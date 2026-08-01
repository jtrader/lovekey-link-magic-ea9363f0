import { createFileRoute } from "@tanstack/react-router";
import { MacroShell } from "@/components/rsp-macro/MacroNav";

export const Route = createFileRoute("/rsp_/macro/governance")({
  head: () => ({
    meta: [
      { title: "Privacy & RSP Safeguards — @rsp/macro · Love Key Link" },
      {
        name: "description",
        content:
          "Governance for @rsp/macro: no employer or competitor surveillance, k-anonymity minimum cell sizes, and raw data burning with 90-day signal decay.",
      },
      { property: "og:title", content: "Privacy & RSP Safeguards — @rsp/macro" },
      {
        property: "og:description",
        content:
          "The safeguards that keep capacity-aware ranking from becoming surveillance: k-anonymity, zero-knowledge ingestion and burn-on-write.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/macro/governance" },
      { property: "og:site_name", content: "Love Key Link" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/macro/governance" }],
  }),
  component: GovernancePage,
});

const items = [
  {
    title: "1. Zero Employer / Competitor Surveillance",
    desc: "Employers cannot view individual employee GPS traces or device habits. Competitors receive zero visibility into financial figures or operational metrics of rival businesses.",
  },
  {
    title: "2. k-Anonymity & Minimum Cell Sizes",
    desc: "Workforce and customer signals are only generated if team sizes meet minimum thresholds (≥ 5 workers), preventing the isolation of individual workers or clients.",
  },
  {
    title: "3. Raw Data Burning & 90-Day Decay",
    desc: "Raw telemetry is reduced to low-resolution state signals and burned on write. In accordance with the RSP Signal Decay Proposal, dormant signals decay and delete automatically after 90 days.",
  },
] as const;

function GovernancePage() {
  return (
    <MacroShell>
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-purple-700">
        Section 05 / Governance
      </div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">Privacy & RSP Safeguards</h1>

      <div className="my-8 space-y-4">
        {items.map((i) => (
          <section key={i.title} className="rounded-2xl border border-slate-200 bg-[#FFFFFF] p-6">
            <h2 className="mb-2 text-lg font-semibold text-purple-700">{i.title}</h2>
            <p className="text-xs leading-relaxed text-slate-500">{i.desc}</p>
          </section>
        ))}
      </div>
    </MacroShell>
  );
}
