import { createFileRoute, Link } from "@tanstack/react-router";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction/equilibrium")({
  head: () => ({
    meta: [
      { title: "The equilibrium score — Ethical Auction · Love Key Link" },
      {
        name: "description",
        content:
          "The Vertical Equilibrium Score: relevance weighted by consumer experience over workforce stress, and target over actual growth velocity, driving rotational prominence.",
      },
      { property: "og:title", content: "The equilibrium score" },
      {
        property: "og:description",
        content:
          "How relevance, consumer experience, workforce stress and growth velocity combine into a rotational ad rank.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction/equilibrium" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction/equilibrium" }],
  }),
  component: EquilibriumPage,
});

function EquilibriumPage() {
  return (
    <>
      <EaSection
        eyebrow="Section 04 · The maths"
        title="One score, three dimensions of reality."
        lead="The three telemetry streams — consumer experience, workforce stress and financial velocity — resolve into a single multiplier applied on top of conventional relevance and bidding."
      >
        <div className="ea-formula">
          <div className="ea-formula-label">Vertical Equilibrium Score</div>
          <div className="ea-formula-eq">
            VES = f(Relevance) × ( <em>CX</em> ÷ <em>S</em> ) × ( <em>V</em><sub>T</sub> ÷{" "}
            <em>V</em><sub>A</sub> )
          </div>
          <p className="ea-formula-note">
            Equilibrium Ad Rank = (Bid Amount × Quality Score) × VES
          </p>
        </div>

        <div className="ea-table-wrap" style={{ marginTop: 28 }}>
          <table className="ea-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Dimension</th>
                <th>Source telemetry</th>
                <th>Effect when high</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  v: "CX",
                  d: "Consumer Experience Index",
                  s: "Call queue metadata, single-tap resolution surveys, service velocity.",
                  e: "Lifts VES — the business can comfortably absorb more demand.",
                },
                {
                  v: "S",
                  d: "Workforce stress",
                  s: "Anonymised shift hours, leave spikes, shift friction.",
                  e: "Lowers VES — exposure throttles to protect the team.",
                },
                {
                  v: "V\u209C / V\u2090",
                  d: "Target over actual growth velocity",
                  s: "Zero-knowledge accounting sync across a rolling ninety days.",
                  e: "Past target lowers VES; short of survival minimums raises it.",
                },
              ].map((r) => (
                <tr key={r.v}>
                  <td data-label="Variable">
                    <strong>{r.v}</strong>
                  </td>
                  <td data-label="Dimension">{r.d}</td>
                  <td data-label="Source telemetry">{r.s}</td>
                  <td data-label="Effect when high">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Operational states"
        title="How the engine reacts in practice."
        lead="Three states cover almost every real situation in a ten-player vertical pool."
      >
        <div className="ea-table-wrap">
          <table className="ea-table">
            <thead>
              <tr>
                <th>Condition</th>
                <th>Metric shift</th>
                <th>Algorithm action</th>
                <th>System outcome</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  c: "Over-extended / saturated",
                  m: "S approaches its ceiling, or CX falls.",
                  a: "VES decreases; paid and organic exposure throttle gracefully.",
                  o: "Staff protected from burnout, ad spend preserved, bad reviews avoided.",
                },
                {
                  c: "Target reached / over-served",
                  m: "Actual velocity well beyond target velocity.",
                  a: "VES decreases; prominence rotates outward.",
                  o: "No single player monopolises the region's revenue.",
                },
                {
                  c: "Under-utilised / high capacity",
                  m: "Low stress and actual velocity below target.",
                  a: "VES increases; prominence and rotation amplify.",
                  o: "Capable operators reach survival minimums and grow steadily.",
                },
              ].map((r) => (
                <tr key={r.c}>
                  <td data-label="Condition">
                    <strong>{r.c}</strong>
                  </td>
                  <td data-label="Metric shift">{r.m}</td>
                  <td data-label="Algorithm action">{r.a}</td>
                  <td data-label="System outcome">{r.o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Worked scenario"
        title="Two operators, one week."
        lead="A ten-player trades vertical in a single metropolitan service area, mid-winter, with demand spiking."
      >
        <div className="ea-compare">
          <div className="ea-compare-card">
            <span className="ea-compare-tag">Operator A · incumbent</span>
            <h3>Throttled, and better for it</h3>
            <ul>
              <li>Largest ad budget in the pool and the strongest domain authority.</li>
              <li>Crews already averaging well over standard hours; two unplanned absences.</li>
              <li>Call abandonment climbing; resolution velocity slipping past the vertical mean.</li>
              <li>VES falls. Bids ease back for six days. The backlog clears, and exposure returns.</li>
            </ul>
          </div>
          <div className="ea-compare-card is-good">
            <span className="ea-compare-tag">Operator G · capable challenger</span>
            <h3>Amplified, within limits</h3>
            <ul>
              <li>Modest budget, but a fully staffed roster with genuine availability.</li>
              <li>Resolution rates comfortably at or above the vertical mean.</li>
              <li>Quarterly velocity tracking below the sustainable target for the pool.</li>
              <li>VES rises. Prominence lifts until their own stress signal says enough.</li>
            </ul>
          </div>
        </div>
        <p className="rsp-lead" style={{ marginTop: 24, textAlign: "center" }}>
          The formal macro-economic write-up of this model, including the open specification
          document, lives at <Link to="/rsp/macro/ves-formula">@rsp/macro · VES Formula</Link>.
        </p>
      </EaSection>

      <EaSection eyebrow="Keep reading" title="Continue through the specification.">
        <EaCards exclude="/rsp/ethical-auction/equilibrium" />
      </EaSection>
    </>
  );
}
