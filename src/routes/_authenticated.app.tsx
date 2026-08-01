import { definePage, Link, useNavigate } from "@/lib/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Nucleus } from "@/components/Nucleus";
import { GroupChatSheet } from "@/components/GroupChatSheet";
import { NotificationsSheet, useUnreadCount } from "@/components/NotificationsSheet";
import { HubCalendarView, type HubCalendarEvent, type CalendarWindow } from "@/components/HubCalendarView";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { demoAccounts, demoHubStats, type DemoAccount } from "@/lib/demo-accounts";
import { createFamilyHub } from "@/lib/create-family-hub";
import {
  hubSpaceCards,
  lowResolutionLocations,
  permissionSignals,
  privacyPreviewDefaults,
  todayTogetherItems,
  getHubType,
  type HubType,
  type MoodRingState,
  type PresenceState,
  type SupportSignal,
} from "@/lib/lovekey-model";
import { toast } from "sonner";
import {
  Activity,
  Battery,
  MapPin,
  HandHeart,
  Users,
  MessageCircle,
  Phone,
  Calendar,
  Check,
  Clock,
  Sparkles,
  Bell,
  Settings,
  ChevronRight,
  Home,
  Briefcase,
  Car,
  LogOut,
  Shield,
  Eye,
  HeartPulse,
  MoreHorizontal,
  PauseCircle,
  UserRound,
  Cloud,
  RefreshCw,
  LockKeyhole,
  CalendarCheck,
  Plus,
  Pencil,
  Save,
  X,
  UserPlus,
  Send,
  Lock,
  Menu,
  Search,
  LocateFixed,
  Copy,
  BookOpen,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

export const Route = definePage("/_authenticated/app")({
  component: AppView,
  head: () => ({
    meta: [
      { title: "Your Link — Love Key Link" },
      {
        name: "description",
        content:
          "A calm, private coordination layer for your hub. Presence, support, and family connection at a glance.",
      },
      { property: "og:title", content: "Your Link — Love Key Link" },
      {
        property: "og:description",
        content:
          "Coordination, not surveillance. Share gentle presence, check moments, and request support from trusted contacts.",
      },
    ],
  }),
});

type Time = "Available" | "Maybe" | "Busy" | "Unavailable";
type Energy = "Green" | "Blue" | "Yellow";
type Loc = (typeof lowResolutionLocations)[number]["value"];
type Will = "Open" | "Ask gently" | "Not now" | "Need help";
type FamilySummary = { id: string; name: string; hub_type: HubType | null };
type FamilyMemberRow = {
  role_label: string | null;
  member_kind: string | null;
  visibility_state: string | null;
  families: FamilySummary | FamilySummary[] | null;
};
type HubMemberSummary = {
  name: string;
  role: string;
  presence: PresenceState;
  mood: MoodRingState;
  avatarUrl?: string | null;
};
type CalendarProtocol = "oauth_2" | "caldav" | "webcal_ics" | "ical_file";
type CalendarProvider = {
  provider: string;
  name: string;
  protocol: CalendarProtocol;
  description: string;
  status: "Available" | "Edge Function next";
  Icon: typeof Calendar;
};
type CalendarConnection = {
  id: string;
  display_name: string;
  provider: string;
  protocol: string;
  status: string;
  availability_granularity: string;
  include_event_titles: boolean;
  last_synced_at: string | null;
};
type HubEvent = {
  id: string;
  title: string;
  event_type: string;
  starts_at: string | null;
  status: string;
  support_context: string | null;
  visibility_level: string;
};
type EventParticipant = {
  id: string;
  event_id: string;
  participant_key: string;
  participant_label: string;
  participant_role: string | null;
  response_status: string;
};
type EventForm = {
  title: string;
  event_type: string;
  starts_at: string;
  support_context: string;
  visibility_level: string;
  participant_keys: string[];
};
type HubConversation = {
  id: string;
  conversation_type: string;
  title: string;
  created_by: string;
  updated_at: string;
};
type HubChatMessage = {
  id: string;
  conversation_id: string;
  sender_label: string;
  sender_user_id: string | null;
  message_type: string;
  body: string;
  created_at: string;
};
type ConversationParticipant = {
  conversation_id: string;
  participant_key: string;
  participant_label: string;
  participant_role: string | null;
  user_id: string | null;
};
type PublicHubSearchResult = {
  id: string;
  name: string;
  description: string | null;
  hub_type: string;
  public_join_mode: string;
  location_label: string | null;
  latitude: number;
  longitude: number;
  distance_km: number;
  password_required: boolean;
};
type DevicePresenceState =
  | "active_now"
  | "recently_seen"
  | "away_or_locked"
  | "offline_or_unreachable"
  | "unknown";
type DevicePresenceRow = {
  family_id: string;
  user_id: string;
  auto_state: string;
  manual_state: string | null;
  manual_until: string | null;
  last_heartbeat_at: string | null;
  last_interaction_at: string | null;
  visibility_state: string;
  is_idle: boolean;
  updated_at: string;
};
type ManualOverrideDuration = 30 | 60 | 240;
type HotspotType = "home" | "school" | "work" | "care" | "custom";
type HotspotVisibility = "private" | "hub" | "emergency_only";
type LocationPresenceState =
  | "at_hotspot_available"
  | "resting_available"
  | "commuting_unavailable"
  | "moving_maybe_unavailable"
  | "paused"
  | "unknown";
type LocationHotspot = {
  id: string;
  family_id: string;
  user_id: string;
  name: string;
  hotspot_type: HotspotType;
  latitude: number;
  longitude: number;
  radius_meters: number;
  visibility: HotspotVisibility;
};
type LocationPresenceRow = {
  family_id: string;
  user_id: string;
  inferred_state: LocationPresenceState;
  status_label: string;
  availability: "available" | "maybe" | "unavailable" | "unknown";
  nearest_hotspot_id: string | null;
  nearest_hotspot_name: string | null;
  nearest_hotspot_type: string | null;
  distance_to_hotspot_meters: number | null;
  speed_kmh: number | null;
  dwell_minutes: number;
  is_tracking: boolean;
  accuracy_meters: number | null;
  last_signal_at: string | null;
};
type LocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speedKmh: number | null;
  capturedAt: number;
};

const timeOpts: Time[] = ["Available", "Maybe", "Busy", "Unavailable"];
const devicePresenceStates: { value: DevicePresenceState; label: string; hint: string }[] = [
  { value: "active_now", label: "Active now", hint: "App visible with recent interaction" },
  { value: "recently_seen", label: "Recently seen", hint: "Heartbeat received recently" },
  { value: "away_or_locked", label: "Away or locked", hint: "Hidden, locked, or idle" },
  {
    value: "offline_or_unreachable",
    label: "Offline or unreachable",
    hint: "Heartbeat is missing",
  },
  { value: "unknown", label: "Unknown", hint: "Cannot determine reliably" },
];
const manualOverrideDurations: { value: ManualOverrideDuration; label: string }[] = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 240, label: "4 hours" },
];
const heartbeatMs = 60 * 1000;
const idleAfterMs = 5 * 60 * 1000;
const recentlySeenMs = 15 * 60 * 1000;
const activeInteractionMs = 2 * 60 * 1000;
const stationaryDwellMs = 10 * 60 * 1000;
const stationaryRadiusMeters = 30;
const commutingSpeedKmh = 30;
const hotspotTypeOptions: { value: HotspotType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "school", label: "School" },
  { value: "work", label: "Work" },
  { value: "care", label: "Care" },
  { value: "custom", label: "Custom" },
];
const hotspotVisibilityOptions: { value: HotspotVisibility; label: string }[] = [
  { value: "hub", label: "Hub visible" },
  { value: "private", label: "Private" },
  { value: "emergency_only", label: "Emergency only" },
];
const energyOpts: { v: Energy; cls: string; hint: string }[] = [
  { v: "Green", cls: "bg-health-green", hint: "Resourced" },
  { v: "Blue", cls: "bg-health-blue", hint: "Steady" },
  { v: "Yellow", cls: "bg-health-yellow", hint: "Low" },
];
const locOpts = lowResolutionLocations.map(({ value, Icon }) => ({ v: value, Icon }));
const willOpts: Will[] = ["Open", "Ask gently", "Not now", "Need help"];
const defaultEventForm: EventForm = {
  title: "",
  event_type: "shared_event",
  starts_at: "",
  support_context: "",
  visibility_level: "summary",
  participant_keys: [],
};
const hubEventTypeOptions = [
  { value: "shared_event", label: "Shared event" },
  { value: "appointment", label: "Appointment" },
  { value: "reminder", label: "Reminder" },
  { value: "pickup", label: "Pickup" },
  { value: "dinner", label: "Dinner" },
  { value: "support_coordination", label: "Support coordination" },
];
const calendarProviders: CalendarProvider[] = [
  {
    provider: "apple_ical",
    name: "Apple Calendar / iCal",
    protocol: "webcal_ics",
    description: "Subscribe with an iCloud public/private ICS feed and import busy windows only.",
    status: "Available",
    Icon: CalendarCheck,
  },
  {
    provider: "google_calendar",
    name: "Google Calendar",
    protocol: "oauth_2",
    description: "Use OAuth to read free/busy blocks without exposing event titles by default.",
    status: "Edge Function next",
    Icon: Cloud,
  },
  {
    provider: "microsoft_365",
    name: "Outlook / Microsoft 365",
    protocol: "oauth_2",
    description: "Sync availability from work calendars while hiding personal wellbeing states.",
    status: "Edge Function next",
    Icon: Briefcase,
  },
  {
    provider: "caldav",
    name: "Generic CalDAV",
    protocol: "caldav",
    description: "Standards-based sync for Fastmail, Nextcloud, Radicale and other CalDAV servers.",
    status: "Available",
    Icon: RefreshCw,
  },
];

const circles: {
  name: string;
  question: string;
  health: string;
  note: string;
  Icon: typeof Home;
}[] = [
  {
    name: "Home",
    question: "How is everyone?",
    health: "bg-health-green",
    note: "All steady",
    Icon: Home,
  },
  {
    name: "Family",
    question: "Who matters most?",
    health: "bg-health-blue",
    note: "Trusted people only",
    Icon: Users,
  },
  {
    name: "Hubs & Spaces",
    question: "What do we share together?",
    health: "bg-health-purple",
    note: "Separate by default",
    Icon: Shield,
  },
  {
    name: "Today Together",
    question: "What matters today?",
    health: "bg-health-yellow",
    note: "3 gentle plans",
    Icon: Calendar,
  },
  {
    name: "Moments",
    question: "What just happened?",
    health: "bg-health-blue",
    note: "Care touchpoints",
    Icon: Activity,
  },
  {
    name: "Wellbeing",
    question: "How is everyone feeling?",
    health: "bg-health-green",
    note: "Family pulse steady",
    Icon: HeartPulse,
  },
  {
    name: "Support / Recovery",
    question: "Who needs care now?",
    health: "bg-health-red",
    note: "Trusted routing ready",
    Icon: HandHeart,
  },
];

type HubMoment = {
  id: string;
  contact_label: string;
  event_type: string;
  event_summary: string;
  validation_status: "pending" | "validated" | "needs_follow_through" | "expired";
  validation_reason: string | null;
  validation_delay_until: string;
  validated_at: string | null;
  burn_receipt_hash: string | null;
  created_at: string;
};

const momentIcons: Record<string, typeof Phone> = {
  call: Phone,
  message: MessageCircle,
  schedule: Calendar,
  support: HandHeart,
  safe_arrival: MapPin,
  all_good: Check,
  need_support: HandHeart,
};

const reminders = [
  { text: "Nan has been quiet for 6 days — a gentle check-in could help.", soft: true },
  { text: "School pickup window starts in 25 minutes.", soft: false },
];

function formatMomentTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function eventToForm(event: HubEvent, participants: EventParticipant[] = []): EventForm {
  return {
    title: event.title,
    event_type: event.event_type,
    starts_at: toDateTimeLocal(event.starts_at),
    support_context: event.support_context ?? "",
    visibility_level: event.visibility_level,
    participant_keys: participants.map((participant) => participant.participant_key),
  };
}

function formatEventType(value: string) {
  return hubEventTypeOptions.find((option) => option.value === value)?.label ?? "Shared event";
}

function toggleParticipantKey(keys: string[], key: string) {
  return keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key];
}

function normalizeDeviceState(value: string | null | undefined): DevicePresenceState {
  return devicePresenceStates.some((state) => state.value === value)
    ? (value as DevicePresenceState)
    : "unknown";
}

function devicePresenceLabel(value: DevicePresenceState) {
  return devicePresenceStates.find((state) => state.value === value)?.label ?? "Unknown";
}

function getDevicePresenceHint(value: DevicePresenceState) {
  return (
    devicePresenceStates.find((state) => state.value === value)?.hint ??
    "Cannot determine reliably"
  );
}

