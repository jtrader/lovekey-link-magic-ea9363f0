import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nucleus } from "@/components/Nucleus";
import lovekeyMark from "@/assets/lovekey-mark.png";
import rspLogo from "@/assets/rsp-logo.png.asset.json";
import {
  Heart, Shield, Users, Clock, MapPin, Sparkles, MessageCircle, Phone, Calendar, Activity, Menu, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Love Key Link — Respectful Synchronisation Protocol" },
      {
        name: "description",
        content:
          "Love Key Link is a calm, private coordination layer for families and small communities. Coordination, not surveillance.",
      },
      { property: "og:title", content: "Love Key Link — Coordination, not surveillance" },
      {
        property: "og:description",
        content:
          "Ambient node-health awareness, five-dimension status, and delayed validation — designed to strengthen real-world support.",
      },
    ],
  }),
});

const features = [
  { icon: MessageCircle, title: "Communication layer", body: "Messages, calls and meetups recognised as participation events — never ranked, never scored." },
  { icon: Clock, title: "Delayed validation", body: "Reinforcement arrives only after follow-through. No spam loops, no synthetic engagement." },
  { icon: Activity, title: "Node health", body: "An ambient nucleus reflects continuity and resilience using calm colour, not numbers." },
  { icon: MapPin, title: "Categorical location", body: "Home, Work, In Transit — never raw GPS. Exact location is opt-in, temporary, revocable." },
  { icon: Users, title: "Five-dimension status", body: "Availability, energy, location, willingness and circle — scoped to the people who need it." },
  { icon: Shield, title: "Privacy by default", body: "No content inspection, no emotional inference, no public comparison between people." },
];

const dimensions = [
  { label: "Time", value: "Available · Maybe · Busy · Unavailable" },
  { label: "Energy", value: "Green · Blue · Yellow (self-declared)" },
  { label: "Location", value: "Categorical context, never coordinates" },
  { label: "Willingness", value: "Open · Ask gently · Not now · Need help" },
  { label: "Circle", value: "Household · Care · Emergency · Extended · School" },
];

const helpNetwork = [
  { title: "First Aid Angel", tag: "PREPARE", body: "Quick first aid guidance and support", href: "https://firstaidangel.org/" },
  { title: "Crisis Compass", tag: "RESPOND", body: "Emergency guidance for active crises", href: "https://crisis-compass.org/" },
  { title: "Aid Angel", tag: "RECOVER", body: "Recovery support after disaster", href: "https://aidangel.app/" },
  { title: "Guardian Guide", tag: "HEAL", body: "Mental health and emotional support", href: "https://guardianguide.org/" },
  { title: "Love Key", tag: "COORDINATE", body: "Connect with the HELP Network", href: "https://lovekeyring.org/" },
  { title: "Love Key Ring", tag: "REACH", body: "A gentle way to reach help", href: "https://lovekey.com.au/?locale=AU#product-section" },
];

