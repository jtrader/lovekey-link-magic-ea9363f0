create table if not exists public.hub_event_participants (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  event_id uuid not null references public.hub_events(id) on delete cascade,
  invited_user_id uuid references auth.users(id) on delete set null,
  participant_key text not null,
  participant_label text not null,
  participant_role text,
  response_status text not null default 'invited',
  visibility_level text not null default 'summary',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hub_event_participants_response_status_check check (
    response_status in ('invited', 'accepted', 'maybe', 'declined', 'tagged')
  ),
  constraint hub_event_participants_visibility_level_check check (
    visibility_level in ('hidden', 'summary', 'contextual', 'detailed')
  ),
  constraint hub_event_participants_unique_key unique (event_id, participant_key)
);

alter table public.hub_event_participants enable row level security;

create trigger hub_event_participants_updated_at
  before update on public.hub_event_participants
  for each row execute function public.set_updated_at();

create index if not exists hub_event_participants_family_event_idx
  on public.hub_event_participants(family_id, event_id);

create policy "Hub members can read event participants"
  on public.hub_event_participants for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Hub members can create event participants"
  on public.hub_event_participants for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = created_by);

create policy "Hub members can update event participants"
  on public.hub_event_participants for update
  using (public.is_family_member(family_id, auth.uid()));

create policy "Hub members can delete event participants"
  on public.hub_event_participants for delete
  using (public.is_family_member(family_id, auth.uid()));
