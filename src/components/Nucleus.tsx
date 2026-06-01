import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRSPPipeline } from "@rsp/react";
import { createConsent, type RSPConsent } from "@rsp/core";
import type { LoveKeyMoodRing } from "@/lib/rsp";

const DOT_POSITIONS = [
  { x: "10%", y: "20%" },
  { x: "85%", y: "30%" },
  { x: "75%", y: "85%" },
  { x: "15%", y: "80%" },
  { x: "50%", y: "5%" },
  { x: "92%", y: "60%" },
  { x: "50%", y: "92%" },
  { x: "5%", y: "55%" },
];

const MOOD_RING_CLASS: Record<LoveKeyMoodRing, string> = {
  healthy: "bg-health-green",
  stable: "bg-health-blue",
  reduced: "bg-health-yellow",
  fragmenting: "bg-health-orange",
  crisis: "bg-health-red",
  offline: "bg-muted",
};

interface NucleusOrbitingDotProps {
  colourClass: string;
  position: { x: string; y: string };
  label: string;
  needsSupport: boolean;
  index: number;
}

function NucleusOrbitingDot({ colourClass, position, label, needsSupport, index }: NucleusOrbitingDotProps) {
  return (
    <span
      title={label}
      aria-label={label || "Family member"}
      className={[
        "absolute h-3 w-3 rounded-full opacity-70 animate-breathe transition-colors duration-1000",
        colourClass,
        needsSupport ? "ring-2 ring-health-red ring-offset-1 opacity-100" : "",
      ].filter(Boolean).join(" ")}
      style={{
        left: position.x,
        top: position.y,
        animationDelay: `${index * 0.8}s`,
      }}
    />
  );
}

function NucleusOrbitingDots({ dots }: { dots: Array<{ colourClass: string; position: { x: string; y: string }; label: string; needsSupport: boolean }> }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((dot, i) => (
        <NucleusOrbitingDot key={i} {...dot} index={i} />
      ))}
    </div>
  );
}

function NucleusBackgroundGlows() {
  return (
    <>
      <div className="absolute inset-0 rounded-full bg-gradient-nucleus opacity-20 blur-3xl animate-breathe" />
      <div className="absolute inset-8 rounded-full bg-gradient-nucleus opacity-30 blur-2xl animate-drift" />
    </>
  );
}

function NucleusCentralSphere() {
  return (
    <div className="relative h-44 w-44 rounded-full bg-gradient-nucleus shadow-nucleus animate-breathe sm:h-56 sm:w-56" />
  );
}

interface NucleusProps {
  familyId?: string;
}

export function Nucleus({ familyId = "primary" }: NucleusProps) {
  const { user } = useAuth();

  const consent: RSPConsent | null = useMemo(() => {
    if (!user) return null;
    return createConsent({
      id: `consent-${user.id}-${familyId}`,
      nodeId: `node-${user.id}-${familyId}`,
      scope: ["coordination"],
      durationDays: 30,
    });
  }, [user?.id, familyId]);

  const nodeId = user ? `node-${user.id}-${familyId}` : "";

  const { track, isTracking } = useRSPPipeline({
    nodeId,
    consent,
    nodeType: "family-member",
    signalWindowMinutes: 30,
    consentScope: "coordination",
  });

  useEffect(() => {
    if (!isTracking) return;
    track.pageView();
    const timer = setInterval(track.activeMinute, 60_000);
    return () => clearInterval(timer);
  }, [isTracking, track]);

  const dots = [
    { colourClass: "bg-health-green", position: DOT_POSITIONS[0]!, label: "", needsSupport: false },
    { colourClass: "bg-health-blue", position: DOT_POSITIONS[1]!, label: "", needsSupport: false },
    { colourClass: "bg-health-yellow", position: DOT_POSITIONS[2]!, label: "", needsSupport: false },
    { colourClass: "bg-health-purple", position: DOT_POSITIONS[3]!, label: "", needsSupport: false },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
        <NucleusBackgroundGlows />
        <NucleusCentralSphere />
        <NucleusOrbitingDots dots={dots} />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Your family is connected
      </p>
    </div>
  );
}