function formatPresenceTime(value: string | null | undefined) {
  if (!value) return "Not received yet";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatManualUntil(value: string | null | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDeviceAutoState({
  visibilityState,
  isIdle,
  lastHeartbeatAt,
  lastInteractionAt,
  nowMs,
}: {
  visibilityState: string;
  isIdle: boolean;
  lastHeartbeatAt: string | null;
  lastInteractionAt: string | null;
  nowMs: number;
}): DevicePresenceState {
  if (!lastHeartbeatAt) return "unknown";
  if (nowMs - new Date(lastHeartbeatAt).getTime() > recentlySeenMs) {
    return "offline_or_unreachable";
  }
  if (visibilityState !== "visible" || isIdle) return "away_or_locked";
  if (lastInteractionAt && nowMs - new Date(lastInteractionAt).getTime() <= activeInteractionMs) {
    return "active_now";
  }
  return "recently_seen";
}

function getEffectiveDevicePresence(row: DevicePresenceRow | null | undefined, nowMs: number) {
  const manualState = normalizeDeviceState(row?.manual_state);
  const manualUntilMs = row?.manual_until ? new Date(row.manual_until).getTime() : 0;
  if (row?.manual_state && manualUntilMs > nowMs) {
    return { state: manualState, source: "manual" as const };
  }
  return { state: normalizeDeviceState(row?.auto_state), source: "auto" as const };
}

function devicePresenceToPresenceState(state: DevicePresenceState): PresenceState {
  if (state === "active_now" || state === "recently_seen") return "available";
  if (state === "away_or_locked") return "busy";
  return "quiet";
}

function locationPresenceToPresenceState(row: LocationPresenceRow | null | undefined) {
  if (row?.availability === "unavailable" || row?.availability === "maybe") return "busy";
  if (row?.availability === "available") return "available";
  return null;
}

function devicePresenceDotClass(state: DevicePresenceState) {
  if (state === "active_now" || state === "recently_seen") return "bg-health-green";
  if (state === "away_or_locked") return "bg-health-yellow";
  if (state === "offline_or_unreachable") return "bg-muted-foreground/50";
  return "bg-health-purple";
}

function useDevicePresence(userId: string | undefined, familyId: string | undefined) {
  const queryClient = useQueryClient();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [lastInteractionAt, setLastInteractionAt] = useState(() => new Date().toISOString());
  const [visibilityState, setVisibilityState] = useState(() =>
    typeof document === "undefined" ? "unknown" : document.visibilityState,
  );
  const lastInteractionWriteMs = useRef(0);
  const enabled = Boolean(userId && familyId);

  const { data: row } = useQuery<DevicePresenceRow | null>({
    queryKey: ["device-presence", familyId, userId],
    enabled,
    refetchInterval: heartbeatMs,
    queryFn: async () => {
      const { data } = await supabase
        .from("device_presence_states")
        .select("*")
        .eq("family_id", familyId!)
        .eq("user_id", userId!)
        .maybeSingle();
      return (data as DevicePresenceRow | null) ?? null;
    },
  });

  const isIdle = nowMs - new Date(lastInteractionAt).getTime() > idleAfterMs;
  const localAutoState = getDeviceAutoState({
    visibilityState,
    isIdle,
    lastHeartbeatAt: new Date(nowMs).toISOString(),
    lastInteractionAt,
    nowMs,
  });

  const upsertDevicePresence = useCallback(
    async (override?: {
      manual_state?: DevicePresenceState | null;
      manual_until?: string | null;
    }) => {
      if (!userId || !familyId) return false;
      const heartbeatAt = new Date().toISOString();
      const autoState = getDeviceAutoState({
        visibilityState,
        isIdle,
        lastHeartbeatAt: heartbeatAt,
        lastInteractionAt,
        nowMs: Date.now(),
      });
      const { error } = await supabase.from("device_presence_states").upsert({
        family_id: familyId,
        user_id: userId,
        auto_state: autoState,
        last_heartbeat_at: heartbeatAt,
        last_interaction_at: lastInteractionAt,
        visibility_state: visibilityState,
        is_idle: isIdle,
        updated_at: heartbeatAt,
        ...override,
      });
      if (error) {
        if (override) toast.error("Device signal could not be saved yet.");
        return false;
      }
      await queryClient.invalidateQueries({ queryKey: ["device-presence", familyId, userId] });
      return true;
    },
    [familyId, isIdle, lastInteractionAt, queryClient, userId, visibilityState],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 30 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const markInteraction = () => {
      const nextMs = Date.now();
      if (nextMs - lastInteractionWriteMs.current < 15 * 1000) return;
      lastInteractionWriteMs.current = nextMs;
      setLastInteractionAt(new Date(nextMs).toISOString());
      setNowMs(nextMs);
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    events.forEach((eventName) =>
      window.addEventListener(eventName, markInteraction, { passive: true }),
    );
    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markInteraction));
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibilityState(document.visibilityState);
      setNowMs(Date.now());
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void upsertDevicePresence();
    const intervalId = window.setInterval(() => {
      void upsertDevicePresence();
    }, heartbeatMs);
    return () => window.clearInterval(intervalId);
  }, [enabled, upsertDevicePresence]);

  const optimisticRow: DevicePresenceRow | null = familyId && userId
    ? {
        family_id: familyId,
        user_id: userId,
        auto_state: localAutoState,
        manual_state: row?.manual_state ?? null,
        manual_until: row?.manual_until ?? null,
        last_heartbeat_at: row?.last_heartbeat_at ?? null,
        last_interaction_at: row?.last_interaction_at ?? lastInteractionAt,
        visibility_state: visibilityState,
        is_idle: isIdle,
        updated_at: row?.updated_at ?? new Date(nowMs).toISOString(),
      }
    : null;
  const effective = getEffectiveDevicePresence(optimisticRow, nowMs);

  const setManualOverride = useCallback(
    async (state: DevicePresenceState, durationMinutes: ManualOverrideDuration) => {
      const manualUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      const saved = await upsertDevicePresence({ manual_state: state, manual_until: manualUntil });
      if (!saved) return;
      toast.success(
        `${devicePresenceLabel(state)} set for ${
          durationMinutes === 60 ? "1 hour" : `${durationMinutes} minutes`
        }.`,
      );
    },
    [upsertDevicePresence],
  );

  const clearManualOverride = useCallback(async () => {
    const saved = await upsertDevicePresence({ manual_state: null, manual_until: null });
    if (!saved) return;
    toast.success("Device signal returned to auto.");
  }, [upsertDevicePresence]);

  return {
    row: optimisticRow,
    effectiveState: effective.state,
    source: effective.source,
    setManualOverride,
    clearManualOverride,
  };
}

