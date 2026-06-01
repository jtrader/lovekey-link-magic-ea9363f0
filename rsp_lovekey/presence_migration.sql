-- RSP presence tables for LoveKey Hub
-- Run in Supabase SQL editor, or save as a migration file

create table if not exists presence_states (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  hub_id        text not null,
  node_id       text not null,
  status        text not null,
  mood_ring     text not null,
  label         text not null,
  needs_support boolean not null default false,
  updated_at    timestamptz not null default now(),
  unique(user_id, hub_id)
);

create table if not exists hub_presence (
  id                   uuid primary key default gen_random_uuid(),
  hub_id               text not null unique,
  health               text not null,
  status_line          text not null,
  support_needed_count int not null default 0,
  active_member_count  int not null default 0,
  updated_at           timestamptz not null default now()
);

-- Row level security
alter table presence_states enable row level security;
alter table hub_presence enable row level security;

-- Any authenticated user can read presence (hub membership check can be added later)
create policy "authenticated_read_presence"
  on presence_states for select
  to authenticated
  using (true);

-- Users can only write their own presence
create policy "users_write_own_presence"
  on presence_states for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users_update_own_presence"
  on presence_states for update
  to authenticated
  using (user_id = auth.uid());

-- Any authenticated user can read hub presence
create policy "authenticated_read_hub_presence"
  on hub_presence for select
  to authenticated
  using (true);

-- Any authenticated user can upsert hub presence (aggregated — not personal data)
create policy "authenticated_write_hub_presence"
  on hub_presence for insert
  to authenticated
  with check (true);

create policy "authenticated_update_hub_presence"
  on hub_presence for update
  to authenticated
  using (true);

-- Enable realtime on both tables
alter publication supabase_realtime add table presence_states;
alter publication supabase_realtime add table hub_presence;
