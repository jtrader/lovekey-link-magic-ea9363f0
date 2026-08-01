import { useId, type ReactNode } from "react";

export type GlossaryEntry = { term: string; definition: string };

export const MACRO_GLOSSARY: Record<string, GlossaryEntry> = {
  veo: {
    term: "VEO — Vertical Equilibrium Optimisation",
    definition:
      "The branch of Equilibrium Theory that ranks advertisers by whether they can actually serve demand, instead of by who bids the most.",
  },
  ves: {
    term: "VES — Vertical Equilibrium Score",
    definition:
      "A live score combining relevance, consumer experience, workforce stress and financial velocity. A higher VES means a business has healthy spare capacity.",
  },
  telemetry: {
    term: "Tripartite telemetry",
    definition:
      "Three anonymised capacity signals — workforce stress, financial velocity and consumer serviceability — that feed the equilibrium engine. No personal tracking is involved.",
  },
  pooledIntent: {
    term: "Pooled intent",
    definition:
      "Search demand is grouped at the vertical level rather than tied to individuals, so matching happens without persistent per-person profiles.",
  },
  calibration: {
    term: "Calibration timeline",
    definition:
      "The mandatory 90-day onboarding sandbox: Month 1 equal exposure diagnostics, Month 2 UI/UX remediation, Month 3 telemetry sync — the engine only goes live on Day 91.",
  },
  equalExposure: {
    term: "Equal Exposure Sandbox",
    definition:
      "Month 1 of calibration. Every participant gets identical impressions so conversion friction can be measured on a level playing field.",
  },
  remediation: {
    term: "UI/UX Remediation",
    definition:
      "Month 2 of calibration. Businesses fix page speed, core web vitals and design flaws until they meet the vertical's mean conversion benchmark.",
  },
  telemetrySync: {
    term: "Telemetry Sync & Launch",
    definition:
      "Month 3 of calibration. Accounting and workforce baselines are established, then the Rotational Equilibrium Engine activates.",
  },
  rotational: {
    term: "Rotational Equilibrium Engine",
    definition:
      "The live ranking system that rotates exposure across a vertical pool so demand flows to whoever currently has capacity to serve it well.",
  },
  signalDecay: {
    term: "Signal decay",
    definition:
      "Raw telemetry is reduced to low-resolution state signals, burned on write, and dormant signals auto-delete after 90 days.",
  },
};

/**
 * Inline glossary term. Shows its definition on hover, focus and tap.
 */
export function Term({ id, children }: { id: keyof typeof MACRO_GLOSSARY; children?: ReactNode }) {
  const entry = MACRO_GLOSSARY[id];
  const tipId = useId();
  if (!entry) return <>{children}</>;

  return (
    <span className="group relative inline-block">
      <button
        type="button"
        aria-describedby={tipId}
        className="cursor-help border-b border-dotted border-amber-500/70 bg-transparent p-0 text-left font-[inherit] text-[inherit] leading-[inherit] text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        {children ?? entry.term}
      </button>
      <span
        role="tooltip"
        id={tipId}
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 max-w-[75vw] -translate-x-1/2 rounded-xl border border-slate-200 bg-[#FFFFFF] p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-slate-600 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="mb-1 block font-semibold text-slate-900">{entry.term}</span>
        {entry.definition}
      </span>
    </span>
  );
}

/** Full glossary card, for the bottom of a macro page. */
export function GlossaryPanel({ ids }: { ids: (keyof typeof MACRO_GLOSSARY)[] }) {
  return (
    <section className="my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-700">Glossary</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {ids.map((id) => (
          <div key={String(id)}>
            <dt className="text-sm font-semibold text-slate-900">{MACRO_GLOSSARY[id].term}</dt>
            <dd className="mt-1 text-xs leading-relaxed text-slate-600">
              {MACRO_GLOSSARY[id].definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
