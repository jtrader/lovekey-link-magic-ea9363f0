import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRSPPipeline } from "@rsp/react";
import { createConsent, type RSPConsent } from "@rsp/core";
import {
  toPresenceRecord,
  toHubHealth,
  MOOD_RING_COLOURS,
  HUB_HEALTH_LINES,
  type LoveKeyPresenceRecord,
  type LoveKeyFamilyPresenceRecord,
  type LoveKeyMoodRing,
} from "@/lib/rsp";

// ── Nucleus ───────────────────────────────────────────────────────────────────
// The central family hub visualisation.
// Orbiting dots are RSP-powered — colour reflects each member's mood ring.
// The hub health status line ("Everyone is okay") is RSP-aggregated.
// RSP runs invisibly — no RSP terminology is exposed to users.

// ── Dot positions for up to 8 members ────────────────────────────────────────
const DOT_POSITIONS = [
  { x: "10%", y: "20%" },
  { x: "85%", y: "30%" },
  { x: "75%", y: "85%" },
  { x: "15%", y: "80%" },
  { x: "50%", y: "5%"  },
  { x: "92%", y: "60%" },
  { x: "50%", y: "92%" },
  { x: "5%",  y: "55%" },
];

// ── Mood ring → Tailwind colour class ─────────────────────────────────────────
// Maps LoveKey mood ring states to the existing health colour classes in the app.
const MOOD_RING_CLASS: Record<LoveKeyMoodRing, string> = {
  healthy:     "bg-health-green",
  stable:      "bg-health-blue",
  reduced:     "bg-health-yellow",
  fragmenting: "bg-health-orange",
  crisis:      "bg-health-red",
  offline:     "bg-muted",
};

// ── useNucleusPresence ────────────────────────────────────────────────────────

interface UseNucleusPresenceReturn {
  memberPresence: LoveKeyPresenceRecord[];
  familyHealth: LoveKeyFamilyPresenceRecord | null;
  track: ReturnType<typeof useRSPPipeline>["track"];
  isTracking: boolean;
}

