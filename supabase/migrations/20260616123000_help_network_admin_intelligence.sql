-- HELP Network admin and anonymous public-site intelligence schema

create table if not exists public.help_network_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  site_type text not null,
  domain text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.anonymous_sessions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.help_network_sites(id) on delete cascade,
  anonymous_id text not null,
  referrer text,
  campaign text,
  device_type text,
  region text,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  consented_profile_id uuid references auth.users(id) on delete set null,
  constraint anonymous_sessions_no_precise_identity check (length(anonymous_id) <= 128)
);

create index if not exists anonymous_sessions_site_started_idx on public.anonymous_sessions(site_id, started_at desc);

create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.help_network_sites(id) on delete cascade,
  session_id uuid not null references public.anonymous_sessions(id) on delete cascade,
  path text not null,
  event_type text not null,
  topic text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists public.help_intent_events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.help_network_sites(id) on delete cascade,
  session_id uuid references public.anonymous_sessions(id) on delete set null,
  intent_type text not null,
  topic text not null,
  urgency text not null default 'unknown',
  conversion_pathway text,
  occurred_at timestamptz not null default now(),
  constraint help_intent_events_urgency_check check (urgency in ('unknown', 'low', 'medium', 'high'))
);

create table if not exists public.consent_transitions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.anonymous_sessions(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  support_request_id uuid references public.support_requests(id) on delete set null,
  transition_type text not null,
  consent_text text not null,
  source_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_request_events (
  id uuid primary key default gen_random_uuid(),
  support_request_id uuid not null references public.support_requests(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.participation_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  signal_weight integer not null default 1,
  context text not null default 'hub',
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_insights (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  severity text not null default 'info',
  title text not null,
  recommendation text not null,
  evidence jsonb not null default '{}'::jsonb,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint dashboard_insights_scope_check check (scope in ('hub', 'public_site', 'network')),
  constraint dashboard_insights_severity_check check (severity in ('info', 'attention', 'urgent')),
  constraint dashboard_insights_status_check check (status in ('open', 'reviewed', 'dismissed', 'actioned'))
);

create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action_type text not null,
  target_table text,
  target_id uuid,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.help_network_sites enable row level security;
alter table public.anonymous_sessions enable row level security;
alter table public.page_events enable row level security;
alter table public.help_intent_events enable row level security;
alter table public.consent_transitions enable row level security;
alter table public.support_request_events enable row level security;
alter table public.participation_events enable row level security;
alter table public.dashboard_insights enable row level security;
alter table public.admin_actions enable row level security;

-- Dashboard tables are intentionally closed by default until admin roles are formalised.
