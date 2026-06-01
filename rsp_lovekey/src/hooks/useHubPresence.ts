import { useState, useEffect, useCallback, useRef } from 'react'
import { useRSPPipeline } from '@rsp/react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RSPConsent, RSPBurnReceipt } from '@rsp/core'
import {
  toPresenceRecord,
  toHubHealth,
  shouldNotifySupport,
} from '../presence/mapping.js'
import {
  upsertPresence,
  upsertHubPresence,
  fetchHubPresence,
  subscribeToHubPresence,
} from '../supabase/presence.js'
import type {
  LoveKeyPresenceRecord,
  LoveKeyHubPresenceRecord,
  LoveKeyPresenceStatus,
  LoveKeyMoodRing,
} from '../presence/types.js'

// ── useHubPresence ────────────────────────────────────────────────────────────
// The primary RSP integration hook for LoveKeyLink.
//
// What it does:
// 1. Runs the RSP pipeline invisibly (consent → track → signal → burn)
// 2. Translates RSP signals to LoveKey presence language
// 3. Writes presence to Supabase presence_states table
// 4. Subscribes to real-time hub presence updates
// 5. Aggregates hub health from all member presence records
//
// What it does NOT do:
// - Expose any RSP terminology to the UI
// - Store raw behavioural data
// - Show signal scores or RSP state names to users
//
// Usage:
//   const { status, moodRing, hubHealth, track, needsSupport } = useHubPresence({
//     userId,
//     nodeId: anonymisedId,  // NOT the userId — a separate anonymous ID
//     hubId,
//     consent,
//     supabase,
//   })

export interface UseHubPresenceOptions {
  /** Supabase user ID — for DB writes only, never passed to RSP */
  userId: string
  /** Anonymised RSP node ID — must NOT be the userId or any real identifier */
  nodeId: string
  /** Hub this member is participating in */
  hubId: string
  /** RSP consent record — tracking disabled if null */
  consent: RSPConsent | null
  /** Supabase client */
  supabase: SupabaseClient
  /** Called when this member needs support */
  onNeedsSupport?: (record: LoveKeyPresenceRecord) => void
  /** Called when hub health changes */
  onHubHealthChange?: (health: LoveKeyHubPresenceRecord) => void
  /** Signal window in minutes — default 30 for family presence */
  signalWindowMinutes?: number
}

export interface UseHubPresenceReturn {
  /** This member's current presence status — LoveKey language */
  status: LoveKeyPresenceStatus | null
  /** This member's mood ring state */
  moodRing: LoveKeyMoodRing | null
  /** User-facing label for this member's status */
  label: string
  /** Whether this member currently needs support */
  needsSupport: boolean
  /** Hub-level health aggregated from all members */
  hubHealth: LoveKeyHubPresenceRecord | null
  /** All member presence records for this hub */
  memberPresence: LoveKeyPresenceRecord[]
  /** Event capture — call these from UI interactions */
  track: {
    pageView: () => void
    activeMinute: () => void
    formInteraction: () => void
    completionOrConversion: () => void
    returnVisit: () => void
    resourceDownload: () => void
    /** Trigger support signal — shows "Needs support" state */
    safetyEscalation: () => void
  }
  /** Whether RSP tracking is active */
  isTracking: boolean
}

export function useHubPresence(options: UseHubPresenceOptions): UseHubPresenceReturn {
  const {
    userId,
    nodeId,
    hubId,
    consent,
    supabase,
    onNeedsSupport,
    onHubHealthChange,
    signalWindowMinutes = 30,
  } = options

  const [myPresence, setMyPresence] = useState<LoveKeyPresenceRecord | null>(null)
  const [memberPresence, setMemberPresence] = useState<LoveKeyPresenceRecord[]>([])
  const [hubHealth, setHubHealth] = useState<LoveKeyHubPresenceRecord | null>(null)

  const onNeedsSupportRef    = useRef(onNeedsSupport)
  const onHubHealthChangeRef = useRef(onHubHealthChange)
  onNeedsSupportRef.current    = onNeedsSupport
  onHubHealthChangeRef.current = onHubHealthChange

  // ── RSP pipeline ────────────────────────────────────────────────────────────
  const { track, signal, isTracking } = useRSPPipeline({
    nodeId,
    consent,
    nodeType:             'hub-member',
    signalWindowMinutes,
    consentScope:         'coordination',
    onBurn: async (receipt: RSPBurnReceipt) => {
      // burn receipt generated — source data gone
      // nothing to do here except optionally log for audit
    },
  })

  // ── translate signal → presence ─────────────────────────────────────────────
  useEffect(() => {
    if (!signal) return
    // only act on burned signals — never on pending-burn
    if (signal.sourceStatus !== 'burned') return

    const record = toPresenceRecord(signal, userId, hubId)
    setMyPresence(record)

    // write to Supabase
    upsertPresence(supabase, record).catch(console.error)

    // notify if support needed
    if (shouldNotifySupport(record)) {
      onNeedsSupportRef.current?.(record)
    }
  }, [signal, userId, hubId, supabase])

  // ── real-time hub presence subscription ────────────────────────────────────
  useEffect(() => {
    // initial fetch
    fetchHubPresence(supabase, hubId)
      .then((records) => {
        setMemberPresence(records)
        updateHubHealth(records)
      })
      .catch(console.error)

    // subscribe to real-time updates
    const unsubscribe = subscribeToHubPresence(supabase, hubId, (records) => {
      setMemberPresence(records)
      updateHubHealth(records)
    })

    return unsubscribe
  }, [hubId, supabase])

  const updateHubHealth = useCallback((records: LoveKeyPresenceRecord[]) => {
    const health = toHubHealth(records, hubId)
    setHubHealth(health)
    upsertHubPresence(supabase, health).catch(console.error)
    onHubHealthChangeRef.current?.(health)
  }, [hubId, supabase])

  return {
    status:         myPresence?.status ?? null,
    moodRing:       myPresence?.moodRing ?? null,
    label:          myPresence?.label ?? '',
    needsSupport:   myPresence?.needsSupport ?? false,
    hubHealth,
    memberPresence,
    track: {
      pageView:               track.pageView,
      activeMinute:           track.activeMinute,
      formInteraction:        track.formInteraction,
      completionOrConversion: track.completionOrConversion,
      returnVisit:            track.returnVisit,
      resourceDownload:       track.resourceDownload,
      safetyEscalation:       track.safetyEscalation,
    },
    isTracking,
  }
}
