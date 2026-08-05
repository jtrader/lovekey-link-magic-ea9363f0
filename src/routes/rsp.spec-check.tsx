import { createFileRoute, Link } from "@tanstack/react-router";

// Internal QA view — verifies each of the 9 canonical RSP routes against the
// site spec (rsp-official-site-prompt.md) and flags remaining gaps.
// Not linked from public navigation; excluded from search indexing.

export const Route = createFileRoute("/rsp/spec-check")({
  head: () => ({
    meta: [
      { title: "RSP Spec Checklist (internal)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SpecCheck,
});

type Status = "met" | "partial" | "gap";

type Check = {
  label: string;
  status: Status;
  note?: string;
};

type RouteAudit = {
  path: string;
  to: string;
  title: string;
  specSummary: string;
  checks: Check[];
};

const audit: RouteAudit[] = [
  {
    path: "/rsp",
    to: "/rsp",
    title: "Landing",
    specSummary: "What RSP is, why it exists — a trust document as much as a spec.",
    checks: [
      { label: "Plain-language lead (consent + coordination layer, not jargon)", status: "met" },
      { label: 'Explicit "what RSP is not" trust section', status: "met", note: "#what-rsp-is — not surveillance / not data-selling / not silent." },
      { label: "Links out to all sub-sections", status: "met", note: "Area menus + in-page links." },
      {
        label: "Established RSP brand (metallic red ring, Orbitron/IBM Plex, circuit aesthetic)",
        status: "partial",
        note: "Uses DM Serif / DM Sans + red ring mark. Orbitron/IBM Plex + circuit motif from the brand kit not applied.",
      },
    ],
  },
  {
    path: "/rsp/principles",
    to: "/rsp/principles",
    title: "Core principles",
    specSummary: "Each principle stated plainly, one paragraph each.",
    checks: [
      { label: "Synchronisation without coercion", status: "met" },
      { label: "Presence without surveillance", status: "met" },
      { label: "Consent as living/revocable state", status: "met" },
      { label: "Minimisation by default", status: "met" },
      {
        label: "Law of Vibration Who/What/Where framework",
        status: "met",
        note: "Spec says default to keeping this internal unless directed — intentionally omitted (by design).",
      },
    ],
  },
  {
    path: "/rsp/how-it-works",
    to: "/rsp/how-it-works",
    title: "How it works",
    specSummary: "Plain-language mechanics with a concrete worked example.",
    checks: [
      { label: "Walkthrough of grants, identity context, revocation, presence", status: "met" },
      { label: "At least one concrete worked example", status: "met", note: '"Worked example" block present.' },
      { label: "Technical deep-dive link to /rsp/for-developers", status: "met" },
    ],
  },
  {
    path: "/rsp/dimensions",
    to: "/rsp/dimensions",
    title: "Dimensions",
    specSummary: "Structured reference table: dimension · governs · example · revocability.",
    checks: [
      { label: "Structured reference table (not just prose)", status: "met", note: "#reference table with revocability column." },
      {
        label: "Grant schema pulled from actual @rsp/core source",
        status: "gap",
        note: "@rsp/core is not vendored in this repo; dimensions are described from the spec, not verified against the live grant schema.",
      },
    ],
  },
  {
    path: "/rsp/implementations",
    to: "/rsp/implementations",
    title: "Implementations",
    specSummary: "Where RSP is deployed and what it governs in each case.",
    checks: [
      { label: "Lists Twinly + HELP Network deployments", status: "met" },
      { label: "Structured so new entries are easy to add", status: "met" },
      {
        label: 'Explicit "keep current / may go stale" flag',
        status: "partial",
        note: "No visible freshness/last-reviewed note prompting updates when a new product integrates RSP.",
      },
    ],
  },
  {
    path: "/rsp/event-token",
    to: "/rsp/event-token",
    title: "Event Token",
    specSummary: "Plain-language subsystem summary + link to existing whitepaper.",
    checks: [
      { label: "ERC-721 on Base summary", status: "met" },
      { label: "Links to existing whitepaper (not re-written)", status: "met" },
      { label: "Plain-language explanation for non-technical visitor", status: "met" },
    ],
  },
  {
    path: "/rsp/for-developers",
    to: "/rsp/for-developers",
    title: "For developers",
    specSummary: "Real @rsp/core + @rsp/react API docs, install, integration quickstart.",
    checks: [
      {
        label: "API reference reflects actual package APIs (verified vs source)",
        status: "gap",
        note: "Non-negotiable. @rsp/core (8 modules) and @rsp/react (3 hooks / 4 components) are not present in this repo, so documented signatures are not verified against source.",
      },
      {
        label: "Install uses file: dependency convention",
        status: "partial",
        note: "Shows npm install; spec calls for the file: monorepo convention.",
      },
      {
        label: "Integration quickstart (add grant · check permission · handle revocation)",
        status: "gap",
        note: "No end-to-end quickstart using real package APIs found.",
      },
    ],
  },
  {
    path: "/rsp/governance",
    to: "/rsp/governance",
    title: "Governance",
    specSummary: "Who maintains RSP, how it changes, versioning approach.",
    checks: [
      { label: "Maintainer + change process documented", status: "met", note: "#versioning section." },
      { label: "Explicit version number", status: "met", note: "RSP v1.6." },
      { label: "Written with external-adopter possibility in mind", status: "met" },
    ],
  },
  {
    path: "/rsp/faq",
    to: "/rsp/faq",
    title: "FAQ",
    specSummary: "Plain-language Q&A, cross-linked to the actual privacy policy.",
    checks: [
      { label: "Covers cross-site data, revocation, leaving a product", status: "met" },
      { label: "Clarifies RSP-vs-privacy-policy distinction", status: "met" },
      {
        label: "Cross-linked to the site's actual privacy policy",
        status: "gap",
        note: "Explains the relationship in prose but does not link to a real privacy-policy URL (awaiting the canonical /privacy link).",
      },
    ],
  },
];

const nonNegotiables: Check[] = [
  { label: "No content overstates what RSP guarantees", status: "met", note: "Manual review — honesty standard held across pages." },
  { label: "Written for a general audience first", status: "met" },
  {
    label: "Developer docs reflect actual package APIs (not invented)",
    status: "gap",
    note: "See /rsp/for-developers — packages not vendored, so APIs are unverified.",
  },
  {
    label: "Cross-reference rather than duplicate",
    status: "partial",
    note: "Whitepaper is linked ✓; privacy policy is not yet linked ✗.",
  },
];

const STATUS_META: Record<Status, { icon: string; label: string; cls: string }> = {
  met: { icon: "✓", label: "Met", cls: "ok" },
  partial: { icon: "◑", label: "Partial", cls: "warn" },
  gap: { icon: "✕", label: "Gap", cls: "gap" },
};

function countBy(checks: Check[], status: Status) {
  return checks.filter((c) => c.status === status).length;
}

const css = `
  .sc-wrap { max-width: 1100px; margin: 0 auto; padding: 48px 2rem 96px; }
  .sc-head { margin-bottom: 8px; }
  .sc-badge {
    display: inline-flex; align-items: center; gap: 8px; font-size: .72rem; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase; color: var(--rsp-text-muted);
    background: var(--rsp-bg-warm); border: 1px solid var(--rsp-border); border-radius: 999px;
    padding: 5px 14px; margin-bottom: 18px;
  }
  .sc-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -.02em; margin: 0 0 10px; }
  .sc-sub { color: var(--rsp-text-muted); max-width: 640px; margin-bottom: 28px; }

  .sc-summary { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; }
  .sc-stat {
    flex: 1 1 150px; border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    background: var(--rsp-surface); padding: 16px 18px;
  }
  .sc-stat-num { font-size: 1.8rem; font-weight: 600; line-height: 1; }
  .sc-stat-label { font-size: .78rem; color: var(--rsp-text-muted); margin-top: 6px; }
  .sc-stat.ok .sc-stat-num { color: oklch(58% .15 150); }
  .sc-stat.warn .sc-stat-num { color: oklch(70% .16 75); }
  .sc-stat.gap .sc-stat-num { color: var(--rsp-primary); }

  .sc-card {
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    background: var(--rsp-surface); padding: 22px 24px; margin-bottom: 16px;
  }
  .sc-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .sc-card-title { font-size: 1.1rem; font-weight: 600; }
  .sc-card-title a { color: inherit; text-decoration: none; }
  .sc-card-title a:hover { color: var(--rsp-primary); }
  .sc-card-path { font-size: .8rem; color: var(--rsp-text-soft); font-family: ui-monospace, monospace; }
  .sc-card-spec { font-size: .84rem; color: var(--rsp-text-muted); margin: 6px 0 16px; }
  .sc-pill {
    font-size: .68rem; font-weight: 700; letter-spacing: .04em; padding: 3px 9px; border-radius: 999px; white-space: nowrap;
  }
  .sc-pill.ok { color: oklch(42% .13 150); background: oklch(95% .04 150); }
  .sc-pill.warn { color: oklch(45% .13 75); background: oklch(96% .05 80); }
  .sc-pill.gap { color: oklch(45% .18 25); background: var(--rsp-primary-light); }

  .sc-checks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .sc-check { display: flex; gap: 12px; align-items: flex-start; }
  .sc-icon {
    flex: none; width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center;
    font-size: .8rem; font-weight: 700; margin-top: 1px;
  }
  .sc-icon.ok { color: oklch(42% .13 150); background: oklch(94% .05 150); }
  .sc-icon.warn { color: oklch(45% .13 75); background: oklch(95% .06 80); }
  .sc-icon.gap { color: #fff; background: var(--rsp-primary); }
  .sc-check-body { font-size: .9rem; }
  .sc-check-label { color: var(--rsp-text); }
  .sc-check-note { display: block; font-size: .8rem; color: var(--rsp-text-muted); margin-top: 3px; }

  .sc-section-label {
    font-size: .78rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin: 40px 0 14px;
  }
`;

function ChecksList({ checks }: { checks: Check[] }) {
  return (
    <ul className="sc-checks">
      {checks.map((c) => {
        const s = STATUS_META[c.status];
        return (
          <li key={c.label} className="sc-check">
            <span className={`sc-icon ${s.cls}`} aria-label={s.label}>{s.icon}</span>
            <span className="sc-check-body">
              <span className="sc-check-label">{c.label}</span>
              {c.note && <span className="sc-check-note">{c.note}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function SpecCheck() {
  const allChecks = [...audit.flatMap((r) => r.checks), ...nonNegotiables];
  const met = countBy(allChecks, "met");
  const partial = countBy(allChecks, "partial");
  const gap = countBy(allChecks, "gap");

  return (
    <div className="sc-wrap">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="sc-head">
        <span className="sc-badge">Internal · not indexed</span>
        <h1 className="sc-title">RSP spec checklist</h1>
        <p className="sc-sub">
          Verifies each of the 9 canonical routes against the RSP site spec and flags
          remaining gaps. Update as pages change — this view is not linked from public navigation.
        </p>
      </div>

      <div className="sc-summary">
        <div className="sc-stat ok"><div className="sc-stat-num">{met}</div><div className="sc-stat-label">Met</div></div>
        <div className="sc-stat warn"><div className="sc-stat-num">{partial}</div><div className="sc-stat-label">Partial</div></div>
        <div className="sc-stat gap"><div className="sc-stat-num">{gap}</div><div className="sc-stat-label">Gaps</div></div>
        <div className="sc-stat"><div className="sc-stat-num">{audit.length}</div><div className="sc-stat-label">Routes audited</div></div>
      </div>

      {audit.map((r) => {
        const worst: Status = countBy(r.checks, "gap") > 0 ? "gap" : countBy(r.checks, "partial") > 0 ? "partial" : "met";
        const s = STATUS_META[worst];
        return (
          <div key={r.path} className="sc-card">
            <div className="sc-card-head">
              <div>
                <div className="sc-card-title">
                  <Link to={r.to}>{r.title}</Link> <span className="sc-card-path">{r.path}</span>
                </div>
              </div>
              <span className={`sc-pill ${s.cls}`}>{s.label}</span>
            </div>
            <p className="sc-card-spec">{r.specSummary}</p>
            <ChecksList checks={r.checks} />
          </div>
        );
      })}

      <div className="sc-section-label">Non-negotiables (sitewide)</div>
      <div className="sc-card">
        <ChecksList checks={nonNegotiables} />
      </div>
    </div>
  );
}
