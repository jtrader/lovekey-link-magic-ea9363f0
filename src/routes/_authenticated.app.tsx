import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Nucleus } from "@/components/Nucleus";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Activity, Battery, MapPin, HandHeart, Users, MessageCircle, Phone, Calendar,
  Check, Clock, Sparkles, Bell, Settings, ChevronRight, Home, Briefcase, Car, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppView,
  head: () => ({
    meta: [
      { title: "Your Link — Love Key Link" },
      { name: "description", content: "A calm, private coordination layer for your circle. Status, participation, and node health at a glance." },
      { property: "og:title", content: "Your Link — Love Key Link" },
      { property: "og:description", content: "Coordination, not surveillance. View your node, set your five-dimension status, and tend your circle." },
    ],
  }),
});

type Time = "Available" | "Maybe" | "Busy" | "Unavailable";
type Energy = "Green" | "Blue" | "Yellow";
type Loc = "Home" | "Work" | "In Transit";
type Will = "Open" | "Ask gently" | "Not now" | "Need help";

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
  { Icon: Calendar, who: "Sam", what: "Coffee scheduled — Sat 10am", when: "Yesterday", validated: false },
  { Icon: HandHeart, who: "Mum", what: "Offered help with groceries", when: "2 days ago", validated: true },
];

const reminders = [
  { text: "Nan hasn't appeared in 6 days — a short message could help.", soft: true },
  { text: "School pickup window starts in 25 minutes.", soft: false },
];

function AppView() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<Time>("Available");
  const [energy, setEnergy] = useState<Energy>("Blue");
  const [loc, setLoc] = useState<Loc>("Home");
  const [will, setWill] = useState<Will>("Open");

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
      const family = (members?.[0] as any)?.families ?? null;
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
    if (energy === "Yellow" || time === "Unavailable") return { t: "Reduced", c: "bg-health-yellow" };
    if (will === "Need help") return { t: "Crisis", c: "bg-health-red" };
    if (energy === "Green" && time === "Available") return { t: "Healthy", c: "bg-health-green" };
    return { t: "Stable", c: "bg-health-blue" };
  }, [time, energy, will]);

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
            <img src={lovekeyMark} alt="Love Key" className="h-7 w-7" width={28} height={28} />
            <span className="font-semibold tracking-tight">
              Love Key <span className="text-primary">Link</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#status" className="hover:text-foreground">Status</a>
            <a href="#circles" className="hover:text-foreground">Circles</a>
            <a href="#events" className="hover:text-foreground">Participation</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">{ctx.family.name}</span>
            <button aria-label="Notifications" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <button aria-label="Settings" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>
            <button
              aria-label="Sign out"
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
            {ctx.profile.avatar_url ? (
              <img src={ctx.profile.avatar_url} alt={ctx.profile.full_name} className="ml-1 h-8 w-8 rounded-full object-cover ring-1 ring-border" />
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
              Your link is calm. Five people in your circle have appeared today. Nothing requires you right now.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm shadow-soft ring-1 ring-border`}>
                <span className={`h-2 w-2 rounded-full ${healthLabel.c}`} />
                Node: {healthLabel.t}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-soft ring-1 ring-border">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                3 validated events today
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center rounded-3xl bg-gradient-hero p-8 shadow-soft ring-1 ring-border">
            <Nucleus />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              Continuity over the last 7 days
            </div>
          </div>
        </section>

        {/* Status setter */}
        <section id="status" className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Your five-dimension status</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visible only to the circles you choose. Never ranked. Never scored.
              </p>
            </div>
            <span className="hidden text-xs text-muted-foreground md:inline">Last updated just now</span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DimensionCard Icon={Clock} label="Time">
              <div className="flex flex-wrap gap-2">
                {timeOpts.map((t) => (
                  <Chip key={t} active={time === t} onClick={() => setTime(t)}>{t}</Chip>
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
              <p className="mt-3 text-xs text-muted-foreground">No coordinates. No tracking. Exact location is opt-in and temporary.</p>
            </DimensionCard>

            <DimensionCard Icon={HandHeart} label="Willingness">
              <div className="flex flex-wrap gap-2">
                {willOpts.map((w) => (
                  <Chip key={w} active={will === w} onClick={() => setWill(w)}>{w}</Chip>
                ))}
              </div>
            </DimensionCard>
          </div>
        </section>

        {/* Circles + events */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div id="circles">
            <h2 className="text-xl font-semibold tracking-tight">Your circles</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ambient health, not individual scoring.</p>
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
                      <div className="text-xs text-muted-foreground">{c.count} people · {c.note}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div id="events">
            <h2 className="text-xl font-semibold tracking-tight">Recent participation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real interactions only. Reinforcement is delayed and earned.</p>
            <ul className="mt-5 space-y-3">
              {events.map((e, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
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
                          <span className="text-muted-foreground">Validated by follow-through</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-health-yellow" />
                          <span className="text-muted-foreground">Awaiting follow-through</span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Gentle reminders */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Quiet nudges</h2>
          <p className="mt-1 text-sm text-muted-foreground">Soft prompts, never alarms. You decide what to act on.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {reminders.map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ${
                  r.soft
                    ? "bg-surface-warm ring-border"
                    : "bg-primary/5 ring-primary/20"
                }`}
              >
                <Activity className={`mt-0.5 h-4 w-4 ${r.soft ? "text-muted-foreground" : "text-primary"}`} />
                <div className="flex-1 text-sm">{r.text}</div>
                <button className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>Coordination, not surveillance.</span>
          <Link to="/" className="hover:text-foreground">← Back to overview</Link>
        </footer>
      </main>
    </div>
  );
}

function DimensionCard({
  Icon, label, children,
}: { Icon: typeof Clock; label: string; children: React.ReactNode }) {
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
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
