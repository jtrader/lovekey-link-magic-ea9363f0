import type { SupabaseClient } from '@supabase/supabase-js'
import type { LoveKeyPresenceRecord, LoveKeyHubPresenceRecord } from '../presence/types.js'

// ── Supabase Presence Integration ─────────────────────────────────────────────
// Writes RSP-derived presence records to the presence_states table.
// The RSP signal itself is never stored — only the translated LoveKey state.
//
// Required Supabase tables:
//
// presence_states
//   id          uuid primary key default gen_random_uuid()
//   user_id     uuid references auth.users not null
//   hub_id      uuid references hubs not null
//   node_id     text not null           -- anonymised RSP node ID
//   status      text not null           -- LoveKey presence status
//   mood_ring   text not null           -- LoveKey mood ring state
//   label       text not null           -- user-facing label
//   needs_support boolean default false
//   updated_at  timestamptz default now()
//   unique(user_id, hub_id)
//
// hub_presence
//   id                  uuid primary key default gen_random_uuid()
//   hub_id              uuid references hubs not null unique
//   health              text not null
//   status_line         text not null
//   support_needed_count int default 0
//   active_member_count  int default 0
//   updated_at          timestamptz default now()

/**
 * Write a member presence record to Supabase.
 * Called after every RSP signal update.
 * Uses upsert — one row per user per hub.
 */
export async function upsertPresence(
  supabase: SupabaseClient,
  record: LoveKeyPresenceRecord,
): Promise<void> {
  const { error } = await supabase
    .from('presence_states')
    .upsert(
      {
        user_id:       record.userId,
        hub_id:        record.hubId,
        node_id:       record.nodeId,
        status:        record.status,
        mood_ring:     record.moodRing,
        label:         record.label,
        needs_support: record.needsSupport,
        updated_at:    record.updatedAt,
      },
      { onConflict: 'user_id,hub_id' },
    )

  if (error) {
    console.error('[RSP] Failed to upsert presence:', error.message)
    throw error
  }
}

/**
 * Write hub-level health to Supabase.
 * Called after aggregating all member presence records.
 */
export async function upsertHubPresence(
  supabase: SupabaseClient,
  record: LoveKeyHubPresenceRecord,
): Promise<void> {
  const { error } = await supabase
    .from('hub_presence')
    .upsert(
      {
        hub_id:               record.hubId,
        health:               record.health,
        status_line:          record.statusLine,
        support_needed_count: record.supportNeededCount,
        active_member_count:  record.activeMemberCount,
        updated_at:           record.updatedAt,
      },
      { onConflict: 'hub_id' },
    )

  if (error) {
    console.error('[RSP] Failed to upsert hub presence:', error.message)
    throw error
  }
}

/**
 * Fetch all presence records for a hub.
 * Used to aggregate hub health after a member update.
 */
export async function fetchHubPresence(
  supabase: SupabaseClient,
  hubId: string,
): Promise<LoveKeyPresenceRecord[]> {
  const { data, error } = await supabase
    .from('presence_states')
    .select('*')
    .eq('hub_id', hubId)

  if (error) {
    console.error('[RSP] Failed to fetch hub presence:', error.message)
    throw error
  }

  return (data ?? []).map((row) => ({
    userId:       row.user_id,
    nodeId:       row.node_id,
    hubId:        row.hub_id,
    status:       row.status,
    moodRing:     row.mood_ring,
    label:        row.label,
    needsSupport: row.needs_support,
    updatedAt:    row.updated_at,
  }))
}

/**
 * Subscribe to real-time presence changes for a hub.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToHubPresence(
  supabase: SupabaseClient,
  hubId: string,
  onUpdate: (records: LoveKeyPresenceRecord[]) => void,
): () => void {
  const channel = supabase
    .channel(`hub_presence:${hubId}`)
    .on(
      'postgres_changes',
      {
        event:  '*',
        schema: 'public',
        table:  'presence_states',
        filter: `hub_id=eq.${hubId}`,
      },
      async () => {
        // refetch all records on any change
        try {
          const records = await fetchHubPresence(supabase, hubId)
          onUpdate(records)
        } catch (e) {
          console.error('[RSP] Real-time presence update failed:', e)
        }
      },
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}

// ── SQL migration helper ───────────────────────────────────────────────────────
// Run this in your Supabase SQL editor to create the required tables.
// Export as a string so you can log it during development.

export const PRESENCE_MIGRATION_SQL = `
-- RSP presence tables for LoveKey Hub
-- Run once in Supabase SQL editor

create table if not exists presence_states (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  hub_id        uuid not null,
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
  hub_id               uuid not null unique,
  health               text not null,
  status_line          text not null,
  support_needed_count int not null default 0,
  active_member_count  int not null default 0,
  updated_at           timestamptz not null default now()
);

-- Row level security
alter table presence_states enable row level security;
alter table hub_presence enable row level security;

-- Members can read presence for hubs they belong to
create policy "hub_members_read_presence"
  on presence_states for select
  using (
    hub_id in (
      select hub_id from hub_memberships
      where user_id = auth.uid()
    )
  );

-- Users can only write their own presence
create policy "users_write_own_presence"
  on presence_states for insert with check (user_id = auth.uid());

create policy "users_update_own_presence"
  on presence_states for update using (user_id = auth.uid());

-- Hub members can read hub presence
create policy "hub_members_read_hub_presence"
  on hub_presence for select
  using (
    hub_id in (
      select hub_id from hub_memberships
      where user_id = auth.uid()
    )
  );
`
