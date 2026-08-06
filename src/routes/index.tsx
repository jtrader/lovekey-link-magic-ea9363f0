import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nucleus } from "@/components/Nucleus";
import { SiteHeader } from "@/components/SiteHeader";
import lovekeyMark from "@/assets/lovekey-mark.png";
import rspLogo from "@/assets/rsp-logo.png.asset.json";
import { trackEvent } from "@/lib/analytics";

import {
  Heart,
  Shield,
  Users,
  Clock,
  MapPin,
  Sparkles,
  MessageCircle,
  Phone,
  Calendar,
  Activity,
} from "lucide-react";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Love Key Link — Are my people okay?" },
      {
        name: "description",
        content:
          "Love Key Link is the warm public entry point for one profile, multiple hubs, gentle presence, and support without surveillance.",
      },
      { property: "og:title", content: "Love Key Link — Coordination, not surveillance" },
      {
        property: "og:description",
        content:
          "One profile. Multiple hubs. Contextual presence and help routing that respects consent, privacy, and real-world care.",
      },
    ],
  }),
});

const features = [
  {
    icon: MessageCircle,
    title: "Communication layer",
    body: "Messages, calls and meetups recognised as participation events — never ranked, never scored.",
  },
  {
    icon: Clock,
    title: "Delayed validation",
    body: "Reinforcement arrives only after follow-through. No spam loops, no synthetic engagement.",
  },
  {
    icon: Activity,
    title: "Node health",
    body: "An ambient nucleus reflects continuity and resilience using calm colour, not numbers.",
  },
  {
    icon: MapPin,
    title: "Categorical location",
    body: "Home, Work, In Transit — never raw GPS. Exact location is opt-in, temporary, revocable.",
  },
  {
    icon: Users,
    title: "Gentle presence states",
    body: "Availability, energy, location, willingness and circle — scoped to the people who need it.",
  },
  {
    icon: Shield,
    title: "Privacy by default",
    body: "No content inspection, no emotional inference, no public comparison between people.",
  },
];

const dimensions = [
  { label: "Time", value: "Available · Maybe · Busy · Unavailable" },
  { label: "Energy", value: "Green · Blue · Yellow (self-declared)" },
  { label: "Location", value: "Categorical context, never coordinates" },
  { label: "Willingness", value: "Open · Ask gently · Not now · Need help" },
  { label: "Circle", value: "Household · Care · Emergency · Extended · School" },
];

const helpNetwork = [
  {
    title: "First Aid Angel",
    tag: "PREPARE",
    body: "Quick first aid guidance and support",
    href: "https://firstaidangel.org/",
  },
  {
    title: "Crisis Compass",
    tag: "RESPOND",
    body: "Emergency guidance for active crises",
    href: "https://crisis-compass.org/",
  },
  {
    title: "Aid Angel",
    tag: "RECOVER",
    body: "Recovery support after disaster",
    href: "https://aidangel.app/",
  },
  {
    title: "Guardian Guide",
    tag: "HEAL",
    body: "Mental health and emotional support",
    href: "https://guardianguide.org/",
  },
  {
    title: "Love Key",
    tag: "COORDINATE",
    body: "Connect with the HELP Network",
    href: "https://lovekeyring.org/",
  },
  {
    title: "Love Key Ring",
    tag: "REACH",
    body: "A gentle way to reach help",
    href: "https://lovekey.com.au/?locale=AU#product-section",
  },
];

const states = [
  { c: "bg-health-green", t: "Healthy" },
  { c: "bg-health-blue", t: "Stable" },
  { c: "bg-health-yellow", t: "Reduced" },
  { c: "bg-health-orange", t: "Fragmenting" },
  { c: "bg-health-red", t: "Crisis" },
  { c: "bg-health-purple", t: "Recovering" },
];

