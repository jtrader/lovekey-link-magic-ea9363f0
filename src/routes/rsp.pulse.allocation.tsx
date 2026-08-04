import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";
import { PulseServerStyles, StateDot } from "@/components/rsp/PulseServerUi";
import {
  K_THRESHOLD,
  STATE_LABEL,
  calcEsi,
  esiState,
  isEscrowed,
  useRegionalTelemetry,
  type RegionalTelemetry,
} from "@/lib/pulse-telemetry";

export const Route = createFileRoute("/rsp/pulse/allocation")({
  head: () => ({
    meta: [
      { title: "Resource Allocation — balancing capacity against strain · Love Key Link" },
      {
        name: "description",
        content:
          "An institutional balancing view: where responder capacity should move next, derived from anonymised Event Strain Index readings.",
      },
      { property: "og:title", content: "Resource Allocation — RSP Pulse Server" },
      {
        property: "og:description",
        content:
          "Route capacity toward strained pools without ever touching an individual record.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulseAllocation,
});

/** Suggested share of spare capacity, weighted by strain above equilibrium. */
function allocationWeights(rows: RegionalTelemetry[]) {
  const eligible = rows.filter((r) => !isEscrowed(r));
  const excess = eligible.map((r) => ({ r, w: Math.max(0, calcEsi(r) - 1) }));
  const total = excess.reduce((s, e) => s + e.w, 0);
  return excess
    .map((e) => ({ ...e, share: total > 0 ? (e.w / total) * 100 : 0 }))
    .sort((a, b) => b.share - a.share);
}

function PulseAllocation() {
  const { rows, loading } = useRegionalTelemetry();
  const weights = allocationWeights(rows);
  const sealed = rows.filter(isEscrowed);

  return (
    <section className="rsp-section">
      <PulseServerStyles />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Institutional interface</div>
        <h1 className="rsp-h2">Resource allocation</h1>
        <p className="rsp-lead">
          Strain above equilibrium (ESI &gt; 1) is converted into a suggested share of available
          responder capacity. The recommendation is derived entirely from aggregated pools — no
          individual record is ever consulted.
        </p>
      </div>

      <div className="pls-shell">
        <div className="pls-table-wrap">
          <table className="rsp-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>State</th>
                <th>ESI</th>
                <th>Strain above equilibrium</th>
                <th>Suggested capacity share</th>
              </tr>
            </thead>
            <tbody>
              {weights.map(({ r, w, share }) => {
                const s = esiState(r);
                return (
                  <tr key={r.region_id}>
                    <td>{r.region_label}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <StateDot state={s} /> {STATE_LABEL[s]}
                      </span>
                    </td>
                    <td>{calcEsi(r).toFixed(2)}</td>
                    <td>{w.toFixed(2)}</td>
                    <td>{share.toFixed(1)}%</td>
                  </tr>
                );
              })}
              {!weights.length && !loading && (
                <tr>
                  <td colSpan={5}>No pool currently clears the rendering threshold.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sealed.length > 0 && (
          <div className="pls-escrow" style={{ marginTop: 26 }}>
            {sealed.length} pool{sealed.length > 1 ? "s are" : " is"} excluded from allocation
            because telemetry is held in escrow (N &lt; {K_THRESHOLD}). Allocate to these regions
            through standing local arrangements, not telemetry.
          </div>
        )}

        <div
          style={{
            maxWidth: 900,
            margin: "34px auto 0",
            padding: "20px 24px",
            borderLeft: "3px solid var(--rsp-primary)",
            background: "var(--rsp-bg-warm)",
            borderRadius: "0 var(--rsp-radius) var(--rsp-radius) 0",
          }}
        >
          <div
            className="rsp-eyebrow"
            style={{ marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <HeartPulse size={14} strokeWidth={1.5} /> Allocation principle
          </div>
          <p style={{ margin: 0, fontSize: "1.02rem", color: "var(--rsp-text)" }}>
            Capacity follows strain, never identity. A region earns support because its pool is
            straining — not because anyone in it was tracked.
          </p>
        </div>
      </div>
    </section>
  );
}
