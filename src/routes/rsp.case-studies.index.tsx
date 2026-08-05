import { createRouteFn, Link } from "@/lib/tanstack-shim";
import { caseStudies } from "@/lib/case-studies";

export const Route = createRouteFn("/rsp/case-studies/")({
  head: () => ({
    meta: [
      { title: "RSP Case Studies — RSP in production · Love Key Link" },
      {
        name: "description",
        content:
          "Concrete examples of RSP in production: how real products use consent grants, revocability, and identity-exposure controls to protect people.",
      },
      { property: "og:title", content: "RSP Case Studies" },
      {
        property: "og:description",
        content: "Real products, real RSP dimensions — the concrete-example counterpart to Implementations.",
      },
    ],
  }),
  component: RspCaseStudies,
});

const css = `
  .rsp-cs-grid { display: flex; flex-direction: column; gap: 18px; max-width: 820px; margin: 0 auto; }
  .rsp-cs-card {
    display: block; text-decoration: none; text-align: left;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 28px 30px;
    transition: border-color .2s, transform .25s var(--rsp-ease), box-shadow .25s var(--rsp-ease);
  }
  .rsp-cs-card:hover {
    border-color: var(--rsp-border-strong); transform: translateY(-2px);
    box-shadow: 0 18px 40px -28px color-mix(in oklab, var(--rsp-primary) 45%, transparent);
  }
  .rsp-cs-card-top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
  .rsp-cs-name { font-family: 'DM Serif Display', serif; font-size: 1.5rem; letter-spacing: -.02em; color: var(--rsp-text); }
  .rsp-cs-arrow { font-size: .82rem; font-weight: 500; color: var(--rsp-primary); white-space: nowrap; }
  .rsp-cs-summary { font-size: .92rem; line-height: 1.65; color: var(--rsp-text-muted); margin: 0 0 16px; }
  .rsp-cs-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .rsp-cs-tag {
    font-size: .72rem; font-weight: 500; color: var(--rsp-primary);
    background: var(--rsp-primary-light); border: 1px solid oklch(88% .018 25);
    border-radius: 999px; padding: 4px 12px;
  }
`;

function RspCaseStudies() {
  return (
    <>
      <style>{css}</style>
      <section className="rsp-section" id="case-studies">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Case studies</div>
          <h2 className="rsp-h2">RSP in production</h2>
          <p className="rsp-lead">
            The concrete-example counterpart to{" "}
            <Link to="/rsp/implementations" style={{ color: "var(--rsp-primary)" }}>
              Implementations
            </Link>
            : real products showing which RSP dimensions they put to work, and how.
          </p>
        </div>

        <div className="rsp-cs-grid">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              to="/rsp/case-studies/$slug"
              params={{ slug: cs.slug }}
              className="rsp-cs-card"
            >
              <div className="rsp-cs-card-top">
                <span className="rsp-cs-name">{cs.product}</span>
                <span className="rsp-cs-arrow">Read case study →</span>
              </div>
              <p className="rsp-cs-summary">{cs.summary}</p>
              <div className="rsp-cs-tags">
                {cs.dimensions.map((d) => (
                  <span className="rsp-cs-tag" key={d}>
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
