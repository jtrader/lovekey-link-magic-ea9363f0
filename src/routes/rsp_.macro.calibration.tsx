import { definePage } from "@/lib/router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";
import {
  IconFlask,
  IconGauge,
  IconRotate,
  MacroIconBadge,
  type MacroTone,
} from "@/components/rsp-macro/MacroVisuals";
import { GlossaryPanel, Term } from "@/components/rsp-macro/MacroGlossary";

export const Route = definePage("/rsp_/macro/calibration")({
  head: () => ({
    meta: [
      { title: "The 3-Month Level-Up Sandbox — @rsp/macro · Love Key Link" },
      {
        name: "description",
        content:
          "A mandatory 90-day calibration phase: equal exposure diagnostics, UI/UX remediation, then telemetry sync before the equilibrium engine goes live.",
      },
      { property: "og:title", content: "The 3-Month Level-Up Sandbox — @rsp/macro" },
      {
        property: "og:description",
        content:
          "How 10-player vertical pools calibrate baselines over 90 days before rotational equilibrium activates.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/macro/calibration" },
      { property: "og:site_name", content: "Love Key Link" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/macro/calibration" }],
  }),
  component: CalibrationPage,
});

const months = [
  {
    tag: "Month 1",
    tone: "slate" as MacroTone,
    icon: <IconFlask />,
    tagClass: "bg-slate-200 text-slate-600",
    border: "border-slate-200",
    termId: "equalExposure" as const,
    title: "Equal Exposure Sandbox",
    desc: "All 10 participants receive equal traffic impressions. Diagnostic audit measures conversion friction & isolates UX weaknesses.",
  },
  {
    tag: "Month 2",
    tone: "amber" as MacroTone,
    icon: <IconGauge />,
    tagClass: "border border-amber-500/40 bg-amber-50 text-amber-700",
    border: "border-amber-500/30",
    termId: "remediation" as const,
    title: "UI/UX Remediation",
    desc: "Businesses fix technical bottlenecks, core web vitals, and design flaws to align with the vertical mean conversion benchmark.",
  },
  {
    tag: "Month 3",
    tone: "emerald" as MacroTone,
    icon: <IconRotate />,
    tagClass: "border border-emerald-500/40 bg-emerald-50 text-emerald-700",
    border: "border-emerald-500/30",
    termId: "telemetrySync" as const,
    title: "Telemetry Sync & Launch",
    desc: "Accounting API and workforce stress baselines calibrate. Live Rotational Equilibrium Engine activates on Day 91.",
  },
] as const;

function CalibrationPage() {
  return (
    <MacroShell>
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-amber-700">
        Section 04 / Calibration
      </div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
        The 3-Month Level-Up Sandbox
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-slate-600">
        Participating 10-player vertical pools undergo a mandatory{" "}
        <Term id="calibration">90-day calibration phase</Term> to level up landing page design and
        establish normative operational baselines before the{" "}
        <Term id="rotational">Rotational Equilibrium Engine</Term> goes live. Hover or tap any
        underlined term for a quick definition.
      </p>

      <div className="my-8 grid gap-6 md:grid-cols-3">
        {months.map((m, idx) => (
          <div key={m.tag} className={`relative rounded-2xl border bg-[#FFFFFF] p-6 ${m.border}`}>
            {idx < months.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-slate-600 md:-right-4 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
            <div className="mb-4">
              <MacroIconBadge tone={m.tone}>{m.icon}</MacroIconBadge>
            </div>
            <span
              className={`mb-4 inline-block rounded px-2.5 py-1 font-mono text-xs ${m.tagClass}`}
            >
              {m.tag}
            </span>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              <Term id={m.termId}>{m.title}</Term>
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">{m.desc}</p>
          </div>
        ))}
      </div>

      <GlossaryPanel
        ids={["calibration", "equalExposure", "remediation", "telemetrySync", "rotational", "ves"]}
      />
    </MacroShell>
  );
}
