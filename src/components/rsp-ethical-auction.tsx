import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

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
