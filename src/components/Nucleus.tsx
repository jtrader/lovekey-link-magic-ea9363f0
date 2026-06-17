import lovekeyMark from "@/assets/lovekey-mark.png";
import { moodRingStates, type MoodRingState, type PresenceState } from "@/lib/lovekey-model";
import { Heart } from "lucide-react";

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

const positions = [
  "left-[50%] top-[4%] -translate-x-1/2",
  "right-[2%] top-[31%]",
  "bottom-[4%] left-[50%] -translate-x-1/2",
  "left-[2%] top-[31%]",
  "left-[13%] bottom-[13%]",
  "right-[13%] bottom-[13%]",
];

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

const heartClass: Record<MoodRingState, string> = {
  healthy: "from-health-green to-primary text-white shadow-[0_0_44px_rgba(94,214,168,0.45)]",
  stable: "from-primary to-soft-blue text-white shadow-[0_0_44px_rgba(46,120,255,0.42)]",
  reduced: "from-health-yellow to-soft-blue text-foreground shadow-[0_0_44px_rgba(255,197,90,0.4)]",
  fragmenting:
    "from-health-orange to-health-yellow text-foreground shadow-[0_0_44px_rgba(255,132,65,0.35)]",
  crisis: "from-health-red to-health-orange text-white shadow-[0_0_44px_rgba(255,107,107,0.45)]",
  recovering: "from-health-purple to-soft-blue text-white shadow-[0_0_44px_rgba(179,157,255,0.42)]",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Nucleus({
  members = defaultMembers,
  status = "healthy",
  variant = "card",
}: {
  members?: HubMember[];
  status?: MoodRingState;
  variant?: "card" | "home";
}) {
  const visibleMembers = members.slice(0, positions.length);
  const statusLabel =
    moodRingStates.find((state) => state.value === status)?.label ?? moodRingStates[0].label;
  const isHome = variant === "home";

  return (
    <div
      className={`relative mx-auto aspect-square w-full overflow-hidden bg-gradient-hero p-6 ${
        isHome
          ? "max-w-[42rem] rounded-[2.5rem] shadow-[0_24px_80px_rgba(46,120,255,0.18)] ring-1 ring-primary/15"
          : "max-w-[29rem] rounded-[2rem] shadow-soft ring-1 ring-border"
      }`}
    >
      <div className="absolute inset-8 rounded-full border border-primary/10" />
      <div className="absolute inset-20 rounded-full border border-primary/10" />
      <div className="absolute inset-32 rounded-full border border-primary/8" />
      <div className="absolute inset-x-12 top-1/2 h-px -translate-y-1/2 bg-primary/10" />
      <div className="absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-primary/10" />
      <div className="absolute left-[18%] top-[18%] h-px w-[64%] rotate-[-28deg] bg-primary/10" />
      <div className="absolute left-[18%] bottom-[18%] h-px w-[64%] rotate-[28deg] bg-primary/10" />

      <div
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.25rem] bg-gradient-to-br ring-8 ring-white/70 ${heartClass[status]} ${
          isHome ? "h-40 w-40 sm:h-52 sm:w-52" : "h-28 w-28 sm:h-36 sm:w-36"
        }`}
        aria-label={`Hub health: ${statusLabel}`}
      >
        <Heart
          className={`${isHome ? "h-24 w-24 sm:h-32 sm:w-32" : "h-16 w-16 sm:h-20 sm:w-20"}`}
          fill="currentColor"
          strokeWidth={1.5}
        />
        <img
          src={lovekeyMark}
          alt=""
          aria-hidden="true"
          className="absolute h-12 w-12 opacity-85 mix-blend-screen sm:h-16 sm:w-16"
        />
      </div>

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

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-card/90 px-3 py-1.5 text-xs shadow-soft ring-1 ring-border backdrop-blur">
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
