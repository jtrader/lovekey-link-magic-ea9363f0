import { createFileRoute } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";

export const Route = createFileRoute("/rsp_/macro/telemetry")({
  head: () => ({
    meta: [
      { title: "Tripartite Operational Telemetry — @rsp/macro · Love Key Link" },
      {
        name: "description",
        content:
          "Three privacy-safe signals feed @rsp/macro: Workforce Capacity Index, Financial Velocity Ratio, and Consumer Experience Index.",
      },
      { property: "og:title", content: "Tripartite Operational Telemetry — @rsp/macro" },
      {
        property: "og:description",
        content:
          "Workforce stress, financial velocity and consumer serviceability — anonymized telemetry that determines real-time business capacity.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TelemetryPage,
});

function TelemetryPage() {
  return (
    <MacroShell>
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
        Section 02 / Telemetry
      </div>
      <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">
        Tripartite Operational Telemetry
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-slate-400">
        Instead of assuming infinite capacity, @rsp/macro ingests three privacy-safe, anonymized
        operational metrics to determine real-time business serviceability.
      </p>

      <div className="space-y-6">
        <section className="rounded-2xl border border-amber-500/30 bg-[#161B26] p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-amber-300">
              1. Workforce Capacity Index (S)
            </h2>
            <span className="rounded border border-amber-500/40 bg-amber-950/80 px-2.5 py-1 font-mono text-xs text-amber-300">
              Internal Stress
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-300">
            Measures human stress load via localized, differential privacy signals.
          </p>
          <ul className="grid gap-3 font-mono text-xs text-slate-400 sm:grid-cols-3">
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • Work Hour Variance
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • Leave Spike Anomaly
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • Shift Friction Rate
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-cyan-500/30 bg-[#161B26] p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-cyan-300">
              2. Financial Velocity Ratio (VA / VT)
            </h2>
            <span className="rounded border border-cyan-500/40 bg-cyan-950/80 px-2.5 py-1 font-mono text-xs text-cyan-300">
              Accounting API
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-300">
            Ingested via anonymized, zero-knowledge accounting APIs (Xero, QuickBooks, MYOB).
          </p>
          <ul className="grid gap-3 font-mono text-xs text-slate-400 sm:grid-cols-2">
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • VA: Actual Rolling 90-Day Revenue Velocity
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • VT: Target Baseline Growth & Survival Pace
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-[#161B26] p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-emerald-300">
              3. Consumer Experience Index (CX)
            </h2>
            <span className="rounded border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 font-mono text-xs text-emerald-300">
              Serviceability
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-300">
            Evaluates real-world serviceability and friction using neutral, vertical-congruent
            metrics.
          </p>
          <ul className="grid gap-3 font-mono text-xs text-slate-400 sm:grid-cols-3">
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • Call Queue Metadata
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • 1-Tap Micro-Surveys
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
              • Job Resolution Speed
            </li>
          </ul>
        </section>
      </div>
    </MacroShell>
  );
}
