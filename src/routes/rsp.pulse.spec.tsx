import { createFileRoute } from "@tanstack/react-router";
import { IconEye, IconFlame, IconShield, IconSync } from "@/components/rsp-shared";

export const Route = createFileRoute("/rsp/pulse/spec")({
  head: () => ({
    meta: [
      { title: "@rsp/pulse v1.0 Open Specification · Love Key Link" },
      {
        name: "description",
        content:
          "The @rsp/pulse v1.0 open specification: edge intent translation, burn-on-write, k-anonymity thresholds and crisis commercial suppression.",
      },
      { property: "og:title", content: "@rsp/pulse v1.0 Open Specification" },
      {
        property: "og:description",
        content:
          "A privacy-first protocol for sensing macro population strain and balancing resource distribution.",
      },
    ],
  }),
  component: PulseSpec,
});

const invariants = [
  {
    icon: <IconEye />,
    title: "1. Edge intent translation",
    body: "Edge actions from 100+ countries across 50+ languages are normalised into low-resolution intent vectors before reaching central pools.",
  },
  {
    icon: <IconFlame />,
    title: "2. Burn-on-write safeguard",
    body: "All PII, exact IP addresses and high-precision GPS coordinates for Tier 4 critical data are irreversibly destroyed at the edge.",
  },
  {
    icon: <IconShield />,
    title: "3. k-anonymity density threshold",
    body: "Regional telemetry is held in escrow until the minimum population threshold (N ≥ 50) is reached, guaranteeing zero individual traceability.",
  },
  {
    icon: <IconSync />,
    title: "4. Crisis commercial suppression",
    body: "A hard-coded protocol override suppresses commercial messaging, ads and monetisation signals whenever regional strain exceeds threshold.",
  },
];

function PulseSpec() {
  return (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Specification proposal</div>
        <h1 className="rsp-h2">@rsp/pulse v1.0 Open Specification</h1>
        <p className="rsp-lead">
          Macro population strain sensing architecture for public authorities, aid agencies,
          municipalities and supply chain operators.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto 40px" }}>
        <h2 className="rsp-h3" style={{ marginBottom: 8 }}>
          Executive summary
        </h2>
        <p className="rsp-lead" style={{ textAlign: "left", margin: 0 }}>
          The @rsp/pulse specification establishes a privacy-first protocol for sensing macro
          population strain and balancing resource distribution. By pooling low-resolution action
          signals and burning source identifiers on write, institutions gain real-time operational
          visibility into demand spikes without conducting surveillance on citizens.
        </p>
      </div>

      <div className="rsp-principle-grid">
        {invariants.map((i) => (
          <div className="rsp-principle-card" key={i.title}>
            <div className="rsp-pc-icon">{i.icon}</div>
            <div className="rsp-pc-title">{i.title}</div>
            <div className="rsp-pc-body">{i.body}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 860,
          margin: "40px auto 0",
          border: "1px solid var(--rsp-border)",
          borderRadius: "var(--rsp-radius)",
          background: "var(--rsp-surface)",
          padding: "24px 26px",
        }}
      >
        <div className="rsp-eyebrow" style={{ marginBottom: 12 }}>
          Non-negotiable privacy safeguards
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          <li className="rsp-pc-body">
            <strong>Burn-on-write:</strong> IP addresses, exact coordinates and device footprints
            are cryptographically erased at the edge.
          </li>
          <li className="rsp-pc-body">
            <strong>k-anonymity threshold:</strong> regional signals surface only when density
            reaches N ≥ 50 distinct anonymous signals.
          </li>
          <li className="rsp-pc-body">
            <strong>90-day decay:</strong> all macro signal history automatically decays and deletes
            after 90 days.
          </li>
          <li className="rsp-pc-body">
            <strong>Commercial isolation:</strong> Pulse feeds cannot be accessed by advertising
            networks or used for commercial retargeting.
          </li>
        </ul>
      </div>
    </section>
  );
}
