create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  protocol text not null,
  display_name text not null,
  source_label text,
  credential_ref text,
  sync_direction text not null default 'read_availability',
  availability_granularity text not null default 'busy_free',
  include_event_titles boolean not null default false,
  status text not null default 'connected',
  last_synced_at timestamptz,
  sync_cursor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_connections_provider_check check (
    provider in ('apple_ical', 'google_calendar', 'outlook', 'microsoft_365', 'caldav', 'webcal_ics', 'other')
  ),
  constraint calendar_connections_protocol_check check (
    protocol in ('oauth_2', 'caldav', 'webcal_ics', 'ical_file')
  ),
  constraint calendar_connections_sync_direction_check check (
    sync_direction in ('read_availability', 'two_way_later')
  ),
  constraint calendar_connections_granularity_check check (
    availability_granularity in ('busy_free', 'summary', 'contextual')
  ),
  constraint calendar_connections_status_check check (
    status in ('connected', 'paused', 'error', 'revoked')
  )
);

alter table public.calendar_connections enable row level security;

create trigger calendar_connections_updated_at
  before update on public.calendar_connections
  for each row execute function public.set_updated_at();

create index if not exists calendar_connections_family_user_idx
  on public.calendar_connections(family_id, user_id);

create policy "Hub members can read calendar connection summaries"
  on public.calendar_connections for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can manage their own calendar connections"
  on public.calendar_connections for all
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id)
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id);

create table if not exists public.calendar_availability_windows (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references public.calendar_connections(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  availability text not null default 'busy',
  source_protocol text not null default 'webcal_ics',
  visibility_level text not null default 'summary',
  share_label text not null default 'Busy',
  external_event_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_availability_order_check check (ends_at > starts_at),
  constraint calendar_availability_state_check check (
    availability in ('free', 'busy', 'tentative', 'out_of_office')
  ),
  constraint calendar_availability_protocol_check check (
    source_protocol in ('oauth_2', 'caldav', 'webcal_ics', 'ical_file')
  ),
  constraint calendar_availability_visibility_check check (
    visibility_level in ('hidden', 'summary', 'contextual')
  )
);

alter table public.calendar_availability_windows enable row level security;

create trigger calendar_availability_windows_updated_at
  before update on public.calendar_availability_windows
  for each row execute function public.set_updated_at();

create index if not exists calendar_availability_family_time_idx
  on public.calendar_availability_windows(family_id, starts_at, ends_at);

create index if not exists calendar_availability_user_time_idx
  on public.calendar_availability_windows(user_id, starts_at, ends_at);

create policy "Hub members can read shared calendar availability"
  on public.calendar_availability_windows for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can manage their own calendar availability"
  on public.calendar_availability_windows for all
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id)
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id);

create table if not exists public.calendar_sync_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references public.calendar_connections(id) on delete set null,
  status text not null,
  windows_imported integer not null default 0,
  message text,
  created_at timestamptz not null default now(),
  constraint calendar_sync_logs_status_check check (
    status in ('started', 'completed', 'partial', 'failed')
  )
);

alter table public.calendar_sync_logs enable row level security;

create index if not exists calendar_sync_logs_connection_created_idx
  on public.calendar_sync_logs(connection_id, created_at desc);

create policy "Hub members can read calendar sync logs"
  on public.calendar_sync_logs for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Users can create their own calendar sync logs"
  on public.calendar_sync_logs for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = user_id);