const homepageHubMembers = [
  {
    name: "Ari",
    role: "Parent · Available",
    presence: "available" as const,
    mood: "healthy" as const,
    avatarUrl: "/avatar-presence/avatar-01.png",
  },
  {
    name: "Maya",
    role: "Partner · Available",
    presence: "available" as const,
    mood: "stable" as const,
    avatarUrl: "/avatar-presence/avatar-02.png",
  },
  {
    name: "Leo",
    role: "At school · Available",
    presence: "available" as const,
    mood: "stable" as const,
    avatarUrl: "/avatar-presence/avatar-03.png",
  },
  {
    name: "Sofia",
    role: "At home · Available",
    presence: "available" as const,
    mood: "healthy" as const,
    avatarUrl: "/avatar-presence/avatar-04.png",
  },
  {
    name: "Noah",
    role: "Quiet mode",
    presence: "quiet" as const,
    mood: "recovering" as const,
    avatarUrl: "/avatar-presence/avatar-05.png",
  },
];

const sectionLinks = [
  { id: "how", label: "How it works" },
  { id: "status", label: "Status model" },
  { id: "privacy", label: "Privacy" },
] as const;

function Index() {

  const [activeSection, setActiveSection] = useState<string>("");
  const [howProgress, setHowProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById("how");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setHowProgress(ratio);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const ids = ["how", "status", "privacy"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navLinkClass = (id: string) =>
    activeSection === id
      ? "relative font-semibold text-primary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary after:content-['']"
      : "relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:after:w-full after:content-['']";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Shared site navigation (same framework as /rsp) */}
      <SiteHeader />

      {/* Page section bar — in-page anchors for this landing page */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-primary transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${howProgress})` }}
        />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <nav
            aria-label="On this page"
            className="flex items-center gap-6 overflow-x-auto text-sm text-muted-foreground"
          >
            {sectionLinks.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={activeSection === s.id ? "true" : undefined}
                className={`shrink-0 ${navLinkClass(s.id)}`}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <a
            href="/login"
            className="hidden shrink-0 items-center rounded-full bg-gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-soft transition ease-calm hover:opacity-95 sm:inline-flex"
          >
            Sign in
          </a>
        </div>
      </div>


      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-up">
            <a
              href="/rsp"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              One profile · multiple hubs · support without shame
            </a>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Are my people okay?
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Connected, with privacy.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Love Key Link helps families, carers, recovery circles and trusted communities see
              gentle presence, coordinate everyday moments and request support without turning care
              into surveillance.
            </p>
            <div className="mt-6 max-w-lg rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                Human-first LoveKey entry point
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Start with one calm profile, create or join a hub, invite trusted people and choose
                what each circle can see. RSP stays underneath as invisible consent, permissions and
                support synchronisation infrastructure — the family experience stays warm, simple
                and human.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 ease-calm"
              >
                <Heart className="h-4 w-4" /> Create your first hub
              </a>
              <a
                href="#how"
                onClick={() => trackEvent("see_how_it_works_click", { location: "home_hero" })}
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary ease-calm"
              >
                See how it works
              </a>
              <a
                href="https://etherscan.io/token/0xA1755730C6F66dbe3de29e24F4Db9F448ef3FDD5"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("genesis_nft_click", { location: "home_hero" })}
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary ease-calm"
              >
                Genesis NFT →
              </a>
            </div>
          </div>

          <div className="relative">
            <Nucleus members={homepageHubMembers} status="healthy" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              The hub nucleus — real people, soft presence, never a leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-hero: RSP technical protocol */}
      <section className="border-b border-border/60 bg-surface-warm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <a
            href="/rsp#event-token"
            className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow ease-calm sm:p-12"
          >
            {/* Glowing logo backdrop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-[0.16] transition duration-700 group-hover:opacity-[0.28] sm:block"
              style={{
                backgroundImage: `url(${rspLogo.url})`,
                maskImage: "radial-gradient(circle at center, black 45%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 72%)",
              }}
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Technical and governance layer
                </span>
                <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
                  Respectful Synchronisation Protocol{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">docs</span>
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  Developer and partner documentation for consent, permissions, participation,
                  support routing and governance.
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition group-hover:border-primary group-hover:text-primary ease-calm">
                Explore the protocol
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Participation events */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Start emotionally, not technically
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            A simple path from profile to support.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The user should feel connected to the right people at the right time, with the right
            level of privacy — not like they are entering a protocol.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Create one profile",
              w: "A person-owned identity that can later bridge family, community, recovery and Help Network spaces.",
            },
            {
              icon: Heart,
              title: "Create or join a hub",
              w: "Family, personal, community and recovery hubs stay separate by default and connect only by consent.",
            },
            {
              icon: Phone,
              title: "Request support",
              w: "A calm support signal routes to trusted contacts before any wider Help Network connection.",
            },
          ].map(({ icon: Icon, title, w }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{w}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface-soft p-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Validation flow</p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-5">
            {[
              "Create profile",
              "Create hub",
              "Invite trusted people",
              "Share gentle presence",
              "Route support",
            ].map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-surface-warm py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Designed around care, not protocol language.
            </h2>
            <p className="mt-4 text-muted-foreground">
              LoveKey keeps public copy warm and simple while RSP quietly synchronises consent,
              roles, permissions and support signals underneath.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow ease-calm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status model */}
      <section id="status" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Gentle presence states
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Enough reassurance. Never too much exposure.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Availability, quiet time, all-good check-ins and needs-support signals give loved ones
              reassurance without raw surveillance or context collapse.
            </p>
          </div>
          <div className="space-y-3">
            {dimensions.map((d) => (
              <div
                key={d.label}
                className="flex items-start justify-between gap-6 rounded-xl border border-border bg-card p-4"
              >
                <span className="text-sm font-semibold">{d.label}</span>
                <span className="text-right text-sm text-muted-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health states */}
        <div className="mt-16 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="text-lg font-semibold">Family connection — ambient, not numerical</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Soft states help the home screen answer one question: are my people okay?
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {states.map((s) => (
              <div key={s.t} className="flex flex-col items-center gap-2">
                <span className={`h-10 w-10 rounded-full ${s.c} shadow-soft animate-breathe`} />
                <span className="text-xs font-medium text-muted-foreground">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="bg-surface-soft py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Shield className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Privacy by default, visibility by consent.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every hub must show what others can see. Every user can pause, reduce or revoke
            visibility. Recovery and Help Network flows stay calm, contextual and permission-aware.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            {[
              "Context separation by default",
              "Presence before messaging",
              "Support without shame",
              "Red only for recovery or crisis states",
            ].map((t) => (
              <div key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="early" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          My people are connected.
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            My privacy is respected.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Help can reach me when it matters. Join the early LoveKey Link flow: create profile,
          create hub, invite member, share presence and route support to a trusted contact.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none ring-ring focus:ring-2"
          />
          <button className="h-12 rounded-full bg-gradient-primary px-6 text-sm font-medium text-primary-foreground shadow-glow ease-calm hover:opacity-95">
            Join early access
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          We only contact you about{" "}
          <a href="/rsp" className="text-primary hover:underline">
            Respectful Synchronisation Protocol
          </a>
          . No tracking.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-8 py-10">
        <div className="mx-auto mb-12 max-w-4xl">
          <h2 className="text-center text-base font-semibold text-foreground">
            Love Key HELP Network
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {helpNetwork.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("help_network_tile_click", {
                    tile: tile.title,
                    tag: tile.tag,
                    location: "home_footer",
                  })
                }
                className="group rounded-2xl border border-border bg-secondary px-5 py-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-primary/55 hover:shadow-[0_0_0_1px_rgba(229,57,53,0.35),0_0_22px_2px_rgba(229,57,53,0.35)] ease-calm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-lg font-semibold text-foreground">{tile.title}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {tile.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tile.body}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center">
          <img
            src={lovekeyMark}
            alt="Love Key Link"
            className="object-contain"
            style={{ width: 96, height: 96 }}
          />
          <div className="max-w-[620px] text-sm text-muted-foreground">
            <strong className="text-foreground">Love Key Link / RSP</strong> · Respectful
            Synchronised Protocol v1.6 · Part of the{" "}
            <a
              href="https://lovekeyring.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Love Key HELP Network
            </a>{" "}
            · Copyright © {new Date().getFullYear()} Jack Oswald. All rights reserved unless
            otherwise licensed in writing.
          </div>
          <div className="max-w-[320px] text-xs text-muted-foreground/80">
            RSP NFTs are utility, provenance, access, participation, and certification tokens. Not
            investment products.
          </div>
        </div>
      </footer>
    </div>
  );
}
