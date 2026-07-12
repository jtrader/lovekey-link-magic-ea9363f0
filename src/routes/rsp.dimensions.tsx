import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp/dimensions")({
  head: () => ({
    meta: [
      { title: "RSP Dimensions — Consent, identity, presence & avatars · Love Key Link" },
      {
        name: "description",
        content:
          "The consent dimensions RSP tracks: permissions, identity context, presence, support signals, and avatar likeness — each scoped and revocable.",
      },
      { property: "og:title", content: "RSP Dimensions" },
      {
        property: "og:description",
        content:
          "Permissions, identity context, presence, support signals and avatar likeness — the consent dimensions RSP tracks.",
      },
    ],
  }),
  component: RspDimensions,
});

function RspDimensions() {
  return (
    <>
      <section className="rsp-section" id="consent">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Functional modules</div>
          <h2 className="rsp-h2">Consent, permissions and support routing.</h2>
          <p className="rsp-lead">
            RSP modules map directly to the Love Key data model and Help Network routing rules, while
            keeping protocol concepts out of the family UI.
          </p>
        </div>
        <div className="rsp-tier-grid">
          {[
            {
              n: "01",
              name: "Identity context",
              desc: "One core profile with hub memberships and contextual roles such as Dad, Coach or Trusted Contact.",
              supply: "users · profiles · hub_memberships",
            },
            {
              n: "02",
              name: "Permission defaults",
              desc: "Presence, location, calendar, emotional status, recovery access and admin rights are scoped per hub.",
              supply: "hub_roles · hub_permissions",
            },
            {
              n: "03",
              name: "Presence sync",
              desc: "Sensitive data is converted into respectful signals before synchronisation.",
              supply: "presence_states · work_contexts",
            },
            {
              n: "04",
              name: "Support routing",
              desc: "Support requests route to the right circle without broadcasting private distress to the wrong people.",
              supply: "support_requests · trusted_contacts",
            },
            {
              n: "05",
              name: "Consent ledger",
              desc: "Permission changes and support events become auditable without becoming surveillance dashboards.",
              supply: "consent_events · permission_audits",
            },
            {
              n: "06",
              name: "Participation status",
              desc: "Helpful participation can be recognised for access or governance without turning people into scores.",
              supply: "participation_signals · trust_statuses",
            },
          ].map((t) => (
            <div className="rsp-tier-card" key={t.name}>
              <div className="rsp-tier-num">{t.n}</div>
              <div className="rsp-tier-name">{t.name}</div>
              <div className="rsp-tier-desc">{t.desc}</div>
              <div className="rsp-tier-supply">{t.supply}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rsp-section" id="avatar-dimensions">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Represented identity</div>
          <h2 className="rsp-h2">The avatar dimension.</h2>
          <p className="rsp-lead">
            In an online climate of impersonation, voice cloning and AI stand-ins, a person's avatar
            is its own consent dimension — scoped, projected, and revocable like every other.
          </p>
        </div>
        <div className="rsp-tier-grid">
          {[
            {
              n: "01",
              name: "Why avatars matter",
              desc: "Reputation, relationships and trust increasingly ride on the avatar, not the raw account behind it.",
              supply: "identity · presence · persona",
            },
            {
              n: "02",
              name: "Current-climate stakes",
              desc: "Impersonation, deepfaked likeness, voice cloning and persona reuse blur the line between a real person and a copy.",
              supply: "likeness · voice · exposure",
            },
            {
              n: "03",
              name: "Likeness & voice grants",
              desc: "Visual and voice likeness is projected only with active, context-scoped consent — never a permanent grant.",
              supply: "likeness_grants · voice_grants",
            },
            {
              n: "04",
              name: "AI stand-ins",
              desc: "Whether an AI twin may speak or act for you is an explicit permission, applied per context and per session.",
              supply: "ai_twin · agency_delegation",
            },
            {
              n: "05",
              name: "Presence & appearance",
              desc: "Presence signals control how an avatar appears live to others, so being seen never means being surveilled.",
              supply: "presence_states · visibility",
            },
            {
              n: "06",
              name: "Revocation",
              desc: "A represented self is withdrawn the same way as any other grant — revoke consent and the projection stops.",
              supply: "consent_events · revocation",
            },
          ].map((t) => (
            <div className="rsp-tier-card" key={t.name}>
              <div className="rsp-tier-num">{t.n}</div>
              <div className="rsp-tier-name">{t.name}</div>
              <div className="rsp-tier-desc">{t.desc}</div>
              <div className="rsp-tier-supply">{t.supply}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rsp-section" id="reference">
        <style dangerouslySetInnerHTML={{ __html: tableCss }} />
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Structured reference</div>
          <h2 className="rsp-h2">The consent dimensions at a glance.</h2>
          <p className="rsp-lead">
            Every dimension RSP tracks is scoped and revocable. This table is the quick reference —
            what each dimension governs, a concrete example, and how it is withdrawn.
          </p>
        </div>
        <div className="rsp-table-wrap">
          <table className="rsp-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>What it governs</th>
                <th>Example</th>
                <th>Revocability</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  d: "Permissions & visibility",
                  g: "Which people or hubs can see which parts of your profile and data.",
                  e: "Let your care circle see your calendar, but not your location.",
                  r: "Revoke per grant; visibility stops immediately.",
                },
                {
                  d: "Identity context",
                  g: "Your core profile plus contextual roles resolved per hub.",
                  e: "You appear as \u201cCoach\u201d in one hub and \u201cDad\u201d in another.",
                  r: "Leave a hub or drop a role; context resolution updates.",
                },
                {
                  d: "Presence",
                  g: "How your live state (available, busy, quiet) is shown to others.",
                  e: "Show \u201cavailable\u201d to your household, nothing to everyone else.",
                  r: "Change or clear presence at any time; scoped per audience.",
                },
                {
                  d: "Identity exposure",
                  g: "Protection of visual and voice likeness against unwanted similarity.",
                  e: "An AI stand-in may read a message in your voice only during a session.",
                  r: "Session- or time-bounded; revoke and the likeness stops projecting.",
                },
                {
                  d: "Support signals",
                  g: "How a request for help routes to the right circle without broadcasting distress.",
                  e: "A quiet \u201cneed help\u201d reaches your emergency circle only.",
                  r: "Withdraw the signal; routing ends and nothing is retained as a score.",
                },
              ].map((row) => (
                <tr key={row.d}>
                  <td data-label="Dimension">
                    <strong>{row.d}</strong>
                  </td>
                  <td data-label="What it governs">{row.g}</td>
                  <td data-label="Example">{row.e}</td>
                  <td data-label="Revocability">{row.r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

const tableCss = `
  .rsp-table-wrap { max-width: 1000px; margin: 0 auto; overflow-x: auto; }
  .rsp-table {
    width: 100%; border-collapse: collapse; font-size: .88rem;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); overflow: hidden;
  }
  .rsp-table th {
    text-align: left; font-size: .72rem; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: var(--rsp-text-muted);
    background: var(--rsp-bg-warm); padding: 14px 16px;
    border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-table td {
    padding: 14px 16px; vertical-align: top; color: var(--rsp-text-muted);
    line-height: 1.55; border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-table tr:last-child td { border-bottom: none; }
  .rsp-table td strong { color: var(--rsp-text); font-weight: 600; }
  @media (max-width: 720px) {
    .rsp-table, .rsp-table thead, .rsp-table tbody, .rsp-table tr, .rsp-table td { display: block; width: 100%; }
    .rsp-table thead { display: none; }
    .rsp-table tr { border-bottom: 1px solid var(--rsp-border-strong); padding: 8px 0; }
    .rsp-table tr:last-child { border-bottom: none; }
    .rsp-table td { border: none; padding: 6px 16px; }
    .rsp-table td::before {
      content: attr(data-label); display: block;
      font-size: .68rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
      color: var(--rsp-text-soft); margin-bottom: 2px;
    }
  }
`;

