import { createRouteFn } from "@/lib/tanstack-shim";
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json";
import { IconEye, IconFlame, IconLayers, IconShield } from "@/components/rsp-shared";

export const Route = createRouteFn("/rsp/event-token")({
  head: () => ({
    meta: [
      { title: "RSP Event Token — Proof without exposure · Love Key Link" },
      {
        name: "description",
        content:
          "The RSP Event Token: an ERC-721 cryptographic receipt that coordination happened, with the source identity burned before the token exists.",
      },
      { property: "og:title", content: "RSP Event Token" },
      {
        property: "og:description",
        content: "Proof that coordination happened — verifiable, not traceable. Source burned at mint.",
      },
    ],
  }),
  component: RspEventToken,
});

function RspEventToken() {
  return (
    <section className="rsp-event-section" id="event-token">
      <div className="rsp-event-inner">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">NFT Tier 6 · Event Token</div>
          <h2 className="rsp-h2">Proof that coordination happened.</h2>
          <p className="rsp-lead">
            The <span className="rsp-fullname">Reciprocal&nbsp;Status&nbsp;Protocol</span> is the
            native credential of the{" "}
            <span className="rsp-fullname-abbr">Respectful Synchronisation Protocol (RSP)</span> — a
            cryptographic record that a validated coordination event occurred, with source identity
            destroyed before the token exists.
          </p>
          <div className="rsp-hero-actions" style={{ justifyContent: "center", marginTop: 8 }}>
            <a href={whitepaperAsset.url} download="rsp-whitepaper.pdf" className="rsp-btn-outline">
              Download white paper ↓
            </a>
          </div>
        </div>

        <div className="rsp-event-grid">
          <div>
            <div className="rsp-event-quote">
              The token proves the event.
              <br />
              <em>It cannot prove who caused it.</em>
            </div>
            <p className="rsp-event-body">
              Every validated coordination event across RSP nodes produces one Event Token. It
              carries the signal — event type, weight, node state, a blurred timestamp — but the
              source identity is cryptographically destroyed at or before mint. The burn receipt hash
              embedded in the token proves that destruction happened. You can verify the
              coordination. You cannot recover the person.
            </p>
            <p className="rsp-event-body">
              Minting is automatic. Once a validation delay clears and the event commits to node
              state, the token is issued. Supply is unbounded: one token per validated event, across
              every node, forever.
            </p>
            <p className="rsp-event-body">
              In Love Key Link, each validated hub moment also writes an auditable
              <code>rsp_validation_events</code> record containing the source event reference,
              validation reason, timestamp, burn receipt hash, and Event Token payload. That backend
              record is the bridge from the live family hub to this Event Token contract.
            </p>
            <div className="rsp-event-receipt">
              <div className="rsp-event-receipt-label">Example token payload</div>
              <div>
                <span className="rsp-event-receipt-key">event_type </span>
                <span className="rsp-event-receipt-val">coordination.resonant</span>
              </div>
              <div>
                <span className="rsp-event-receipt-key">signal_weight </span>
                <span className="rsp-event-receipt-val">20</span>
              </div>
              <div>
                <span className="rsp-event-receipt-key">node_state </span>
                <span className="rsp-event-receipt-val">resonant</span>
              </div>
              <div>
                <span className="rsp-event-receipt-key">timestamp </span>
                <span className="rsp-event-receipt-val">
                  2026-06-16T14:00Z{" "}
                  <span style={{ color: "var(--rsp-text-soft)", fontSize: ".7rem" }}>
                    (hour-level blur)
                  </span>
                </span>
              </div>
              <div>
                <span className="rsp-event-receipt-key">burn_receipt </span>
                <span className="rsp-event-receipt-burned">0xd4e8…f1a2</span>
              </div>
              <div>
                <span className="rsp-event-receipt-key">source_id </span>
                <span className="rsp-event-receipt-burned">∅ destroyed</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="rsp-event-carries">
              <div className="rsp-event-carries-header">What the token carries</div>
              {[
                {
                  yes: true,
                  label: "Event type",
                  sub: "e.g. coordination.resonant, safety.escalation",
                },
                { yes: true, label: "Signal weight", sub: "Normalised 0–25 contribution value" },
                {
                  yes: true,
                  label: "Node state at event",
                  sub: "resonant, friction, cooling, etc.",
                },
                {
                  yes: true,
                  label: "Blurred timestamp",
                  sub: "Hour-level resolution only — not exact time",
                },
                {
                  yes: true,
                  label: "Burn receipt hash",
                  sub: "Proof that source identity was destroyed",
                },
              ].map((r) => (
                <div className="rsp-event-row" key={r.label}>
                  <span className="rsp-event-row-yes">✓</span>
                  <div>
                    <div>{r.label}</div>
                    <div className="rsp-event-row-sub">{r.sub}</div>
                  </div>
                </div>
              ))}
              <div
                className="rsp-event-carries-header"
                style={{ borderTop: "1px solid var(--rsp-border)" }}
              >
                What it never carries
              </div>
              {[
                { label: "Identity", sub: "No user ID, account reference, or profile link" },
                { label: "Raw location", sub: "No coordinates, IP address, or device signal" },
                { label: "Message content", sub: "No text, media, or payload from the event" },
                { label: "Exact timestamp", sub: "Sub-hour precision is discarded before mint" },
              ].map((r) => (
                <div className="rsp-event-row" key={r.label}>
                  <span className="rsp-event-row-no">✗</span>
                  <div>
                    <div>{r.label}</div>
                    <div className="rsp-event-row-sub">{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rsp-event-flow">
              {[
                {
                  icon: <IconEye />,
                  title: "Event validated",
                  desc: "A coordination event clears the validation delay and commits to node state.",
                },
                {
                  icon: <IconFlame />,
                  title: "Source identity burned",
                  desc: "Identifiable data is cryptographically destroyed. A burn receipt hash is generated.",
                },
                {
                  icon: <IconLayers />,
                  title: "Token auto-minted",
                  desc: "The Event Token is issued with signal data and burn receipt. Supply unbounded.",
                },
                {
                  icon: <IconShield />,
                  title: "Verifiable, not traceable",
                  desc: "Anyone can verify the coordination happened. No one can recover who caused it.",
                },
              ].map((s) => (
                <div className="rsp-event-flow-step" key={s.title}>
                  <div className="rsp-event-flow-icon">{s.icon}</div>
                  <div>
                    <div className="rsp-event-flow-title">{s.title}</div>
                    <div className="rsp-event-flow-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
