import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Nucleus } from "@/components/Nucleus";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/app")({
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
type Loc = "Home" | "Work" | "In Transit";
type Will = "Open" | "Ask gently" | "Not now" | "Need help";
type FamilySummary = { id: string; name: string };
type FamilyMemberRow = { families: FamilySummary | FamilySummary[] | null };
type SupportSignal = "All good" | "Safe arrival" | "Need support";

const timeOpts: Time[] = ["Available", "Maybe", "Busy", "Unavailable"];
const energyOpts: { v: Energy; cls: string; hint: string }[] = [
  { v: "Green", cls: "bg-health-green", hint: "Resourced" },
  { v: "Blue", cls: "bg-health-blue", hint: "Steady" },
  { v: "Yellow", cls: "bg-health-yellow", hint: "Low" },
];
const locOpts: { v: Loc; Icon: typeof Home }[] = [
  { v: "Home", Icon: Home },
  { v: "Work", Icon: Briefcase },
  { v: "In Transit", Icon: Car },
];
const willOpts: Will[] = ["Open", "Ask gently", "Not now", "Need help"];

const circles = [
  { name: "Household", count: 3, health: "bg-health-green", note: "All steady" },
  { name: "Care", count: 2, health: "bg-health-blue", note: "Mum — checked in 2h ago" },
  { name: "Emergency", count: 4, health: "bg-health-green", note: "All reachable" },
  { name: "Extended", count: 11, health: "bg-health-yellow", note: "2 quiet for 5+ days" },
  { name: "School", count: 6, health: "bg-health-green", note: "Pickup confirmed" },
];

const events = [
  { Icon: Phone, who: "Dad", what: "Voice call — 14 min", when: "1h ago", validated: true },
  { Icon: MessageCircle, who: "Sister", what: "Message exchange", when: "3h ago", validated: true },
  {
    Icon: Calendar,
    who: "Sam",
    what: "Coffee scheduled — Sat 10am",
    when: "Yesterday",
    validated: false,
  },
  {
    Icon: HandHeart,
    who: "Mum",
    what: "Offered help with groceries",
    when: "2 days ago",
    validated: true,
  },
];

const reminders = [
  { text: "Nan has been quiet for 6 days — a gentle check-in could help.", soft: true },
  { text: "School pickup window starts in 25 minutes.", soft: false },
];

function AppView() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<Time>("Available");
  const [energy, setEnergy] = useState<Energy>("Blue");
  const [loc, setLoc] = useState<Loc>("Home");
  const [will, setWill] = useState<Will>("Open");
  const [supportSignal, setSupportSignal] = useState<SupportSignal>("All good");
  const [savingSignal, setSavingSignal] = useState(false);

  // Pull profile + first family. Redirect to onboarding if either missing.
  const { data: ctx, isLoading } = useQuery({
    queryKey: ["app-context", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: profile }, { data: members }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase
          .from("family_members")
          .select("family_id, families(id, name)")
          .eq("user_id", user!.id)
          .limit(1),
      ]);
      const familyRow = members?.[0] as FamilyMemberRow | undefined;
      const family = Array.isArray(familyRow?.families)
        ? (familyRow.families[0] ?? null)
        : (familyRow?.families ?? null);
      return { profile, family };
    },
  });

  useEffect(() => {
    if (!ctx) return;
    if (!ctx.profile?.full_name || !ctx.family) {
      navigate({ to: "/onboarding" });
    }
  }, [ctx, navigate]);

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

    const { error: supportError } = await supabase.from("support_requests").insert({
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
    });

    const { error: consentError } = await supabase.from("rsp_consent_events").insert({
      family_id: ctx.family.id,
      actor_user_id: user.id,
      event_type: "support_signal_shared",
      signal_type: "support_request",
      consent_state: "support_routed",
      context: "family_hub",
      metadata: { signal, category, route: "trusted_contacts_first" },
    });

    await persistPresence(nextWill, signal);
    setSavingSignal(false);

    if (supportError || consentError) {
      toast.error("Support signal could not be routed yet.");
      return;
    }

    toast.success(
      signal === "Need support"
        ? "Support routed to trusted contacts first."
        : "Presence shared with trusted contacts.",
    );
  };

  if (isLoading || !ctx?.profile?.full_name || !ctx?.family) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading your link…</div>
      </div>
    );
  }

  const firstName = ctx.profile.full_name.split(" ")[0];
  const initials = ctx.profile.full_name
    .split(" ")
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={lovekeyMark} alt="Love Key" className="h-14 w-14" width={56} height={56} />
            <span className="font-semibold tracking-tight">
              Love Key <span className="text-primary">Link</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#presence" className="hover:text-foreground">
              Presence
            </a>
            <a href="#hubs" className="hover:text-foreground">
              Hubs
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
              aria-label="Notifications"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
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

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <p className="text-sm text-muted-foreground">{ctx.family.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome, {firstName}.
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Your family hub is calm. Five people have shared gentle presence today. Nothing
              requires you right now.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm shadow-soft ring-1 ring-border`}
              >
                <span className={`h-2 w-2 rounded-full ${healthLabel.c}`} />
                Family connection: {healthLabel.t}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                <Sparkles className="h-3.5 w-3.5 text-primary" />3 moments today
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center rounded-3xl bg-gradient-hero p-8 shadow-soft ring-1 ring-border">
            <Nucleus />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              Presence over the last 7 days
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
          </div>
        </section>

        {/* Hubs + moments */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div id="hubs">
            <h2 className="text-xl font-semibold tracking-tight">Your hubs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Separate contexts by default. Bridge only by consent.
            </p>
            <ul className="mt-5 space-y-3">
              {circles.map((c) => (
                <li
                  key={c.name}
                  className="group flex items-center justify-between rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border transition ease-calm hover:ring-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${c.health}`} />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.count} people · {c.note}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div id="moments">
            <h2 className="text-xl font-semibold tracking-tight">Recent moments</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Care touchpoints and shared updates, not a performance feed.
            </p>
            <ul className="mt-5 space-y-3">
              {events.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <e.Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{e.who}</div>
                      <div className="text-xs text-muted-foreground">{e.when}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{e.what}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs">
                      {e.validated ? (
                        <>
                          <Check className="h-3 w-3 text-health-green" />
                          <span className="text-muted-foreground">Follow-through confirmed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-health-yellow" />
                          <span className="text-muted-foreground">Waiting gently</span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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

        <footer className="mt-16 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>
            Presence before messaging. · Support without shame. · Part of the Love Key HELP Network
          </span>
          <Link to="/" className="hover:text-foreground">
            ← Back to overview
          </Link>
        </footer>
      </main>
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
