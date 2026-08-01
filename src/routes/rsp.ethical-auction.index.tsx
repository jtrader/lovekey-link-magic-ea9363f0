import { createFileRoute, Link } from "@tanstack/react-router";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction/")({
  head: () => ({
    meta: [
      {
        title:
          "Vertical Equilibrium Optimization (VEO) — Ethical Auction Theory for Search Engines · Love Key Link",
      },
      {
        name: "description",
        content:
          "Vertical Equilibrium Optimization is the natural successor to SEO & SEM: Ethical Auction Theory governing organic ranking and paid auctions alike, on pooled intent and real capacity to serve instead of bid size or legacy authority.",
      },
      {
        property: "og:title",
        content: "Vertical Equilibrium Optimization — Ethical Auction Theory for Search Engines",
      },
      {
        property: "og:description",
        content:
          "The natural successor to SEO & SEM: pooled intent, burned identifiers, and rotational exposure across organic and paid results that follows a business's real serviceability.",
      },

      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction" }],
  }),
  component: EthicalAuctionIndex,
});

function EthicalAuctionIndex() {
  return (
    <>
      <EaSection
        id="intro"
        eyebrow={
          <>
            <span style={{ display: "block" }}>
              Vertical Equilibrium Optimization (The natural successor to SEO &amp; SEM)
            </span>
            <span
              style={{
                display: "block",
                marginTop: 4,
                textTransform: "none",
                letterSpacing: "normal",
                fontWeight: 400,
                color: "var(--rsp-text-muted)",
              }}
            >
              Ethical Auction Theory for Search Engines · an RSP branch
            </span>
          </>
        }
        title="Coordination, not surveillance. Equilibrium, not extraction."
        lead="Both channels of search distribution — organic ranking (SEO) and paid auctions (SEM) — decide who a market gets to meet. Today the dominant names in a vertical are handed the organic results for free on legacy authority, absorbing demand they cannot fully serve, while capable competitors are forced to pay for clicks to reach the very customers those incumbents are keeping waiting. Vertical Equilibrium Optimization applies RSP to both layers at once: measure intent richly, forget who it came from, and give prominence — organic and paid alike — to whoever can actually serve the need right now."
      >
        <div className="ea-compare">
          <div className="ea-compare-card">
            <span className="ea-compare-tag">The legacy model</span>
            <h3>Monopolistic extraction</h3>
            <ul>
              <li>Real-time intent is welded to a permanent profile that follows the person around the web.</li>
              <li>The top one to three players hold the organic results for free on legacy domain authority, capturing the bulk of regional demand at zero marginal cost.</li>
              <li>That free traffic lands on businesses with no bandwidth left — met by burnt-out staff, slow replies, poor reviews — while the same names still buy the paid slots above it.</li>
              <li>The asymmetry is inverted: dominant vertical players are ranked organically for traffic they cannot serve, while capable competitors with real availability must pay for every click just to be seen at all.</li>

            </ul>
          </div>
          <div className="ea-compare-card is-good">
            <span className="ea-compare-tag">Vertical Equilibrium Optimization</span>
            <h3>Synchronised equilibrium</h3>
            <ul>
              <li>Intent is pooled at sector level and the identifiable source is burned on write.</li>
              <li>Organic prominence stops being a free incumbency annuity: it is re-earned each cycle by whoever has genuine capacity to fulfil the request.</li>
              <li>Saturated businesses lose the unserviceable organic overflow first and have their bids eased back second, so capable operators no longer have to buy clicks to reach demand they can actually serve.</li>

              <li>A vertical behaves like a coordinated service division rather than isolated gladiators.</li>
            </ul>
          </div>
        </div>
      </EaSection>

      <EaSection
        id="score"
        eyebrow="The new pillar"
        title="A Respectful Intent Score sitting beside Quality Score."
        lead="Ad Rank today is roughly bid amount multiplied by quality score, and organic position is roughly relevance multiplied by authority — which is why free organic prominence accrues to whoever ranked yesterday, and why everyone else has to buy their way in. Vertical Equilibrium Optimization adds one term that no amount of budget or backlink history can buy — whether the destination behaves respectfully and can serve the person on the other side — and applies it to both surfaces."
      >
        <div className="ea-formula">
          <div className="ea-formula-label">Proposed ranking terms — paid and organic</div>
          <div className="ea-formula-eq">
            Ad Rank = Bid Amount × Quality Score × <em>Respectful Intent Score</em>
          </div>
          <div className="ea-formula-eq" style={{ marginTop: 10 }}>
            Organic Position = Relevance × Authority × <em>Respectful Intent Score</em>
          </div>
          <p className="ea-formula-note">
            The Respectful Intent Score is derived from the same RSP primitives used across Love Key
            Link — sensitivity tiers, low-resolution signals, signal decay and a deterministic next
            safe step. It multiplies into the paid auction and acts as an organic ranking modifier,
            so a saturated business loses its free organic position at the same moment its bids are
            eased back — and a capable one earns organic exposure it would otherwise have had to buy.
          </p>

        </div>

        <div className="ea-table-wrap" style={{ marginTop: 28 }}>
          <table className="ea-table">
            <thead>
              <tr>
                <th>RSP principle</th>
                <th>What it means here</th>
                <th>Organic (SEO) &amp; paid (SEM) effect</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  p: "Sensitivity-aware monetisation",
                  m: "Commercial prompts are suppressed in distress, crisis and high-urgency contexts.",
                  e: "Advertisers who lower commercial intensity on sensitive intent are rewarded and pages that do the same rank higher organically; predatory bidding or crisis-keyword content is demoted on both surfaces.",
                },
                {
                  p: "Low-resolution intent",
                  m: "Action-based signals such as course_started, not profiles such as anxious_user.",
                  e: "Landing pages that resolve intent without tracking walls or lead-capture traps score higher on experience, lifting both organic position and ad quality.",
                },
                {
                  p: "Signal decay & burn integrity",
                  m: "Time-based decay and raw event burning as standard practice.",
                  e: "Sites that honour retention lifecycles earn an ethical trustworthiness lift carried into organic ranking and auction eligibility alike.",
                },
                {
                  p: "Deterministic next safe step",
                  m: "Always offer a contextual, safe onward route instead of a conversion trap.",
                  e: "Non-coercive routing, clear disclosures and visible opt-outs outrank funnel lock-in in the organic index and win better placement in the auction.",
                },
              ].map((r) => (
                <tr key={r.p}>
                  <td data-label="RSP principle">
                    <strong>{r.p}</strong>
                  </td>
                  <td data-label="What it means here">{r.m}</td>
                  <td data-label="Organic (SEO) & paid (SEM) effect">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection
        id="engine"
        eyebrow="Architecture at a glance"
        title="Pooled demand meets measured capacity."
        lead="Two independent streams meet in the match engine. Neither stream needs to know who the individual is, and neither competitor can see the other's numbers."
      >
        <div className="ea-flow">
          <div className="ea-flow-node">
            <div className="ea-flow-step">Demand</div>
            <h4>Pooled intent</h4>
            <p>What the region needs solved right now, aggregated and decoupled from identity.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Supply</div>
            <h4>Capacity index</h4>
            <p>Workforce load, financial velocity and consumer experience, all anonymised.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Match</div>
            <h4>Equilibrium engine</h4>
            <p>The Vertical Equilibrium Score weighs relevance against real serviceability, then applies to organic ranking and paid bids together.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Result</div>
            <h4>Rotational exposure</h4>
            <p>Prominence across both organic results and paid placements flows to whoever can serve the need without breaking their people.</p>
          </div>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Read the specification"
        title="Six sections, front to back."
        lead="Each section builds on the last — from how demand is captured, through the three telemetry streams, to the maths and the adoption path."
      >
        <EaCards exclude="/rsp/ethical-auction" />
        <p className="rsp-lead" style={{ marginTop: 24, textAlign: "center" }}>
          The macro-economic specification that grew out of this work lives at{" "}
          <Link to="/rsp/macro">@rsp/macro</Link>.
        </p>
      </EaSection>
    </>
  );
}
