import { createFileRoute } from "@tanstack/react-router";
import { PulseSummary } from "@/components/rsp/PulseSummary";

export const Route = createFileRoute("/rsp/pulse/summary")({
  head: () => ({
    meta: [
      { title: "Inside the RSP Pulse Server — summary · Love Key Link" },
      {
        name: "description",
        content:
          "A plain-language summary of the RSP Pulse Server: the Event Strain Index engine, its place in the protocol, burn-on-write edge escrow at N ≥ 50, its 15-minute window, and the humanitarian purpose behind it.",
      },
      { property: "og:title", content: "Inside the RSP Pulse Server" },
      {
        property: "og:description",
        content:
          "Strain sensing without surveillance — how the RSP Pulse Server measures regional capacity while destroying identity at the edge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulseSummaryPage,
});

function PulseSummaryPage() {
  return (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div
          className="rsp-eyebrow"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <span className="rsp-hero-eyebrow-dot" /> RSP Pulse Server · summary
        </div>
        <h1 className="rsp-h2">Inside the RSP Pulse Server</h1>
        <p className="rsp-lead">
          What the server senses, where it sits in the protocol, how it forgets people by design,
          and why any of it matters when a region comes under strain.
        </p>
      </div>

      <PulseSummary />
    </section>
  );
}
