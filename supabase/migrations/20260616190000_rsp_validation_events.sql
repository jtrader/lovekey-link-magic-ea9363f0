-- Backend-backed RSP moment validation and audit trail

create table if not exists public.hub_moments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  contact_label text not null,
  event_type text not null,
  event_summary text not null,
  source_event_id text,
  follow_through_met boolean not null default false,
  validation_status text not null default 'pending',
  validation_reason text,
  validation_delay_until timestamptz not null default (now() + interval '24 hours'),
  validated_at timestamptz,
  burn_receipt_hash text,
  token_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hub_moments_validation_status_check check (
    validation_status in ('pending', 'validated', 'needs_follow_through', 'expired')
  )
);

alter table public.hub_moments enable row level security;

create trigger hub_moments_updated_at
  before update on public.hub_moments
  for each row execute function public.set_updated_at();

create index if not exists hub_moments_family_created_idx
  on public.hub_moments(family_id, created_at desc);

create index if not exists hub_moments_pending_validation_idx
  on public.hub_moments(validation_status, validation_delay_until)
  where validation_status = 'pending';

create table if not exists public.rsp_validation_events (
  id uuid primary key default gen_random_uuid(),
  hub_moment_id uuid not null references public.hub_moments(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  status_from text,
  status_to text not null,
  reason text not null,
  source_event_id text,
  burn_receipt_hash text,
  event_token_payload jsonb not null default '{}'::jsonb,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint rsp_validation_events_status_to_check check (
    status_to in ('pending', 'validated', 'needs_follow_through', 'expired')
  )
);

alter table public.rsp_validation_events enable row level security;

create index if not exists rsp_validation_events_family_created_idx
  on public.rsp_validation_events(family_id, created_at desc);

create policy "Family members can read hub moments"
  on public.hub_moments for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Family members can create hub moments"
  on public.hub_moments for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = actor_user_id);

create policy "Family members can update their hub moments"
  on public.hub_moments for update
  using (public.is_family_member(family_id, auth.uid()) and auth.uid() = actor_user_id)
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = actor_user_id);

create policy "Family members can read validation events"
  on public.rsp_validation_events for select
  using (public.is_family_member(family_id, auth.uid()));

create or replace function public.validate_due_hub_moments(_family_id uuid, _limit integer default 100)
returns table (
  hub_moment_id uuid,
  validation_status text,
  burn_receipt_hash text,
  validation_reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  moment_record public.hub_moments%rowtype;
  next_status text;
  next_reason text;
  receipt text;
  payload jsonb;
begin
  if not public.is_family_member(_family_id, auth.uid()) then
    raise exception 'Not authorized to validate hub moments for this family';
  end if;

  for moment_record in
    select *
    from public.hub_moments
    where family_id = _family_id
      and validation_status = 'pending'
      and validation_delay_until <= now()
    order by validation_delay_until asc
    limit greatest(_limit, 1)
    for update skip locked
  loop
    if moment_record.follow_through_met then
      next_status := 'validated';
      next_reason := 'Validation delay cleared and follow-through criteria were met.';
      receipt := 'burn:' || encode(
        sha256((moment_record.id::text || ':' || coalesce(moment_record.source_event_id, '') || ':' || extract(epoch from now())::text)::bytea),
        'hex'
      );
      payload := jsonb_build_object(
        'event_type', moment_record.event_type,
        'node_state', 'validated',
        'timestamp_blur', to_char(date_trunc('hour', now() at time zone 'utc'), 'YYYY-MM-DD"T"HH24:00"Z"'),
        'burn_receipt_hash', receipt,
        'source_id', null
      );
    else
      next_status := 'needs_follow_through';
      next_reason := 'Validation delay cleared, but follow-through criteria are not yet met.';
      receipt := null;
      payload := '{}'::jsonb;
    end if;

    update public.hub_moments
    set validation_status = next_status,
        validation_reason = next_reason,
        validated_at = case when next_status = 'validated' then now() else null end,
        burn_receipt_hash = receipt,
        token_payload = payload
    where id = moment_record.id;

    insert into public.rsp_validation_events (
      hub_moment_id, family_id, status_from, status_to, reason, source_event_id,
      burn_receipt_hash, event_token_payload, validated_at
    ) values (
      moment_record.id, moment_record.family_id, moment_record.validation_status, next_status,
      next_reason, moment_record.source_event_id, receipt, payload,
      case when next_status = 'validated' then now() else null end
    );

    hub_moment_id := moment_record.id;
    validation_status := next_status;
    burn_receipt_hash := receipt;
    validation_reason := next_reason;
    return next;
  end loop;
end;
$$;


revoke all on function public.validate_due_hub_moments(uuid, integer) from public;
grant execute on function public.validate_due_hub_moments(uuid, integer) to authenticated;
