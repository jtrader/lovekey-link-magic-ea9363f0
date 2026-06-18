
-- 1. pgcrypto for bcrypt
create extension if not exists pgcrypto;

-- 2. families UPDATE: admins only
drop policy if exists "Members can update their families" on public.families;
drop policy if exists "Hub admins can update their families" on public.families;
create policy "Hub admins can update their families"
  on public.families for update
  using (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = id
        and fm.user_id = auth.uid()
        and fm.is_hub_admin = true
    )
  );

-- 3. Hide password hash from clients
revoke select (public_password_hash) on public.families from authenticated;

-- 4. set_hub_password (admin only, server-side bcrypt)
create or replace function public.set_hub_password(_family_id uuid, _plaintext_password text)
returns void language plpgsql security definer set search_path = public as $$
declare _user_id uuid := auth.uid();
begin
  if _user_id is null then raise exception 'Not authenticated.'; end if;
  if not exists (
    select 1 from public.family_members
    where family_id = _family_id and user_id = _user_id and is_hub_admin = true
  ) then raise exception 'Only hub admins can set the hub password.'; end if;

  if _plaintext_password is null or trim(_plaintext_password) = '' then
    update public.families set public_password_hash = null, public_join_mode = 'invite' where id = _family_id;
  else
    update public.families set public_password_hash = crypt(trim(_plaintext_password), gen_salt('bf', 10)), public_join_mode = 'password' where id = _family_id;
  end if;
end; $$;
revoke all on function public.set_hub_password(uuid, text) from public;
grant execute on function public.set_hub_password(uuid, text) to authenticated;

-- 5. join_hub_with_password (bcrypt verify then join)
create or replace function public.join_hub_with_password(_family_id uuid, _plaintext_password text)
returns void language plpgsql security definer set search_path = public as $$
declare _user_id uuid := auth.uid(); _hub record;
begin
  if _user_id is null then raise exception 'Not authenticated.'; end if;
  select hub_visibility, public_join_mode, public_password_hash into _hub from public.families where id = _family_id;
  if not found then raise exception 'Hub not found.'; end if;
  if _hub.hub_visibility != 'public' then raise exception 'This hub is not publicly joinable.'; end if;
  if _hub.public_join_mode != 'password' then raise exception 'This hub does not use password access.'; end if;
  if _hub.public_password_hash is null or _hub.public_password_hash != crypt(trim(_plaintext_password), _hub.public_password_hash) then
    raise exception 'Incorrect password.';
  end if;
  insert into public.family_members (family_id, user_id) values (_family_id, _user_id)
  on conflict (family_id, user_id) do nothing;
end; $$;
revoke all on function public.join_hub_with_password(uuid, text) from public;
grant execute on function public.join_hub_with_password(uuid, text) to authenticated;

-- 6. create_family: hash password server-side (rename param)
drop function if exists public.create_family(text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz);
create or replace function public.create_family(
  _name text,
  _hub_type text default 'immediate_family',
  _description text default null,
  _hub_visibility text default 'private',
  _public_join_mode text default 'invite',
  _plaintext_password text default null,
  _role_label text default 'Member',
  _location_label text default null,
  _latitude float8 default null,
  _longitude float8 default null,
  _location_accuracy_meters float8 default null,
  _location_captured_at timestamptz default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare _user_id uuid := auth.uid(); _family_id uuid; _password_hash text := null;
begin
  if _user_id is null then raise exception 'Not authenticated — cannot create a family hub.'; end if;
  if trim(_name) = '' then raise exception 'Hub name cannot be empty.'; end if;
  if _plaintext_password is not null and trim(_plaintext_password) != '' then
    _password_hash := crypt(trim(_plaintext_password), gen_salt('bf', 10));
  end if;
  insert into public.families (
    name, hub_type, description, hub_visibility, public_join_mode, public_password_hash,
    location_label, latitude, longitude, location_accuracy_meters, location_captured_at, created_by
  ) values (
    trim(_name), _hub_type, nullif(trim(coalesce(_description, '')), ''),
    _hub_visibility, _public_join_mode, _password_hash,
    nullif(trim(coalesce(_location_label, '')), ''), _latitude, _longitude,
    _location_accuracy_meters, _location_captured_at, _user_id
  ) returning id into _family_id;
  insert into public.family_members (family_id, user_id, role_label, member_kind, visibility_state, is_hub_admin)
  values (_family_id, _user_id, _role_label, 'owner', 'summary', true)
  on conflict (family_id, user_id) do update set
    role_label = excluded.role_label, member_kind = excluded.member_kind,
    visibility_state = excluded.visibility_state, is_hub_admin = excluded.is_hub_admin;
  return _family_id;
end; $$;
revoke all on function public.create_family(text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz) from public;
grant execute on function public.create_family(text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz) to authenticated;

-- 7. hub_event_participants: restrict UPDATE/DELETE
drop policy if exists "Hub members can update event participants" on public.hub_event_participants;
drop policy if exists "Hub members can delete event participants" on public.hub_event_participants;
create policy "Participants or admins can update event participants"
  on public.hub_event_participants for update
  using (
    is_family_member(family_id, auth.uid())
    and (created_by = auth.uid() or invited_user_id = auth.uid()
      or exists (select 1 from public.family_members where family_id = hub_event_participants.family_id and user_id = auth.uid() and is_hub_admin))
  );
create policy "Event creators or admins can delete event participants"
  on public.hub_event_participants for delete
  using (
    is_family_member(family_id, auth.uid())
    and (created_by = auth.uid()
      or exists (select 1 from public.hub_events e where e.id = event_id and e.created_by = auth.uid())
      or exists (select 1 from public.family_members where family_id = hub_event_participants.family_id and user_id = auth.uid() and is_hub_admin))
  );

-- 8. hub_conversations: fix participant join condition
drop policy if exists "Hub members can read hub conversations" on public.hub_conversations;
create policy "Hub members can read hub conversations"
  on public.hub_conversations for select
  using (
    is_family_member(family_id, auth.uid())
    and (
      conversation_type = 'hub'
      or created_by = auth.uid()
      or exists (
        select 1 from public.hub_conversation_participants p
        where p.conversation_id = hub_conversations.id and p.user_id = auth.uid()
      )
    )
  );

-- 9. calendar_connections: hide credential_ref from members
revoke select (credential_ref) on public.calendar_connections from authenticated;

-- 10. avatars bucket: prevent listing all files (still viewable by direct path is not possible for fully anon listing; restrict broad listing)
drop policy if exists "Users can read avatar images" on storage.objects;
create policy "Users can read avatar images"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (auth.uid())::text);
