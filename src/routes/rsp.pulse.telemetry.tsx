import { createFileRoute } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { PulseServerStyles, StateDot } from "@/components/rsp/PulseServerUi";
import {
  K_THRESHOLD,
  STATE_LABEL,
  calcEsi,
  esiState,
  isEscrowed,
  useRegionalTelemetry,
} from "@/lib/pulse-telemetry";

export const Route = createFileRoute("/rsp/pulse/telemetry")({
  head: () => ({
    meta: [
      { title: "Global Telemetry — macro ESI across regional pools · Love Key Link" },
      {
        name: "description",
        content:
          "A world view of Event Strain Index readings across anonymised regional pools, with sealed regions shown as escrowed rather than empty.",
      },
      { property: "og:title", content: "Global Telemetry — macro ESI view" },
      {
        property: "og:description",
        content:
          "Macro strain across regional pools, rendered only where the k-anonymity threshold is met.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulseTelemetry,
});

function PulseTelemetry() {
  const { rows, loading } = useRegionalTelemetry();
  const visible = rows.filter((r) => !isEscrowed(r));
  const sealed = rows.length - visible.length;
  const macro = visible.length
    ? visible.reduce((sum, r) => sum + calcEsi(r), 0) / visible.length
    : null;

  return (
    <section className="rsp-section">
      <PulseServerStyles />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Macro view</div>
        <h1 className="rsp-h2">Global telemetry</h1>
        <p className="rsp-lead">
          Every reporting pool, ranked by strain. Regions below the anonymity threshold appear as
          escrowed — never as a zero, never as an empty chart.
        </p>
      </div>

      <div className="pls-shell">
        <div className="pls-metrics" style={{ marginBottom: 26 }}>
          <div className="pls-metric">
            <div className="pls-metric-head">
              <span className="pls-metric-icon">
                <Globe2 size={16} strokeWidth={1.5} />
              </span>
              <span className="pls-metric-label">Macro ESI</span>
            </div>
            <div className="pls-metric-value">{macro === null ? "—" : macro.toFixed(2)}</div>
            <div className="pls-metric-hint">Mean strain across all rendered pools.</div>
          </div>
          <div className="pls-metric">
            <div className="pls-metric-head">
              <span className="pls-metric-label">Rendered pools</span>
            </div>
            <div className="pls-metric-value">{visible.length}</div>
            <div className="pls-metric-hint">Pools clearing N ≥ {K_THRESHOLD}.</div>
          </div>
          <div className="pls-metric">
            <div className="pls-metric-head">
              <span className="pls-metric-label">Held in escrow</span>
            </div>
            <div className="pls-metric-value">{sealed}</div>
            <div className="pls-metric-hint">Sealed to preserve herd privacy.</div>
          </div>
        </div>

        <div className="pls-table-wrap">
          <table className="rsp-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Country</th>
                <th>State</th>
                <th>ESI</th>
                <th>N-pool</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const s = esiState(r);
                return (
                  <tr key={r.region_id}>
                    <td>{r.region_label}</td>
                    <td>{r.country_code}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <StateDot state={s} /> {STATE_LABEL[s]}
                      </span>
                    </td>
                    <td>{s === "escrow" ? "sealed" : calcEsi(r).toFixed(2)}</td>
                    <td>{r.n_count}</td>
                  </tr>
                );
              })}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan={5}>No regional pools are reporting yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
