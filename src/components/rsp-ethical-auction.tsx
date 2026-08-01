import type { ReactNode } from "react";
import { Link } from "@/lib/router";

/* ── Shared styling for the Ethical Auction area ───────────────────────────
   Uses the RSP light theme tokens defined in src/routes/rsp.tsx so the
   subsection stays visually congruent with the rest of the site.        */

export const eaCss = `
  .ea-table-wrap { max-width: 1000px; margin: 0 auto; overflow-x: auto; }
  .ea-table {
    width: 100%; border-collapse: collapse; font-size: .88rem;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); overflow: hidden;
  }
  .ea-table th {
    text-align: left; font-size: .72rem; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: var(--rsp-text-muted);
    background: var(--rsp-bg-warm); padding: 14px 16px;
    border-bottom: 1px solid var(--rsp-border);
  }
  .ea-table td {
    padding: 14px 16px; vertical-align: top; color: var(--rsp-text-muted);
    line-height: 1.55; border-bottom: 1px solid var(--rsp-border);
  }
  .ea-table tr:last-child td { border-bottom: none; }
  .ea-table td strong { color: var(--rsp-text); font-weight: 600; }
  @media (max-width: 720px) {
    .ea-table, .ea-table thead, .ea-table tbody, .ea-table tr, .ea-table td { display: block; width: 100%; }
    .ea-table thead { display: none; }
    .ea-table tr { border-bottom: 1px solid var(--rsp-border-strong); padding: 8px 0; }
    .ea-table tr:last-child { border-bottom: none; }
    .ea-table td { border: none; padding: 6px 16px; }
    .ea-table td::before {
      content: attr(data-label); display: block;
      font-size: .68rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
      color: var(--rsp-text-soft); margin-bottom: 2px;
    }
  }

  /* Two-column comparison */
  .ea-compare {
    max-width: 1000px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }
  @media (max-width: 760px) { .ea-compare { grid-template-columns: 1fr; } }
  .ea-compare-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 24px;
  }
  .ea-compare-card.is-good { border-color: oklch(80% .09 160); background: oklch(99% .012 160); }
  .ea-compare-tag {
    font-size: .7rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 6px; display: block;
  }
  .ea-compare-card.is-good .ea-compare-tag { color: oklch(48% .12 160); }
  .ea-compare-card h3 { font-size: 1.05rem; font-weight: 600; margin: 0 0 12px; }
  .ea-compare-card ul { margin: 0; padding-left: 18px; }
  .ea-compare-card li {
    font-size: .9rem; color: var(--rsp-text-muted); line-height: 1.6; margin-bottom: 8px;
  }

  /* Formula plate */
  .ea-formula {
    max-width: 820px; margin: 0 auto; text-align: center;
    background: var(--rsp-bg-warm); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 32px 24px;
  }
  .ea-formula-label {
    font-size: .7rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 14px;
  }
  .ea-formula-eq {
    font-family: 'DM Serif Display', serif; font-size: clamp(1.15rem, 3vw, 1.7rem);
    color: var(--rsp-text); line-height: 1.5; letter-spacing: -.01em;
  }
  .ea-formula-eq em { color: var(--rsp-primary); font-style: italic; }
  .ea-formula-note {
    margin-top: 14px; font-size: .82rem; color: var(--rsp-text-muted);
  }

  /* Flow / pipeline diagram */
  .ea-flow {
    max-width: 940px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;
  }
  .ea-flow-node {
    position: relative; background: var(--rsp-surface);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    padding: 18px; text-align: left;
  }
  .ea-flow-node::after {
    content: '→'; position: absolute; right: -13px; top: 50%; transform: translateY(-50%);
    color: var(--rsp-text-soft); font-size: 1rem;
  }
  .ea-flow-node:last-child::after { content: none; }
  @media (max-width: 760px) {
    .ea-flow-node::after { content: '↓'; right: 50%; top: auto; bottom: -18px; transform: translateX(50%); }
  }
  .ea-flow-step {
    font-size: .68rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 6px;
  }
  .ea-flow-node h4 { font-size: .95rem; font-weight: 600; margin: 0 0 6px; }
  .ea-flow-node p { font-size: .84rem; color: var(--rsp-text-muted); margin: 0; line-height: 1.55; }

  /* Gauge / meter rows */
  .ea-meters { max-width: 820px; margin: 0 auto; display: grid; gap: 16px; }
  .ea-meter {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 18px 20px;
  }
  .ea-meter-head {
    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
    margin-bottom: 10px;
  }
  .ea-meter-name { font-size: .95rem; font-weight: 600; }
  .ea-meter-state {
    font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  }
  .ea-meter-bar {
    height: 8px; border-radius: 999px; background: var(--rsp-border); overflow: hidden;
  }
  .ea-meter-fill { height: 100%; border-radius: 999px; }
  .ea-meter-note { margin-top: 10px; font-size: .84rem; color: var(--rsp-text-muted); line-height: 1.55; }

  /* Guardrail / callout list */
  .ea-guards { max-width: 900px; margin: 0 auto; display: grid; gap: 14px; }
  .ea-guard {
    display: flex; gap: 14px; align-items: flex-start;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 18px 20px;
  }
  .ea-guard-num {
    flex: none; width: 28px; height: 28px; border-radius: 999px;
    background: var(--rsp-primary-light); color: var(--rsp-primary);
    display: flex; align-items: center; justify-content: center;
    font-size: .78rem; font-weight: 600;
  }
  .ea-guard h4 { font-size: .95rem; font-weight: 600; margin: 0 0 4px; }
  .ea-guard p { font-size: .87rem; color: var(--rsp-text-muted); margin: 0; line-height: 1.6; }

  /* Timeline */
  .ea-timeline { max-width: 820px; margin: 0 auto; display: grid; gap: 0; }
  .ea-phase {
    position: relative; padding: 0 0 26px 34px; border-left: 2px solid var(--rsp-border);
  }
  .ea-phase:last-child { border-left-color: transparent; padding-bottom: 0; }
  .ea-phase::before {
    content: ''; position: absolute; left: -7px; top: 4px;
    width: 12px; height: 12px; border-radius: 999px;
    background: var(--rsp-primary); box-shadow: 0 0 0 4px var(--rsp-primary-light);
  }
  .ea-phase-tag {
    font-size: .7rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 4px;
  }
  .ea-phase h4 { font-size: 1rem; font-weight: 600; margin: 0 0 6px; }
  .ea-phase p { font-size: .88rem; color: var(--rsp-text-muted); margin: 0; line-height: 1.6; }

  /* Next-page card grid */
  .ea-cards {
    max-width: 1000px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px;
  }
  .ea-card {
    display: block; text-decoration: none; color: inherit;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 20px; transition: all .2s var(--rsp-ease);
  }
  .ea-card:hover { border-color: var(--rsp-primary); transform: translateY(-2px); }
  .ea-card-step {
    font-size: .68rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 6px;
  }
  .ea-card h3 { font-size: 1rem; font-weight: 600; margin: 0 0 6px; }
  .ea-card p { font-size: .85rem; color: var(--rsp-text-muted); margin: 0; line-height: 1.55; }
/* ── Citations & footnotes ─────────────────────────────────────────── */
  .ea-ref a {
    color: var(--rsp-primary); text-decoration: none; font-size: .68em;
    padding: 0 1px; font-weight: 600;
  }
  .ea-ref a:hover { text-decoration: underline; }
  .ea-notes {
    max-width: 1000px; margin: 34px auto 0; background: var(--rsp-bg-warm);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius); padding: 22px 24px;
  }
  .ea-notes-head {
    font-size: .7rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 8px;
  }
  .ea-notes-intro { margin: 0 0 12px; font-size: .85rem; color: var(--rsp-text-muted); }
  .ea-notes-list { margin: 0; padding-left: 20px; }
  .ea-notes-list li {
    font-size: .82rem; line-height: 1.6; color: var(--rsp-text-muted); margin-bottom: 10px;
  }
  .ea-notes-list li:target { background: var(--rsp-primary-light); border-radius: 6px; padding: 4px 6px; }
  .ea-notes-list strong { color: var(--rsp-text); }

  /* ── SEO + SEM callout ─────────────────────────────────────────────── */
  .ea-dual {
    max-width: 1000px; margin: 16px auto 0; padding: 16px 20px;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-left: 3px solid var(--rsp-primary); border-radius: var(--rsp-radius);
  }
  .ea-dual-tag {
    font-size: .7rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 6px;
  }
  .ea-dual p { margin: 0; font-size: .88rem; line-height: 1.65; color: var(--rsp-text-muted); }
  .ea-dual strong { color: var(--rsp-text); }

  /* ── Formula term tooltips ─────────────────────────────────────────── */
  .ea-tt {
    position: relative; cursor: help;
    border-bottom: 1px dashed var(--rsp-border-strong, var(--rsp-border));
  }
  .ea-tt-pop {
    position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%);
    width: min(260px, 70vw); background: var(--rsp-text); color: var(--rsp-surface);
    font-family: 'IBM Plex Sans', system-ui, sans-serif; font-style: normal;
    font-size: .74rem; line-height: 1.5; text-align: left; padding: 9px 11px;
    border-radius: 8px; opacity: 0; visibility: hidden; transition: opacity .15s var(--rsp-ease);
    z-index: 40; pointer-events: none;
  }
  .ea-tt:hover .ea-tt-pop, .ea-tt:focus .ea-tt-pop, .ea-tt:focus-visible .ea-tt-pop {
    opacity: 1; visibility: visible;
  }
  .ea-formula-swap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 22px; text-align: left;
  }
  @media (max-width: 700px) { .ea-formula-swap { grid-template-columns: 1fr; } }
  .ea-formula-swap > div {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 14px 16px;
  }
  .ea-formula-swap span {
    display: block; font-size: .68rem; font-weight: 600; letter-spacing: .09em;
    text-transform: uppercase; color: var(--rsp-text-soft); margin-bottom: 6px;
  }
  .ea-formula-swap p { margin: 0; font-size: .84rem; line-height: 1.6; color: var(--rsp-text-muted); }

  /* ── SEO vs SEM side-by-side metrics ───────────────────────────────── */
  .ea-channels { max-width: 1000px; margin: 0 auto; display: grid; gap: 10px; }
  .ea-channels-head, .ea-channels-row {
    display: grid; grid-template-columns: 1fr 1.4fr 1.4fr; gap: 12px;
  }
  .ea-channels-head > div {
    font-size: .68rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-text-soft); padding: 0 4px;
  }
  .ea-channels-row {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 14px 16px; align-items: start;
  }
  .ea-channels-outcome { font-size: .88rem; font-weight: 600; color: var(--rsp-text); }
  .ea-channels-cell { font-size: .85rem; line-height: 1.6; color: var(--rsp-text-muted); }
  .ea-chan-tag {
    display: inline-block; margin-right: 6px; font-size: .62rem; font-weight: 700;
    letter-spacing: .08em; padding: 2px 6px; border-radius: 4px; vertical-align: 1px;
  }
  .ea-chan-tag.is-seo { background: oklch(94% .05 160); color: oklch(45% .12 160); }
  .ea-chan-tag.is-sem { background: oklch(94% .05 250); color: oklch(45% .12 265); }
  @media (max-width: 760px) {
    .ea-channels-head { display: none; }
    .ea-channels-row { grid-template-columns: 1fr; gap: 8px; }
  }

  /* ── Interactive capacity simulator ────────────────────────────────── */
  .ea-sim { max-width: 1000px; margin: 0 auto; }
  .ea-sim-controls {
    background: var(--rsp-bg-warm); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 20px; margin-bottom: 18px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
  }
  @media (max-width: 760px) { .ea-sim-controls { grid-template-columns: 1fr; } }
  .ea-sim-controls label { display: block; }
  .ea-sim-controls label > span {
    display: flex; justify-content: space-between; gap: 10px; align-items: baseline;
    font-size: .82rem; font-weight: 600; color: var(--rsp-text); margin-bottom: 8px;
  }
  .ea-sim-controls label > span strong { color: var(--rsp-primary); font-size: .95rem; }
  .ea-sim-controls input[type=range] { width: 100%; accent-color: var(--rsp-primary); }
  .ea-sim-controls small {
    display: block; margin-top: 6px; font-size: .74rem; line-height: 1.5; color: var(--rsp-text-soft);
  }
  .ea-sim-basis {
    grid-column: 1 / -1; margin: 0; font-size: .74rem; line-height: 1.55; color: var(--rsp-text-soft);
    border-top: 1px solid var(--rsp-border); padding-top: 12px;
  }
  .ea-sim-share {
    grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  }
  .ea-sim-share-btn, .ea-sim-reset-btn {
    font: inherit; font-size: .78rem; font-weight: 600; cursor: pointer;
    border-radius: 999px; padding: 8px 16px; border: 1px solid var(--rsp-border);
    background: var(--rsp-surface); color: var(--rsp-text);
    transition: background .15s ease, border-color .15s ease;
  }
  .ea-sim-share-btn { border-color: oklch(72% .12 250); }
  .ea-sim-share-btn:hover, .ea-sim-reset-btn:hover { background: var(--rsp-surface-2, oklch(97% .01 250)); }
  .ea-sim-share small, .ea-sim-share > small {
    flex: 1 1 260px; font-size: .72rem; line-height: 1.5; color: var(--rsp-text-soft);
  }
  .ea-sim-share code { font-size: .7rem; word-break: break-all; }
  .ea-pdf-download {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 20px;
    font-size: .82rem; font-weight: 600; text-decoration: none;
    border-radius: 999px; padding: 10px 18px;
    border: 1px solid oklch(72% .12 250);
    background: var(--rsp-surface); color: var(--rsp-text);
    transition: background .15s ease, border-color .15s ease;
  }
  .ea-pdf-download:hover { background: var(--rsp-surface-2, oklch(97% .01 250)); }

  .ea-sim-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 760px) { .ea-sim-grid { grid-template-columns: 1fr; } }
  .ea-sim-panel {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 20px;
  }
  .ea-sim-panel.is-good { border-color: oklch(80% .09 160); background: oklch(99% .012 160); }
  .ea-sim-panel-tag {
    font-size: .7rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 14px;
  }
  .ea-sim-panel.is-good .ea-sim-panel-tag { color: oklch(48% .12 160); }
  .ea-sim-metric {
    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
    font-size: .84rem; color: var(--rsp-text-muted); margin-top: 12px;
  }
  .ea-sim-metric strong { font-size: 1rem; color: var(--rsp-text); font-variant-numeric: tabular-nums; }
  .ea-sim-metric strong.is-bad { color: oklch(55% .17 28); }
  .ea-sim-metric strong.is-good { color: oklch(48% .12 160); }
  .ea-sim-bar {
    height: 7px; border-radius: 999px; background: var(--rsp-border);
    overflow: hidden; margin-top: 6px;
  }
  .ea-sim-bar-fill { height: 100%; border-radius: 999px; transition: width .25s var(--rsp-ease); }
  .ea-sim-verdict {
    margin: 16px 0 0; padding-top: 12px; border-top: 1px solid var(--rsp-border);
    font-size: .82rem; line-height: 1.6; color: var(--rsp-text-muted);
  }

  /* ── Asymmetry FAQ ─────────────────────────────────────────────────── */
  .ea-faq { max-width: 860px; margin: 0 auto; display: grid; gap: 10px; }
  .ea-faq-item {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 0 18px;
  }
  .ea-faq-item summary {
    cursor: pointer; list-style: none; padding: 15px 0; font-size: .92rem; font-weight: 600;
    color: var(--rsp-text); display: flex; justify-content: space-between; gap: 12px; align-items: center;
  }
  .ea-faq-item summary::-webkit-details-marker { display: none; }
  .ea-faq-item summary::after { content: '+'; color: var(--rsp-primary); font-size: 1.15rem; }
  .ea-faq-item[open] summary::after { content: '–'; }
  .ea-faq-body {
    padding: 0 0 16px; font-size: .87rem; line-height: 1.7; color: var(--rsp-text-muted);
    border-top: 1px solid var(--rsp-border); padding-top: 12px;
  }
  .ea-faq-body strong { color: var(--rsp-text); }
`;

