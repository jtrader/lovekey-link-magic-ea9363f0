import { createFileRoute } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";

export const Route = createFileRoute("/rsp_/macro/calibration")({
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
    tagClass: "bg-slate-800 text-slate-300",
    border: "border-slate-800",
    title: "Equal Exposure Sandbox",
    desc: "All 10 participants receive equal traffic impressions. Diagnostic audit measures conversion friction & isolates UX weaknesses.",
  },
  {
    tag: "Month 2",
    tagClass: "border border-amber-500/40 bg-amber-950/80 text-amber-300",
    border: "border-amber-500/30",
    title: "UI/UX Remediation",
    desc: "Businesses fix technical bottlenecks, core web vitals, and design flaws to align with the vertical mean conversion benchmark.",
  },
  {
    tag: "Month 3",
    tagClass: "border border-emerald-500/40 bg-emerald-950/80 text-emerald-300",
    border: "border-emerald-500/30",
    title: "Telemetry Sync & Launch",
    desc: "Accounting API and workforce stress baselines calibrate. Live Rotational Equilibrium Engine activates on Day 91.",
  },
] as const;

function CalibrationPage() {
  return (
    <MacroShell>
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-amber-400">
        Section 04 / Calibration
      </div>
      <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">
        The 3-Month Level-Up Sandbox
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-slate-400">
        Participating 10-player vertical pools undergo a mandatory 90-day calibration phase to level
        up landing page design and establish normative operational baselines.
      </p>

      <div className="my-8 grid gap-6 md:grid-cols-3">
        {months.map((m) => (
          <div key={m.tag} className={`rounded-2xl border bg-[#161B26] p-6 ${m.border}`}>
            <span
              className={`mb-4 inline-block rounded px-2.5 py-1 font-mono text-xs ${m.tagClass}`}
            >
              {m.tag}
            </span>
            <h2 className="mb-2 text-lg font-semibold text-white">{m.title}</h2>
            <p className="text-xs leading-relaxed text-slate-400">{m.desc}</p>
          </div>
        ))}
      </div>
    </MacroShell>
  );
}
