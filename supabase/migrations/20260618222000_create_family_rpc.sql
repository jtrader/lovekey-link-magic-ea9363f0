-- create_family() — SECURITY DEFINER RPC for hub creation
--
-- Why this exists:
--   The direct INSERT path for families hits a chicken-and-egg RLS problem.
--   The INSERT policy requires auth.uid() = created_by (fine), but the
--   RETURNING clause is checked against the SELECT policy
--   (is_family_member OR auth.uid() = created_by) — which requires the
--   member row to exist. That row is created by the on_family_created
--   AFTER trigger, but AFTER triggers fire *after* RETURNING is evaluated,
--   so the SELECT policy always fails for brand-new families.
--
--   Additionally, some client environments (SSR hydration, token-refresh
--   race) can lose the JWT before the request fires, causing the INSERT
--   WITH CHECK (auth.uid() = created_by) to reject the row outright.
--
-- This function:
--   1. Reads auth.uid() server-side — unforgeable, no JWT race condition.
--   2. Inserts families and family_members in one transaction, so the
--      member row exists before anything tries to read back the family.
--   3. Runs as the function owner (SECURITY DEFINER), so it bypasses
--      client-facing RLS on both tables entirely.
--   4. Returns the new family UUID to the caller.

create or replace function public.create_family(
  _name                    text,
  _hub_type                text    default 'immediate_family',
  _description             text    default null,
  _hub_visibility          text    default 'private',
  _public_join_mode        text    default 'invite',
  _public_password_hash    text    default null,
  _role_label              text    default 'Member',
  _location_label          text    default null,
  _latitude                float8  default null,
  _longitude               float8  default null,
  _location_accuracy_meters float8 default null,
  _location_captured_at    timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _user_id   uuid := auth.uid();
  _family_id uuid;
begin
  if _user_id is null then
    raise exception 'Not authenticated — cannot create a family hub.';
  end if;

  if trim(_name) = '' then
    raise exception 'Hub name cannot be empty.';
  end if;

  -- Insert the family row (no RLS check — SECURITY DEFINER runs as owner)
  insert into public.families (
    name, hub_type, description,
    hub_visibility, public_join_mode, public_password_hash,
    location_label, latitude, longitude,
    location_accuracy_meters, location_captured_at,
    created_by
  ) values (
    trim(_name), _hub_type, nullif(trim(coalesce(_description, '')), ''),
    _hub_visibility, _public_join_mode, _public_password_hash,
    nullif(trim(coalesce(_location_label, '')), ''), _latitude, _longitude,
    _location_accuracy_meters, _location_captured_at,
    _user_id
  )
  returning id into _family_id;

  -- Upsert the owner membership row.
  -- The on_family_created AFTER trigger also inserts a minimal row; we
  -- override it with full role data via ON CONFLICT DO UPDATE.
  insert into public.family_members (
    family_id, user_id, role_label, member_kind, visibility_state, is_hub_admin
  ) values (
    _family_id, _user_id, _role_label, 'owner', 'summary', true
  )
  on conflict (family_id, user_id) do update set
    role_label        = excluded.role_label,
    member_kind       = excluded.member_kind,
    visibility_state  = excluded.visibility_state,
    is_hub_admin      = excluded.is_hub_admin;

  return _family_id;
end;
$$;

-- Only authenticated users may call this function
revoke all on function public.create_family(
  text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz
) from public;

grant execute on function public.create_family(
  text, text, text, text, text, text, text, text, float8, float8, float8, timestamptz
) to authenticated;
