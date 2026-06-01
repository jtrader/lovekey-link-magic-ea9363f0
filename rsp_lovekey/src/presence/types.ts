// ── LoveKey Presence Types ────────────────────────────────────────────────────
// These are the user-facing presence states shown in the Hub UI.
// RSP visual states are translated into these before any user sees them.
// The RSP layer is invisible to users — they see LoveKey language only.

// ── Member Presence ───────────────────────────────────────────────────────────

/** What a family member's avatar shows in the Hub */
export type LoveKeyPresenceStatus =
  | 'all_good'       // resonant / mastery — green, positive
  | 'available'      // active / converting — available and engaged
  | 'quiet'          // aware — low activity, not unreachable
  | 'busy'           // friction / overload — occupied, don't interrupt
  | 'stepping_back'  // cooling / drop_off — reduced engagement
  | 'needs_support'  // support_needed — CRITICAL, show support prompt
  | 'offline'        // dormant — no signal

/** Mood ring state shown as outer ring on avatar */
export type LoveKeyMoodRing =
  | 'healthy'        // all good, connected, thriving
  | 'stable'         // active, engaged, normal
  | 'reduced'        // quieter than usual, stepping back
  | 'fragmenting'    // friction, overload, struggling
  | 'crisis'         // needs support immediately
  | 'offline'        // no signal

/** Hub-level connection health — "Everyone is okay" state */
export type LoveKeyFamilyHealth =
  | 'everyone_connected'  // coordination_healthy — all members active/resonant
  | 'all_good'            // most members healthy, no concerns
  | 'some_quiet'          // some members reduced/stepping back
  | 'needs_attention'     // one or more members in friction/overload
  | 'needs_support'       // one or more members need support — urgent

// ── Presence Record ───────────────────────────────────────────────────────────

/** What gets written to the presence_states table in Supabase */
export interface LoveKeyPresenceRecord {
  /** Supabase user ID — used for DB writes only, never passed to RSP */
  userId: string
  /** Anonymised RSP node ID — what RSP actually tracks */
  nodeId: string
  /** User-facing status */
  status: LoveKeyPresenceStatus
  /** Mood ring state */
  moodRing: LoveKeyMoodRing
  /** User-facing label — shown in tooltips and accessibility text */
  label: string
  /** ISO 8601 timestamp */
  updatedAt: string
  /** Whether this member needs immediate support */
  needsSupport: boolean
  /** Hub ID this presence belongs to */
  familyId: string
}

/** Hub-level aggregated presence */
export interface LoveKeyFamilyPresenceRecord {
  familyId: string
  health: LoveKeyFamilyHealth
  /** User-facing status line — e.g. "Everyone is okay" */
  statusLine: string
  /** Count of members needing support */
  supportNeededCount: number
  /** Total active members */
  activeMemberCount: number
  updatedAt: string
}

// ── Colour Map ────────────────────────────────────────────────────────────────
// Maps mood ring states to LoveKey's warm blue palette.
// Coral red is reserved for crisis only — prospectus is explicit about this.

export const MOOD_RING_COLOURS: Record<LoveKeyMoodRing, string> = {
  healthy:     '#5ED6A8', // Mint Green
  stable:      '#2E78FF', // Primary Blue
  reduced:     '#FFC55A', // Warm Amber
  fragmenting: '#FFC55A', // Warm Amber (not red — red is crisis only)
  crisis:      '#FF6B6B', // Coral Red — reserved for support_needed
  offline:     '#CBD5E1', // Neutral grey
}

export const PRESENCE_LABELS: Record<LoveKeyPresenceStatus, string> = {
  all_good:       'All good',
  available:      'Available',
  quiet:          'Quiet',
  busy:           'Busy',
  stepping_back:  'Stepping back',
  needs_support:  'Needs support',
  offline:        'Offline',
}

export const FAMILY_HEALTH_LINES: Record<LoveKeyFamilyHealth, string> = {
  everyone_connected: 'Everyone is connected',
  all_good:           'Everyone is okay',
  some_quiet:         'Some members are quiet',
  needs_attention:    'Family needs attention',
  needs_support:      'Someone needs support',
}