function distanceMeters(
  from: Pick<LocationPoint, "latitude" | "longitude">,
  to: Pick<LocationHotspot, "latitude" | "longitude">,
) {
  const radius = 6371000;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const deltaLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const deltaLng = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function locationPresenceTone(state: LocationPresenceState) {
  if (state === "commuting_unavailable") return "bg-health-yellow";
  if (state === "moving_maybe_unavailable") return "bg-health-blue";
  if (state === "paused" || state === "unknown") return "bg-muted-foreground/50";
  return "bg-health-green";
}

function classifyLocationPresence({
  point,
  hotspots,
  dwellMinutes,
}: {
  point: LocationPoint;
  hotspots: LocationHotspot[];
  dwellMinutes: number;
}): Omit<LocationPresenceRow, "family_id" | "user_id" | "is_tracking"> {
  const nearest = hotspots
    .map((hotspot) => ({ hotspot, distance: distanceMeters(point, hotspot) }))
    .sort((a, b) => a.distance - b.distance)[0];
  const insideHotspot =
    nearest && nearest.distance <= Math.max(nearest.hotspot.radius_meters, point.accuracy ?? 0);
  const speedKmh = point.speedKmh ?? 0;
  const nearestName = insideHotspot ? nearest.hotspot.name : null;
  const nearestType = insideHotspot ? nearest.hotspot.hotspot_type : null;
  const nearestId = insideHotspot ? nearest.hotspot.id : null;
  const nearestDistance = insideHotspot ? Math.round(nearest.distance) : null;

  if (speedKmh >= commutingSpeedKmh) {
    return {
      inferred_state: "commuting_unavailable",
      status_label: "Commuting · unavailable",
      availability: "unavailable",
      nearest_hotspot_id: nearestId,
      nearest_hotspot_name: nearestName,
      nearest_hotspot_type: nearestType,
      distance_to_hotspot_meters: nearestDistance,
      speed_kmh: Number(speedKmh.toFixed(1)),
      dwell_minutes: dwellMinutes,
      accuracy_meters: point.accuracy,
      last_signal_at: new Date(point.capturedAt).toISOString(),
    };
  }

  if (insideHotspot && dwellMinutes >= 10) {
    return {
      inferred_state: "at_hotspot_available",
      status_label: `At ${nearest.hotspot.name} · available`,
      availability: "available",
      nearest_hotspot_id: nearest.hotspot.id,
      nearest_hotspot_name: nearest.hotspot.name,
      nearest_hotspot_type: nearest.hotspot.hotspot_type,
      distance_to_hotspot_meters: Math.round(nearest.distance),
      speed_kmh: Number(speedKmh.toFixed(1)),
      dwell_minutes: dwellMinutes,
      accuracy_meters: point.accuracy,
      last_signal_at: new Date(point.capturedAt).toISOString(),
    };
  }

  if (dwellMinutes >= 10) {
    return {
      inferred_state: "resting_available",
      status_label: "Resting · available",
      availability: "available",
      nearest_hotspot_id: null,
      nearest_hotspot_name: null,
      nearest_hotspot_type: null,
      distance_to_hotspot_meters: null,
      speed_kmh: Number(speedKmh.toFixed(1)),
      dwell_minutes: dwellMinutes,
      accuracy_meters: point.accuracy,
      last_signal_at: new Date(point.capturedAt).toISOString(),
    };
  }

  return {
    inferred_state: "moving_maybe_unavailable",
    status_label: "In transit · maybe unavailable",
    availability: "maybe",
    nearest_hotspot_id: nearestId,
    nearest_hotspot_name: nearestName,
    nearest_hotspot_type: nearestType,
    distance_to_hotspot_meters: nearestDistance,
    speed_kmh: Number(speedKmh.toFixed(1)),
    dwell_minutes: dwellMinutes,
    accuracy_meters: point.accuracy,
    last_signal_at: new Date(point.capturedAt).toISOString(),
  };
}

function useLocationPresence(userId: string | undefined, familyId: string | undefined) {
  const queryClient = useQueryClient();
  const [tracking, setTracking] = useState(false);
  const [latestPoint, setLatestPoint] = useState<LocationPoint | null>(null);
  const [watchError, setWatchError] = useState<string | null>(null);
  const stationarySinceRef = useRef<number | null>(null);
  const anchorPointRef = useRef<LocationPoint | null>(null);
  const lastWriteMs = useRef(0);

  const { data: hotspots = [] } = useQuery<LocationHotspot[]>({
    queryKey: ["location-hotspots", familyId, userId],
    enabled: Boolean(userId && familyId),
    queryFn: async () => {
      const { data } = await supabase
        .from("location_hotspots")
        .select("*")
        .eq("family_id", familyId!)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      return (data ?? []) as LocationHotspot[];
    },
  });

  const { data: presence } = useQuery<LocationPresenceRow | null>({
    queryKey: ["location-presence", familyId, userId],
    enabled: Boolean(userId && familyId),
    queryFn: async () => {
      const { data } = await supabase
        .from("location_presence_states")
        .select("*")
        .eq("family_id", familyId!)
        .eq("user_id", userId!)
        .maybeSingle();
      return (data as LocationPresenceRow | null) ?? null;
    },
  });

  const writePresence = useCallback(
    async (payload: Partial<LocationPresenceRow>) => {
      if (!userId || !familyId) return false;
      const { error } = await supabase.from("location_presence_states").upsert({
        family_id: familyId,
        user_id: userId,
        inferred_state: payload.inferred_state ?? "unknown",
        status_label: payload.status_label ?? "Location unknown",
        availability: payload.availability ?? "unknown",
        nearest_hotspot_id: payload.nearest_hotspot_id ?? null,
        nearest_hotspot_name: payload.nearest_hotspot_name ?? null,
        nearest_hotspot_type: payload.nearest_hotspot_type ?? null,
        distance_to_hotspot_meters: payload.distance_to_hotspot_meters ?? null,
        speed_kmh: payload.speed_kmh ?? null,
        dwell_minutes: payload.dwell_minutes ?? 0,
        is_tracking: payload.is_tracking ?? tracking,
        accuracy_meters: payload.accuracy_meters ?? null,
        last_signal_at: payload.last_signal_at ?? new Date().toISOString(),
      });
      if (error) {
        toast.error("Location signal could not be saved yet.");
        return false;
      }
      await queryClient.invalidateQueries({ queryKey: ["location-presence", familyId, userId] });
      return true;
    },
    [familyId, queryClient, tracking, userId],
  );

  const processPoint = useCallback(
    async (point: LocationPoint) => {
      setLatestPoint(point);
      const anchor = anchorPointRef.current;
      if (!anchor || distanceMeters(point, anchor) > stationaryRadiusMeters) {
        anchorPointRef.current = point;
        stationarySinceRef.current = point.capturedAt;
      }
      const stationarySince = stationarySinceRef.current ?? point.capturedAt;
      const dwellMinutes = Math.floor((point.capturedAt - stationarySince) / 60000);
      const classified = classifyLocationPresence({ point, hotspots, dwellMinutes });
      if (point.capturedAt - lastWriteMs.current < 30 * 1000) return;
      lastWriteMs.current = point.capturedAt;
      await writePresence({ ...classified, is_tracking: true });
    },
    [hotspots, writePresence],
  );

  useEffect(() => {
    if (!tracking) return;
    if (!navigator.geolocation) {
      setWatchError("Geolocation is not available in this browser.");
      setTracking(false);
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setWatchError(null);
        void processPoint({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: position.coords.accuracy ? Math.round(position.coords.accuracy) : null,
          speedKmh:
            typeof position.coords.speed === "number" && position.coords.speed >= 0
              ? position.coords.speed * 3.6
              : null,
          capturedAt: Date.now(),
        });
      },
      () => {
        setWatchError("Location permission was not granted.");
        setTracking(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60 * 1000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [processPoint, tracking]);

  const pauseTracking = useCallback(async () => {
    setTracking(false);
    await writePresence({
      inferred_state: "paused",
      status_label: "Location paused",
      availability: "unknown",
      is_tracking: false,
      last_signal_at: new Date().toISOString(),
    });
  }, [writePresence]);

  const saveHotspot = useCallback(
    async ({
      name,
      hotspotType,
      radiusMeters,
      visibility,
    }: {
      name: string;
      hotspotType: HotspotType;
      radiusMeters: number;
      visibility: HotspotVisibility;
    }) => {
      if (!userId || !familyId || !latestPoint) return false;
      const { error } = await supabase.from("location_hotspots").insert({
        family_id: familyId,
        user_id: userId,
        name,
        hotspot_type: hotspotType,
        latitude: latestPoint.latitude,
        longitude: latestPoint.longitude,
        radius_meters: radiusMeters,
        visibility,
      });
      if (error) {
        toast.error("Hotspot could not be saved yet.");
        return false;
      }
      await queryClient.invalidateQueries({ queryKey: ["location-hotspots", familyId, userId] });
      toast.success(`${name} added to hotspot favourites.`);
      return true;
    },
    [familyId, latestPoint, queryClient, userId],
  );

  return {
    hotspots,
    presence,
    latestPoint,
    tracking,
    watchError,
    startTracking: () => setTracking(true),
    pauseTracking,
    saveHotspot,
  };
}

function AppView() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [time, setTime] = useState<Time>("Available");
  const [energy, setEnergy] = useState<Energy>("Blue");
  const [loc, setLoc] = useState<Loc>("Home");
  const [will, setWill] = useState<Will>("Open");
  const [supportSignal, setSupportSignal] = useState<SupportSignal>("All good");
  const [savingSignal, setSavingSignal] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState(demoAccounts[0].id);
  const [eventForm, setEventForm] = useState<EventForm>(defaultEventForm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventForm, setEditingEventForm] = useState<EventForm>(defaultEventForm);
  const [hubChatBody, setHubChatBody] = useState("");
  const [privateChatBody, setPrivateChatBody] = useState("");
  const [privateParticipantKeys, setPrivateParticipantKeys] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(25);
  const [nearbySearching, setNearbySearching] = useState(false);
  const [nearbyLocation, setNearbyLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null>(null);
  const [nearbyPublicHubs, setNearbyPublicHubs] = useState<PublicHubSearchResult[]>([]);
  // Active hub selection — null means "use the first hub from the query"
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [createHubOpen, setCreateHubOpen] = useState(false);
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  // Invite-from-home state
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [inviteContact, setInviteContact] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [manualDeviceState, setManualDeviceState] = useState<DevicePresenceState>("away_or_locked");
  const [manualDeviceDuration, setManualDeviceDuration] = useState<ManualOverrideDuration>(60);
  const [hotspotName, setHotspotName] = useState("");
  const [hotspotType, setHotspotType] = useState<HotspotType>("home");
  const [hotspotRadius, setHotspotRadius] = useState(150);
  const [hotspotVisibility, setHotspotVisibility] = useState<HotspotVisibility>("hub");

  // Pull profile + active family (honoring selectedFamilyId if set).
  const { data: ctx, isLoading } = useQuery({
    queryKey: ["app-context", user?.id, selectedFamilyId],
    enabled: !!user,
    queryFn: async () => {
      let membersQuery = supabase
        .from("family_members")
        .select(
          "family_id, role_label, member_kind, visibility_state, families(id, name, hub_type)",
        )
        .eq("user_id", user!.id);
      if (selectedFamilyId) {
        membersQuery = membersQuery.eq("family_id", selectedFamilyId);
      }
      membersQuery = membersQuery.limit(1);

      const [{ data: profile }, { data: members }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        membersQuery,
      ]);
      const familyRow = members?.[0] as FamilyMemberRow | undefined;
      const family = Array.isArray(familyRow?.families)
        ? (familyRow.families[0] ?? null)
        : (familyRow?.families ?? null);
      return { profile, family, membership: familyRow ?? null };
    },
  });

  // All hubs this user belongs to — drives the Family section in the side menu.
  const { data: allHubs = [] } = useQuery<FamilySummary[]>({
    queryKey: ["all-hubs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("family_members")
        .select("families(id, name, hub_type)")
        .eq("user_id", user!.id);
      if (!data) return [];
      return data.flatMap((row) => {
        const f = (row as { families: FamilySummary | FamilySummary[] | null }).families;
        if (!f) return [];
        return Array.isArray(f) ? f : [f];
      });
    },
  });
  const devicePresence = useDevicePresence(user?.id, ctx?.family?.id);
  const locationPresence = useLocationPresence(user?.id, ctx?.family?.id);

  // Unread notification count — drives the badge on the bell icon
  const unreadNotificationCount = useUnreadCount(user?.id);

  useEffect(() => {
    if (!isLoading && ctx && (!ctx.profile?.full_name || !ctx.family)) {
      navigate({ to: "/onboarding" });
    }
  }, [ctx, isLoading, navigate]);

  const { data: moments = [], isLoading: momentsLoading } = useQuery({
    queryKey: ["hub-moments", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_moments")
        .select(
          "id, contact_label, event_type, event_summary, validation_status, validation_reason, validation_delay_until, validated_at, burn_receipt_hash, created_at",
        )
        .eq("family_id", ctx!.family!.id)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return (data ?? []) as HubMoment[];
    },
  });

  const { data: calendarConnections = [] } = useQuery({
    queryKey: ["calendar-connections", ctx?.family?.id, user?.id],
    enabled: !!ctx?.family && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_connections")
        .select(
          "id, display_name, provider, protocol, status, availability_granularity, include_event_titles, last_synced_at",
        )
        .eq("family_id", ctx!.family!.id)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as CalendarConnection[];
    },
  });

  const { data: hubEvents = [], isLoading: hubEventsLoading } = useQuery({
    queryKey: ["hub-events", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_events")
        .select("id, title, event_type, starts_at, status, support_context, visibility_level")
        .eq("family_id", ctx!.family!.id)
        .order("starts_at", { ascending: true, nullsFirst: false })
        .limit(12);

      if (error) throw error;
      return (data ?? []) as HubEvent[];
    },
  });

  const { data: eventParticipants = [] } = useQuery({
    queryKey: ["hub-event-participants", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_event_participants")
        .select(
          "id, event_id, participant_key, participant_label, participant_role, response_status",
        )
        .eq("family_id", ctx!.family!.id);

      if (error) throw error;
      return (data ?? []) as EventParticipant[];
    },
  });

  // Calendar availability windows from connected external calendars — all members' busy/free blocks
  const { data: calendarWindows = [] } = useQuery<CalendarWindow[]>({
    queryKey: ["calendar-windows", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();
      const { data } = await supabase
        .from("calendar_availability_windows")
        .select("id, user_id, share_label, availability, starts_at, ends_at, visibility_level")
        .eq("family_id", ctx!.family!.id)
        .gte("starts_at", monthStart)
        .lte("starts_at", monthEnd)
        .order("starts_at", { ascending: true })
        .limit(200);
      return (data ?? []) as CalendarWindow[];
    },
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["hub-conversations", ctx?.family?.id, user?.id],
    enabled: !!ctx?.family && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_conversations")
        .select("id, conversation_type, title, created_by, updated_at")
        .eq("family_id", ctx!.family!.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as HubConversation[];
    },
  });

  const hubConversation = conversations.find(
    (conversation) => conversation.conversation_type === "hub",
  );
  const privateConversations = conversations.filter(
    (conversation) => conversation.conversation_type === "private",
  );

  const { data: chatMessages = [] } = useQuery({
    queryKey: ["hub-chat-messages", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_chat_messages")
        .select("id, conversation_id, sender_label, sender_user_id, message_type, body, created_at")
        .eq("family_id", ctx!.family!.id)
        .order("created_at", { ascending: false })
        .limit(80);

      if (error) throw error;
      return (data ?? []) as HubChatMessage[];
    },
  });

  const { data: conversationParticipants = [] } = useQuery({
    queryKey: ["hub-conversation-participants", ctx?.family?.id],
    enabled: !!ctx?.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_conversation_participants")
        .select("conversation_id, participant_key, participant_label, participant_role, user_id")
        .eq("family_id", ctx!.family!.id);

      if (error) throw error;
      return (data ?? []) as ConversationParticipant[];
    },
  });

  const participantOptions = useMemo(() => {
    const currentUserOption = ctx?.profile?.full_name
      ? [
          {
            key: `user:${user?.id ?? "current"}`,
            label: ctx.profile.full_name,
            role: ctx.membership?.role_label ?? "You",
            userId: user?.id ?? null,
          },
        ]
      : [];

    return [
      ...currentUserOption,
      ...demoAccounts.map((account) => ({
        key: `demo:${account.id}`,
        label: account.fullName,
        role: account.role,
        userId: null,
      })),
    ];
  }, [ctx?.membership?.role_label, ctx?.profile?.full_name, user?.id]);

  const participantsByEventId = useMemo(() => {
    return eventParticipants.reduce<Record<string, EventParticipant[]>>((acc, participant) => {
      acc[participant.event_id] = [...(acc[participant.event_id] ?? []), participant];
      return acc;
    }, {});
  }, [eventParticipants]);

  // hub events enriched with participant labels — fed to HubCalendarView
  const calendarHubEvents = useMemo<HubCalendarEvent[]>(() => {
    return hubEvents.map((event) => ({
      ...event,
      participantLabels: (participantsByEventId[event.id] ?? []).map(
        (p) => p.participant_label,
      ),
    }));
  }, [hubEvents, participantsByEventId]);

  const rowsForParticipantKeys = (eventId: string, keys: string[]) =>
    keys
      .map((key) => {
        const option = participantOptions.find((participant) => participant.key === key);
        if (!option || !ctx?.family || !user) return null as never;
        return {
          family_id: ctx.family.id,
          event_id: eventId,
          invited_user_id: option.userId,
          participant_key: option.key,
          participant_label: option.label,
          participant_role: option.role,
          response_status: option.userId ? "invited" : "tagged",
          visibility_level: "summary",
          created_by: user.id,
        };
      })
      .filter(Boolean);

  const ensureHubConversation = async () => {
    if (!ctx?.family || !user) return null;
    if (hubConversation) return hubConversation.id;

    const { data, error } = await supabase
      .from("hub_conversations")
      .insert({
        family_id: ctx.family.id,
        conversation_type: "hub",
        title: `${ctx.family.name} hub chat`,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ["hub-conversations", ctx.family.id] });
    return data.id;
  };

  const writeHubLog = async (
    body: string,
    messageType: HubChatMessage["message_type"] = "action",
  ) => {
    if (!ctx?.family) return;
    const conversationId = await ensureHubConversation();
    if (!conversationId) return;
    await supabase.from("hub_chat_messages").insert({
      family_id: ctx.family.id,
      conversation_id: conversationId,
      sender_user_id: null,
      sender_label: "LoveKey",
      message_type: messageType,
      body,
      visibility_level: "summary",
    });
    await queryClient.invalidateQueries({ queryKey: ["hub-chat-messages", ctx.family.id] });
  };

  const sendHubMessage = useMutation({
    mutationFn: async () => {
      if (!ctx?.family || !user || !hubChatBody.trim()) return;
      const conversationId = await ensureHubConversation();
      if (!conversationId) return;
      const { error } = await supabase.from("hub_chat_messages").insert({
        family_id: ctx.family.id,
        conversation_id: conversationId,
        sender_user_id: user.id,
        sender_label: ctx.profile?.full_name ?? "Hub member",
        message_type: "message",
        body: hubChatBody.trim(),
        visibility_level: "summary",
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      setHubChatBody("");
      await queryClient.invalidateQueries({ queryKey: ["hub-chat-messages", ctx?.family?.id] });
    },
    onError: () => toast.error("Message could not be sent yet."),
  });

  const sendPrivateMessage = useMutation({
    mutationFn: async () => {
      if (!ctx?.family || !user || !privateChatBody.trim()) return;
      const selectedOptions = participantOptions.filter((option) =>
        privateParticipantKeys.includes(option.key),
      );
      if (selectedOptions.length === 0) {
        throw new Error("Choose at least one private chat participant.");
      }
      const title = selectedOptions.map((option) => option.label.split(" ")[0]).join(", ");
      const { data: conversation, error: conversationError } = await supabase
        .from("hub_conversations")
        .insert({
          family_id: ctx.family.id,
          conversation_type: "private",
          title: `Private chat with ${title}`,
          created_by: user.id,
        })
        .select("id")
        .single();
      if (conversationError) throw conversationError;

      const currentUserRow = {
        family_id: ctx.family.id,
        conversation_id: conversation.id,
        user_id: user.id,
        participant_key: `user:${user.id}`,
        participant_label: ctx.profile?.full_name ?? "You",
        participant_role: ctx.membership?.role_label ?? "You",
      };
      const selectedRows = selectedOptions.map((option) => ({
        family_id: ctx.family!.id,
        conversation_id: conversation.id,
        user_id: option.userId,
        participant_key: option.key,
        participant_label: option.label,
        participant_role: option.role,
      }));
      const { error: participantError } = await supabase
        .from("hub_conversation_participants")
        .insert([currentUserRow, ...selectedRows]);
      if (participantError) throw participantError;

      const { error: messageError } = await supabase.from("hub_chat_messages").insert({
        family_id: ctx.family.id,
        conversation_id: conversation.id,
        sender_user_id: user.id,
        sender_label: ctx.profile?.full_name ?? "Hub member",
        message_type: "message",
        body: privateChatBody.trim(),
        visibility_level: "contextual",
      });
      if (messageError) throw messageError;
    },
    onSuccess: async () => {
      setPrivateChatBody("");
      setPrivateParticipantKeys([]);
      await queryClient.invalidateQueries({ queryKey: ["hub-conversations", ctx?.family?.id] });
      await queryClient.invalidateQueries({
        queryKey: ["hub-conversation-participants", ctx?.family?.id],
      });
      await queryClient.invalidateQueries({ queryKey: ["hub-chat-messages", ctx?.family?.id] });
      toast.success("Private chat started.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Private message could not be sent yet.",
      ),
  });

  const searchNearbyPublicHubs = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }
    setNearbySearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));
        setNearbyLocation({
          latitude,
          longitude,
          accuracy: position.coords.accuracy ? Math.round(position.coords.accuracy) : null,
        });

        const { data, error } = await supabase.rpc("search_public_hubs_nearby", {
          _latitude: latitude,
          _longitude: longitude,
          _radius_km: nearbyRadiusKm,
          _limit: 24,
        });

        setNearbySearching(false);
        if (error) {
          toast.error("Nearby public hubs could not be searched yet.");
          return;
        }
        setNearbyPublicHubs((data ?? []) as PublicHubSearchResult[]);
        toast.success(`${data?.length ?? 0} public hubs found nearby.`);
      },
      () => {
        setNearbySearching(false);
        toast.error("Location permission was not granted.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const generateInviteLink = async () => {
    if (!ctx?.family || !user) return;
    setCreatingInvite(true);
    const { data, error } = await supabase
      .from("family_invites")
      .insert({ family_id: ctx.family.id, created_by: user.id })
      .select("token")
      .single();
    setCreatingInvite(false);
    if (error || !data) {
      toast.error("Couldn't create invite link.");
      return;
    }
    setInviteLink(`${window.location.origin}/invite/${data.token}`);
  };

  const openInviteSheet = () => {
    setInviteLink(null);
    setInviteContact("");
    setInviteSheetOpen(true);
  };

  const validateDueMoments = useMutation({
    mutationFn: async () => {
      if (!ctx?.family) return;
      const { error } = await supabase.rpc("validate_due_hub_moments", {
        _family_id: ctx.family.id,
        _limit: 100,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["hub-moments", ctx?.family?.id] });
      toast.success("Moment validation refreshed.");
    },
    onError: () => toast.error("Moment validation could not be refreshed yet."),
  });

  const createDemoCalendarSync = useMutation({
    mutationFn: async (provider: CalendarProvider) => {
      if (!ctx?.family || !user) return;
      const now = new Date();
      const pickupStart = new Date(now);
      pickupStart.setHours(15, 0, 0, 0);
      const pickupEnd = new Date(pickupStart);
      pickupEnd.setMinutes(pickupEnd.getMinutes() + 45);
      const dinnerStart = new Date(now);
      dinnerStart.setHours(18, 0, 0, 0);
      const dinnerEnd = new Date(dinnerStart);
      dinnerEnd.setMinutes(dinnerEnd.getMinutes() + 90);

      const { data: connection, error: connectionError } = await supabase
        .from("calendar_connections")
        .insert({
          family_id: ctx.family.id,
          user_id: user.id,
          provider: provider.provider,
          protocol: provider.protocol,
          display_name: provider.name,
          source_label: "Demo availability sync",
          availability_granularity: "busy_free",
          include_event_titles: false,
          status: "connected",
          last_synced_at: now.toISOString(),
        })
        .select("id")
        .single();

      if (connectionError) throw connectionError;

      const { error: availabilityError } = await supabase
        .from("calendar_availability_windows")
        .insert([
          {
            family_id: ctx.family.id,
            user_id: user.id,
            connection_id: connection.id,
            starts_at: pickupStart.toISOString(),
            ends_at: pickupEnd.toISOString(),
            availability: "busy",
            source_protocol: provider.protocol,
            visibility_level: "summary",
            share_label: "Busy for school pickup",
            external_event_hash: `${provider.provider}:pickup-demo`,
          },
          {
            family_id: ctx.family.id,
            user_id: user.id,
            connection_id: connection.id,
            starts_at: dinnerStart.toISOString(),
            ends_at: dinnerEnd.toISOString(),
            availability: "tentative",
            source_protocol: provider.protocol,
            visibility_level: "summary",
            share_label: "Family dinner window",
            external_event_hash: `${provider.provider}:dinner-demo`,
          },
        ]);
      if (availabilityError) throw availabilityError;

      const { error: consentError } = await supabase.from("rsp_consent_events").insert({
        family_id: ctx.family.id,
        actor_user_id: user.id,
        event_type: "calendar_availability_sync_enabled",
        signal_type: "calendar",
        consent_state: "granted",
        context: "calendar_sync",
        metadata: {
          provider: provider.provider,
          protocol: provider.protocol,
          granularity: "busy_free",
          event_titles_shared: false,
        },
      });
      if (consentError) throw consentError;

      await supabase.from("calendar_sync_logs").insert({
        family_id: ctx.family.id,
        user_id: user.id,
        connection_id: connection.id,
        status: "completed",
        windows_imported: 2,
        message: "Demo busy/free windows imported. Event titles remain hidden.",
      });
      await writeHubLog(
        `${provider.name} availability sync connected. Busy/free windows are now visible in the hub.`,
        "system",
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calendar-connections", ctx?.family?.id] });
      toast.success("Calendar availability sync enabled for demo.");
    },
    onError: () => toast.error("Calendar sync could not be created yet."),
  });

  const createHubEvent = useMutation({
    mutationFn: async (form: EventForm) => {
      if (!ctx?.family || !user) return;
      const { data: event, error } = await supabase
        .from("hub_events")
        .insert({
          family_id: ctx.family.id,
          created_by: user.id,
          title: form.title.trim(),
          event_type: form.event_type,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
          support_context: form.support_context.trim() || null,
          visibility_level: form.visibility_level,
          status: "planned",
        })
        .select("id")
        .single();
      if (error) throw error;

      const participantRows = rowsForParticipantKeys(event.id, form.participant_keys);
      if (participantRows.length > 0) {
        const { error: participantError } = await supabase
          .from("hub_event_participants")
          .insert(participantRows);
        if (participantError) throw participantError;
      }
      await writeHubLog(`Calendar event added: ${form.title.trim()}.`, "event");
    },
    onSuccess: async () => {
      setEventForm(defaultEventForm);
      await queryClient.invalidateQueries({ queryKey: ["hub-events", ctx?.family?.id] });
      await queryClient.invalidateQueries({
        queryKey: ["hub-event-participants", ctx?.family?.id],
      });
      toast.success("Event added to Today Together.");
    },
    onError: () => toast.error("Event could not be added yet."),
  });

  const updateHubEvent = useMutation({
    mutationFn: async ({ id, form }: { id: string; form: EventForm }) => {
      const { error } = await supabase
        .from("hub_events")
        .update({
          title: form.title.trim(),
          event_type: form.event_type,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
          support_context: form.support_context.trim() || null,
          visibility_level: form.visibility_level,
        })
        .eq("id", id);
      if (error) throw error;

      const { error: deleteError } = await supabase
        .from("hub_event_participants")
        .delete()
        .eq("event_id", id);
      if (deleteError) throw deleteError;

      const participantRows = rowsForParticipantKeys(id, form.participant_keys);
      if (participantRows.length > 0) {
        const { error: participantError } = await supabase
          .from("hub_event_participants")
          .insert(participantRows);
        if (participantError) throw participantError;
      }
      await writeHubLog(`Calendar event updated: ${form.title.trim()}.`, "event");
    },
    onSuccess: async () => {
      setEditingEventId(null);
      setEditingEventForm(defaultEventForm);
      await queryClient.invalidateQueries({ queryKey: ["hub-events", ctx?.family?.id] });
      await queryClient.invalidateQueries({
        queryKey: ["hub-event-participants", ctx?.family?.id],
      });
      toast.success("Event updated.");
    },
    onError: () => toast.error("Event could not be updated yet."),
  });

  const healthLabel = useMemo(() => {
    if (energy === "Yellow" || time === "Unavailable")
      return { t: "Reduced", c: "bg-health-yellow" };
    if (will === "Need help") return { t: "Crisis", c: "bg-health-red" };
    if (energy === "Green" && time === "Available") return { t: "Healthy", c: "bg-health-green" };
    return { t: "Stable", c: "bg-health-blue" };
  }, [time, energy, will]);

  const persistPresence = async (nextWill: Will, nextSupportSignal = supportSignal) => {
    if (!user || !ctx?.family) return;
    const { error } = await supabase.from("presence_states").upsert({
      family_id: ctx.family.id,
      user_id: user.id,
      node_id: ctx.family.id,
      label: nextSupportSignal,
      status: nextWill,
      mood_ring: nextWill === "Need help" ? "Needs support" : healthLabel.t,
      needs_support: nextWill === "Need help",
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Presence could not be shared yet.");
    }
  };

  const routeSupportSignal = async (signal: SupportSignal) => {
    if (!user || !ctx?.family) return;
    const nextWill: Will = signal === "Need support" ? "Need help" : will;
    setSupportSignal(signal);
    if (signal === "Need support") setWill("Need help");
    setSavingSignal(true);

    const category =
      signal === "Safe arrival"
        ? "safe_arrival"
        : signal === "Need support"
          ? "need_support"
          : "all_good";
    const urgency = signal === "Need support" ? "medium" : "low";

    const { data: supportRequest, error: supportError } = await supabase
      .from("support_requests")
      .insert({
        family_id: ctx.family.id,
        requester_user_id: user.id,
        category,
        urgency,
        message:
          signal === "Need support"
            ? "I need support. Please route this to my trusted contacts first."
            : signal === "Safe arrival"
              ? "Safe arrival confirmed."
              : "All good check-in shared.",
        route_summary: "trusted_contacts -> recovery_circle -> help_network_referral",
      })
      .select("id")
      .single();

    const { error: consentError } = await supabase.from("rsp_consent_events").insert({
      family_id: ctx.family.id,
      actor_user_id: user.id,
      event_type: "support_signal_shared",
      signal_type: "support_request",
      consent_state: "support_routed",
      context: "family_hub",
      metadata: { signal, category, route: "trusted_contacts_first" },
    });

    const { error: momentError } = await supabase.from("hub_moments").insert({
      family_id: ctx.family.id,
      actor_user_id: user.id,
      contact_label: firstName,
      event_type: category,
      event_summary:
        signal === "Need support"
          ? "Support request routed to trusted contacts"
          : signal === "Safe arrival"
            ? "Safe arrival shared with the hub"
            : "All-good presence check-in shared",
      source_event_id: supportRequest?.id ?? `${category}:${Date.now()}`,
      follow_through_met: signal !== "Need support",
    });

    if (!momentError) {
      await queryClient.invalidateQueries({ queryKey: ["hub-moments", ctx.family.id] });
    }

    await persistPresence(nextWill, signal);
    setSavingSignal(false);

    if (supportError || consentError || momentError) {
      toast.error("Support signal could not be routed yet.");
      return;
    }

    await writeHubLog(
      signal === "Need support"
        ? `${firstName} shared a support signal. Trusted contacts first.`
        : `${firstName} shared: ${signal}.`,
      signal === "Need support" ? "alert" : "support",
    );

    toast.success(
      signal === "Need support"
        ? "Support routed to trusted contacts first."
        : "Presence shared with trusted contacts.",
    );
  };

  if (isLoading || !ctx?.profile?.full_name || !ctx?.family) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-6 text-center">
        <div>
          <img src={lovekeyMark} alt="Love Key" className="mx-auto h-14 w-14" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Getting your account ready</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We will finish your profile first, then create or join a hub with your consent.
          </p>
        </div>
      </div>
    );
  }

  const firstName = ctx.profile.full_name.split(" ")[0];
  const hubType = ctx.family.hub_type ?? "immediate_family";
  const isWorkHub = hubType === "corporate_team";
  const contextualRole =
    ctx.membership?.role_label ?? (isWorkHub ? "Operations Manager" : "Hub owner");
  const privacyLine = isWorkHub
    ? `You are visible as ${contextualRole} in this team hub. Your family wellbeing status is private.`
    : `You are visible as ${contextualRole} in this hub. Work status stays out of family spaces.`;
  const initials = ctx.profile.full_name
    .split(" ")
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const demoHubMembers: HubMemberSummary[] = demoAccounts.map((account) => ({
    name: account.displayName,
    role: `${account.location} · ${account.role}`,
    presence: account.availability,
    mood: account.mood,
    avatarUrl: account.avatarUrl,
  }));
  const selectedDemoAccount =
    demoAccounts.find((account) => account.id === selectedDemoId) ?? demoAccounts[0];
  const locationAvatarPresence = locationPresenceToPresenceState(locationPresence.presence);
  const currentAvatarPresence =
    will === "Need help"
      ? "needs_support"
      : (locationAvatarPresence ?? devicePresenceToPresenceState(devicePresence.effectiveState));
  const hubMembers: HubMemberSummary[] = [
    {
      name: firstName,
      role: contextualRole,
      presence: currentAvatarPresence,
      mood:
        will === "Need help"
          ? "crisis"
          : energy === "Yellow"
            ? "reduced"
            : energy === "Green"
              ? "healthy"
              : "stable",
      avatarUrl: ctx.profile.avatar_url,
    },
    ...demoHubMembers,
  ];
  const hubHealth = healthLabel.t.toLowerCase() as MoodRingState;
  const homeMenuLinks = [
    { href: "#home", label: "Home", Icon: Home },
    { href: "#hub-chat", label: "Hub chat", Icon: MessageCircle },
    { href: "#presence", label: "Presence", Icon: HeartPulse },
    { href: "#today", label: "Today Together", Icon: Calendar },
    { href: "#calendar-sync", label: "Calendar sync", Icon: CalendarCheck },
    { href: "#support", label: "Support", Icon: HandHeart },
    { href: "#moments", label: "Moments", Icon: Activity },
  ];

  /** Icon to represent a hub type in the side menu */
  const hubTypeIcon = (hubType: HubType | null | undefined) => {
    switch (hubType) {
      case "immediate_family": return Home;
      case "birth_family": return Users;
      case "blended_family": return Users;
      case "co_parenting": return HeartPulse;
      case "elder_care": return HandHeart;
      case "sporting_group": return Activity;
      case "book_club": return BookOpen;
      case "corporate_team": return Briefcase;
      case "recovery_circle": return Shield;
      default: return Home;
    }
  };

  const activeHubId = selectedFamilyId ?? ctx?.family?.id ?? null;
  const hubChatMessages = hubConversation
    ? chatMessages.filter((message) => message.conversation_id === hubConversation.id).slice(0, 10)
    : [];
  const mobileTopMembers = hubMembers.slice(0, 3);
  const mobileBottomMembers = hubMembers.slice(3, 6);
  const mobileHeartTone =
    hubHealth === "crisis"
      ? "from-health-red to-health-orange"
      : hubHealth === "reduced"
        ? "from-health-yellow to-soft-blue"
        : hubHealth === "recovering"
          ? "from-health-purple to-soft-blue"
          : hubHealth === "healthy"
            ? "from-health-green to-primary"
            : "from-primary to-soft-blue";
  const privateChatPreviews = privateConversations.map((conversation) => ({
    conversation,
    participants: conversationParticipants.filter(
      (participant) => participant.conversation_id === conversation.id,
    ),
    messages: chatMessages
      .filter((message) => message.conversation_id === conversation.id)
      .slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigate({ to: "/" });
                }
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img src={lovekeyMark} alt="Love Key" className="h-14 w-14" width={56} height={56} />
              <span className="truncate font-semibold tracking-tight">
                Love Key <span className="text-primary">Link</span>
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#presence" className="hover:text-foreground">
              Presence
            </a>
            <a href="#family" className="hover:text-foreground">
              Family
            </a>
            <a href="#hubs" className="hover:text-foreground">
              Hubs
            </a>
            <a href="#today" className="hover:text-foreground">
              Today Together
            </a>
            <a href="#support" className="hover:text-foreground">
              Support
            </a>
            <a href="#moments" className="hover:text-foreground">
              Moments
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">
              {ctx.family.name}
            </span>
            <button
              aria-label="Open hub menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
              className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>
            <button
              aria-label="Settings"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              aria-label="Sign out"
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
            {ctx.profile.avatar_url ? (
              <img
                src={ctx.profile.avatar_url}
                alt={ctx.profile.full_name}
                className="ml-1 h-8 w-8 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-medium text-primary-foreground">
                {initials}
              </div>
            )}
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-[20rem] overflow-y-auto bg-background/95 backdrop-blur"
        >
          <SheetHeader className="pr-6">
            <div className="flex items-center gap-3">
              <img src={lovekeyMark} alt="" aria-hidden="true" className="h-10 w-10" />
              <div>
                <SheetTitle>{ctx.family.name}</SheetTitle>
                <SheetDescription>Hub health: {healthLabel.t}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-6 rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${healthLabel.c}`} />
              {hubMembers.length} participating people
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              The heart changes color as hub health changes.
            </p>
          </div>

          <nav className="mt-5 grid gap-1">
            {homeMenuLinks.map(({ href, label, Icon }) => (
              <SheetClose asChild key={href}>
                <a
                  href={href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </a>
              </SheetClose>
            ))}
          </nav>

          {/* ── Family section ─────────────────────────────── */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between px-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Family
              </span>
              <SheetClose asChild>
                <button
                  type="button"
                  onClick={() => setCreateHubOpen(true)}
                  aria-label="Create a new family hub"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </SheetClose>
            </div>

            <div className="grid gap-1">
              {allHubs.length === 0 && (
                <p className="px-3 text-xs text-muted-foreground">No hubs yet.</p>
              )}
              {allHubs.map((hub) => {
                const HubIcon = hubTypeIcon(hub.hub_type);
                const isActive = hub.id === activeHubId;
                return (
                  <SheetClose asChild key={hub.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedFamilyId(hub.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
                          isActive ? "bg-primary/15 text-primary" : "bg-accent text-muted-foreground"
                        }`}
                      >
                        <HubIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{hub.name}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  </SheetClose>
                );
              })}
            </div>
          </div>
          {/* ─────────────────────────────────────────────────── */}

          <div className="mt-6 grid gap-2">
            <button
              type="button"
              onClick={() => void routeSupportSignal("All good")}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
            >
              Share all good
            </button>
            <button
              type="button"
              onClick={() => void routeSupportSignal("Need support")}
              className="rounded-2xl border border-health-red/25 bg-health-red/10 px-4 py-3 text-sm font-medium"
            >
              Request support
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section
          id="home"
          className="min-h-[calc(100svh-6rem)] scroll-mt-24 py-0 md:grid md:items-center md:gap-8 md:py-6 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="-mx-6 h-[calc(100svh-5.1rem)] overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory md:hidden">
            <div className="relative flex min-h-[calc(100svh-5.1rem)] snap-start flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-secondary via-background to-soft-blue/20 px-5 py-5">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-2xl" />
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open hub menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-soft ring-1 ring-border"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div className="rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium shadow-soft ring-1 ring-border">
                    {healthLabel.t}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {mobileTopMembers.map((member) => (
                    <div key={`mobile-top-${member.name}`} className="flex flex-col items-center">
                      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-card text-sm font-semibold text-primary shadow-soft ring-4 ring-white">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          member.name.slice(0, 2).toUpperCase()
                        )}
                        <span
                          className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${
                            member.presence === "needs_support"
                              ? "bg-health-red"
                              : member.presence === "busy"
                                ? "bg-health-yellow"
                                : member.presence === "quiet"
                                  ? "bg-health-purple"
                                  : "bg-health-green"
                          }`}
                        />
                      </div>
                      <div className="mt-1 max-w-20 truncate text-xs font-medium">
                        {member.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex min-h-[18rem] w-full flex-1 items-center justify-center py-5">
                <a
                  href="#mobile-hub-chat-state"
                  aria-label="Open hub chat log"
                  className={`relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-[0_22px_70px_rgba(16,33,74,0.22)] ring-1 ring-primary/10 transition active:scale-95`}
                >
                  <span
                    className={`absolute inset-10 rounded-[2rem] bg-gradient-to-br ${mobileHeartTone} shadow-[0_0_56px_rgba(46,120,255,0.35)]`}
                  />
                  <img
                    src={lovekeyMark}
                    alt="Open hub chat"
                    className="relative h-28 w-28 drop-shadow-lg"
                  />
                </a>
              </div>

              <div className="relative z-10 w-full">
                <div className="grid grid-cols-3 gap-3">
                  {mobileBottomMembers.map((member) => (
                    <div
                      key={`mobile-bottom-${member.name}`}
                      className="flex flex-col items-center"
                    >
                      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-card text-sm font-semibold text-primary shadow-soft ring-4 ring-white">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          member.name.slice(0, 2).toUpperCase()
                        )}
                        <span
                          className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${
                            member.presence === "needs_support"
                              ? "bg-health-red"
                              : member.presence === "busy"
                                ? "bg-health-yellow"
                                : member.presence === "quiet"
                                  ? "bg-health-purple"
                                  : "bg-health-green"
                          }`}
                        />
                      </div>
                      <div className="mt-1 max-w-20 truncate text-xs font-medium">
                        {member.name}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">Are my people okay?</h1>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                    Tap the heart or swipe down for the hub chat and public log.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="mobile-hub-chat-state"
              className="flex min-h-[calc(100svh-5.1rem)] snap-start flex-col bg-gradient-to-b from-foreground via-[#133c55] to-primary px-5 py-5 text-white"
            >
              <div className="flex items-center justify-between">
                <a
                  href="#home"
                  aria-label="Return to hub heart"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25"
                >
                  <img src={lovekeyMark} alt="" className="h-7 w-7" />
                </a>
                <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20">
                  Hub chat log
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
                  <MessageCircle className="h-20 w-20 text-primary" />
                </div>
              </div>

              <div className="mt-7 flex-1 overflow-hidden rounded-[2rem] bg-white/95 p-4 text-foreground shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Group chat</h2>
                    <p className="text-xs text-muted-foreground">Messages, actions and alerts.</p>
                  </div>
                  <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
                    Public
                  </span>
                </div>

                <div className="mt-4 max-h-[42svh] space-y-3 overflow-y-auto pr-1">
                  {hubChatMessages.length === 0 ? (
                    <div className="rounded-2xl bg-surface-warm p-4 text-sm text-muted-foreground">
                      No hub chat messages yet. Send a message or create an event to start the log.
                    </div>
                  ) : (
                    hubChatMessages.slice(0, 8).map((message) => (
                      <div
                        key={`mobile-${message.id}`}
                        className={`rounded-2xl p-3 ring-1 ${
                          message.message_type === "alert"
                            ? "bg-health-red/10 ring-health-red/20"
                            : message.message_type === "message"
                              ? "bg-background ring-border"
                              : "bg-surface-warm ring-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-medium">{message.sender_label}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {formatMomentTime(message.created_at)}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{message.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendHubMessage.mutate();
                  }}
                >
                  <input
                    value={hubChatBody}
                    onChange={(event) => setHubChatBody(event.target.value)}
                    placeholder="Message the hub..."
                    className="min-h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40"
                  />
                  <button
                    type="submit"
                    disabled={sendHubMessage.isPending || !hubChatBody.trim()}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                    aria-label="Send hub message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="hidden animate-fade-up md:block lg:order-1">
            <p className="text-sm text-muted-foreground">
              {ctx.family.name} · One profile, multiple hubs
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              Are my people okay?
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Good morning, {firstName}. Your hub is connected and calm. Presence comes before
              messaging, and support is ready without shame.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm shadow-soft ring-1 ring-border`}
              >
                <span className={`h-2 w-2 rounded-full ${healthLabel.c}`} />
                Family connection: {healthLabel.t}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {moments.length} live moments
              </span>
            </div>
            <div className="mt-5 rounded-2xl bg-card p-4 text-sm shadow-soft ring-1 ring-border">
              <div className="flex items-center gap-2 font-medium">
                <Eye className="h-4 w-4 text-primary" />
                What others can see
              </div>
              <p className="mt-1 text-muted-foreground">{privacyLine}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Pause visibility", "Reduce detail", "Revoke access"].map((action) => (
                  <button
                    key={action}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <PauseCircle className="h-3 w-3" />
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden items-center justify-center md:flex lg:order-2">
            <Nucleus
              members={hubMembers.slice(1)}
              status={hubHealth}
              variant="home"
              inviteSlotCount={4}
              hubType={ctx.family.hub_type as import("@/lib/lovekey-model").HubType}
              onHeartClick={() => setGroupChatOpen(true)}
              onInviteSlot={openInviteSheet}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-4">
          {[
            "Everyone connected",
            "Everyone cared for",
            "Privacy first",
            "Human-first connection",
          ].map((promise) => (
            <div
              key={promise}
              className="rounded-2xl bg-card px-4 py-3 text-sm shadow-soft ring-1 ring-border"
            >
              {promise}
            </div>
          ))}
        </section>

        <section id="shared-dashboard" className="mt-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Shared user dashboard</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Demo accounts show how one hub feels different for each person while keeping
                visibility low-resolution and consent-led.
              </p>
            </div>
            <div className="inline-flex rounded-2xl bg-card p-1 shadow-soft ring-1 ring-border">
              {demoAccounts.slice(0, 4).map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedDemoId(account.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                    selectedDemoId === account.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {account.displayName}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <DemoPerspectiveCard account={selectedDemoAccount} />

            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-4">
                {demoHubStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                  >
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="mt-1 text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.detail}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold tracking-tight">Demo account visibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Every person can share less detail without leaving the hub.
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setSelectedDemoId(account.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedDemoId === account.id
                          ? "border-primary/35 bg-primary/5"
                          : "border-border bg-background hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AvatarInitials account={account} />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{account.fullName}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {account.role} · {account.visibility}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-surface-warm px-2.5 py-1">
                          {account.location}
                        </span>
                        <span className="rounded-full bg-surface-warm px-2.5 py-1">
                          {account.wellbeing}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="hub-chat" className="mt-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Hub chat</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                A central conversation for public hub coordination, logged actions and calm alerts.
                Private chats stay separate and participant-selected.
              </p>
            </div>
            <div className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
              Public hub log · private direct chats
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold tracking-tight">Central hub chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Messages, events, actions and alerts shared with the hub.
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-4 max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                {hubChatMessages.length === 0 ? (
                  <div className="rounded-2xl bg-surface-warm p-4 text-sm text-muted-foreground">
                    No hub chat messages yet. Send a message or create an event to start the log.
                  </div>
                ) : (
                  hubChatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-2xl p-4 ring-1 ${
                        message.message_type === "alert"
                          ? "bg-health-red/10 ring-health-red/20"
                          : message.message_type === "message"
                            ? "bg-background ring-border"
                            : "bg-surface-warm ring-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium">{message.sender_label}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatMomentTime(message.created_at)}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{message.body}</p>
                      <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {message.message_type}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendHubMessage.mutate();
                }}
              >
                <input
                  value={hubChatBody}
                  onChange={(event) => setHubChatBody(event.target.value)}
                  placeholder="Share a message with the hub..."
                  className="min-h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40"
                />
                <button
                  type="submit"
                  disabled={sendHubMessage.isPending || !hubChatBody.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold tracking-tight">Private chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Select one or more recipients for a two-or-more-person private conversation.
                    </p>
                  </div>
                  <Lock className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-background p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Select recipients
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {participantOptions
                      .filter((participant) => participant.key !== `user:${user?.id}`)
                      .map((participant) => (
                        <button
                          key={participant.key}
                          type="button"
                          onClick={() =>
                            setPrivateParticipantKeys((current) =>
                              toggleParticipantKey(current, participant.key),
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            privateParticipantKeys.includes(participant.key)
                              ? "border-primary/30 bg-primary/8 text-primary"
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {participant.label}
                        </button>
                      ))}
                  </div>
                </div>

                <form
                  className="mt-3 grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendPrivateMessage.mutate();
                  }}
                >
                  <textarea
                    value={privateChatBody}
                    onChange={(event) => setPrivateChatBody(event.target.value)}
                    placeholder="Write a private message..."
                    rows={3}
                    className="resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none transition focus:border-primary/40"
                  />
                  <button
                    type="submit"
                    disabled={
                      sendPrivateMessage.isPending ||
                      !privateChatBody.trim() ||
                      privateParticipantKeys.length === 0
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    Start private chat
                  </button>
                </form>
              </div>

              <div className="rounded-3xl bg-surface-warm p-5 shadow-soft ring-1 ring-border">
                <h3 className="font-semibold tracking-tight">Private conversations</h3>
                <div className="mt-3 space-y-3">
                  {privateChatPreviews.length === 0 ? (
                    <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground ring-1 ring-border">
                      No private chats yet.
                    </div>
                  ) : (
                    privateChatPreviews
                      .slice(0, 4)
                      .map(({ conversation, participants, messages }) => (
                        <div
                          key={conversation.id}
                          className="rounded-2xl bg-card p-4 ring-1 ring-border"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-medium">{conversation.title}</div>
                            <span className="rounded-full bg-primary/8 px-2 py-1 text-[11px] text-primary">
                              Private
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {participants.map((participant) => (
                              <span
                                key={`${conversation.id}-${participant.participant_key}`}
                                className="rounded-full bg-surface-warm px-2 py-1 text-[11px] text-muted-foreground"
                              >
                                {participant.participant_label}
                              </span>
                            ))}
                          </div>
                          {messages[0] ? (
                            <p className="mt-3 text-sm text-muted-foreground">{messages[0].body}</p>
                          ) : null}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Presence setter */}
        <section id="presence" className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Your gentle presence</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visible to trusted hub members you choose. Never ranked. Never scored.
              </p>
            </div>
            <span className="hidden text-xs text-muted-foreground md:inline">
              Visible to: Household + Care · change anytime
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DimensionCard Icon={Clock} label="Time">
              <div className="flex flex-wrap gap-2">
                {timeOpts.map((t) => (
                  <Chip key={t} active={time === t} onClick={() => setTime(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </DimensionCard>

            <DimensionCard Icon={Battery} label="Energy">
              <div className="flex flex-wrap gap-2">
                {energyOpts.map((e) => (
                  <button
                    key={e.v}
                    onClick={() => setEnergy(e.v)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ease-calm ${
                      energy === e.v
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${e.cls}`} />
                    {e.v} <span className="text-xs text-muted-foreground">· {e.hint}</span>
                  </button>
                ))}
              </div>
            </DimensionCard>

            <DimensionCard Icon={MapPin} label="Location (categorical)">
              <div className="flex flex-wrap gap-2">
                {locOpts.map(({ v, Icon }) => (
                  <button
                    key={v}
                    onClick={() => setLoc(v)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ease-calm ${
                      loc === v
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {v}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No coordinates. No tracking. Exact location is opt-in, temporary and revocable.
              </p>
            </DimensionCard>

            <DimensionCard Icon={HandHeart} label="Willingness">
              <div className="flex flex-wrap gap-2">
                {willOpts.map((w) => (
                  <Chip
                    key={w}
                    active={will === w}
                    onClick={() => {
                      setWill(w);
                      void persistPresence(w);
                    }}
                  >
                    {w}
                  </Chip>
                ))}
              </div>
            </DimensionCard>

            <DimensionCard Icon={Activity} label="Device signal">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${devicePresenceDotClass(
                      devicePresence.effectiveState,
                    )}`}
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {devicePresenceLabel(devicePresence.effectiveState)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {devicePresence.source === "manual"
                        ? `Manual until ${formatManualUntil(devicePresence.row?.manual_until)}`
                        : "Auto from app visibility and heartbeat"}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getDevicePresenceHint(devicePresence.effectiveState)} · Last heartbeat:{" "}
                  {formatPresenceTime(devicePresence.row?.last_heartbeat_at)}
                </p>
                <div className="grid gap-2 sm:grid-cols-[1fr_7rem_auto]">
                  <Select
                    value={manualDeviceState}
                    onValueChange={(value) => setManualDeviceState(value as DevicePresenceState)}
                  >
                    <SelectTrigger aria-label="Manual device signal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {devicePresenceStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(manualDeviceDuration)}
                    onValueChange={(value) =>
                      setManualDeviceDuration(Number(value) as ManualOverrideDuration)
                    }
                  >
                    <SelectTrigger aria-label="Manual device signal duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {manualOverrideDurations.map((duration) => (
                        <SelectItem key={duration.value} value={String(duration.value)}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() =>
                      void devicePresence.setManualOverride(
                        manualDeviceState,
                        manualDeviceDuration,
                      )
                    }
                    className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Override
                  </button>
                </div>
                {devicePresence.source === "manual" ? (
                  <button
                    type="button"
                    onClick={() => void devicePresence.clearManualOverride()}
                    className="w-fit text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Return to auto
                  </button>
                ) : null}
              </div>
            </DimensionCard>

            <DimensionCard Icon={LocateFixed} label="Location intelligence">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${locationPresenceTone(
                      locationPresence.presence?.inferred_state ?? "unknown",
                    )}`}
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {locationPresence.presence?.status_label ?? "Location unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locationPresence.tracking
                        ? "Foreground location signal is active"
                        : "Location signal is paused"}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Uses saved hotspots, 10-minute dwell time and 30 km/h movement to infer context.
                  Exact live coordinates are not shown to hub members.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={locationPresence.startTracking}
                    disabled={locationPresence.tracking}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    Start signal
                  </button>
                  <button
                    type="button"
                    onClick={() => void locationPresence.pauseTracking()}
                    disabled={!locationPresence.tracking}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-60"
                  >
                    <PauseCircle className="h-3.5 w-3.5" />
                    Pause
                  </button>
                </div>

                {locationPresence.watchError ? (
                  <p className="text-xs text-destructive">{locationPresence.watchError}</p>
                ) : null}

                {locationPresence.latestPoint ? (
                  <div className="rounded-xl bg-surface-warm px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
                    Current reading: about {locationPresence.latestPoint.accuracy ?? "unknown"}m
                    accuracy
                    {typeof locationPresence.presence?.speed_kmh === "number"
                      ? ` · ${locationPresence.presence.speed_kmh.toFixed(1)} km/h`
                      : ""}
                    {locationPresence.presence?.dwell_minutes
                      ? ` · settled ${locationPresence.presence.dwell_minutes} min`
                      : ""}
                  </div>
                ) : null}

                <div className="rounded-xl bg-card p-3 ring-1 ring-border">
                  <div className="text-xs font-medium text-muted-foreground">
                    Add current location to hotspot favourites
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      value={hotspotName}
                      onChange={(event) => setHotspotName(event.target.value)}
                      placeholder="Home, school, work..."
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                    <Select
                      value={hotspotType}
                      onValueChange={(value) => setHotspotType(value as HotspotType)}
                    >
                      <SelectTrigger aria-label="Hotspot type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hotspotTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={String(hotspotRadius)}
                      onValueChange={(value) => setHotspotRadius(Number(value))}
                    >
                      <SelectTrigger aria-label="Hotspot radius">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[100, 150, 250, 500].map((radius) => (
                          <SelectItem key={radius} value={String(radius)}>
                            {radius}m radius
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={hotspotVisibility}
                      onValueChange={(value) =>
                        setHotspotVisibility(value as HotspotVisibility)
                      }
                    >
                      <SelectTrigger aria-label="Hotspot visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hotspotVisibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const name = hotspotName.trim();
                      if (!name) {
                        toast.error("Name this hotspot first.");
                        return;
                      }
                      if (!locationPresence.latestPoint) {
                        toast.error("Start the location signal before saving a hotspot.");
                        return;
                      }
                      const saved = await locationPresence.saveHotspot({
                        name,
                        hotspotType,
                        radiusMeters: hotspotRadius,
                        visibility: hotspotVisibility,
                      });
                      if (saved) setHotspotName("");
                    }}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save hotspot
                  </button>
                </div>

                {locationPresence.hotspots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {locationPresence.hotspots.slice(0, 5).map((hotspot) => (
                      <span
                        key={hotspot.id}
                        className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border"
                      >
                        <MapPin className="h-3 w-3" />
                        {hotspot.name} · {hotspot.radius_meters}m
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </DimensionCard>
          </div>
        </section>

        <section id="family" className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Family</h2>
          <p className="mt-1 text-sm text-muted-foreground">Who matters most?</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {demoAccounts.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
              >
                <div className="flex items-center gap-3">
                  <AvatarInitials account={member} />
                  <div>
                    <div className="font-medium">{member.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.role} · {member.location}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      member.availability === "needs_support"
                        ? "bg-health-red"
                        : member.availability === "busy"
                          ? "bg-health-yellow"
                          : member.availability === "quiet"
                            ? "bg-health-purple"
                            : "bg-health-green"
                    }`}
                  />
                  {member.visibility}. {member.lastMoment}.
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div id="hubs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Hubs & Spaces</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  What do we share together? Contexts stay separate by default.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateSpaceOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-soft transition hover:bg-accent hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Create hub
              </button>
            </div>
            <div className="mt-5 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 font-semibold tracking-tight">
                    <Search className="h-4 w-4 text-primary" />
                    Search public hubs near me
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Finds public hubs with shared approximate locations. Private hubs never appear
                    here.
                  </p>
                  {nearbyLocation && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Searching from {nearbyLocation.latitude}, {nearbyLocation.longitude}
                      {nearbyLocation.accuracy
                        ? ` · about ${nearbyLocation.accuracy}m accuracy`
                        : ""}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <label className="sr-only" htmlFor="nearby-radius">
                    Search radius
                  </label>
                  <select
                    id="nearby-radius"
                    value={nearbyRadiusKm}
                    onChange={(event) => setNearbyRadiusKm(Number(event.target.value))}
                    className="h-10 rounded-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                  >
                    {[5, 10, 25, 50, 100].map((radius) => (
                      <option key={radius} value={radius}>
                        {radius} km
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void searchNearbyPublicHubs()}
                    disabled={nearbySearching}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    <LocateFixed className="h-4 w-4" />
                    {nearbySearching ? "Searching..." : "Use location"}
                  </button>
                </div>
              </div>

              {nearbyPublicHubs.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {nearbyPublicHubs.map((hub) => {
                    const type = getHubType(hub.hub_type);
                    return (
                      <div
                        key={hub.id}
                        className="rounded-2xl bg-surface-warm p-4 ring-1 ring-border"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold tracking-tight">{hub.name}</h3>
                              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
                                {type.label}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                  hub.password_required
                                    ? "bg-health-yellow/25 text-foreground"
                                    : "bg-health-green/20 text-foreground"
                                }`}
                              >
                                {hub.password_required ? "Password required" : hub.public_join_mode}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {hub.description || type.purpose}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 ring-1 ring-border">
                                <MapPin className="h-3 w-3" />
                                {hub.location_label || "Approximate location shared"}
                              </span>
                              <span className="rounded-full bg-card px-2.5 py-1 ring-1 ring-border">
                                {hub.distance_km.toFixed(1)} km away
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
                            disabled
                          >
                            Join flow next
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {hubSpaceCards.map(({ title, body, Icon }) => (
                <li key={title} className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-xs text-muted-foreground">{body}</div>
                    </div>
                  </div>
                </li>
              ))}
              {circles.map((c) => (
                <li
                  key={c.name}
                  className="group rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${c.health}`} />
                      <div>
                        <div className="text-xs text-muted-foreground">{c.question}</div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.note}</div>
                      </div>
                    </div>
                    <c.Icon className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div id="today">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Today Together</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Events, appointments, reminders and support coordination.
                </p>
              </div>
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>

            {/* ── Hub calendar grid ────────────────────────────────────── */}
            <div className="mt-5">
              <HubCalendarView
                hubEvents={calendarHubEvents}
                calendarWindows={calendarWindows}
                loading={hubEventsLoading}
              />
            </div>

            <form
              className="mt-6 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
              onSubmit={(event) => {
                event.preventDefault();
                if (!eventForm.title.trim()) {
                  toast.error("Add an event title first.");
                  return;
                }
                createHubEvent.mutate(eventForm);
              }}
            >
              <div className="flex items-center gap-2 font-medium">
                <Plus className="h-4 w-4 text-primary" />
                Add calendar event
              </div>
              <div className="mt-3 grid gap-3">
                <input
                  value={eventForm.title}
                  onChange={(event) =>
                    setEventForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Dinner, pickup, appointment..."
                  className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={eventForm.event_type}
                    onChange={(event) =>
                      setEventForm((current) => ({ ...current, event_type: event.target.value }))
                    }
                    className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                  >
                    {hubEventTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="datetime-local"
                    value={eventForm.starts_at}
                    onChange={(event) =>
                      setEventForm((current) => ({ ...current, starts_at: event.target.value }))
                    }
                    className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={eventForm.support_context}
                    onChange={(event) =>
                      setEventForm((current) => ({
                        ...current,
                        support_context: event.target.value,
                      }))
                    }
                    placeholder="Optional care note, e.g. bring medication"
                    className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                  />
                  <select
                    value={eventForm.visibility_level}
                    onChange={(event) =>
                      setEventForm((current) => ({
                        ...current,
                        visibility_level: event.target.value,
                      }))
                    }
                    className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                  >
                    <option value="summary">Summary</option>
                    <option value="contextual">Contextual</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Invite or tag hub participants
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {participantOptions.map((participant) => (
                      <button
                        key={participant.key}
                        type="button"
                        onClick={() =>
                          setEventForm((current) => ({
                            ...current,
                            participant_keys: toggleParticipantKey(
                              current.participant_keys,
                              participant.key,
                            ),
                          }))
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          eventForm.participant_keys.includes(participant.key)
                            ? "border-primary/30 bg-primary/8 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {participant.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Participants are invited or tagged inside this hub only.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Shared events stay inside this hub. Visibility can be reduced per event.
                </p>
                <button
                  type="submit"
                  disabled={createHubEvent.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </form>

            <ul className="mt-4 space-y-3">
              {hubEventsLoading ? (
                <li className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                  Loading calendar events...
                </li>
              ) : hubEvents.length > 0 ? (
                hubEvents.map((event) => {
                  const editing = editingEventId === event.id;
                  const participants = participantsByEventId[event.id] ?? [];
                  return (
                    <li
                      key={event.id}
                      className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                    >
                      {editing ? (
                        <form
                          className="grid gap-3"
                          onSubmit={(submitEvent) => {
                            submitEvent.preventDefault();
                            if (!editingEventForm.title.trim()) {
                              toast.error("Event title cannot be empty.");
                              return;
                            }
                            updateHubEvent.mutate({ id: event.id, form: editingEventForm });
                          }}
                        >
                          <input
                            value={editingEventForm.title}
                            onChange={(changeEvent) =>
                              setEditingEventForm((current) => ({
                                ...current,
                                title: changeEvent.target.value,
                              }))
                            }
                            className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                          />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <select
                              value={editingEventForm.event_type}
                              onChange={(changeEvent) =>
                                setEditingEventForm((current) => ({
                                  ...current,
                                  event_type: changeEvent.target.value,
                                }))
                              }
                              className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                            >
                              {hubEventTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="datetime-local"
                              value={editingEventForm.starts_at}
                              onChange={(changeEvent) =>
                                setEditingEventForm((current) => ({
                                  ...current,
                                  starts_at: changeEvent.target.value,
                                }))
                              }
                              className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                            />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <input
                              value={editingEventForm.support_context}
                              onChange={(changeEvent) =>
                                setEditingEventForm((current) => ({
                                  ...current,
                                  support_context: changeEvent.target.value,
                                }))
                              }
                              className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                            />
                            <select
                              value={editingEventForm.visibility_level}
                              onChange={(changeEvent) =>
                                setEditingEventForm((current) => ({
                                  ...current,
                                  visibility_level: changeEvent.target.value,
                                }))
                              }
                              className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary/40"
                            >
                              <option value="summary">Summary</option>
                              <option value="contextual">Contextual</option>
                              <option value="hidden">Hidden</option>
                            </select>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <UserPlus className="h-4 w-4 text-primary" />
                              Invite or tag hub participants
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {participantOptions.map((participant) => (
                                <button
                                  key={participant.key}
                                  type="button"
                                  onClick={() =>
                                    setEditingEventForm((current) => ({
                                      ...current,
                                      participant_keys: toggleParticipantKey(
                                        current.participant_keys,
                                        participant.key,
                                      ),
                                    }))
                                  }
                                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                                    editingEventForm.participant_keys.includes(participant.key)
                                      ? "border-primary/30 bg-primary/8 text-primary"
                                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {participant.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEventId(null);
                                setEditingEventForm(defaultEventForm);
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={updateHubEvent.isPending}
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                            >
                              <Save className="h-3.5 w-3.5" />
                              Save
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-health-yellow/20 text-foreground">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {event.starts_at
                                    ? formatMomentTime(event.starts_at)
                                    : "Time not set"}{" "}
                                  · {formatEventType(event.event_type)}
                                </div>
                              </div>
                              <button
                                type="button"
                                aria-label={`Edit ${event.title}`}
                                onClick={() => {
                                  setEditingEventId(event.id);
                                  setEditingEventForm(eventToForm(event, participants));
                                }}
                                className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                            {event.support_context ? (
                              <div className="mt-2 text-sm text-muted-foreground">
                                {event.support_context}
                              </div>
                            ) : null}
                            {participants.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {participants.map((participant) => (
                                  <span
                                    key={participant.id}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-xs text-primary"
                                  >
                                    <Users className="h-3 w-3" />
                                    {participant.participant_label}
                                    <span className="text-primary/70">
                                      {participant.response_status}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="rounded-full bg-surface-warm px-2.5 py-1">
                                {event.status}
                              </span>
                              <span className="rounded-full bg-surface-warm px-2.5 py-1">
                                {event.visibility_level} visibility
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })
              ) : (
                todayTogetherItems.map(({ title, time, Icon }) => (
                  <li
                    key={title}
                    className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-health-yellow/20 text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-xs text-muted-foreground">{time}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div
              id="wellbeing"
              className="mt-6 rounded-2xl bg-surface-warm p-5 shadow-soft ring-1 ring-border"
            >
              <h2 className="text-xl font-semibold tracking-tight">Wellbeing</h2>
              <p className="mt-1 text-sm text-muted-foreground">How is everyone feeling?</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {["All good", "Steady", "Stretched", "Need help"].map((state) => (
                  <button
                    key={state}
                    className={`rounded-full border px-3 py-2 text-sm transition ease-calm ${
                      state === "Need help"
                        ? "border-health-red/30 bg-health-red/10"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="calendar-sync" className="mt-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Calendar availability sync</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Connect popular calendar programs through standard protocols and share only
                availability windows. Event titles, notes, guests and exact location stay private
                unless explicitly enabled later.
              </p>
            </div>
            <div className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
              iCal · ICS · CalDAV · OAuth free/busy
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-3 md:grid-cols-2">
              {calendarProviders.map((provider) => (
                <div
                  key={provider.provider}
                  className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <provider.Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {provider.description}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-surface-warm px-2.5 py-1 text-[11px] text-muted-foreground">
                      {provider.protocol}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Busy/free by default
                    </span>
                    <button
                      type="button"
                      onClick={() => createDemoCalendarSync.mutate(provider)}
                      disabled={createDemoCalendarSync.isPending}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary/30 hover:text-primary disabled:cursor-wait disabled:opacity-60"
                    >
                      {provider.status === "Available" ? "Enable demo sync" : "Preview flow"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-surface-warm p-5 shadow-soft ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold tracking-tight">Synced availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Personal calendar data becomes calm hub signals.
                  </p>
                </div>
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 space-y-3">
                {calendarConnections.length === 0 ? (
                  <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                    No calendar syncs yet. Enable a demo sync to import busy/free windows for this
                    hub.
                  </div>
                ) : (
                  calendarConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{connection.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {connection.protocol} · {connection.availability_granularity} · titles{" "}
                            {connection.include_event_titles ? "shared" : "hidden"}
                          </div>
                        </div>
                        <span className="rounded-full bg-health-green/15 px-2.5 py-1 text-xs">
                          {connection.status}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Last synced:{" "}
                        {connection.last_synced_at
                          ? formatMomentTime(connection.last_synced_at)
                          : "Not yet"}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 rounded-2xl bg-primary/5 p-4 text-sm ring-1 ring-primary/15">
                LoveKey stores availability windows like “busy” or “tentative,” not full event
                bodies. Calendar sync can be paused, reduced or revoked at any time.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div id="moments">
            <h2 className="text-xl font-semibold tracking-tight">Moments</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check-ins, shared updates and safe-arrival confirmations.
            </p>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => validateDueMoments.mutate()}
                disabled={validateDueMoments.isPending}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-60"
              >
                {validateDueMoments.isPending ? "Refreshing validation…" : "Refresh validation"}
              </button>
            </div>
            <ul className="mt-5 space-y-3">
              {momentsLoading ? (
                <li className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                  Loading live validation status…
                </li>
              ) : moments.length === 0 ? (
                <li className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                  No persisted moments yet. Share a support signal to start the validation trail.
                </li>
              ) : (
                moments.map((moment) => {
                  const Icon = momentIcons[moment.event_type] ?? Activity;
                  const isValidated = moment.validation_status === "validated";
                  const isWaiting = moment.validation_status === "pending";
                  const statusText = isValidated
                    ? "Validated"
                    : isWaiting
                      ? `Pending until ${formatMomentTime(moment.validation_delay_until)}`
                      : "Needs follow-through";

                  return (
                    <li
                      key={moment.id}
                      className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                    >
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/8 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">{moment.contact_label}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatMomentTime(moment.created_at)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{moment.event_summary}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs">
                          {isValidated ? (
                            <Check className="h-3 w-3 text-health-green" />
                          ) : (
                            <Clock className="h-3 w-3 text-health-yellow" />
                          )}
                          <span className="text-muted-foreground">{statusText}</span>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">Permissions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preview what this hub can see. Cross-hub sharing stays off unless you choose it.
            </p>
            <div className="mt-5 grid gap-3">
              {permissionSignals.map((permission) => (
                <div
                  key={permission.value}
                  className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                >
                  <div className="font-medium">{permission.label}</div>
                  <div className="text-sm text-muted-foreground">{permission.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-primary/5 p-4 text-sm ring-1 ring-primary/15">
              {privacyLine}
            </div>
          </div>
        </section>

        {/* Support request */}
        <section
          id="support"
          className="mt-12 rounded-3xl bg-surface-warm p-6 shadow-soft ring-1 ring-border"
        >
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <HandHeart className="h-3.5 w-3.5" />
                Support without shame
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">Who needs care now?</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Share a calm support signal with trusted contacts first. If private support is not
                enough, the Help Network connection can be considered with consent and context.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-4 text-sm shadow-soft ring-1 ring-border">
              <div className="flex items-center gap-2 font-medium">
                <Shield className="h-4 w-4 text-primary" />
                Current routing
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Trusted contacts → recovery circle → Help Network referral.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(["All good", "Safe arrival", "Need support"] as SupportSignal[]).map((signal) => (
              <button
                key={signal}
                onClick={() => void routeSupportSignal(signal)}
                disabled={savingSignal}
                className={`rounded-full border px-4 py-2 text-sm transition ease-calm disabled:cursor-wait disabled:opacity-60 ${
                  supportSignal === signal
                    ? signal === "Need support"
                      ? "border-health-red/40 bg-health-red/10 text-foreground"
                      : "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {signal}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Selected signal: <span className="font-medium text-foreground">{supportSignal}</span>.
            You can pause, reduce or revoke visibility at any time.
          </p>
        </section>

        {/* Gentle reminders */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Quiet nudges</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Soft prompts, never alarms. You decide what to act on.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {reminders.map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ${
                  r.soft ? "bg-surface-warm ring-border" : "bg-primary/5 ring-primary/20"
                }`}
              >
                <Activity
                  className={`mt-0.5 h-4 w-4 ${r.soft ? "text-muted-foreground" : "text-primary"}`}
                />
                <div className="flex-1 text-sm">{r.text}</div>
                <button className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-border/60 pb-24 pt-5 text-center text-xs text-muted-foreground md:pb-6">
          © {new Date().getFullYear()} Love Key · Part of the Love Key HELP Network
        </footer>

      </main>
      <InviteSheet
        open={inviteSheetOpen}
        onOpenChange={(open) => {
          setInviteSheetOpen(open);
          if (!open) { setInviteLink(null); setInviteContact(""); }
        }}
        contact={inviteContact}
        onContactChange={setInviteContact}
        inviteLink={inviteLink}
        creating={creatingInvite}
        onGenerate={generateInviteLink}
        familyName={ctx.family.name}
      />
      <NotificationsSheet
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        userId={user!.id}
      />
      <GroupChatSheet
        open={groupChatOpen}
        onOpenChange={setGroupChatOpen}
        hubName={ctx.family.name}
        hubType={ctx.family.hub_type as import("@/lib/lovekey-model").HubType | undefined}
        currentUser={{
          id: user!.id,
          name: ctx.profile.full_name,
          avatarUrl: ctx.profile.avatar_url,
        }}
        members={hubMembers.map((m, i) => ({
          id: i === 0 ? user!.id : `member-${i}`,
          name: m.name,
          avatarUrl: m.avatarUrl,
        }))}
      />
      <CreateHubSheet
        open={createHubOpen}
        onOpenChange={setCreateHubOpen}
        userId={user!.id}
        hubTypes={["immediate_family","birth_family","blended_family","co_parenting","elder_care"]}
        title="Create a family hub"
        description="Choose a template and give your hub a name. You can invite members after it's created."
        onCreated={(hubId) => {
          setSelectedFamilyId(hubId);
          void queryClient.invalidateQueries({ queryKey: ["all-hubs", user?.id] });
          void queryClient.invalidateQueries({ queryKey: ["app-context", user?.id, hubId] });
        }}
      />
      <CreateHubSheet
        open={createSpaceOpen}
        onOpenChange={setCreateSpaceOpen}
        userId={user!.id}
        hubTypes={["sporting_group","book_club","corporate_team","recovery_circle"]}
        title="Create a hub or space"
        description="Choose a template — each one comes with suggested roles and a starter group chat."
        onCreated={(hubId) => {
          setSelectedFamilyId(hubId);
          void queryClient.invalidateQueries({ queryKey: ["all-hubs", user?.id] });
          void queryClient.invalidateQueries({ queryKey: ["app-context", user?.id, hubId] });
        }}
      />

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl bg-card/95 p-2 text-[11px] shadow-soft ring-1 ring-border backdrop-blur md:hidden">
        {[
          { href: "#presence", label: "Home", Icon: Home },
          { href: "#family", label: "Family", Icon: UserRound },
          { href: "#hubs", label: "Hubs", Icon: Shield },
          { href: "#wellbeing", label: "Wellbeing", Icon: HeartPulse },
          { href: "#support", label: "More", Icon: MoreHorizontal },
        ].map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            className="flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

function DimensionCard({
  Icon,
  label,
  children,
}: {
  Icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      {children}
    </div>
  );
}

function DemoPerspectiveCard({ account }: { account: DemoAccount }) {
  const isSupport = account.availability === "needs_support";

  return (
    <div className="rounded-3xl bg-gradient-hero p-5 shadow-soft ring-1 ring-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AvatarInitials account={account} size="lg" />
          <div>
            <div className="text-sm text-muted-foreground">Viewing demo account</div>
            <h3 className="text-2xl font-semibold tracking-tight">{account.fullName}</h3>
            <div className="mt-1 text-sm text-muted-foreground">
              {account.role} · {account.location}
            </div>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isSupport ? "bg-health-red/12 text-foreground" : "bg-primary/10 text-primary"
          }`}
        >
          {account.visibility}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SignalTile label="Presence" value={presenceLabel(account.availability)} />
        <SignalTile label="Wellbeing" value={account.wellbeing} />
        <SignalTile label="Next" value={account.next} />
        <SignalTile label="Latest moment" value={account.lastMoment} />
      </div>

      <div className="mt-5 rounded-2xl bg-card/85 p-4 text-sm shadow-soft ring-1 ring-border backdrop-blur">
        <div className="flex items-center gap-2 font-medium">
          <Eye className="h-4 w-4 text-primary" />
          What the hub sees
        </div>
        <p className="mt-1 text-muted-foreground">{account.privacyNote}</p>
      </div>
    </div>
  );
}

function SignalTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card/85 p-4 shadow-soft ring-1 ring-border backdrop-blur">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function AvatarInitials({
  account,
  size = "md",
}: {
  account: Pick<DemoAccount, "fullName" | "color" | "avatarUrl">;
  size?: "md" | "lg";
}) {
  const letters = account.fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white shadow-soft ring-4 ring-white/70 ${
        size === "lg" ? "h-16 w-16" : "h-11 w-11"
      } ${account.avatarUrl ? "bg-card" : account.color}`}
    >
      {account.avatarUrl ? (
        <img src={account.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        letters
      )}
    </div>
  );
}

// ─── New user welcome screen ───────────────────────────────────────────────

function NewUserHome({ user, hubType, onInviteSlot }: { user: { email?: string } | null; hubType?: import("@/lib/lovekey-model").HubType; onInviteSlot: (index: number) => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-hero px-6 py-12">
      <div className="flex items-center gap-2">
        <img src={lovekeyMark} alt="Love Key" className="h-14 w-14" />
        <span className="font-semibold tracking-tight">
          Love Key <span className="text-primary">Link</span>
        </span>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome to your hub.</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Setting up your private family space… Tap the invite slots to bring your people in.
        </p>
      </div>
      <div className="w-full max-w-lg">
        <Nucleus
          members={[]}
          status="healthy"
          variant="home"
          inviteSlotCount={4}
          hubType={hubType}
          onInviteSlot={onInviteSlot}
        />
      </div>
      <p className="text-xs text-muted-foreground">{user?.email}</p>
    </div>
  );
}

// ─── Create hub sheet (shared for Family and Hubs & Spaces) ─────────────────

const CATEGORY_BADGE: Record<string, string> = {
  Family:    "bg-primary/10 text-primary",
  Community: "bg-health-blue/15 text-health-blue",
  Work:      "bg-health-yellow/20 text-foreground",
  Recovery:  "bg-health-purple/15 text-health-purple",
};

/** Generic hub-creation sheet. Pass `hubTypes` to limit which templates appear. */
function CreateHubSheet({
  open,
  onOpenChange,
  userId,
  onCreated,
  hubTypes: allowedTypes,
  title = "Create a hub",
  description = "Choose a template and give your hub a name. You can invite members after it's created.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onCreated: (hubId: string) => void;
  hubTypes: HubType[];
  title?: string;
  description?: string;
}) {
  const typeOptions = allowedTypes.map((v) => getHubType(v));
  const [selectedType, setSelectedType] = useState<HubType>(allowedTypes[0]);
  const [hubName, setHubName] = useState("");
  const [creating, setCreating] = useState(false);

  // Reset on open / type change
  useEffect(() => {
    if (open) { setSelectedType(allowedTypes[0]); setHubName(""); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => { setHubName(""); }, [selectedType]);

  const placeholder = getHubType(selectedType).namePlaceholder;

  const handleCreate = async () => {
    setCreating(true);
    try {
      const name = hubName.trim() || placeholder;
      // Use SECURITY DEFINER RPC — avoids RLS chicken-and-egg on families INSERT
      const { id: newHubId, error } = await createFamilyHub({
        userId,
        name,
        hubType: selectedType,
        hubVisibility: "private",
        publicJoinMode: "invite",
        roleLabel: "Hub owner",
      });

      if (error) console.error("[CreateHubSheet] hub create error:", error.cause);
      if (error || !newHubId) {
        toast.error(error?.message ? `Hub error: ${error.message}` : "Couldn't create hub. Please try again.");
        return;
      }

      toast.success(`${name} created.`);
      onCreated(newHubId);
      onOpenChange(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Template picker */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Choose a template</p>
            <div className="grid gap-2">
              {typeOptions.map((ht) => {
                const isSelected = ht.value === selectedType;
                const badgeClass = CATEGORY_BADGE[ht.category] ?? CATEGORY_BADGE.Family;
                return (
                  <button
                    key={ht.value}
                    type="button"
                    onClick={() => setSelectedType(ht.value)}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-primary/40 bg-primary/8 ring-1 ring-primary/25"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isSelected ? "text-primary" : ""}`}>
                          {ht.label}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}>
                          {ht.category}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{ht.purpose}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        e.g. {ht.members}
                      </p>
                      {isSelected && ht.roleSuggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ht.roleSuggestions.map((role) => (
                            <span
                              key={role}
                              className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hub name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="new-hub-name">
              Hub name <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              id="new-hub-name"
              type="text"
              value={hubName}
              onChange={(e) => setHubName(e.target.value)}
              placeholder={placeholder}
              maxLength={60}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={creating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {creating ? "Creating…" : "Create hub"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Invite sheet ──────────────────────────────────────────────────────────

function InviteSheet({
  open,
  onOpenChange,
  contact,
  onContactChange,
  inviteLink,
  creating,
  onGenerate,
  familyName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: string;
  onContactChange: (v: string) => void;
  inviteLink: string | null;
  creating: boolean;
  onGenerate: () => void;
  familyName: string;
}) {
  const isEmail = contact.includes("@");
  const isPhone = /^[\d+\s\-()]{7,}$/.test(contact.trim());

  const copyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied.");
  };

  const mailtoHref = inviteLink && isEmail
    ? `mailto:${encodeURIComponent(contact.trim())}?subject=${encodeURIComponent(`Join ${familyName} on Love Key`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to invite you to join my family hub on Love Key Link.\n\nClick this link to join:\n${inviteLink}\n\nLinks expire in 14 days.\n`)}`
    : null;

  const smsHref = inviteLink && isPhone
    ? `sms:${encodeURIComponent(contact.trim())}?body=${encodeURIComponent(`Join my Love Key family hub: ${inviteLink}`)}`
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Invite a family member
          </SheetTitle>
          <SheetDescription>
            Invite someone to join <span className="font-medium text-foreground">{familyName}</span>.
            Links expire in 14 days and can only be used once.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Email address or phone number</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => onContactChange(e.target.value)}
              placeholder="name@example.com or +61 4xx xxx xxx"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {contact && !isEmail && !isPhone && (
              <p className="mt-1 text-xs text-muted-foreground">
                Enter a valid email or phone to unlock send shortcuts.
              </p>
            )}
          </div>

          {!inviteLink ? (
            <button
              onClick={onGenerate}
              disabled={creating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Generating…" : "Generate invite link"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl bg-surface-warm p-4 ring-1 ring-border">
                <p className="text-xs font-medium text-muted-foreground">Your invite link</p>
                <div className="mt-2 break-all rounded-md bg-background p-3 font-mono text-xs ring-1 ring-border">
                  {inviteLink}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-medium ring-1 ring-border hover:bg-accent"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy link
                </button>

                {mailtoHref && (
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-medium ring-1 ring-border hover:bg-accent"
                  >
                    <Send className="h-3.5 w-3.5" /> Send via email
                  </a>
                )}

                {smsHref && (
                  <a
                    href={smsHref}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-medium ring-1 ring-border hover:bg-accent"
                  >
                    <Phone className="h-3.5 w-3.5" /> Send via SMS
                  </a>
                )}

                <button
                  onClick={onGenerate}
                  disabled={creating}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-medium ring-1 ring-border hover:bg-accent disabled:opacity-60"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> New link
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Share this link only with trusted people. Anyone with it can request to join.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <SheetClose asChild>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              Close
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function presenceLabel(value: PresenceState) {
  if (value === "needs_support") return "Needs support";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ease-calm ${
        active
          ? "border-primary/30 bg-primary/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
