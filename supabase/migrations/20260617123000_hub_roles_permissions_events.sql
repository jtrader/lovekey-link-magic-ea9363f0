alter table public.family_members
  add column if not exists role_label text not null default 'Member',
  add column if not exists member_kind text not null default 'member',
  add column if not exists visibility_state text not null default 'summary',
  add column if not exists is_hub_admin boolean not null default false;

alter table public.family_members
  drop constraint if exists family_members_member_kind_check;

alter table public.family_members
  add constraint family_members_member_kind_check check (
    member_kind in ('owner', 'admin', 'member', 'trusted_contact')
  );

alter table public.family_members
  drop constraint if exists family_members_visibility_state_check;

alter table public.family_members
  add constraint family_members_visibility_state_check check (
    visibility_state in ('hidden', 'summary', 'contextual', 'detailed')
  );

update public.family_members fm
set member_kind = 'owner',
    is_hub_admin = true
from public.families f
where f.id = fm.family_id
  and f.created_by = fm.user_id;

alter table public.rsp_permissions
  drop constraint if exists rsp_permissions_signal_type_check;

alter table public.rsp_permissions
  add constraint rsp_permissions_signal_type_check check (
    signal_type in (
      'presence',
      'location',
      'calendar',
      'emotional_status',
      'work_status',
      'contact_methods',
      'recovery_access',
      'admin_rights',
      'support_request'
    )
  );

create table if not exists public.work_contexts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_name text not null,
  job_title text,
  favicon_url text,
  working_visibility text not null default 'summary',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint work_contexts_working_visibility_check check (
    working_visibility in ('hidden', 'summary', 'contextual', 'detailed')
  )
);

alter table public.work_contexts enable row level security;

create trigger work_contexts_updated_at
  before update on public.work_contexts
  for each row execute function public.set_updated_at();

create index if not exists work_contexts_family_user_idx
  on public.work_contexts(family_id, user_id);

create policy "Hub members can read work contexts"
  on public.work_contexts for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can manage their own work context"
  on public.work_contexts for all
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id)
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id);

create table if not exists public.hub_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_type text not null default 'shared_event',
  starts_at timestamptz,
  status text not null default 'planned',
  support_context text,
  visibility_level text not null default 'summary',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hub_events_event_type_check check (
    event_type in ('shared_event', 'appointment', 'reminder', 'pickup', 'dinner', 'support_coordination')
  ),
  constraint hub_events_status_check check (
    status in ('planned', 'confirmed', 'done', 'cancelled')
  ),
  constraint hub_events_visibility_level_check check (
    visibility_level in ('hidden', 'summary', 'contextual', 'detailed')
  )
);

alter table public.hub_events enable row level security;

create trigger hub_events_updated_at
  before update on public.hub_events
  for each row execute function public.set_updated_at();

create index if not exists hub_events_family_starts_idx
  on public.hub_events(family_id, starts_at);

create policy "Hub members can read hub events"
  on public.hub_events for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Hub members can create hub events"
  on public.hub_events for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = created_by);

create policy "Hub members can update hub events"
  on public.hub_events for update
  using (public.is_family_member(family_id, auth.uid()));
