import { definePage } from "@/lib/router";

export const Route = definePage("/rsp/governance")({
  head: () => ({
    meta: [
      { title: "RSP Governance — Tiers, credits & the burn clause · Love Key Link" },
      {
        name: "description",
        content:
          "How RSP is governed: the NFT tier structure, service-credit specification, and the v1.6 burn clause that mandates destroying identifiable source data.",
      },
      { property: "og:title", content: "RSP Governance" },
      {
        property: "og:description",
        content: "NFT tiers, service credits and the burn clause that governs RSP.",
      },
    ],
  }),
  component: RspGovernance,
});

function RspGovernance() {
  return (
    <>
      <section className="rsp-burn-section" id="burn">
        <div className="rsp-burn-inner">
          <div>
            <div className="rsp-burn-label">Key Clause — v1.6</div>
            <div className="rsp-burn-quote">
              When behaviour is translated into a signal, <em>burn the identifiable source.</em>
            </div>
            <p className="rsp-burn-body">
              When user behaviour is translated, synchronised, aggregated, or converted into a
              protocol signal, any identifiable source information should be removed, destroyed,
              cryptographically erased, or irreversibly decoupled as soon as it is no longer
              necessary — unless retention is required by law, explicit consent, safety, or
              legitimate accountability.
            </p>
          </div>
          <div>
            {[
              {
                n: "1",
                title: "Translate behaviour",
                desc: "Raw events converted to weighted, low-resolution signals",
              },
              {
                n: "2",
                title: "Synchronise the signal",
                desc: "Aggregate to a node state — resonant, friction, cooling, etc.",
              },
              {
                n: "3",
                title: "Burn the identifiable source",
                desc: "Delete, anonymise, cryptographically erase, or irreversibly decouple",
              },
            ].map((s) => (
              <div className="rsp-burn-step" key={s.n}>
                <div className="rsp-burn-step-num">{s.n}</div>
                <div>
                  <div className="rsp-burn-step-title">{s.title}</div>
                  <div className="rsp-burn-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rsp-section" id="tiers">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">NFT tier structure</div>
          <h2 className="rsp-h2">Provenance, access & certification</h2>
          <p className="rsp-lead">
            RSP NFTs are utility tokens — provenance, access, participation, and certification. Not
            investment products.
          </p>
        </div>
        <div className="rsp-tier-grid">
          {[
            {
              n: "0",
              name: "Genesis NFT",
              desc: "Origin, provenance, and symbolic protocol anchor.",
              supply: "Supply: 1",
              genesis: true,
            },
            {
              n: "1",
              name: "Founder Pass",
              desc: "Early supporter access, private updates, feedback windows.",
              supply: "Supply: 25–100 · 100 credits",
              genesis: false,
            },
            {
              n: "2",
              name: "Builder Pass",
              desc: "SDK access, templates, checklists, priority review.",
              supply: "Supply: 100–500 · 250 credits",
              genesis: false,
            },
            {
              n: "3",
              name: "Certification Badge",
              desc: "Verifiable credential for RSP-aligned people or systems.",
              supply: "Issued after review",
              genesis: false,
            },
            {
              n: "4",
              name: "Partner Licence",
              desc: "Commercial partner and brand-use licence marker.",
              supply: "Approval-based",
              genesis: false,
            },
            {
              n: "5",
              name: "Audit Token",
              desc: "Proof of completed review, workshop, or assessment.",
              supply: "Service-based issuance",
              genesis: false,
            },
            {
              n: "6",
              name: "Event Token",
              desc: "Signal proof that coordination happened. Source identity burned at mint.",
              supply: "Unbounded · auto-minted",
              genesis: false,
            },
          ].map((t) => (
            <div className={`rsp-tier-card${t.genesis ? " genesis" : ""}`} key={t.n}>
              <div className="rsp-tier-num">{t.n}</div>
              <div className="rsp-tier-name">{t.name}</div>
              <div className="rsp-tier-desc">{t.desc}</div>
              <div className="rsp-tier-supply">{t.supply}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rsp-signal-section" id="credits">
        <div className="rsp-signal-inner">
          <div className="rsp-section-header">
            <div className="rsp-eyebrow">Service-credit specification</div>
            <h2 className="rsp-h2">Utility-first credits, documented only.</h2>
            <p className="rsp-lead">
              RSP credits are described here as service accounting primitives for certification,
              review, partner onboarding and governance work. This page is technical documentation,
              not a consumer sales funnel.
            </p>
          </div>
          <div className="rsp-credits-grid">
            {[
              {
                key: "standard",
                name: "Standard RSP review",
                credits: "100 credits",
                desc: "Framework review against privacy by destruction, weighted signals, non-coercive synchronisation, consent architecture and burn-clause compliance.",
              },
              {
                key: "full",
                name: "Full review + badge issuance",
                credits: "250 credits",
                desc: "Formal assessment with an RSP Certification Badge after review. Intended for products, platforms and organisations demonstrating RSP alignment.",
              },
              {
                key: "partner",
                name: "Partner certification",
                credits: "1,000 credits",
                desc: "Enterprise-scale review for partners building on RSP, including registry alignment and governance participation rules.",
              },
              {
                key: "certifier",
                name: "Certifier licence",
                credits: "1,000 credits",
                desc: "Licence model for approved reviewers who issue RSP Certification Badges under documented governance rules.",
              },
            ].map((c) => (
              <div className="rsp-credit-card" key={c.key}>
                <div className="rsp-credit-name">{c.name}</div>
                <div className="rsp-credit-credits">{c.credits}</div>
                <div className="rsp-credit-note">{c.desc}</div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: ".78rem",
              color: "var(--rsp-text-muted)",
              marginTop: 16,
            }}
          >
            Credits are not cash, not fiat-redeemable and not investment products. Any activation
            must follow legal, financial, privacy and security review.
          </p>
        </div>
      </section>

      <section className="rsp-section" id="versioning">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Maintenance & versioning</div>
          <h2 className="rsp-h2">How RSP is maintained.</h2>
          <p className="rsp-lead">
            RSP is a living specification. It is versioned so that anyone building on it — inside or
            beyond the Love Key ecosystem — can rely on a known reference point.
          </p>
        </div>
        <div className="rsp-tier-grid">
          {[
            {
              n: "v1.6",
              name: "Current version",
              desc: "The active specification, including the burn clause that mandates destroying identifiable source data.",
              supply: "Reference: RSP v1.6",
            },
            {
              n: "01",
              name: "Who maintains it",
              desc: "RSP is maintained by the Love Key core team, with principles anchored across the HELP Network and Twinly.",
              supply: "Love Key · HELP Network",
            },
            {
              n: "02",
              name: "How it changes",
              desc: "Principles and the spec evolve through reviewed, documented revisions — changes are additive and backward-aware, never silent.",
              supply: "reviewed · documented",
            },
            {
              n: "03",
              name: "Versioning approach",
              desc: "Semantic-style version numbers signal the scope of a change so integrators know what a new release affects.",
              supply: "major · minor · patch",
            },
            {
              n: "04",
              name: "Adoption beyond Love Key",
              desc: "RSP is written to be adoptable by other products and teams, so the spec is kept stable and portable.",
              supply: "portable · referenceable",
            },
            {
              n: "05",
              name: "Change log",
              desc: "Each version records what changed and why, so the trust proposition can be audited over time.",
              supply: "consent_events · spec_history",
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
    </>
  );
}

