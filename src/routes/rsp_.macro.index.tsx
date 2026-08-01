import { createFileRoute, Link } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";

export const Route = createFileRoute("/rsp_/macro/")({
  head: () => ({
    meta: [
      { title: "@rsp/macro — Section index & quick links · Love Key Link" },
      {
        name: "description",
        content:
          "Index of the @rsp/macro open specification: overview, tripartite telemetry, the VES formula, the 90-day calibration sandbox, and privacy governance.",
      },
      { property: "og:title", content: "@rsp/macro — Section index" },
      {
        property: "og:description",
        content:
          "Jump into any of the five @rsp/macro sections: overview, telemetry, VES formula, calibration and governance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/macro" },
      { property: "og:site_name", content: "Love Key Link" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/macro" }],
  }),
  component: MacroIndex,
});

const sections = [
  {
    to: "/rsp/macro/overview",
    num: "01",
    accent: "text-emerald-400",
    hover: "hover:border-emerald-500/50",
    title: "Overview",
    desc: "Why winner-take-all auctions break verticals, and what synchronised equilibrium replaces them with.",
    points: ["Legacy extraction vs. equilibrium", "Pooled intent, zero tracking", "Rotational exposure"],
  },
  {
    to: "/rsp/macro/telemetry",
    num: "02",
    accent: "text-amber-400",
    hover: "hover:border-amber-500/50",
    title: "Telemetry",
    desc: "The three anonymized operational signals that determine real-time serviceability.",
    points: ["Workforce Capacity Index (S)", "Financial Velocity (VA / VT)", "Consumer Experience (CX)"],
  },
  {
    to: "/rsp/macro/ves-formula",
    num: "03",
    accent: "text-cyan-400",
    hover: "hover:border-cyan-500/50",
    title: "VES Formula",
    desc: "The mathematical specification for capacity-aware ad rank and prominence.",
    points: ["VES = f(Relevance) × (CX / S) × (VT / VA)", "Equilibrium Ad Rank", "Variable reference table"],
  },
  {
    to: "/rsp/macro/calibration",
    num: "04",
    accent: "text-amber-300",
    hover: "hover:border-amber-400/50",
    title: "Calibration",
    desc: "The mandatory 90-day level-up sandbox before the equilibrium engine goes live.",
    points: ["Month 1 — equal exposure", "Month 2 — UI/UX remediation", "Month 3 — telemetry sync"],
  },
  {
    to: "/rsp/macro/governance",
    num: "05",
    accent: "text-purple-400",
    hover: "hover:border-purple-500/50",
    title: "Governance",
    desc: "The safeguards that keep capacity-aware ranking from becoming surveillance.",
    points: ["No employer or competitor visibility", "k-anonymity thresholds", "Burn on write, 90-day decay"],
  },
] as const;

function MacroIndex() {
  return (
    <MacroShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 font-mono text-xs text-emerald-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        @rsp/macro v1.0 Open Specification
      </div>

      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
        @rsp/macro — Section index
      </h1>
      <p className="mb-10 max-w-3xl text-xl font-light leading-relaxed text-slate-400">
        Five sections describe how search and ad auctions become capacity-aware equilibrium
        ecosystems. Start at the overview, or jump straight to the part you need.
      </p>

      <ol className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <li key={s.to}>
            <Link
              to={s.to}
              className={`flex h-full flex-col rounded-2xl border border-slate-800 bg-[#161B26] p-6 transition-all ${s.hover}`}
            >
              <div className="mb-2 flex items-baseline gap-3">
                <span className={`font-mono text-xs tracking-widest ${s.accent}`}>
                  SECTION {s.num}
                </span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">{s.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              <ul className="mt-auto space-y-1.5 font-mono text-xs text-slate-500">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className={s.accent}>•</span>
                    {p}
                  </li>
                ))}
              </ul>
              <span className={`mt-5 font-mono text-xs ${s.accent}`}>Read section →</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-8">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
          Quick links
        </span>
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="rounded-lg border border-slate-800 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200"
          >
            {s.num}. {s.title}
          </Link>
        ))}
        <Link
          to="/rsp"
          className="rounded-lg border border-slate-800 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200"
        >
          ← Back to RSP
        </Link>
      </div>
    </MacroShell>
  );
}
