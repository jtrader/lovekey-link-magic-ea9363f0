import type { ReactNode } from "react";

/* ── Citations & inline footnotes for the VEO branch ───────────────────────
   A single shared registry so every formula, glossary term and ideological
   claim across the branch points at the same numbered source note.        */

export type EaNote = { id: string; label: string; body: string };

export const EA_NOTES: EaNote[] = [
  {
    id: "adrank",
    label: "Ad Rank baseline",
    body:
      "Legacy paid formula. Ad Rank ≈ Bid Amount × Quality Score (plus ad-format and context adjustments). Google Ads Help, \"About Ad Rank\". VEO adds the Respectful Intent Score as a third multiplier rather than replacing either existing term.",
  },
  {
    id: "organic",
    label: "Organic position baseline",
    body:
      "Legacy organic formula. Position ≈ Relevance × Authority, where authority is accumulated historically (links, domain age, brand signals). Because authority is a stock rather than a flow, incumbents retain free prominence even when their present capacity to serve has collapsed — the asymmetry this branch corrects.",
  },
  {
    id: "ris",
    label: "Respectful Intent Score (RIS)",
    body:
      "RSP-derived multiplier, defined in this specification. Composed of sensitivity-aware monetisation, low-resolution intent, signal decay & burn integrity, and deterministic next safe step. Range 0–1.5; it cannot be bought with budget or backlink history. See /rsp/principles.",
  },
  {
    id: "ves",
    label: "Vertical Equilibrium Score (VES)",
    body:
      "VES = Relevance × Consumer Experience × Workforce Headroom × Financial Velocity, all anonymised and decayed. Defined in full at /rsp/ethical-auction/equilibrium and in the @rsp/macro glossary.",
  },
  {
    id: "asymmetry",
    label: "The tuned asymmetry",
    body:
      "Ideological premise of this branch: dominant vertical players are ranked organically — at zero marginal cost — for demand they cannot service, while capable operators with real availability must pay per click to be seen. VEO withdraws unearned free prominence first and eases bids second.",
  },
  {
    id: "telemetry",
    label: "Tripartite telemetry",
    body:
      "Workforce stress, financial velocity and consumer serviceability, collected as low-resolution state signals with raw events burned on write and dormant signals auto-deleted after 90 days. See /rsp/ethical-auction/capacity.",
  },
  {
    id: "calibration",
    label: "Calibration timeline",
    body:
      "Mandatory 90-day sandbox — Month 1 equal exposure diagnostics, Month 2 UI/UX remediation, Month 3 telemetry sync — with the Rotational Equilibrium Engine activating on Day 91. See /rsp/ethical-auction/adoption.",
  },
  {
    id: "rotational",
    label: "Rotational exposure",
    body:
      "Prominence is re-earned each cycle rather than held. Applies identically to organic results and paid placements, so no channel can be used to route around a saturation signal.",
  },
];

const INDEX = new Map(EA_NOTES.map((n, i) => [n.id, { n, num: i + 1 }]));

/** Inline superscript citation marker linking to the notes list. */
export function EaRef({ id }: { id: string }) {
  const hit = INDEX.get(id);
  if (!hit) return null;
  return (
    <sup className="ea-ref">
      <a href={`#ea-note-${hit.n.id}`} title={`${hit.n.label} — ${hit.n.body}`}>
        [{hit.num}]
      </a>
    </sup>
  );
}

/** The numbered notes / sources list. Render once per page, near the bottom. */
export function EaNotesList({
  only,
  heading = "Notes & sources",
  intro = "Every formula, glossary term and ideological claim on this page is grounded below.",
}: {
  only?: string[];
  heading?: string;
  intro?: ReactNode;
}) {
  const items = only
    ? only.map((id) => INDEX.get(id)).filter(Boolean).map((h) => h!)
    : EA_NOTES.map((n, i) => ({ n, num: i + 1 }));

  return (
    <aside className="ea-notes" aria-label={heading}>
      <div className="ea-notes-head">{heading}</div>
      {intro && <p className="ea-notes-intro">{intro}</p>}
      <ol className="ea-notes-list">
        {items.map(({ n, num }) => (
          <li key={n.id} id={`ea-note-${n.id}`} value={num}>
            <strong>{n.label}.</strong> {n.body}
          </li>
        ))}
      </ol>
    </aside>
  );
}
