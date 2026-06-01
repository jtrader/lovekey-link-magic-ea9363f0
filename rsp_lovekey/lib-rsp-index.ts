// ── src/lib/rsp/index.ts ──────────────────────────────────────────────────────
// RSP integration layer for LoveKeyLink.
// Import from here — never import @rsp/* directly in UI components.

export type {
  LoveKeyPresenceStatus,
  LoveKeyMoodRing,
  LoveKeyFamilyHealth,
  LoveKeyPresenceRecord,
  LoveKeyFamilyPresenceRecord,
} from "./presence/types";

export {
  MOOD_RING_COLOURS,
  PRESENCE_LABELS,
  FAMILY_HEALTH_LINES,
} from "./presence/types";

export {
  toPresenceStatus,
  toMoodRing,
  toPresenceRecord,
  toFamilyHealth,
  shouldNotifySupport,
} from "./presence/mapping";
