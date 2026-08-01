import { createFileRoute } from "@tanstack/react-router";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction/experience")({
  head: () => ({
    meta: [
      { title: "Consumer experience signals — Ethical Auction · Love Key Link" },
      {
        name: "description",
        content:
          "Neutral, vertical-congruent feedback — call metadata, single-tap resolution surveys and service velocity — used as an operational relief valve rather than a public score.",
      },
      { property: "og:title", content: "Consumer experience signals" },
      {
        property: "og:description",
        content:
          "Turning customer feedback from a gameable reputation badge into a live relief valve for overloaded businesses.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction/experience" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction/experience" }],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <>
      <EaSection
        eyebrow="Section 03 · Feedback loop"
        title="Feedback as a relief valve, not a reputation badge."
        lead="Star ratings are static, gameable and reactive. They punish a business long after the damage is done, and never address the bottleneck that caused it. Standardised, vertical-congruent signals do the opposite: they detect friction while it is happening and ease the pressure automatically."
      >
        <div className="ea-guards">
          {[
            {
              t: "Call interaction metadata",
              b: "Ring-to-answer latency, mean call duration and abandonment rates. A sustained duration spike over the vertical mean suggests staff are handling disputes or system delays; high abandonment means the front desk is saturated. Audio and transcripts are strictly out of scope.",
            },
            {
              t: "Single-tap micro-surveys",
              b: "One neutral question sent after every interaction: was your issue resolved — yes, in progress, or unresolved. Because all participants in the vertical use the identical trigger, review gating becomes impossible.",
            },
            {
              t: "Service resolution velocity",
              b: "Time elapsed from first inquiry to job or ticket closeout. A blow-out across active clients means fulfilment channels are backed up well before any review is written.",
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
        eyebrow="Automated operational protection"
        title="What happens when a business starts to drown."
        lead="A conventional ad engine keeps taking the money and keeps sending leads. The Ethical Auction does the opposite — it buys the business time."
      >
        <div className="ea-flow">
          <div className="ea-flow-node">
            <div className="ea-flow-step">Detect</div>
            <h4>Bottleneck signal</h4>
            <p>Call queues back up, resolutions stall, unresolved responses cluster.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Score</div>
            <h4>CX drops below mean</h4>
            <p>The consumer experience index falls under the vertical baseline.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Act</div>
            <h4>Graceful throttle</h4>
            <p>Free organic prominence is released first, paid bids second, and both rotate to competitors with headroom.</p>
          </div>
          <div className="ea-flow-node">
            <div className="ea-flow-step">Recover</div>
            <h4>Exposure restores</h4>
            <p>Queues normalise, resolution recovers, and exposure returns automatically.</p>
          </div>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Boundaries"
        title="What is never inspected."
        lead="The feedback layer only works if it cannot be turned into content surveillance of customers or staff."
      >
        <div className="ea-table-wrap">
          <table className="ea-table">
            <thead>
              <tr>
                <th>Prohibited</th>
                <th>Permitted substitute</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  p: "Call recording, transcription or speech-to-text inspection.",
                  a: "Duration, latency and outcome tags only, reduced to a state label and burned.",
                },
                {
                  p: "Free-text sentiment engines applied to messages or reviews.",
                  a: "A single structured resolution response with three fixed options.",
                },
                {
                  p: "Identifying which customer reported an unresolved issue.",
                  a: "Survey data pooled across rolling fourteen-day windows under k-anonymity.",
                },
                {
                  p: "Retaining raw call metadata after scoring.",
                  a: "Decoupled and burned once the aggregate index has been calculated.",
                },
              ].map((r) => (
                <tr key={r.p}>
                  <td data-label="Prohibited">
                    <strong>{r.p}</strong>
                  </td>
                  <td data-label="Permitted substitute">{r.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection eyebrow="Keep reading" title="Continue through the specification.">
        <EaCards exclude="/rsp/ethical-auction/experience" />
      </EaSection>
    </>
  );
}
