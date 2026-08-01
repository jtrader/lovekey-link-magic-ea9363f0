import { createFileRoute, Link } from "@tanstack/react-router";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction/adoption")({
  head: () => ({
    meta: [
      { title: "Calibration & adoption — Ethical Auction · Love Key Link" },
      {
        name: "description",
        content:
          "The ninety-day calibration sandbox, the ten-player participation threshold, privacy governance, and why search engines and businesses would adopt the standard.",
      },
      { property: "og:title", content: "Calibration & adoption" },
      {
        property: "og:description",
        content:
          "Equal exposure, remediation, telemetry baselining — then live rotational equilibrium, with governance rules that make it safe.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction/adoption" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction/adoption" }],
  }),
  component: AdoptionPage,
});

function AdoptionPage() {
  return (
    <>
      <EaSection
        eyebrow="Section 05 · Onboarding"
        title="A vertical joins together, or not at all."
        lead="The model is only meaningful once roughly ten participants — a full first page of results — are in the pool. Below that threshold rotation simply hands share to whoever is left, which is not equilibrium. Above it, the vertical behaves like a coordinated service division with a shared floor and a shared ceiling."
      >
        <div className="ea-timeline">
          {[
            {
              tag: "Days 1 – 30",
              t: "Equal exposure sandbox",
              b: "Every participant receives identical organic and paid impression volume. Conversion data reveals the mean diversion delta — the specific technical, speed and interface friction points separating the strongest pages from the weakest.",
            },
            {
              tag: "Days 31 – 60",
              t: "Remediation to the vertical mean",
              b: "Each business receives a private diagnostic report and fixes its landing page bottlenecks. The floor of the entire pool rises, which is the part search engines benefit from most.",
            },
            {
              tag: "Days 61 – 90",
              t: "Telemetry baseline calibration",
              b: "Anonymised accounting histories and workforce shift patterns are ingested to set normative standard deviations for stress, target velocity and consumer experience. Seasonal businesses calibrate across a longer window.",
            },
            {
              tag: "Day 91 onward",
              t: "Live rotational equilibrium",
              b: "The engine goes live. Exposure begins following serviceability, and participants can withdraw at any time — with all baselines decaying and deleting after ninety days of inactivity.",
            },
          ].map((p) => (
            <div className="ea-phase" key={p.tag}>
              <div className="ea-phase-tag">{p.tag}</div>
              <h4>{p.t}</h4>
              <p>{p.b}</p>
            </div>
          ))}
        </div>
      </EaSection>

      <EaSection
        eyebrow="Governance"
        title="Four rules that make this safe to run."
        lead="Every one of these is inherited directly from the Respectful Synchronised Protocol rather than invented for the auction layer."
      >
        <div className="ea-guards">
          {[
            {
              t: "Zero employer or competitor surveillance",
              b: "Employers cannot view individual traces, device habits or leave reasons. Competitors in the pool receive no visibility whatsoever into each other's financial or operational metrics.",
            },
            {
              t: "k-anonymity and minimum cell thresholds",
              b: "Workforce and consumer signals are only generated where the group meets a minimum size, so no individual worker or customer can be isolated from an aggregate.",
            },
            {
              t: "Immediate raw data burning",
              b: "All raw telemetry is processed at the edge, reduced to a low-resolution state label, and burned on write. Nothing raw is warehoused.",
            },
            {
              t: "Ninety-day automatic decay",
              b: "In line with the RSP signal decay rules, a business that pauses participation has its historical operational and financial baselines decay and delete automatically.",
            },
          ].map((g, i) => (
            <div className="ea-guard" key={g.t}>
              <div className="ea-guard-num">{i + 1}</div>
              <div>
                <h4>{g.t}</h4>
                <p>{g.b}</p>
              </div>
            </div>
          ))}
        </div>
      </EaSection>

      <EaSection
        eyebrow="The case for adoption"
        title="Why anyone would actually run this."
        lead="Ethical framing alone does not move an ad platform. The argument has to be commercial as well, and it is."
      >
        <div className="ea-compare">
          <div className="ea-compare-card is-good">
            <span className="ea-compare-tag">For search engines & auction providers</span>
            <h3>Better inventory, fewer dead ends</h3>
            <ul>
              <li>Eliminates dead-end results where a user clicks the top listing and finds an overbooked, unresponsive business.</li>
              <li>Raises merchant landing page quality across the whole vertical during calibration.</li>
              <li>Provides a defensible, privacy-first distribution model as regulatory pressure on behavioural profiling increases.</li>
              <li>Protects the small and mid-sized merchant base that long-term auction liquidity depends on.</li>
            </ul>
          </div>
          <div className="ea-compare-card">
            <span className="ea-compare-tag">For businesses & workplaces</span>
            <h3>Capital and people protected</h3>
            <ul>
              <li>No more paying for leads during periods of operational saturation.</li>
              <li>Market mechanics that push back against chronic overwork instead of rewarding it.</li>
              <li>Guaranteed baseline exposure for capable operators, rather than survival by budget.</li>
              <li>A conversion advantage earned through lower friction, not coercive retargeting.</li>
            </ul>
          </div>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Related work"
        title="Where this sits in the wider protocol."
        lead="The Ethical Auction is the plain-language branch. The formal macro-economic specification, telemetry schema and governance document live alongside it."
      >
        <div className="ea-cards">
          <Link to="/rsp/macro" className="ea-card">
            <div className="ea-card-step">Specification</div>
            <h3>@rsp/macro</h3>
            <p>The open macro-economic vertical equilibrium specification, v1.0.</p>
          </Link>
          <Link to="/rsp/macro/telemetry" className="ea-card">
            <div className="ea-card-step">Schema</div>
            <h3>Telemetry</h3>
            <p>The tripartite metric definitions in full technical detail.</p>
          </Link>
          <Link to="/rsp/macro/governance" className="ea-card">
            <div className="ea-card-step">Governance</div>
            <h3>Macro governance</h3>
            <p>k-anonymity, zero-knowledge proofs and burn rules as specified.</p>
          </Link>
          <Link to="/rsp/principles" className="ea-card">
            <div className="ea-card-step">Foundation</div>
            <h3>RSP principles</h3>
            <p>The core protocol every rule on this page inherits from.</p>
          </Link>
        </div>
      </EaSection>

      <EaSection eyebrow="Start over" title="Back through the specification.">
        <EaCards exclude="/rsp/ethical-auction/adoption" />
      </EaSection>
    </>
  );
}
