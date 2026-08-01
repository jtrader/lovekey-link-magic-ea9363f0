import { createFileRoute } from "@tanstack/react-router";
import { EaCards, EaSection } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction/capacity")({
  head: () => ({
    meta: [
      { title: "Capacity & workforce load — Ethical Auction · Love Key Link" },
      {
        name: "description",
        content:
          "Serviceability as a ranking input: anonymous workforce capacity, operational bandwidth and financial velocity decide how much exposure a business receives.",
      },
      { property: "og:title", content: "Capacity & workforce load" },
      {
        property: "og:description",
        content:
          "Workforce stress, operational bandwidth and anonymised financial velocity, turned into an exposure valve that protects staff.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://lovekeylink.com/rsp/ethical-auction/capacity" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://lovekeylink.com/rsp/ethical-auction/capacity" }],
  }),
  component: CapacityPage,
});

const meters = [
  {
    name: "Over-extended",
    state: "Throttle exposure",
    color: "oklch(60% .22 25)",
    width: "94%",
    note: "Staff consistently over standard hours, unplanned leave spiking, queues backing up. Free organic prominence is withdrawn first and rotates to a competitor with room; paid bids are dialled back behind it.",
  },
  {
    name: "High friction",
    state: "Hold at baseline",
    color: "oklch(72% .17 70)",
    width: "72%",
    note: "Shift disengagement and context-switching are elevated. The business keeps the minimum volume it needs to survive; overflow is routed away until the signal recovers.",
  },
  {
    name: "Healthy capacity",
    state: "Amplify exposure",
    color: "oklch(62% .14 160)",
    width: "38%",
    note: "Shift density is comfortable and availability is high. Market prominence is amplified so the operator receives the volume required for steady, sustainable growth.",
  },
];

function CapacityPage() {
  return (
    <>
      <EaSection
        eyebrow="Section 02 · Supply side"
        title="A business is only as rankable as it is serviceable."
        lead="Conventional ad networks treat capacity as infinite so long as the card clears. Send a hundred leads to an operator already at ninety-five percent load and the whole system fails at once: staff burn out, service degrades, reviews collapse and the ad spend is wasted. Capacity has to be an input, not an afterthought."
      >
        <div className="ea-meters">
          {meters.map((m) => (
            <div className="ea-meter" key={m.name}>
              <div className="ea-meter-head">
                <span className="ea-meter-name">{m.name}</span>
                <span className="ea-meter-state" style={{ color: m.color }}>
                  {m.state}
                </span>
              </div>
              <div className="ea-meter-bar">
                <div
                  className="ea-meter-fill"
                  style={{ width: m.width, background: m.color }}
                />
              </div>
              <p className="ea-meter-note">{m.note}</p>
            </div>
          ))}
        </div>
      </EaSection>

      <EaSection
        eyebrow="Workforce Capacity Index"
        title="Stress-load as an exposure valve."
        lead="Devices compute differentially-private metrics locally. What leaves the premises is a single low-resolution state for the whole team — never a per-employee record, and never anything an employer can drill into."
      >
        <div className="ea-table-wrap">
          <table className="ea-table">
            <thead>
              <tr>
                <th>Workforce signal</th>
                <th>Anonymised observation</th>
                <th>State</th>
                <th>Engine action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  s: "Work hour mean testing",
                  o: "Team consistently clocking around twenty percent over standard hours.",
                  st: "over_extended",
                  a: "Throttle paid bids and rotate top organic exposure.",
                },
                {
                  s: "Leave spikes",
                  o: "Statistically significant unplanned leave across a rolling fourteen days.",
                  st: "degraded",
                  a: "Pause peak promotions and demote high-volume organic lead generation.",
                },
                {
                  s: "Shift friction",
                  o: "Elevated context-switching and extended idle time during active shifts.",
                  st: "friction_high",
                  a: "Hold organic and paid exposure at survival baseline; route overflow elsewhere.",
                },
                {
                  s: "Hour deficit",
                  o: "Team under standard hours with low shift density and high availability.",
                  st: "under_utilised",
                  a: "Amplify organic prominence and paid reach to drive the volume the business needs.",
                },
              ].map((r) => (
                <tr key={r.s}>
                  <td data-label="Workforce signal">
                    <strong>{r.s}</strong>
                  </td>
                  <td data-label="Anonymised observation">{r.o}</td>
                  <td data-label="State">
                    <code>{r.st}</code>
                  </td>
                  <td data-label="Engine action">{r.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EaSection>

      <EaSection
        eyebrow="Privacy boundary"
        title="This must never become workplace surveillance."
        lead="Workforce telemetry is the most dangerous input in the entire specification. RSP's guardrails are what make it usable at all — and if they cannot be met, the signal is simply not collected."
      >
        <div className="ea-guards">
          {[
            {
              t: "Zero employer visibility",
              b: "Employers never see individual scores, location traces, device habits or leave reasons. They see one business-level capacity index and how the engine is responding to it.",
            },
            {
              t: "k-anonymity and minimum cell sizes",
              b: "A signal is only generated where a team or site meets a minimum threshold of active workers, so no manager can isolate the impact of one person being unwell.",
            },
            {
              t: "Edge processing and burn on write",
              b: "Raw telemetry is reduced on-device or at the edge to a low-resolution state and then destroyed. Nothing raw is transmitted or retained.",
            },
            {
              t: "Voluntary and revocable",
              b: "Participation is a grant, not a condition of employment, and withdrawing it removes the contribution without penalty to the individual.",
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
        eyebrow="Financial velocity"
        title="Ground truth from the books, not the bid."
        lead="A zero-knowledge accounting sync — tokenised feeds from mainstream accounting software or quarterly statements — establishes whether a business is under, at, or well past the growth pace it needs to stay healthy."
      >
        <div className="ea-formula">
          <div className="ea-formula-label">Financial term</div>
          <div className="ea-formula-eq">
            Velocity ratio = <em>Target growth</em> ÷ Actual growth
          </div>
          <p className="ea-formula-note">
            Actual velocity is ingested over a rolling ninety-day window. Target velocity is the
            sustainable pace established during calibration. A player far past target has their
            prominence rotated away; a player short of survival minimums has theirs lifted.
          </p>
        </div>
      </EaSection>

      <EaSection eyebrow="Keep reading" title="Continue through the specification.">
        <EaCards exclude="/rsp/ethical-auction/capacity" />
      </EaSection>
    </>
  );
}