export function EaStyles() {
  return <style dangerouslySetInnerHTML={{ __html: eaCss }} />;
}

export function EaSection({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string;
  eyebrow: ReactNode;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="rsp-section" id={id}>
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">{eyebrow}</div>
        <h2 className="rsp-h2">{title}</h2>
        {lead && <p className="rsp-lead">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

export type EaNavItem = { to: string; step: string; title: string; desc: string };

export const eaPages: EaNavItem[] = [
  {
    to: "/rsp/ethical-auction",
    step: "00",
    title: "Overview",
    desc: "Why ranking by budget alone breaks markets — and what replaces it.",
  },
  {
    to: "/rsp/ethical-auction/intent",
    step: "01",
    title: "Pooled intent",
    desc: "Rich real-time demand signals with the identifiable source burned on write.",
  },
  {
    to: "/rsp/ethical-auction/capacity",
    step: "02",
    title: "Capacity & workforce",
    desc: "Serviceability, stress-load and financial velocity as exposure valves.",
  },
  {
    to: "/rsp/ethical-auction/experience",
    step: "03",
    title: "Consumer experience",
    desc: "Neutral, vertical-congruent feedback that acts as a relief valve.",
  },
  {
    to: "/rsp/ethical-auction/equilibrium",
    step: "04",
    title: "Equilibrium score",
    desc: "The VES maths and how rotational prominence is calculated.",
  },
  {
    to: "/rsp/ethical-auction/adoption",
    step: "05",
    title: "Calibration & adoption",
    desc: "The 90-day sandbox, privacy guardrails and the case for adoption.",
  },
];

export function EaCards({ exclude }: { exclude?: string }) {
  return (
    <div className="ea-cards">
      {eaPages
        .filter((p) => p.to !== exclude)
        .map((p) => (
          <Link key={p.to} to={p.to} className="ea-card">
            <div className="ea-card-step">Section {p.step}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </Link>
        ))}
    </div>
  );
}
