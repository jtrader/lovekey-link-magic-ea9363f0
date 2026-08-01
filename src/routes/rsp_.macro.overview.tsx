import { createFileRoute, Link } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";

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
    ],
  }),
  component: MacroOverview,
});

const cards = [
  {
    to: "/rsp/macro/telemetry",
    section: "SECTION 02",
    accent: "text-emerald-400",
    title: "Telemetry",
    desc: "Tripartite metrics: Workforce, Financial, Consumer CX.",
  },
  {
    to: "/rsp/macro/ves-formula",
    section: "SECTION 03",
    accent: "text-cyan-400",
    title: "VES Formula",
    desc: "Vertical Equilibrium Score & Ad Rank Math.",
  },
  {
    to: "/rsp/macro/calibration",
    section: "SECTION 04",
    accent: "text-amber-400",
    title: "Calibration",
    desc: "3-Month Sandbox & Equal Exposure leveling.",
  },
  {
    to: "/rsp/macro/governance",
    section: "SECTION 05",
    accent: "text-purple-400",
    title: "Governance",
    desc: "k-Anonymity, Zero-Knowledge & Burn rules.",
  },
] as const;

function MacroOverview() {
  return (
    <MacroShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 font-mono text-xs text-emerald-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        @rsp/macro v1.0 Open Specification
      </div>

      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
        Macro-Economic Vertical Equilibrium
      </h1>
      <p className="mb-10 text-xl font-light leading-relaxed text-slate-400">
        Transitioning search engines and ad auctions from winner-take-all monetization extraction
        engines into dynamic, capacity-aware economic balance ecosystems.
      </p>

      <div className="my-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-[#161B26] p-6 shadow-lg">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-red-400">
            The Legacy Model
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">Monopolistic Extraction</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-400">•</span> Permanent user profiling &
              predatory retargeting.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-400">•</span> Top 1–3 players capture 80% of
              volume regardless of capacity.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-400">•</span> Overworked staff, customer
              bottlenecks, and wasted ad spend.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-[#161B26] p-6 shadow-lg">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
            The @rsp/macro Model
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">Synchronised Equilibrium</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">•</span> Pooled intent with zero
              persistent tracking; raw events burned on write.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">•</span> Rotational exposure based on
              real-time operational capacity.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">•</span> Industry equilibrium protecting
              workforce health & capital efficiency.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-xl border border-slate-800 bg-[#161B26] p-5 transition-all hover:border-emerald-500/50"
          >
            <span className={`mb-1 block font-mono text-xs ${c.accent}`}>{c.section}</span>
            <h3 className="mb-1 font-semibold text-white">{c.title}</h3>
            <p className="text-xs text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>
    </MacroShell>
  );
}
