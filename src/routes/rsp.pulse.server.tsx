import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, ShieldCheck, Users } from "lucide-react";
import {
  MetricCard,
  NodeHealthPulse,
  PulseServerStyles,
  StateDot,
} from "@/components/rsp/PulseServerUi";
import {
  K_THRESHOLD,
  STATE_NOTE,
  calcEsi,
  esiState,
  isEscrowed,
  useRegionalTelemetry,
} from "@/lib/pulse-telemetry";

export const Route = createFileRoute("/rsp/pulse/server")({
  head: () => ({
    meta: [
      { title: "RSP Pulse Server — live Event Strain Index · Love Key Link" },
      {
        name: "description",
        content:
          "The RSP Pulse Server renders ambient regional node health from the Event Strain Index, with k-anonymity escrow enforced before any region is shown.",
      },
      { property: "og:title", content: "RSP Pulse Server" },
      {
        property: "og:description",
        content:
          "Ambient node health from live ESI telemetry — burn-on-write at the edge, escrowed below N = 50.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulseServer,
});

function PulseServer() {
  const { rows, loading, error } = useRegionalTelemetry();
  const [selected, setSelected] = useState<string | null>(null);

  const region = useMemo(
    () => rows.find((r) => r.region_id === selected) ?? rows[0] ?? null,
    [rows, selected],
  );

  const escrowed = region ? isEscrowed(region) : true;
  const state = region ? esiState(region) : "escrow";
  const esi = region && !escrowed ? calcEsi(region) : null;

  return (
    <section className="rsp-section">
      <PulseServerStyles />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className="rsp-hero-eyebrow-dot" /> RSP Pulse Server
        </div>
        <h1 className="rsp-h2">Ambient node health, not surveillance</h1>
        <p className="rsp-lead">
          Live regional strain rendered from the Event Strain Index over a 15-minute sliding
          window. Identifiable source data is burned at the edge; every region stays sealed until
          its anonymity pool clears N ≥ {K_THRESHOLD}.
        </p>
        <div className="pls-live" style={{ marginTop: 10 }}>
          <span className="pls-live-dot" /> {loading ? "connecting" : "live telemetry"}
        </div>
      </div>

      <div className="pls-shell">
        {error && (
          <div className="pls-escrow">Telemetry stream unavailable right now: {error}</div>
        )}

        <div className="pls-regions">
          {rows.map((r) => {
            const s = esiState(r);
            return (
              <button
                key={r.region_id}
                type="button"
                className={`pls-region-btn${region?.region_id === r.region_id ? " on" : ""}`}
                onClick={() => setSelected(r.region_id)}
              >
                <StateDot state={s} />
                {r.region_label}
              </button>
            );
          })}
        </div>

        {region ? (
          <>
            <NodeHealthPulse state={state} esi={esi} />

            {escrowed ? (
              <div className="pls-escrow">{STATE_NOTE.escrow}</div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  maxWidth: 620,
                  margin: "0 auto 30px",
                  color: "var(--rsp-text-muted)",
                  fontSize: ".95rem",
                }}
              >
                {STATE_NOTE[state]}
              </p>
            )}

            <div className="pls-metrics">
              <MetricCard
                icon={<Activity size={16} strokeWidth={1.5} />}
                label="Volume ratio"
                value={escrowed ? "—" : (region.v_current / region.v_baseline).toFixed(2)}
                hint="V current (15-min window) over V baseline (30-day regional trailing mean)."
              />
              <MetricCard
                icon={<ShieldCheck size={16} strokeWidth={1.5} />}
                label="Surgency factor"
                value={escrowed ? "—" : region.surgency.toFixed(2)}
                hint="Weighted crisis severity against verified responder capacity."
              />
              <MetricCard
                icon={<Users size={16} strokeWidth={1.5} />}
                label="Active N-pool"
                value={region.n_count}
                hint={`Anonymity pool size. Rendering unlocks at N ≥ ${K_THRESHOLD}.`}
              />
            </div>
          </>
        ) : (
          !loading && <div className="pls-escrow">No regional pools are reporting yet.</div>
        )}
      </div>
    </section>
  );
}
