import { createFileRoute, Link } from "@tanstack/react-router";
import { IconShield, IconFlame, IconSync, IconHeart, IconEye } from "@/components/rsp-shared";

export const Route = createFileRoute("/rsp/pulse/disaster-aid")({
  head: () => ({
    meta: [
      { title: "Disaster & Humanitarian Aid Framework — @rsp/pulse · Love Key Link" },
      {
        name: "description",
        content:
          "How @rsp/pulse senses population strain across Prepare, Respond, Recover, Heal and Coordinate — with burn-on-write privacy and k-anonymity.",
      },
      { property: "og:title", content: "Disaster & Humanitarian Aid Framework" },
      {
        property: "og:description",
        content:
          "Real-time population strain sensing across Crisis Compass, AidAngel, Guardian Guide and FirstAidAngel.",
      },
    ],
  }),
  component: PulseDisasterAid,
});

const stages = [
  {
    icon: <IconShield />,
    name: "1. First Aid Angel",
    tag: "PREPARE",
    body: "Educational gaps, readiness checklists and pre-event capacity sensing.",
  },
  {
    icon: <IconFlame />,
    name: "2. Crisis Compass",
    tag: "RESPOND",
    body: "Active hazard footprint, life-safety urgency and rapid ESI strain telemetry.",
  },
  {
    icon: <IconSync />,
    name: "3. Aid Angel",
    tag: "RECOVER",
    body: "Financial assistance, grants and housing demand with burn-on-write privacy.",
  },
  {
    icon: <IconHeart />,
    name: "4. Guardian Guide",
    tag: "HEAL",
    body: "Community emotional strain and psychological care pulse — no profiling records.",
  },
  {
    icon: <IconEye />,
    name: "5. Love Key Link",
    tag: "COORDINATE",
    body: "Care circle support states, coordinated without raw GPS or identity retention.",
  },
];

const tiers = [
  ["Tier 1 (Low)", "Preparedness course start", "90-day automatic decay"],
  ["Tier 2 (Medium)", "Disaster recovery search", "30-day signal expiry; minimised in 24h"],
  ["Tier 3 (High)", "Financial aid inquiry", "Session-only default; marketing blocked"],
  ["Tier 4 (Critical)", "Immediate danger / crisis prompt", "Burned on write immediately"],
];

function PulseDisasterAid() {
  return (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Humanitarian network integration</div>
        <h1 className="rsp-h2">Disaster & Humanitarian Aid Framework</h1>
        <p className="rsp-lead">
          Real-time population strain sensing across the Love Key Help Network: Prepare → Respond →
          Recover → Heal → Coordinate.
        </p>
      </div>

      <div className="rsp-principle-grid">
        {stages.map((s) => (
          <div className="rsp-principle-card" key={s.name}>
            <div className="rsp-pc-icon">{s.icon}</div>
            <div
              className="rsp-pc-title"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>{s.name}</span>
              <span
                style={{
                  fontSize: ".7rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "var(--rsp-primary-light)",
                  color: "var(--rsp-primary)",
                }}
              >
                {s.tag}
              </span>
            </div>
            <div className="rsp-pc-body">{s.body}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "48px auto 0" }}>
        <h2 className="rsp-h3" style={{ marginBottom: 12 }}>
          Signal mapping & burn schedule
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="rsp-table">
            <thead>
              <tr>
                <th>Sensitivity tier</th>
                <th>Example action</th>
                <th>Data lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t[0]}>
                  <td>
                    <strong>{t[0]}</strong>
                  </td>
                  <td>{t[1]}</td>
                  <td>{t[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto 0", display: "grid", gap: 20 }}>
        <div
          style={{
            border: "1px solid var(--rsp-border)",
            borderRadius: "var(--rsp-radius)",
            background: "var(--rsp-surface)",
            padding: "24px 26px",
          }}
        >
          <div className="rsp-eyebrow" style={{ marginBottom: 10 }}>
            Geographical boundaries
          </div>
          <p className="rsp-pc-body" style={{ marginTop: 0 }}>
            Telemetry strictly avoids raw GPS coordinates, operating at regional scope (local
            government area / postcode) using Help Locale Packs.
          </p>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "var(--rsp-bg-warm)",
              border: "1px solid var(--rsp-border)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: ".8rem",
              color: "var(--rsp-primary)",
            }}
          >
            Privacy requirement: k-anonymity density threshold N ≥ 50 signals per regional zone.
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--rsp-border)",
            borderRadius: "var(--rsp-radius)",
            background: "var(--rsp-surface)",
            padding: "24px 26px",
          }}
        >
          <div className="rsp-eyebrow" style={{ marginBottom: 10 }}>
            Core ethical safeguards
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
            <li className="rsp-pc-body">
              <strong>Coordination, not surveillance:</strong> real-time demand measurement with
              zero persistent ad profiling.
            </li>
            <li className="rsp-pc-body">
              <strong>Hard-coded suppression:</strong> commercial offers are disabled in crisis or
              high-urgency states.
            </li>
            <li className="rsp-pc-body">
              <strong>Multi-event portfolio reserve:</strong> allocation models reserve capacity to
              avoid starving adjacent regional crises.
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "32px auto 0",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          fontSize: ".9rem",
        }}
      >
        <Link to="/rsp/pulse" className="rsp-crumb">
          ← Back to @rsp/pulse overview
        </Link>
        <Link to="/rsp/pulse/spec" className="rsp-crumb">
          View open specification →
        </Link>
      </div>
    </section>
  );
}
