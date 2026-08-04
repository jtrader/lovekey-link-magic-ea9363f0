import { createFileRoute, Link } from "@tanstack/react-router";
import { PulseTelemetryFlow } from "@/components/rsp/PulseTelemetryFlow";
import { IconShield, IconScale, IconHeart, IconSync } from "@/components/rsp-shared";

export const Route = createFileRoute("/rsp/pulse/")({
  head: () => ({
    meta: [
      { title: "@rsp/pulse — Global Population Pulse Standard · Love Key Link" },
      {
        name: "description",
        content:
          "@rsp/pulse measures real-time population capacity, strain and resource demand without human surveillance — a privacy-first telemetry standard for aid, health and civic infrastructure.",
      },
      { property: "og:title", content: "@rsp/pulse — Global Population Pulse Standard" },
      {
        property: "og:description",
        content:
          "Coordination, not surveillance: sensing macro population strain without individual tracking.",
      },
    ],
  }),
  component: PulseOverview,
});

const domains = [
  {
    to: "/rsp/pulse/summary",
    icon: <IconShield />,
    title: "Pulse Server Summary →",
    body: "An editorial walkthrough of the strain engine, its scope, edge escrow, timing model and humanitarian purpose.",
  },
  {
    to: "/rsp/pulse/server",
    icon: <IconSync />,
    title: "RSP Pulse Server →",
    body: "Live ambient node health per region, with k-anonymity escrow enforced before anything renders.",
  },
  {
    to: "/rsp/pulse/telemetry",
    icon: <IconScale />,
    title: "Global Telemetry →",
    body: "Macro ESI across every reporting pool, with sealed regions shown as escrowed.",
  },
  {
    to: "/rsp/pulse/allocation",
    icon: <IconHeart />,
    title: "Resource Allocation →",
    body: "Institutional balancing: route responder capacity toward strain, never toward identity.",
  },
  {
    to: "/rsp/pulse/spec",
    icon: <IconShield />,
    title: "Open Specification →",
    body: "Protocol invariants for edge telemetry, burn-on-write and k-anonymity thresholding.",
  },
  {
    to: "/rsp/pulse/strain-engine",
    icon: <IconScale />,
    title: "Strain Engine (ESI) →",
    body: "The Event Strain Index mathematical formulation for real-time capacity vs demand sensing.",
  },
  {
    to: "/rsp/pulse/disaster-aid",
    icon: <IconHeart />,
    title: "Disaster Aid Framework →",
    body: "Integration across Crisis Compass, AidAngel, Guardian Guide and FirstAidAngel.",
  },
];

function PulseOverview() {
  return (
    <>
      <section className="rsp-section" id="pulse">
        <div className="rsp-section-header">
          <div
            className="rsp-eyebrow"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span className="rsp-hero-eyebrow-dot" /> @rsp/pulse v1.0 Standard
          </div>
          <h1 className="rsp-h2">Global Population Pulse & Resource Allocation</h1>
          <p className="rsp-lead">
            Measuring real-time capacity, strain and resource demand across populations without
            human surveillance. A privacy-first telemetric framework for public health, civic
            infrastructure, supply chain equilibrium and disaster response.
          </p>
        </div>

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto 8px",
            padding: "20px 24px",
            borderLeft: "3px solid var(--rsp-primary)",
            background: "var(--rsp-bg-warm)",
            borderRadius: "0 var(--rsp-radius) var(--rsp-radius) 0",
          }}
        >
          <div className="rsp-eyebrow" style={{ marginBottom: 6 }}>
            Guiding principle
          </div>
          <p style={{ margin: 0, fontSize: "1.05rem", color: "var(--rsp-text)" }}>
            “Coordination, not surveillance. Sensing macro population strain without individual
            tracking.”
          </p>
        </div>

        <PulseTelemetryFlow />

        <div className="rsp-principle-grid" style={{ marginTop: 32 }}>
          {domains.map((d) => (
            <Link
              key={d.to}
              to={d.to}
              className="rsp-principle-card"
              style={{ textDecoration: "none" }}
            >
              <div className="rsp-pc-icon">{d.icon}</div>
              <div className="rsp-pc-title" style={{ color: "var(--rsp-primary)" }}>
                {d.title}
              </div>
              <div className="rsp-pc-body">{d.body}</div>
            </Link>
          ))}
          <div className="rsp-principle-card">
            <div className="rsp-pc-icon">
              <IconSync />
            </div>
            <div className="rsp-pc-title">Civic infrastructure & utilities</div>
            <div className="rsp-pc-body">
              Sense power grid friction, transit bottlenecks or municipal water deficits via
              anonymised action signals.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
