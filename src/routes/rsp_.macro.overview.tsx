import { createFileRoute, Link } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";
import {
  IconChart,
  IconClose,
  IconGauge,
  IconPulse,
  IconRotate,
  IconScales,
  IconShieldCheck,
  IconSigma,
  IconUsers,
  MacroBullet,
  MacroFlow,
  MacroIconBadge,
  type MacroTone,
} from "@/components/rsp-macro/MacroVisuals";

const flowSteps = [
  {
    tone: "emerald" as MacroTone,
    icon: <IconUsers />,
    label: "Pooled intent",
    desc: "Anonymous demand aggregated per vertical; raw identifiers burned on write.",
  },
  {
    tone: "amber" as MacroTone,
    icon: <IconPulse />,
    label: "Capacity telemetry",
    desc: "Workforce stress, financial velocity and consumer experience sampled.",
  },
  {
    tone: "cyan" as MacroTone,
    icon: <IconSigma />,
    label: "VES scoring",
    desc: "f(Relevance) × (CX / S) × (VT / VA) resolves a live equilibrium score.",
  },
  {
    tone: "purple" as MacroTone,
    icon: <IconRotate />,
    label: "Rotational exposure",
    desc: "Prominence rotates toward operators with real headroom to serve.",
  },
] as const;

export const Route = createFileRoute("/rsp_/macro/overview")({
  head: () => ({
    meta: [
      { title: "@rsp/macro — Macro-Economic Vertical Equilibrium · Love Key Link" },
      {
        name: "description",
        content:
          "@rsp/macro turns search and ad auctions from extraction engines into capacity-aware equilibrium ecosystems — pooled intent, no persistent tracking, rotational exposure.",
      },
      { property: "og:title", content: "@rsp/macro — Macro-Economic Vertical Equilibrium" },
      {
        property: "og:description",
        content:
          "An open specification for capacity-aware ad ranking: workforce, financial and consumer telemetry balanced into a Vertical Equilibrium Score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/macro/overview" },
      { property: "og:site_name", content: "Love Key Link" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/macro/overview" }],
  }),
  component: MacroOverview,
});

const cards = [
  {
    to: "/rsp/macro/telemetry",
    section: "SECTION 02",
    accent: "text-emerald-700",
    tone: "emerald" as MacroTone,
    icon: <IconPulse />,
    title: "Telemetry",
    desc: "Tripartite metrics: Workforce, Financial, Consumer CX.",
  },
  {
    to: "/rsp/macro/ves-formula",
    section: "SECTION 03",
    accent: "text-cyan-700",
    tone: "cyan" as MacroTone,
    icon: <IconSigma />,
    title: "VES Formula",
    desc: "Vertical Equilibrium Score & Ad Rank Math.",
  },
  {
    to: "/rsp/macro/calibration",
    section: "SECTION 04",
    accent: "text-amber-700",
    tone: "amber" as MacroTone,
    icon: <IconGauge />,
    title: "Calibration",
    desc: "3-Month Sandbox & Equal Exposure leveling.",
  },
  {
    to: "/rsp/macro/governance",
    section: "SECTION 05",
    accent: "text-purple-700",
    tone: "purple" as MacroTone,
    icon: <IconShieldCheck />,
    title: "Governance",
    desc: "k-Anonymity, Zero-Knowledge & Burn rules.",
  },
] as const;

function MacroOverview() {
  return (
    <MacroShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 font-mono text-xs text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        @rsp/macro v1.0 Open Specification
      </div>

      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Macro-Economic Vertical Equilibrium
      </h1>
      <p className="mb-10 text-xl font-light leading-relaxed text-slate-600">
        Transitioning search engines and ad auctions from winner-take-all monetization extraction
        engines into dynamic, capacity-aware economic balance ecosystems.
      </p>

      <div className="my-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-[#FFFFFF] p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <MacroIconBadge tone="red">
              <IconChart />
            </MacroIconBadge>
            <div className="font-mono text-xs uppercase tracking-wider text-red-700">
              The Legacy Model
            </div>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">Monopolistic Extraction</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <MacroBullet tone="red" icon={<IconClose />}>
              Permanent user profiling & predatory retargeting.
            </MacroBullet>
            <MacroBullet tone="red" icon={<IconClose />}>
              Top 1–3 players capture 80% of volume regardless of capacity.
            </MacroBullet>
            <MacroBullet tone="red" icon={<IconClose />}>
              Overworked staff, customer bottlenecks, and wasted ad spend.
            </MacroBullet>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-[#FFFFFF] p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <MacroIconBadge tone="emerald">
              <IconScales />
            </MacroIconBadge>
            <div className="font-mono text-xs uppercase tracking-wider text-emerald-700">
              The @rsp/macro Model
            </div>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">Synchronised Equilibrium</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <MacroBullet tone="emerald">
              Pooled intent with zero persistent tracking; raw events burned on write.
            </MacroBullet>
            <MacroBullet tone="emerald">
              Rotational exposure based on real-time operational capacity.
            </MacroBullet>
            <MacroBullet tone="emerald">
              Industry equilibrium protecting workforce health & capital efficiency.
            </MacroBullet>
          </ul>
        </div>
      </div>

      <section className="my-12">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-600">
          Signal flow
        </div>
        <MacroFlow steps={flowSteps} />
      </section>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-xl border border-slate-200 bg-[#FFFFFF] p-5 transition-all hover:border-emerald-500/50"
          >
            <span className="mb-3 block">
              <MacroIconBadge tone={c.tone} size="sm">
                {c.icon}
              </MacroIconBadge>
            </span>
            <span className={`mb-1 block font-mono text-xs ${c.accent}`}>{c.section}</span>
            <h3 className="mb-1 font-semibold text-slate-900">{c.title}</h3>
            <p className="text-xs text-slate-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </MacroShell>
  );
}
