-- RSP permission, consent, trusted-contact and support-routing schema

create table if not exists public.rsp_permissions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  subject_user_id uuid not null references auth.users(id) on delete cascade,
  viewer_user_id uuid references auth.users(id) on delete cascade,
  viewer_role text not null default 'trusted_contact',
  signal_type text not null,
  visibility_level text not null default 'summary',
  can_view boolean not null default true,
  can_route_support boolean not null default false,
  expires_at timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rsp_permissions_signal_type_check check (
    signal_type in ('presence', 'location', 'calendar', 'emotional_status', 'recovery_access', 'support_request')
  ),
  constraint rsp_permissions_visibility_level_check check (
    visibility_level in ('hidden', 'summary', 'contextual', 'detailed')
  )
);

alter table public.rsp_permissions enable row level security;

create trigger rsp_permissions_updated_at
  before update on public.rsp_permissions
  for each row execute function public.set_updated_at();

create policy "Family members can read RSP permissions"
  on public.rsp_permissions for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Family members can create RSP permissions"
  on public.rsp_permissions for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = created_by);

create policy "Permission creators can update RSP permissions"
  on public.rsp_permissions for update
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = created_by);

create table if not exists public.rsp_consent_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  signal_type text,
  consent_state text not null,
  context text not null default 'family_hub',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint rsp_consent_events_state_check check (
    consent_state in ('granted', 'reduced', 'revoked', 'requested', 'support_routed')
  )
);

alter table public.rsp_consent_events enable row level security;

create policy "Family members can read consent events"
  on public.rsp_consent_events for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Family members can create consent events"
  on public.rsp_consent_events for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = actor_user_id);

create table if not exists public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_user_id uuid references auth.users(id) on delete cascade,
  display_name text not null,
  relationship text not null default 'trusted contact',
  route_priority integer not null default 1,
  can_receive_support_requests boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trusted_contacts enable row level security;

create trigger trusted_contacts_updated_at
  before update on public.trusted_contacts
  for each row execute function public.set_updated_at();

create policy "Family members can read trusted contacts"
  on public.trusted_contacts for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can manage their trusted contacts"
  on public.trusted_contacts for all
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id)
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  urgency text not null default 'low',
  status text not null default 'open',
  message text,
  route_summary text not null default 'trusted_contacts',
  routed_to_contact_id uuid references public.trusted_contacts(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint support_requests_category_check check (category in ('all_good', 'safe_arrival', 'need_support')),
  constraint support_requests_urgency_check check (urgency in ('low', 'medium', 'high')),
  constraint support_requests_status_check check (status in ('open', 'acknowledged', 'resolved', 'cancelled'))
);

alter table public.support_requests enable row level security;

create index if not exists support_requests_family_created_idx on public.support_requests(family_id, created_at desc);

create policy "Family members can read support requests"
  on public.support_requests for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Family members can create support requests"
  on public.support_requests for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = requester_user_id);

create policy "Requesters and family members can update support requests"
  on public.support_requests for update
  using (public.is_family_member(family_id, auth.uid()));
