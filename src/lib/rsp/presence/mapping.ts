import type { RSPVisualState, RSPNodeSignal } from "@rsp/core";
import type {
  LoveKeyPresenceStatus,
  LoveKeyMoodRing,
  LoveKeyFamilyHealth,
  LoveKeyPresenceRecord,
  LoveKeyFamilyPresenceRecord,
} from "./types.js";
import { PRESENCE_LABELS, FAMILY_HEALTH_LINES } from "./types.js";

// ── RSP → LoveKey Mapping ─────────────────────────────────────────────────────
// This is the translation layer. RSP runs underneath; LoveKey speaks to users.
// Never expose RSP state names in the UI — use LoveKey language always.

// ── State Mappings ────────────────────────────────────────────────────────────

const RSP_TO_PRESENCE: Record<RSPVisualState, LoveKeyPresenceStatus> = {
  dormant: "offline",
  aware: "quiet",
  active: "available",
  resonant: "all_good",
  friction: "busy",
  overload: "busy",
  drop_off: "stepping_back",
  support_needed: "needs_support",
  cooling: "stepping_back",
  converting: "available",
  mastery: "all_good",
  coordination_degraded: "busy",
  coordination_healthy: "all_good",
};

const RSP_TO_MOOD_RING: Record<RSPVisualState, LoveKeyMoodRing> = {
  dormant: "offline",
  aware: "reduced",
  active: "stable",
  resonant: "healthy",
  friction: "fragmenting",
  overload: "fragmenting",
  drop_off: "reduced",
  support_needed: "crisis",
  cooling: "reduced",
  converting: "stable",
  mastery: "healthy",
  coordination_degraded: "fragmenting",
  coordination_healthy: "healthy",
};

// ── Translators ───────────────────────────────────────────────────────────────

/**
 * Translate an RSP visual state to a LoveKey presence status.
 */
export function toPresenceStatus(state: RSPVisualState): LoveKeyPresenceStatus {
  return RSP_TO_PRESENCE[state] ?? "offline";
}

/**
 * Translate an RSP visual state to a LoveKey mood ring state.
 */
export function toMoodRing(state: RSPVisualState): LoveKeyMoodRing {
  return RSP_TO_MOOD_RING[state] ?? "offline";
}

/**
 * Build a full presence record from an RSP node signal.
 * This is the main translation function — call this after every signal update.
 *
 * @param signal    - The RSP node signal (sourceStatus must be 'burned')
 * @param userId    - Supabase user ID (for DB writes only)
 * @param familyId  - Hub this presence belongs to
 */
export function toPresenceRecord(
  signal: RSPNodeSignal,
  userId: string,
  familyId: string,
): LoveKeyPresenceRecord {
  const status = toPresenceStatus(signal.state);
  const moodRing = toMoodRing(signal.state);

  return {
    userId,
    nodeId: signal.nodeId,
    status,
    moodRing,
    label: PRESENCE_LABELS[status],
    updatedAt: new Date().toISOString(),
    needsSupport: status === "needs_support",
    familyId,
  };
}

/**
 * Aggregate multiple member presence records into a hub-level health state.
 */
export function toFamilyHealth(
  records: LoveKeyPresenceRecord[],
  familyId: string,
): LoveKeyFamilyPresenceRecord {
  const active = records.filter((r) => r.status !== "offline");
  const support = records.filter((r) => r.needsSupport);
  const fragmented = records.filter(
    (r) => r.moodRing === "fragmenting" || r.moodRing === "crisis",
  );
  const reduced = records.filter((r) => r.moodRing === "reduced");

  let health: LoveKeyFamilyHealth;

  if (support.length > 0) {
    health = "needs_support";
  } else if (fragmented.length > 0) {
    health = "needs_attention";
  } else if (reduced.length > active.length / 2) {
    health = "some_quiet";
  } else if (active.length === records.length && fragmented.length === 0) {
    health = "everyone_connected";
  } else {
    health = "all_good";
  }

  return {
    familyId,
    health,
    statusLine: FAMILY_HEALTH_LINES[health],
    supportNeededCount: support.length,
    activeMemberCount: active.length,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Backwards-compatible alias retained for older callers.
 */
export const toHubHealth = toFamilyHealth;

/**
 * Check whether a presence record should trigger a support notification.
 * Call this after every presence update to decide whether to surface a prompt.
 */
export function shouldNotifySupport(record: LoveKeyPresenceRecord): boolean {
  return record.needsSupport;
}

/**
 * Get a human-friendly description for a hub health state.
 * Used in the hub home screen subtitle.
 */
export function getFamilyStatusLine(health: LoveKeyFamilyHealth): string {
  return FAMILY_HEALTH_LINES[health];
}

/**
 * Backwards-compatible alias retained for older callers.
 */
export const getHubStatusLine = getFamilyStatusLine;
