import { createFileRoute } from "@tanstack/react-router";
import {
  PrincipleCard,
  IconShield,
  IconScale,
  IconSync,
  IconLayers,
} from "@/components/rsp-shared";

export const Route = createFileRoute("/rsp/principles")({
  head: () => ({
    meta: [
      { title: "RSP Principles — Synchronisation without coercion · Love Key Link" },
      {
        name: "description",
        content:
          "The core principles of RSP: privacy by destruction, weighted signals, non-coercive synchronisation, portability, and avatar sovereignty.",
      },
      { property: "og:title", content: "RSP Principles" },
      {
        property: "og:description",
        content:
          "Privacy by destruction, weighted signals, synchronisation without coercion, and avatar sovereignty.",
      },
    ],
  }),
  component: RspPrinciples,
});

function RspPrinciples() {
  return (
    <>
      <section className="rsp-section" id="protocol">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Core principles</div>
          <h2 className="rsp-h2">Built on respectful coordination</h2>
          <p className="rsp-lead">
            RSP defines how an application observes, interprets, and forgets — without surveilling,
            profiling, or coercing anyone. In an online ecosystem where people are experienced
            through avatars, likeness and AI stand-ins, those same principles govern the represented
            self as much as the raw data behind it.
          </p>
        </div>
        <div className="rsp-principle-grid">
          <PrincipleCard
            icon={<IconShield />}
            title="Privacy by destruction"
            body="Identifiable source data is removed, anonymised, or cryptographically erased as soon as it is no longer necessary."
          />
          <PrincipleCard
            icon={<IconScale />}
            title="Weighted, not absolute"
            body="Behaviour is translated into weighted, low-resolution signals — never high-fidelity surveillance records."
          />
          <PrincipleCard
            icon={<IconSync />}
            title="Synchronise, never coerce"
            body="Nodes synchronise toward shared states without forcing, ranking, or punishing individuals."
          />
          <PrincipleCard
            icon={<IconLayers />}
            title="Portable across systems"
            body="The same protocol applies to humans, AI agents, and hybrid systems wherever coordination meets privacy."
          />
          <PrincipleCard
            icon={<IconShield />}
            title="Avatar sovereignty"
            body="Your represented self — likeness, voice and AI stand-ins — is projected only with active, revocable consent, never treated as a platform's to reuse."
          />
        </div>
      </section>

      <section className="rsp-section" id="journey">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Love Key Link + Help Network</div>
          <h2 className="rsp-h2">RSP improves the journey while staying invisible.</h2>
          <p className="rsp-lead">
            The public experience starts with a simple promise: are my people okay? RSP sits
            underneath to make each handoff safer, more contextual and more respectful.
          </p>
        </div>
        <div className="rsp-principle-grid">
          {[
            {
              title: "Discover",
              body: "Love Key Link stays warm and human. RSP remains behind the scenes as trust and synchronisation architecture.",
            },
            {
              title: "Onboard",
              body: "One profile is created with privacy-first defaults, permission preparation and future hub bridging.",
            },
            {
              title: "Create or join a hub",
              body: "Membership, contextual roles and hub boundaries prevent context collapse across family, work, community and recovery spaces.",
            },
            {
              title: "Share presence",
              body: "Gentle states such as available, busy, quiet, all good or needs support sync only to permitted people.",
            },
            {
              title: "Request support",
              body: "RSP decides which trusted contacts should be notified, applies escalation rules and records a respectful support event.",
            },
            {
              title: "Connect to Help Network",
              body: "When private support is not enough, routing considers category, urgency, consent and trusted helper availability.",
            },
          ].map((item, i) => (
            <div className="rsp-principle-card rsp-journey-card" key={item.title}>
              <span className="rsp-journey-step">{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
