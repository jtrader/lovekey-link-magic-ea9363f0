const STEPS = [
  {
    n: "1",
    title: "Multi-lingual intent",
    body: "100+ countries / 50 languages of edge actions",
  },
  { n: "2", title: "Burn-on-write", body: "PII, IP & coordinates destroyed at the edge" },
  { n: "3", title: "k-anonymity pool", body: "Regional aggregation (N ≥ 50 threshold)" },
  { n: "4", title: "Macro ESI & balance", body: "Resource allocation for institutions" },
];

export function PulseTelemetryFlow() {
  return (
    <div className="rsp-pulse-flow">
      <div className="rsp-eyebrow" style={{ marginBottom: 14 }}>
        @rsp/pulse telemetry architecture — edge signal to anonymised pool
      </div>
      <div className="rsp-pulse-flow-grid">
        {STEPS.map((s) => (
          <div className="rsp-pulse-step" key={s.n}>
            <span className="rsp-pulse-step-n">{s.n}</span>
            <span className="rsp-pulse-step-title">{s.title}</span>
            <span className="rsp-pulse-step-body">{s.body}</span>
          </div>
        ))}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .rsp-pulse-flow {
          max-width: 1100px; margin: 32px auto;
          border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
          background: var(--rsp-surface); padding: 24px 26px;
        }
        .rsp-pulse-flow-grid {
          display: grid; gap: 14px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .rsp-pulse-step {
          display: flex; flex-direction: column; gap: 6px;
          padding: 18px 18px; border-radius: 10px;
          border: 1px solid var(--rsp-border); background: var(--rsp-bg-warm);
        }
        .rsp-pulse-step-n {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
          font-size: .72rem; letter-spacing: .12em; color: var(--rsp-primary); font-weight: 700;
        }
        .rsp-pulse-step-title { font-weight: 600; color: var(--rsp-text); font-size: .95rem; }
        .rsp-pulse-step-body { font-size: .85rem; line-height: 1.5; color: var(--rsp-text-muted); }
      `,
        }}
      />
    </div>
  );
}
