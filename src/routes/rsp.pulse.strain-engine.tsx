import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp/pulse/strain-engine")({
  head: () => ({
    meta: [
      { title: "Event Strain Index (ESI) — @rsp/pulse Strain Engine · Love Key Link" },
      {
        name: "description",
        content:
          "The Event Strain Index quantifies population demand against institutional capacity in real time, without retaining identity.",
      },
      { property: "og:title", content: "The Event Strain Index (ESI)" },
      {
        property: "og:description",
        content:
          "Quantifying population demand vs. institutional capacity without identity retention.",
      },
    ],
  }),
  component: PulseStrainEngine,
});

const variables = [
  {
    symbol: (
      <>
        V<sub>current</sub> / V<sub>baseline</sub>
      </>
    ),
    title: "Intent velocity ratio",
    body: "Current 15-minute sliding-window signal volume relative to the 30-day trailing regional baseline.",
  },
  {
    symbol: <>S{"\u2093"}</>,
    title: "Urgency multiplier",
    body: "Proportion of high or immediate urgency signals relative to general monitoring traffic.",
  },
  {
    symbol: <>C{"\u2093"}</>,
    title: "Institutional reserve",
    body: "Verified operational throughput of local resource providers, responder bandwidth and volunteer density.",
  },
];

function PulseStrainEngine() {
  return (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Mathematical model</div>
        <h1 className="rsp-h2">The Event Strain Index (ESI)</h1>
        <p className="rsp-lead">
          Quantifying population demand against institutional capacity in real time, without
          retaining identity.
        </p>
      </div>

      <div
        style={{
          background: "var(--rsp-bg-warm)",
          border: "1px solid var(--rsp-border)",
          borderRadius: "var(--rsp-radius)",
          padding: "32px 24px",
          textAlign: "center",
          margin: "0 auto 40px",
          maxWidth: 820,
        }}
      >
        <div className="rsp-eyebrow" style={{ marginBottom: 12 }}>
          Core strain equation
        </div>
        <div
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            color: "var(--rsp-text)",
            fontWeight: 700,
            letterSpacing: "-.01em",
          }}
        >
          ESI = ( V<sub>current</sub> / V<sub>baseline</sub> ) × ( 1 + S
          <sub>urgency</sub> / C<sub>capacity</sub> )
        </div>
      </div>

      <div className="rsp-principle-grid">
        {variables.map((v) => (
          <div className="rsp-principle-card" key={v.title}>
            <div
              className="rsp-pc-title"
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                color: "var(--rsp-primary)",
              }}
            >
              {v.symbol}
            </div>
            <div className="rsp-pc-title" style={{ marginTop: 4 }}>
              {v.title}
            </div>
            <div className="rsp-pc-body">{v.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
