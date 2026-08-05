import { createRouteFn } from "@/lib/tanstack-shim";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";
import { EaNotesList } from "@/components/rsp-ea-notes";

export const Route = createRouteFn("/rsp/ethical-auction/intent")({
  head: () => ({
    meta: [
      { title: "Pooled intent, not surveillance — Ethical Auction · Love Key Link" },
      {
        name: "description",
        content:
          "How the Ethical Auction collects rich real-time demand signals, aggregates them into a sector intent pool, and burns the identifiable source on write.",
      },
      { property: "og:title", content: "Pooled intent, not surveillance" },
      {
        property: "og:description",
        content:
          "Rich demand signals without persistent profiles: aggregation, k-anonymity, burn on write and 90-day decay.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction/intent" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction/intent" }],
  }),
  component: IntentPage,
});

function IntentPage() {
  return (
    <>
      <EaSection
        eyebrow="Section 01 · Demand side"
        title="Measure the need. Forget the person."
        lead="Surveillance advertising assumes that to serve intent well you must know who someone is and remember it forever. The Ethical Auction rejects that trade. It collects more context about the moment and less about the individual — then destroys the link between the two."
      >
        <div className="ea-flow">
          <div className="ea-flow-node">
            <div className="ea-flow-step">Step 1</div>
            <h4>Capture context</h4>
            <p>The problem being solved right now: the query, the urgency, the service area.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Step 2</div>
            <h4>Reduce to signal</h4>
            <p>Translated into an action-based label such as quote_requested — never a trait label.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Step 3</div>
            <h4>Pool by sector</h4>
            <p>Aggregated into a regional vertical pool that only exists in the plural.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Step 4</div>
            <h4>Burn the source</h4>
            <p>The raw identifier is destroyed on write. There is nothing left to retarget.</p>
          </div>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Signal grammar"
        title="Action labels replace trait labels."
        lead="The difference between a respectful and an extractive system is usually visible in one place: the vocabulary it stores."
      >
        <div className="ea-compare">
          <div className="ea-compare-card">
            <span className="ea-compare-tag">Rejected</span>
            <h3>Trait profiling</h3>
            <ul>
              <li><code>anxious_user</code> — an inference about a person's state.</li>
              <li><code>panic_buyer</code> — a label that follows them into unrelated contexts.</li>
              <li><code>high_intent_profile_982</code> — persistent, sellable, re-identifiable.</li>
              <li>Retained indefinitely and enriched with every visit.</li>
            </ul>
          </div>
          <div className="ea-compare-card is-good">
            <span className="ea-compare-tag">Adopted</span>
            <h3>Action signals</h3>
            <ul>
              <li><code>course_started</code> — something that happened, not someone's nature.</li>
              <li><code>support_route_clicked</code> — useful for routing, useless for profiling.</li>
              <li><code>quote_requested</code> — pooled to a vertical, never to a person.</li>
              <li>Decays automatically after 90 days of inactivity.</li>
            </ul>
          </div>
        </div>
      </EaSection>

      <EaSection
        eyebrow="What the engine knows"
        title="Collective precision, individual opacity."
        lead="Pooling does not blunt the signal — it sharpens it at the level where routing decisions are actually made."
      >
        <div className="ea-table-wrap">
          <table className="ea-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Surveillance model</th>
                <th>Ethical Auction</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  q: "What does this region need this week?",
                  s: "Answered, via millions of individual profiles.",
                  e: "Answered, via one anonymous pool.",
                },
                {
                  q: "Who is the person behind this request?",
                  s: "Answered, permanently, and sold onward.",
                  e: "Unanswerable. The identifier no longer exists.",
                },
                {
                  q: "Can this person be retargeted for months?",
                  s: "Yes — that is the business model.",
                  e: "No. There is no durable key to target.",
                },
                {
                  q: "Can a small operator see demand fairly?",
                  s: "No. Incumbents are ranked organically for free on domain age, so the capable newcomer has to pay for clicks just to be visible.",
                  e: "Yes. Pool visibility is a shared vertical resource, and real capacity earns organic prominence directly — there is no pay-to-be-seen tax on being able to serve.",
                },

              ].map((r) => (
                <tr key={r.q}>
                  <td data-label="Question">
                    <strong>{r.q}</strong>
                  </td>
                  <td data-label="Surveillance model">{r.s}</td>
                  <td data-label="Ethical Auction">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection eyebrow="Grounding" title="Notes, sources and definitions.">
        <EaNotesList only={["asymmetry", "organic", "ris"]} heading="Notes & sources for this page" />
      </EaSection>

      <EaSection eyebrow="Keep reading" title="Continue through the specification.">
        <EaCards exclude="/rsp/ethical-auction/intent" />
      </EaSection>
    </>
  );
}
