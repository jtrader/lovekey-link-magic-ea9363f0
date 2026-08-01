import { definePage } from "@/lib/router";
import { GlossaryPanel, Term } from "@/components/rsp-macro/MacroGlossary";
import { MacroShell } from "@/components/rsp-macro/MacroNav";
import { IconSigma, MacroIconBadge } from "@/components/rsp-macro/MacroVisuals";

export const Route = definePage("/rsp_/macro/ves-formula")({
  head: () => ({
    meta: [
      { title: "Vertical Equilibrium Score (VES) — @rsp/macro · Love Key Link" },
      {
        name: "description",
        content:
          "The VES formula: relevance scaled by consumer experience over workforce stress and target over actual financial velocity, applied to equilibrium ad rank.",
      },
      { property: "og:title", content: "Vertical Equilibrium Score (VES) — @rsp/macro" },
      {
        property: "og:description",
        content:
          "Mathematical specification for capacity-aware ad ranking, with each variable's telemetry source and algorithmic impact.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/macro/ves-formula" },
      { property: "og:site_name", content: "Love Key Link" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/macro/ves-formula" }],
  }),
  component: VESFormulaPage,
});

const rows = [
  {
    v: "CX",
    vClass: "text-emerald-700",
    dim: "Consumer Experience Index",
    src: "Call queue metadata & 1-tap resolution surveys",
    impact: "Lifts VES (High Quality)",
    impactClass: "text-emerald-700",
  },
  {
    v: "S",
    vClass: "text-amber-700",
    dim: "Workforce Capacity Index",
    src: "Anonymized shift hours, leave spikes, stress",
    impact: "Lowers VES (Throttles Stress)",
    impactClass: "text-amber-700",
  },
  {
    v: "VT / VA",
    vClass: "text-cyan-700",
    dim: "Target / Actual Financial Velocity",
    src: "Zero-knowledge accounting software API",
    impact: "Rotates Share when Target Met",
    impactClass: "text-cyan-700",
  },
] as const;

function VESFormulaPage() {
  return (
    <MacroShell>
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-cyan-700">
        Section 03 / Mathematical Specification
      </div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
        <Term id="ves">Vertical Equilibrium Score (VES)</Term>
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-slate-600">
        VES is the maths behind <Term id="veo">VEO</Term>: it converts{" "}
        <Term id="telemetry">tripartite telemetry</Term> into a live ranking signal. Underlined
        terms show a definition on hover or tap.
      </p>

      <div className="my-8 rounded-2xl border border-cyan-500/30 bg-[#FFFFFF] p-8 text-center shadow-2xl">
        <div className="mb-3 flex items-center justify-center">
          <MacroIconBadge tone="cyan">
            <IconSigma />
          </MacroIconBadge>
        </div>
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-cyan-700">
          Algorithmic Ad Rank & Prominence Formula
        </div>
        <div className="my-4 rounded-xl border border-slate-200 bg-[#F5F7FB] py-4 font-mono text-2xl text-slate-900 md:text-3xl">
          VES = f(Relevance) × ( CX / S ) × ( VT / VA )
        </div>
        <div className="font-mono text-xs text-slate-600">
          Equilibrium Ad Rank = (Bid Amount × Quality Score) × VES
        </div>
      </div>

      <div className="my-10 overflow-x-auto">
        <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200 bg-[#FFFFFF] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-[#F5F7FB] font-mono text-xs uppercase text-slate-600">
              <th className="px-4 py-4">Variable</th>
              <th className="px-4 py-4">Dimension</th>
              <th className="px-4 py-4">Source Telemetry</th>
              <th className="px-4 py-4">Algorithm Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {rows.map((r) => (
              <tr key={r.v}>
                <td className={`px-4 py-4 font-mono font-bold ${r.vClass}`}>{r.v}</td>
                <td className="px-4 py-4 text-slate-700">{r.dim}</td>
                <td className="px-4 py-4 text-xs text-slate-600">{r.src}</td>
                <td className={`px-4 py-4 text-xs ${r.impactClass}`}>{r.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GlossaryPanel ids={["veo", "ves", "telemetry", "rotational"]} />
    </MacroShell>
  );
}