const states = [
  { c: "bg-health-green", t: "Healthy" },
  { c: "bg-health-blue", t: "Stable" },
  { c: "bg-health-yellow", t: "Reduced" },
  { c: "bg-health-orange", t: "Fragmenting" },
  { c: "bg-health-red", t: "Crisis" },
  { c: "bg-health-purple", t: "Recovering" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
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
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-primary transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${howProgress})` }}
        />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <img src={lovekeyMark} alt="Love Key" className="h-14 w-14" width={56} height={56} />
            <span className="font-semibold tracking-tight">
              Love Key <span className="text-primary">Link</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#how" aria-current={activeSection === "how" ? "true" : undefined} className={navLinkClass("how")}>How it works</a>
            <a href="#status" aria-current={activeSection === "status" ? "true" : undefined} className={navLinkClass("status")}>Status model</a>
            <a href="#privacy" aria-current={activeSection === "privacy" ? "true" : undefined} className={navLinkClass("privacy")}>Privacy</a>
            <a href="/rsp" className="hover:text-foreground">RSP</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden md:inline-flex items-center rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-95 ease-calm"
            >
              Sign in
            </a>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-border/60 bg-background/95 px-6 py-4 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground">
              <a href="#how" onClick={() => setMenuOpen(false)} className={navLinkClass("how")}>How it works</a>
              <a href="#status" onClick={() => setMenuOpen(false)} className={navLinkClass("status")}>Status model</a>
              <a href="#privacy" onClick={() => setMenuOpen(false)} className={navLinkClass("privacy")}>Privacy</a>
              <a href="/rsp" onClick={() => setMenuOpen(false)} className="hover:text-foreground">RSP</a>
              
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex w-fit items-center rounded-full bg-gradient-primary px-4 py-2 font-medium text-primary-foreground shadow-soft transition hover:opacity-95 ease-calm"
              >
                Sign in
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-up">
            <a href="/rsp" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Respectful Synchronisation Protocol Example
            </a>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Coordination,<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">not surveillance.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              <a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a> recognises real human coordination — messages of care, voice calls, and time spent together. Each contributes to the node, never to a public score.
            </p>
            <div className="mt-6 max-w-lg rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">Hypothetical RSP prototype</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Love Key Link is a hypothetical RSP prototype built to demonstrate real-world application. It's a
                privacy-first family coordination layer that helps loved ones know when and how to connect — using
                consent-based device, calendar, and location context to share simple availability signals. The result is
                stronger family unity, better timing, and clearer communication, without ever exposing private details.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#how" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 ease-calm">
                <Heart className="h-4 w-4" /> Get started
              </a>
              <a href="#how" onClick={() => trackEvent("see_how_it_works_click", { location: "home_hero" })} className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary ease-calm">
                See how it works
              </a>
              <a href="https://etherscan.io/token/0xA1755730C6F66dbe3de29e24F4Db9F448ef3FDD5" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("genesis_nft_click", { location: "home_hero" })} className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary ease-calm">
                Genesis NFT →
              </a>
            </div>
          </div>

          <div className="relative">
            <Nucleus />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              The node nucleus — ambient, breathing, never a leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-hero: RSP technical protocol */}
      <section className="border-b border-border/60 bg-surface-warm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <a
            href="/rsp"
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
                  Technical EVENT token protocol
                </span>
                <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
                  Reciprocal Status Protocol{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">(RSP EVENT)</span>
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  The cryptographic foundation behind meaningful contact — how status is earned,
                  validated, and kept private.
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition group-hover:border-primary group-hover:text-primary ease-calm">
                Explore the protocol
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </a>
        </div>
      </section>


      {/* Participation events */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Participation, not performance</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Three kinds of meaningful contact.</h2>
          <p className="mt-4 text-muted-foreground">
            The&nbsp;<a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a> recognises real human coordination — messages of care, voice calls,
            and time spent together. Each contributes to the node, never to a public score.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: MessageCircle, title: "Message", w: "Wellbeing & support touchpoints" },
            { icon: Phone, title: "Voice call", w: "Active, present conversation" },
            { icon: Calendar, title: "Meetup", w: "Real-world synchronisation" },
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
            {["Interaction", "Validation delay", "Continuity assessed", "Node health updated", "Reinforcement distributed"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">{i + 1}</span>
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
            <h2 className="text-3xl font-semibold sm:text-4xl">Designed to feel like care.</h2>
            <p className="mt-4 text-muted-foreground">
              Every choice in the&nbsp;<a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a> is shaped by one principle: protect the person, strengthen the node.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow ease-calm">
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
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Five-dimension status</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Enough context. Never too much.</h2>
            <p className="mt-4 text-muted-foreground">
              A small, honest signal tells the right people whether now is a good moment —
              without exposing what you're doing, where exactly you are, or how you feel.
            </p>
          </div>
          <div className="space-y-3">
            {dimensions.map((d) => (
              <div key={d.label} className="flex items-start justify-between gap-6 rounded-xl border border-border bg-card p-4">
                <span className="text-sm font-semibold">{d.label}</span>
                <span className="text-right text-sm text-muted-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health states */}
        <div className="mt-16 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="text-lg font-semibold">Node health — ambient, not numerical</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Rolling weekly averages reduce volatility and prevent performance pressure.
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
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Private by architecture.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            No raw GPS. No message content. No emotional inference. No social scores.
            &nbsp;<a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a> interprets context on-device and shares only what coordination requires.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            {[
              "Categorical location only — default geofence ~1km",
              "Willingness is always manual, never inferred",
              "Statuses expire automatically",
              "Reinforcement is mostly invisible by design",
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
          The first node is a family.<br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">Yours could be next.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          <a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a>&nbsp;is in private development. Join RSP to help shape a calmer way
          to stay in sync with the people who matter.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none ring-ring focus:ring-2"
          />
          <button className="h-12 rounded-full bg-gradient-primary px-6 text-sm font-medium text-primary-foreground shadow-glow ease-calm hover:opacity-95">
            Request access
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">We only contact you about <a href="/rsp" className="text-primary hover:underline">Respectful Synchronisation Protocol</a>. No tracking.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-8 py-10">
        <div className="mx-auto mb-12 max-w-4xl">
          <h2 className="text-center text-base font-semibold text-foreground">Love Key HELP Network</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {helpNetwork.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-card px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow ease-calm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-lg font-semibold text-foreground">{tile.title}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{tile.tag}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tile.body}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center">
          <img src={lovekeyMark} alt="Love Key Link" className="object-contain" style={{ width: 96, height: 96 }} />
          <div className="max-w-[620px] text-sm text-muted-foreground">
            <strong className="text-foreground">Love Key Link / RSP</strong> · Respectful Synchronised Protocol v1.6 ·
            Part of the <a href="https://lovekeyring.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Love Key HELP Network</a> ·
            Copyright © {new Date().getFullYear()} Jack Oswald. All rights reserved unless otherwise licensed in writing.
          </div>
          <div className="max-w-[320px] text-xs text-muted-foreground/80">
            RSP NFTs are utility, provenance, access, participation, and certification tokens.
            Not investment products.
          </div>
        </div>
      </footer>
    </div>
  );
}
