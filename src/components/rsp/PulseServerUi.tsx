import type { ReactNode } from "react";
import { STATE_LABEL, type EsiState } from "@/lib/pulse-telemetry";

export function PulseServerStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function NodeHealthPulse({ state, esi }: { state: EsiState; esi: number | null }) {
  return (
    <div className={`pls-node pls-node-${state}`}>
      <span className="pls-ring pls-ring-1" aria-hidden="true" />
      <span className="pls-ring pls-ring-2" aria-hidden="true" />
      <span className="pls-core">
        <span className="pls-core-value">{esi === null ? "—" : esi.toFixed(2)}</span>
        <span className="pls-core-label">{state === "escrow" ? "ESI sealed" : "ESI"}</span>
      </span>
      <span className="pls-state-chip">{STATE_LABEL[state]}</span>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint: string;
  icon?: ReactNode;
}) {
  return (
    <div className="pls-metric">
      <div className="pls-metric-head">
        {icon ? <span className="pls-metric-icon">{icon}</span> : null}
        <span className="pls-metric-label">{label}</span>
      </div>
      <div className="pls-metric-value">{value}</div>
      <div className="pls-metric-hint">{hint}</div>
    </div>
  );
}

export function StateDot({ state }: { state: EsiState }) {
  return <span className={`pls-dot pls-dot-${state}`} aria-hidden="true" />;
}

const css = `
  .pls-shell { max-width: 1080px; margin: 0 auto; }

  .pls-node {
    position: relative; display: grid; place-items: center;
    width: 260px; height: 260px; margin: 8px auto 34px;
  }
  .pls-ring {
    position: absolute; inset: 0; border-radius: 50%;
    background: var(--pls-tint); opacity: .35;
    animation: pls-breathe 5.5s var(--rsp-ease, ease-in-out) infinite;
  }
  .pls-ring-2 { inset: 26px; opacity: .5; animation-delay: .9s; }
  .pls-core {
    position: relative; display: grid; place-items: center; gap: 2px;
    width: 148px; height: 148px; border-radius: 50%;
    background: var(--rsp-surface); border: 1px solid var(--pls-edge);
    box-shadow: 0 10px 40px -22px var(--pls-edge);
  }
  .pls-core-value {
    font-size: 2.1rem; font-weight: 600; color: var(--rsp-text);
    font-variant-numeric: tabular-nums;
  }
  .pls-core-label {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: .66rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--rsp-text-muted);
  }
  .pls-state-chip {
    position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
    padding: 5px 14px; border-radius: 999px; white-space: nowrap;
    font-size: .74rem; font-weight: 600; letter-spacing: .04em;
    background: var(--rsp-surface); border: 1px solid var(--pls-edge); color: var(--pls-ink);
  }
  .pls-node-healthy { --pls-tint: oklch(88% .07 155); --pls-edge: oklch(70% .12 155); --pls-ink: oklch(45% .12 155); }
  .pls-node-stable  { --pls-tint: oklch(89% .06 250); --pls-edge: oklch(70% .10 250); --pls-ink: oklch(45% .12 250); }
  .pls-node-strain  { --pls-tint: oklch(90% .09 85);  --pls-edge: oklch(74% .13 80);  --pls-ink: oklch(48% .12 70); }
  .pls-node-escrow  { --pls-tint: oklch(92% .008 260); --pls-edge: var(--rsp-border-strong); --pls-ink: var(--rsp-text-muted); }
  .pls-node-strain .pls-ring { animation-duration: 3.2s; }
  .pls-node-escrow .pls-ring { animation: none; opacity: .5; }
  .pls-node-escrow .pls-core-value { color: var(--rsp-text-soft); }

  @keyframes pls-breathe {
    0%, 100% { transform: scale(.94); opacity: .3; }
    50% { transform: scale(1); opacity: .55; }
  }
  @media (prefers-reduced-motion: reduce) { .pls-ring { animation: none !important; } }

  .pls-metrics {
    display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .pls-metric {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 18px 20px;
  }
  .pls-metric-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .pls-metric-icon { color: var(--rsp-primary); display: inline-flex; }
  .pls-metric-label {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--rsp-text-muted);
  }
  .pls-metric-value {
    font-size: 1.55rem; font-weight: 600; color: var(--rsp-text); font-variant-numeric: tabular-nums;
  }
  .pls-metric-hint { font-size: .82rem; line-height: 1.5; color: var(--rsp-text-muted); margin-top: 4px; }

  .pls-regions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 26px; }
  .pls-region-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 999px; cursor: pointer;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    font-size: .85rem; color: var(--rsp-text); transition: border-color .18s, background .18s;
  }
  .pls-region-btn:hover { border-color: var(--rsp-primary); }
  .pls-region-btn.on { border-color: var(--rsp-primary); background: var(--rsp-bg-warm); font-weight: 600; }

  .pls-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .pls-dot-healthy { background: oklch(70% .13 155); }
  .pls-dot-stable  { background: oklch(68% .12 250); }
  .pls-dot-strain  { background: oklch(76% .14 80); }
  .pls-dot-escrow  { background: var(--rsp-border-strong); }

  .pls-escrow {
    max-width: 640px; margin: 0 auto 30px; text-align: center;
    background: var(--rsp-bg-warm); border: 1px dashed var(--rsp-border-strong);
    border-radius: var(--rsp-radius); padding: 18px 22px;
    font-size: .9rem; line-height: 1.6; color: var(--rsp-text-muted);
  }

  .pls-live {
    display: inline-flex; align-items: center; gap: 8px; font-size: .76rem;
    color: var(--rsp-text-muted); font-family: 'IBM Plex Mono', ui-monospace, monospace;
    letter-spacing: .08em; text-transform: uppercase;
  }
  .pls-live-dot {
    width: 8px; height: 8px; border-radius: 50%; background: oklch(70% .13 155);
    animation: pls-breathe 2.4s ease-in-out infinite;
  }

  .pls-table-wrap { overflow-x: auto; }
`;
