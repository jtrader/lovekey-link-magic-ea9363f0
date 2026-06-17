import hubHealthImage from "@/assets/lovekey-hub-health.png";
import {
  hubInviteTemplates,
  moodRingStates,
  type HubType,
  type MoodRingState,
  type PresenceState,
} from "@/lib/lovekey-model";
import { MessageCircle, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HubMember = {
  name: string;
  role: string;
  presence: PresenceState;
  mood: MoodRingState;
  avatarUrl?: string | null;
};

const defaultMembers: HubMember[] = [
  { name: "Sarah", role: "At home", presence: "available", mood: "healthy" },
  { name: "Liam", role: "At school", presence: "available", mood: "stable" },
  { name: "Mia", role: "At work", presence: "busy", mood: "reduced" },
  { name: "Noah", role: "At home", presence: "available", mood: "healthy" },
  { name: "Nan", role: "Quiet", presence: "quiet", mood: "recovering" },
];

// 4 cardinal + 2 diagonal — matches invite slot count
const positions = [
  "left-[50%] top-[4%] -translate-x-1/2",
  "right-[2%] top-[31%]",
  "bottom-[4%] left-[50%] -translate-x-1/2",
  "left-[2%] top-[31%]",
  "left-[13%] bottom-[13%]",
  "right-[13%] bottom-[13%]",
];

// Only first 4 positions for invite placeholders
const invitePositions = positions.slice(0, 4);

const presenceClass: Record<PresenceState, string> = {
  available: "bg-health-green",
  busy: "bg-health-yellow",
  quiet: "bg-health-purple",
  needs_support: "bg-health-red",
};

const moodClass: Record<MoodRingState, string> = {
  healthy: "ring-health-green",
  stable: "ring-health-blue",
  reduced: "ring-health-yellow",
  fragmenting: "ring-health-orange",
  crisis: "ring-health-red",
  recovering: "ring-health-purple",
};

const starterAvatarUrl = (index: number) =>
  `/avatar-presence/avatar-${String(index + 1).padStart(2, "0")}.png`;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

/**
 * Auto-appearing tooltip that floats above the heart.
 * Fades in after `delayMs`, auto-hides after `visibleMs`, has a close button.
 * Suppressed once dismissed (per page session via ref).
 */
function HeartTooltip({
  visible,
  onClose,
  isHome,
}: {
  visible: boolean;
  onClose: () => void;
  isHome: boolean;
}) {
  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 transition-all duration-500 ease-in-out ${
        isHome ? "top-[18%]" : "top-[16%]"
      } ${visible ? "pointer-events-auto opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
    >
      <div className="relative flex items-center gap-2 whitespace-nowrap rounded-2xl bg-card px-3.5 py-2 text-xs font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-border">
        <MessageCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>Tap to open group chat</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Dismiss tooltip"
          className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
        {/* Caret pointing down toward the heart */}
        <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
      </div>
    </div>
  );
}

// ─── Nucleus ──────────────────────────────────────────────────────────────────

export function Nucleus({
  members = defaultMembers,
  status = "healthy",
  variant = "card",
  inviteSlotCount = 0,
  hubType,
  onInviteSlot,
  onHeartClick,
}: {
  members?: HubMember[];
  status?: MoodRingState;
  variant?: "card" | "home";
  /** Number of placeholder invite slots to show (max 4) */
  inviteSlotCount?: number;
  /** Hub type — drives invite label text and avatar seeds */
  hubType?: HubType;
  /** Called with the slot index (0–3) when a placeholder is clicked */
  onInviteSlot?: (index: number) => void;
  /** Called when the central heart is clicked — opens group chat */
  onHeartClick?: () => void;
}) {
  const showInvitePlaceholders = inviteSlotCount > 0;
  const visibleMembers = showInvitePlaceholders ? [] : members.slice(0, positions.length);
  const statusLabel =
    moodRingStates.find((state) => state.value === status)?.label ?? moodRingStates[0].label;
  const isHome = variant === "home";

  const template = hubInviteTemplates[hubType ?? "immediate_family"];
  const slotCount = Math.min(inviteSlotCount, 4);

  // Tooltip state — auto-appears after 1.8s, auto-hides after 5s, close button dismisses permanently
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!onHeartClick || dismissedRef.current) return;
    const showTimer = setTimeout(() => {
      if (!dismissedRef.current) setTooltipVisible(true);
    }, 1800);
    return () => clearTimeout(showTimer);
  }, [onHeartClick]);

  useEffect(() => {
    if (!tooltipVisible) return;
    const hideTimer = setTimeout(() => setTooltipVisible(false), 5000);
    return () => clearTimeout(hideTimer);
  }, [tooltipVisible]);

  const dismissTooltip = () => {
    dismissedRef.current = true;
    setTooltipVisible(false);
  };

  return (
    <div
      className={`relative mx-auto aspect-square w-full overflow-hidden bg-gradient-hero p-6 ${
        isHome
          ? "max-w-[42rem] rounded-[2.5rem] shadow-[0_24px_80px_rgba(46,120,255,0.18)] ring-1 ring-primary/15"
          : "max-w-[29rem] rounded-[2rem] shadow-soft ring-1 ring-border"
      }`}
    >
      {/* Orbital guide lines */}
      <div className="absolute inset-8 rounded-full border border-primary/10" />
      <div className="absolute inset-20 rounded-full border border-primary/10" />
      <div className="absolute inset-32 rounded-full border border-primary/8" />
      <div className="absolute inset-x-12 top-1/2 h-px -translate-y-1/2 bg-primary/10" />
      <div className="absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-primary/10" />
      <div className="absolute left-[18%] top-[18%] h-px w-[64%] rotate-[-28deg] bg-primary/10" />
      <div className="absolute left-[18%] bottom-[18%] h-px w-[64%] rotate-[28deg] bg-primary/10" />

      {/* Tooltip — floats above the heart */}
      {onHeartClick && (
        <HeartTooltip
          visible={tooltipVisible}
          onClose={dismissTooltip}
          isHome={isHome}
        />
      )}

      {/* Central Love Key Heart — clickable when onHeartClick is provided */}
      {onHeartClick ? (
        <button
          type="button"
          onClick={() => {
            dismissTooltip();
            onHeartClick();
          }}
          aria-label="Open group chat"
          className={`group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition hover:scale-[1.04] active:scale-[0.97] ${
            isHome ? "h-40 w-40 sm:h-52 sm:w-52" : "h-28 w-28 sm:h-36 sm:w-36"
          }`}
          aria-describedby="hub-health"
        >
          <img
            src={hubHealthImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full rounded-full object-contain drop-shadow-[0_0_34px_rgba(255,55,55,0.42)] transition-transform group-hover:scale-105"
          />
          {/* Chat hint icon — appears on hover */}
          <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 opacity-0 shadow-sm transition group-hover:opacity-100">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
          </span>
        </button>
      ) : (
        <div
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
            isHome ? "h-40 w-40 sm:h-52 sm:w-52" : "h-28 w-28 sm:h-36 sm:w-36"
          }`}
          aria-label={`Hub health: ${statusLabel}`}
        >
          <img
            src={hubHealthImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full rounded-full object-contain drop-shadow-[0_0_34px_rgba(255,55,55,0.42)]"
          />
        </div>
      )}

      {/* Real member avatars */}
      {visibleMembers.map((member, index) => (
        <div key={`${member.name}-${index}`} className={`absolute ${positions[index]}`}>
          <div className="flex w-24 flex-col items-center text-center">
            <div
              className={`relative flex items-center justify-center overflow-hidden rounded-full bg-card font-semibold text-primary shadow-soft ring-4 ${moodClass[member.mood]} ${
                isHome ? "h-20 w-20 text-base sm:h-24 sm:w-24" : "h-16 w-16 text-sm"
              }`}
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(member.name)
              )}
              <span
                className={`absolute bottom-0 right-0 rounded-full border-2 border-card ${presenceClass[member.presence]} ${
                  isHome ? "h-5 w-5" : "h-4 w-4"
                }`}
              />
            </div>
            <div className="mt-2 max-w-28 truncate text-xs font-medium">{member.name}</div>
            <div className="max-w-28 truncate text-[10px] text-muted-foreground">{member.role}</div>
          </div>
        </div>
      ))}

      {/* Invite placeholder slots — starter avatar + role label */}
      {showInvitePlaceholders &&
        invitePositions.slice(0, slotCount).map((pos, index) => {
          const slot = template.defaultSlots[index];
          return (
            <div key={`invite-slot-${index}`} className={`absolute ${pos}`}>
              <div className="flex w-24 flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => onInviteSlot?.(index)}
                  aria-label={template.inviteLabel}
                  className={`group relative flex items-center justify-center overflow-hidden rounded-full bg-card shadow-soft ring-4 ring-primary/10 backdrop-blur transition ease-calm hover:ring-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isHome ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16"
                  }`}
                >
                  {/* Local starter avatar from the LoveKey avatar and presence system */}
                  <img
                    src={starterAvatarUrl(index)}
                    alt=""
                    aria-hidden="true"
                    className="absolute h-full w-full rounded-full object-cover opacity-95 transition group-hover:scale-105 group-hover:opacity-100"
                  />
                  {/* UserPlus overlay — appears on hover */}
                  <span className="relative z-10 flex items-center justify-center rounded-full bg-white/80 p-1 opacity-0 shadow-sm transition group-hover:opacity-100">
                    <UserPlus
                      className={`text-primary ${isHome ? "h-5 w-5 sm:h-6 sm:w-6" : "h-4 w-4"}`}
                    />
                  </span>
                </button>
                <div className="mt-2 max-w-28 text-center text-xs font-medium leading-tight text-foreground/65">
                  {slot.role}
                </div>
                <div className="max-w-28 text-[10px] text-muted-foreground">Tap to invite</div>
              </div>
            </div>
          );
        })}

      {/* Hub health pill */}
      <div id="hub-health" className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-card/90 px-3 py-1.5 text-xs shadow-soft ring-1 ring-border backdrop-blur">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "crisis"
              ? "bg-health-red"
              : status === "reduced"
                ? "bg-health-yellow"
                : status === "recovering"
                  ? "bg-health-purple"
                  : "bg-health-green"
          }`}
        />
        Hub health: {statusLabel}
      </div>
    </div>
  );
}