function useNucleusPresence(familyId: string): UseNucleusPresenceReturn {
  const { user } = useAuth();
  const [memberPresence, setMemberPresence] = useState<LoveKeyPresenceRecord[]>([]);
  const [familyHealth, setHubHealth] = useState<LoveKeyFamilyPresenceRecord | null>(null);
  const [consent, setConsent] = useState<RSPConsent | null>(null);

  // Build consent from authenticated user
  useEffect(() => {
    if (!user) return;
    setConsent(
      createConsent({
        id:           `consent-${user.id}-${familyId}`,
        nodeId:       `node-${user.id}-${familyId}`,
        scope:        ["coordination"],
        durationDays: 30,
      })
    );
  }, [user?.id, familyId]);

  const nodeId = user ? `node-${user.id}-${familyId}` : "";

  // RSP pipeline — invisible to users
  const { track, signal, isTracking } = useRSPPipeline({
    nodeId,
    consent,
    nodeType:             "family-member",
    signalWindowMinutes:  30,
    consentScope:         "coordination",
  });

  // Translate RSP signal → LoveKey presence → write to Supabase
  useEffect(() => {
    if (!signal || !user || signal.sourceStatus !== "burned") return;

    const record = toPresenceRecord(signal, user.id, familyId);

    supabase
      .from("presence_states")
      .upsert(
        {
          user_id:       record.userId,
          family_id:        record.familyId,
          node_id:       record.nodeId,
          status:        record.status,
          mood_ring:     record.moodRing,
          label:         record.label,
          needs_support: record.needsSupport,
          updated_at:    record.updatedAt,
        },
        { onConflict: "user_id,family_id" }
      )
      .then(({ error }) => {
        if (error) console.error("[RSP] presence upsert:", error.message);
      });
  }, [signal, user?.id, familyId]);

  // Fetch + subscribe to hub presence in real-time
  useEffect(() => {
    if (!familyId) return;

    const refresh = async () => {
      const { data, error } = await supabase
        .from("presence_states")
        .select("*")
        .eq("family_id", familyId);

      if (error) { console.error("[RSP] fetch presence:", error.message); return; }

      const records: LoveKeyPresenceRecord[] = (data ?? []).map((row) => ({
        userId:       row.user_id,
        nodeId:       row.node_id,
        familyId:        row.family_id,
        status:       row.status,
        moodRing:     row.mood_ring,
        label:        row.label,
        needsSupport: row.needs_support,
        updatedAt:    row.updated_at,
      }));

      setMemberPresence(records);

      const health = toHubHealth(records, familyId);
      setHubHealth(health);

      supabase
        .from("family_presence")
        .upsert(
          {
            family_id:               health.familyId,
            health:               health.health,
            status_line:          health.statusLine,
            support_needed_count: health.supportNeededCount,
            active_member_count:  health.activeMemberCount,
            updated_at:           health.updatedAt,
          },
          { onConflict: "family_id" }
        )
        .then(({ error }) => {
          if (error) console.error("[RSP] family_presence upsert:", error.message);
        });
    };

    refresh();

    const channel = supabase
      .channel(`presence_states:${familyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "presence_states", filter: `family_id=eq.${familyId}` },
        refresh
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [familyId]);

  // Track page view on mount and active minutes
  useEffect(() => {
    if (!isTracking) return;
    track.pageView();
    const timer = setInterval(track.activeMinute, 60_000);
    return () => clearInterval(timer);
  }, [isTracking]);

  return { memberPresence, familyHealth, track, isTracking };
}

// ── Nucleus Component ─────────────────────────────────────────────────────────

interface NucleusProps {
  /** Hub ID to show presence for — defaults to user's primary hub */
  familyId?: string;
}

export function Nucleus({ familyId = "primary" }: NucleusProps) {
  const { memberPresence, familyHealth } = useNucleusPresence(familyId);

  // Fall back to static dots if no presence data yet
  const dots =
    memberPresence.length > 0
      ? memberPresence.slice(0, 8).map((m, i) => ({
          colourClass: MOOD_RING_CLASS[m.moodRing],
          position:    DOT_POSITIONS[i] ?? DOT_POSITIONS[0],
          label:       m.label,
          needsSupport: m.needsSupport,
        }))
      : [
          { colourClass: "bg-health-green",  position: DOT_POSITIONS[0]!, label: "", needsSupport: false },
          { colourClass: "bg-health-blue",   position: DOT_POSITIONS[1]!, label: "", needsSupport: false },
          { colourClass: "bg-health-yellow", position: DOT_POSITIONS[2]!, label: "", needsSupport: false },
          { colourClass: "bg-health-purple", position: DOT_POSITIONS[3]!, label: "", needsSupport: false },
        ];

  const statusLine = familyHealth?.statusLine ?? "Your family is connected";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
        {/* Background glow — unchanged */}
        <div className="absolute inset-0 rounded-full bg-gradient-nucleus opacity-20 blur-3xl animate-breathe" />
        <div className="absolute inset-8 rounded-full bg-gradient-nucleus opacity-30 blur-2xl animate-drift" />

        {/* Central sphere — unchanged */}
        <div className="relative h-44 w-44 rounded-full bg-gradient-nucleus shadow-nucleus animate-breathe sm:h-56 sm:w-56" />

        {/* Orbiting member dots — RSP-powered */}
        <div className="pointer-events-none absolute inset-0">
          {dots.map((dot, i) => (
            <span
              key={i}
              title={dot.label}
              aria-label={dot.label || "Family member"}
              className={[
                "absolute h-3 w-3 rounded-full opacity-70 animate-breathe transition-colors duration-1000",
                dot.colourClass,
                // pulse ring for support_needed
                dot.needsSupport ? "ring-2 ring-health-red ring-offset-1 opacity-100" : "",
              ].filter(Boolean).join(" ")}
              style={{
                left:           dot.position.x,
                top:            dot.position.y,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hub status line — RSP-aggregated, LoveKey language */}
      <p className="text-sm text-muted-foreground text-center">
        {statusLine}
      </p>
    </div>
  );
}
