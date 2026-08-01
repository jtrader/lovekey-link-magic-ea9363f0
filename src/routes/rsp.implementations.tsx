import { definePage } from "@/lib/router";

export const Route = definePage("/rsp/implementations")({
  head: () => ({
    meta: [
      { title: "RSP Implementations — Where RSP is deployed · Love Key Link" },
      {
        name: "description",
        content:
          "Where RSP applies: multi-agent AI, education, healthcare, creator platforms and more — plus the low-resolution signal model that powers it.",
      },
      { property: "og:title", content: "RSP Implementations" },
      {
        property: "og:description",
        content: "The verticals RSP is designed for and the signal model that powers coordination.",
      },
    ],
  }),
  component: RspImplementations,
});

function RspImplementations() {
  return (
    <>
      <section className="rsp-section" id="verticals">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Integration verticals</div>
          <h2 className="rsp-h2">Where RSP applies</h2>
          <p className="rsp-lead">
            RSP is designed for any system where group coordination intersects with privacy — human,
            AI, or hybrid.
          </p>
        </div>
        <div className="rsp-vertical-grid">
          {[
            "AI Model Congregations & Multi-Agent Systems",
            "LMS & Online Education",
            "Product Analytics & UX",
            "Customer Support & AI Service Operations",
            "Workplace Collaboration",
            "Healthcare & Care Coordination",
            "Governance, DAOs & Civic Coordination",
            "Cybersecurity & Incident Response",
            "Creator Platforms & Communities",
            "E-commerce & Marketplaces",
          ].map((name, i) => (
            <div className="rsp-vertical-card" key={name}>
              <div className="rsp-vc-tag">{String(i + 1).padStart(2, "0")}</div>
              <div className="rsp-vc-name">{name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rsp-signal-section">
        <div className="rsp-signal-inner">
          <div className="rsp-section-header">
            <div className="rsp-eyebrow">Signal model — v1.6</div>
            <h2 className="rsp-h2">Visual states & weights</h2>
            <p className="rsp-lead">
              RSP reduces raw behaviour to 13 low-resolution visual states. Signal weights control
              how strongly each event contributes.
            </p>
          </div>
          <div className="rsp-signal-states">
            {[
              "resonant",
              "active",
              "aware",
              "dormant",
              "friction",
              "overload",
              "drop_off",
              "support_needed",
              "cooling",
              "converting",
              "mastery",
              "coordination_degraded",
              "coordination_healthy",
            ].map((s) => (
              <span className="rsp-state-pill" key={s}>
                {s}
              </span>
            ))}
          </div>
          <div className="rsp-signal-weights">
            {[
              { name: "Completion / conversion", pct: 100, val: 25 },
              { name: "Return visit", pct: 80, val: 20 },
              { name: "Safety escalation", pct: 80, val: 20 },
              { name: "Resource download", pct: 60, val: 15 },
              { name: "Human correction", pct: 48, val: 12 },
              { name: "Form interaction", pct: 48, val: 12 },
              { name: "Active minute", pct: 40, val: 10 },
              { name: "Agent handoff", pct: 40, val: 10 },
            ].map((w) => (
              <div className="rsp-weight-row" key={w.name}>
                <span className="rsp-weight-name">{w.name}</span>
                <div className="rsp-weight-bar-wrap">
                  <div className="rsp-weight-bar" style={{ width: `${w.pct}%` }} />
                </div>
                <span className="rsp-weight-val">{w.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
