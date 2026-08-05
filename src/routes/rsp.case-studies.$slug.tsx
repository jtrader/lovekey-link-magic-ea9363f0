import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCaseStudy, type CaseStudyApplication } from "@/lib/case-studies";

export const Route = createFileRoute("/rsp/case-studies/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    const study = loaderData?.study;
    return {
      meta: study
        ? [
            { title: `${study.product} — RSP Case Study · Love Key Link` },
            { name: "description", content: study.summary },
            { property: "og:title", content: `${study.product} — RSP Case Study` },
            { property: "og:description", content: study.summary },
          ]
        : [{ title: "Case study not found · Love Key Link" }],
    };
  },
  component: CaseStudyPage,
  notFoundComponent: () => (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Case studies</div>
        <h2 className="rsp-h2">Case study not found</h2>
        <p className="rsp-lead">
          <Link to="/rsp/case-studies" style={{ color: "var(--rsp-primary)" }}>
            ← Back to all case studies
          </Link>
        </p>
      </div>
    </section>
  ),
  errorComponent: () => (
    <section className="rsp-section">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Case studies</div>
        <h2 className="rsp-h2">Something went wrong</h2>
        <p className="rsp-lead">
          <Link to="/rsp/case-studies" style={{ color: "var(--rsp-primary)" }}>
            ← Back to all case studies
          </Link>
        </p>
      </div>
    </section>
  ),
});

const css = `
  .rsp-csd-wrap { max-width: 820px; margin: 0 auto; }
  .rsp-csd-back { display: inline-block; font-size: .82rem; font-weight: 500; color: var(--rsp-primary); text-decoration: none; margin-bottom: 24px; }
  .rsp-csd-back:hover { text-decoration: underline; }
  .rsp-csd-overview {
    font-size: 1rem; line-height: 1.75; color: var(--rsp-text-muted);
    padding: 24px 28px; background: var(--rsp-bg-warm);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    margin-bottom: 40px;
  }
  .rsp-csd-app { margin-top: 40px; padding-top: 40px; border-top: 1px solid var(--rsp-border); }
  .rsp-csd-app:first-of-type { border-top: none; padding-top: 0; }
  .rsp-csd-app-eyebrow {
    font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 8px;
  }
  .rsp-csd-app-title { font-family: 'DM Serif Display', serif; font-size: 1.7rem; letter-spacing: -.02em; color: var(--rsp-text); margin: 0 0 10px; }
  .rsp-csd-app-summary { font-size: .95rem; line-height: 1.65; color: var(--rsp-text-muted); margin: 0 0 24px; }
  .rsp-csd-frame { display: flex; flex-direction: column; gap: 2px; }
  .rsp-csd-row {
    display: grid; grid-template-columns: 120px 1fr; gap: 20px;
    padding: 18px 0; border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-csd-row:last-child { border-bottom: none; }
  .rsp-csd-key {
    font-family: 'DM Serif Display', serif; font-size: 1.15rem; color: var(--rsp-primary);
  }
  .rsp-csd-val { font-size: .92rem; line-height: 1.7; color: var(--rsp-text); margin: 0; }
  .rsp-csd-links {
    margin-top: 48px; padding: 24px 28px; background: var(--rsp-surface);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
  }
  .rsp-csd-links-title { font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--rsp-text-soft); margin: 0 0 14px; }
  .rsp-csd-links-list { display: flex; flex-wrap: wrap; gap: 12px; }
  .rsp-csd-links-list a {
    font-size: .88rem; font-weight: 500; color: var(--rsp-primary);
    background: var(--rsp-primary-light); border: 1px solid oklch(88% .018 25);
    border-radius: 999px; padding: 8px 16px; text-decoration: none; transition: background .2s;
  }
  .rsp-csd-links-list a:hover { background: oklch(93% .016 25); }
  @media (max-width: 640px) {
    .rsp-csd-row { grid-template-columns: 1fr; gap: 4px; }
  }
`;

const FRAME_ORDER: { key: keyof CaseStudyApplication; label: string }[] = [
  { key: "who", label: "Who" },
  { key: "what", label: "What" },
  { key: "when", label: "When" },
  { key: "where", label: "Where" },
  { key: "how", label: "How" },
  { key: "why", label: "Why" },
];

function CaseStudyPage() {
  const { study } = Route.useLoaderData();

  return (
    <>
      <style>{css}</style>
      <section className="rsp-section">
        <div className="rsp-csd-wrap">
          <Link to="/rsp/case-studies" className="rsp-csd-back">
            ← All case studies
          </Link>

          <div className="rsp-eyebrow">Case study</div>
          <h1 className="rsp-h2" style={{ marginBottom: 16 }}>
            {study.productUrl ? (
              <a
                href={study.productUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {study.product}
              </a>
            ) : (
              study.product
            )}
          </h1>

          <p className="rsp-csd-overview">{study.overview}</p>

          {study.applications.map((app: CaseStudyApplication, i: number) => (
            <div className="rsp-csd-app" key={app.title}>
              <div className="rsp-csd-app-eyebrow">Application {i + 1}</div>
              <h2 className="rsp-csd-app-title">{app.title}</h2>
              <p className="rsp-csd-app-summary">{app.summary}</p>
              <div className="rsp-csd-frame">
                {FRAME_ORDER.map(({ key, label }) => (
                  <div className="rsp-csd-row" key={key}>
                    <div className="rsp-csd-key">{label}</div>
                    <p className="rsp-csd-val">{app[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rsp-csd-links">
            <p className="rsp-csd-links-title">Related concepts</p>
            <div className="rsp-csd-links-list">
              <Link to="/rsp/dimensions">RSP Dimensions</Link>
              <Link to="/rsp/implementations">Implementations</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
