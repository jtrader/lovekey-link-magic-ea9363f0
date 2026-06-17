-- Security fixes:
--   1. family_members INSERT policy allows any user to join any family
--   2. Hub passwords hashed with unsalted SHA-256 in the browser (no work factor,
--      hash readable by all members → pass-the-hash / offline cracking)
--
-- Fixes:
--   1. Replace "Users can join as themselves" with two narrow policies:
--        a. Hub admins can insert any member row for their hub
--        b. Authenticated users can self-join public/open hubs (no invite needed)
--      Invite-based joins continue to use accept_family_invite() SECURITY DEFINER
--      which already bypasses RLS.  Password-protected joins use the new
--      join_hub_with_password() RPC below.
--
--   2. Move password hashing into PostgreSQL using pgcrypto bcrypt (work factor 10).
--      create_family() now accepts _plaintext_password instead of _public_password_hash
--      and hashes it server-side.  The client never computes or sends a hash.
--      A new set_hub_password() RPC lets admins change the password later.
--
--   3. Revoke column-level SELECT on public_password_hash from authenticated so
--      the bcrypt digest is never returned to the client at all.

-- ─── 1. pgcrypto (needed for crypt / gen_salt) ───────────────────────────────

create extension if not exists pgcrypto;

-- ─── 2. family_members INSERT policy ─────────────────────────────────────────

drop policy if exists "Users can join as themselves" on public.family_members;

-- Hub admins can add anyone to their hub (direct add / bulk import)
create policy "Hub admins can insert members"
  on public.family_members for insert
  with check (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_members.family_id
        and fm.user_id   = auth.uid()
        and fm.is_hub_admin = true
    )
  );

-- Authenticated users can self-join public/open hubs without an invite
create policy "Users can self-join public open hubs"
  on public.family_members for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.families f
      where f.id             = family_members.family_id
        and f.hub_visibility  = 'public'
        and f.public_join_mode = 'open'
    )
  );

-- ─── 3. Column-level security: hide password hash from clients ────────────────

revoke select (public_password_hash) on public.families from authenticated;

-- ─── 4. set_hub_password() — admin-only, bcrypt server-side ──────────────────

create or replace function public.set_hub_password(
  _family_id uuid,
  _plaintext_password text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _user_id uuid := auth.uid();
begin
  if _user_id is null then
    raise exception 'Not authenticated.';
  end if;

  if not exists (
    select 1 from public.family_members
    where family_id  = _family_id
      and user_id    = _user_id
      and is_hub_admin = true
  ) then
    raise exception 'Only hub admins can set the hub password.';
  end if;

  if _plaintext_password is null or trim(_plaintext_password) = '' then
    -- Clear the password; revert join mode to invite-only
    update public.families
    set public_password_hash = null,
        public_join_mode     = 'invite'
    where id = _family_id;
  else
    update public.families
    set public_password_hash = crypt(trim(_plaintext_password), gen_salt('bf', 10)),
        public_join_mode     = 'password'
    where id = _family_id;
  end if;
end;
$$;

revoke all  on function public.set_hub_password(uuid, text) from public;
grant execute on function public.set_hub_password(uuid, text) to authenticated;

-- ─── 5. join_hub_with_password() — bcrypt verify, then insert member ─────────

create or replace function public.join_hub_with_password(
  _family_id uuid,
  _plaintext_password text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _user_id uuid := auth.uid();
  _hub     record;
begin
  if _user_id is null then
    raise exception 'Not authenticated.';
  end if;

  select hub_visibility, public_join_mode, public_password_hash
  into _hub
  from public.families
  where id = _family_id;

  if not found then
    raise exception 'Hub not found.';
  end if;

  if _hub.hub_visibility != 'public' then
    raise exception 'This hub is not publicly joinable.';
  end if;

  if _hub.public_join_mode != 'password' then
    raise exception 'This hub does not use password access.';
  end if;

  -- crypt() with the stored hash as salt recomputes and compares in one step
  if _hub.public_password_hash is null or
     _hub.public_password_hash != crypt(trim(_plaintext_password), _hub.public_password_hash)
  then
    raise exception 'Incorrect password.';
  end if;

  insert into public.family_members (family_id, user_id)
  values (_family_id, _user_id)
  on conflict (family_id, user_id) do nothing;
end;
$$;

revoke all  on function public.join_hub_with_password(uuid, text) from public;
grant execute on function public.join_hub_with_password(uuid, text) to authenticated;

-- ─── 6. Update create_family() to hash server-side ───────────────────────────
--
-- Parameter renamed: _public_password_hash → _plaintext_password
-- The function hashes with bcrypt (work factor 10) internally.
-- Callers must never pre-hash the password before passing it.

create or replace function public.create_family(
  _name                     text,
  _hub_type                 text        default 'immediate_family',
  _description              text        default null,
  _hub_visibility           text        default 'private',
  _public_join_mode         text        default 'invite',
  _plaintext_password       text        default null,
  _role_label               text        default 'Member',
  _location_label           text        default null,
  _latitude                 float8      default null,
  _longitude                float8      default null,
  _location_accuracy_meters float8      default null,
  _location_captured_at     timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _user_id      uuid := auth.uid();
  _family_id    uuid;
  _password_hash text := null;
begin
  if _user_id is null then
    raise exception 'Not authenticated — cannot create a family hub.';
  end if;

  if trim(_name) = '' then
    raise exception 'Hub name cannot be empty.';
  end if;

  -- Hash password server-side with bcrypt; never store a client-supplied hash
  if _plaintext_password is not null and trim(_plaintext_password) != '' then
    _password_hash := crypt(trim(_plaintext_password), gen_salt('bf', 10));
  end if;

  insert into public.families (
    name, hub_type, description,
    hub_visibility, public_join_mode, public_password_hash,
    location_label, latitude, longitude,
    location_accuracy_meters, location_captured_at,
    created_by
  ) values (
    trim(_name), _hub_type, nullif(trim(coalesce(_description, '')), ''),
    _hub_visibility, _public_join_mode, _password_hash,
    nullif(trim(coalesce(_location_label, '')), ''), _latitude, _longitude,
    _location_accuracy_meters, _location_captured_at,
    _user_id
  )
  returning id into _family_id;

  insert into public.family_members (
    family_id, user_id, role_label, member_kind, visibility_state, is_hub_admin
  ) values (
    _family_id, _user_id, _role_label, 'owner', 'summary', true
  )
  on conflict (family_id, user_id) do update set
    role_label       = excluded.role_label,
    member_kind      = excluded.member_kind,
    visibility_state = excluded.visibility_state,
    is_hub_admin     = excluded.is_hub_admin;

  return _family_id;
end;
$$;

revoke all on function public.create_family(
  text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz
) from public;

grant execute on function public.create_family(
  text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz
) to authenticated;
