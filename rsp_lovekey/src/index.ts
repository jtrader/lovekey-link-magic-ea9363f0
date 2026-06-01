// ── LoveKey RSP Integration ───────────────────────────────────────────────────
// RSP presence layer for LoveKeyLink Hub.
// Drop this into your LoveKeyLink app — it runs RSP invisibly underneath.

// Hook
export { useHubPresence } from './hooks/useHubPresence.js'
export type { UseHubPresenceOptions, UseHubPresenceReturn } from './hooks/useHubPresence.js'

// Presence types
export type {
  LoveKeyPresenceStatus,
  LoveKeyMoodRing,
  LoveKeyFamilyHealth,
  LoveKeyPresenceRecord,
  LoveKeyFamilyPresenceRecord,
} from './presence/types.js'

export {
  MOOD_RING_COLOURS,
  PRESENCE_LABELS,
  FAMILY_HEALTH_LINES,
} from './presence/types.js'

// Mapping utilities
export {
  toPresenceStatus,
  toMoodRing,
  toPresenceRecord,
  toFamilyHealth,
  shouldNotifySupport,
  getHubStatusLine,
} from './presence/mapping.js'

// Supabase utilities
export {
  upsertPresence,
  upsertFamilyPresence,
  fetchHubPresence,
  subscribeToHubPresence,
  PRESENCE_MIGRATION_SQL,
} from './supabase/presence.js'
