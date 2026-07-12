import { createFileRoute, Link } from "@tanstack/react-router";
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json";
import chapterPdfAsset from "@/assets/RSP_Chapter_Law_of_Vibration.pdf.asset.json";
import rspLogo from "@/assets/rsp-logo.png.asset.json";
import {
  FlowCard,
  IconEye,
  IconScale,
  IconSync,
  IconClock,
  IconFlame,
} from "@/components/rsp-shared";

export const Route = createFileRoute("/rsp/")({
  head: () => ({
    meta: [
      { title: "RSP — Respectful Synchronisation Protocol · Love Key Link" },
      {
        name: "description",
        content:
          "RSP is a privacy-first coordination layer. Synchronise consent, presence and identity — including avatars and AI stand-ins — without surveillance or coercion.",
      },
      { property: "og:title", content: "RSP — Respectful Synchronisation Protocol" },
      {
        property: "og:description",
        content:
          "A privacy-first coordination framework. Translate behaviour. Synchronise the signal. Burn the identifiable source.",
      },
    ],
  }),
  component: RspLanding,
});

const sections = [
  { to: "/rsp/principles", label: "Principles", desc: "The core commitments RSP is built on." },
  {
    to: "/rsp/how-it-works",
    label: "How it works",
    desc: "Consent grants, identity context, presence, revocation.",
  },
  {
    to: "/rsp/dimensions",
    label: "Dimensions",
    desc: "The consent dimensions RSP tracks, including avatars.",
  },
  {
    to: "/rsp/checklist",
    label: "Identity checklist",
    desc: "Interactively secure your avatar: claim, grant, project, revoke.",
  },
  {
    to: "/rsp/implementations",
    label: "Implementations",
    desc: "Where RSP is deployed and what it governs.",
  },
  {
    to: "/rsp/event-token",
    label: "Event Token",
    desc: "Proof that coordination happened, source burned.",
  },
  {
    to: "/rsp/for-developers",
    label: "For developers",
    desc: "Install, core concepts and integration.",
  },
  { to: "/rsp/governance", label: "Governance", desc: "Tiers, credits and the burn clause." },
  { to: "/rsp/faq", label: "FAQ", desc: "Plain-language answers for visitors." },
] as const;

function RspLanding() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: brandCss }} />
      <div className="rsp-brand">
      {/* HERO */}
      <section className="rsp-hero">
        <div className="rsp-circuit" aria-hidden="true" />
        <div
          className="rsp-hero-backdrop"
          style={{ backgroundImage: `url(${rspLogo.url})` }}
          aria-hidden="true"
        />
        <div>
          <div className="rsp-hero-eyebrow">
            <span className="rsp-hero-eyebrow-dot" />
            Respectful Synchronisation Protocol
          </div>
          <h1 className="rsp-h1">
            Synchronisation
            <br />
            <em>without coercion.</em>
          </h1>
          <p className="rsp-hero-sub">
            RSP is the invisible coordination layer beneath Love Key Link, Love Key Hub and the Love
            Key Help Network. It synchronises consent, permissions, identity context, roles,
            presence and support signals — and, in an online world where people increasingly show up
            through avatars, likeness and AI stand-ins, it keeps that represented self tied to the
            person it belongs to, without making families feel like they are entering a protocol.
          </p>

          <div className="rsp-hero-actions">
            <Link to="/rsp/principles" className="rsp-btn-primary">
              Explore the protocol →
            </Link>
            <a href={whitepaperAsset.url} download="rsp-whitepaper.pdf" className="rsp-btn-outline">
              Download white paper ↓
            </a>
            <a
              href="https://etherscan.io/token/0xA1755730C6F66dbe3de29e24F4Db9F448ef3FDD5"
              target="_blank"
              rel="noopener noreferrer"
              className="rsp-btn-outline"
            >
              Genesis NFT →
            </a>
            <div className="rsp-btn-group">
              <a
                href={chapterPdfAsset.url}
                download="RSP_Chapter_Law_of_Vibration.pdf"
                className="rsp-btn-pill-left"
              >
                Chapter PDF ↓
              </a>
              <Link to="/quiz" className="rsp-btn-pill-right">
                Quiz →
              </Link>
            </div>
          </div>
        </div>
        <div className="rsp-hero-visual">
          <FlowCard
            iconClass="ic-observe"
            icon={<IconEye />}
            label="Observe behaviour"
            desc="Raw events from people, agents, or systems"
          />
          <FlowCard
            iconClass="ic-weight"
            icon={<IconScale />}
            label="Weight the signal"
            desc="Events become low-resolution weighted signals"
          />
          <FlowCard
            iconClass="ic-sync"
            icon={<IconSync />}
            label="Synchronise the state"
            desc="Aggregate to a node state — resonant, friction…"
          />
          <FlowCard
            iconClass="ic-expire"
            icon={<IconClock />}
            label="Expire & decouple"
            desc="Source links decay once no longer necessary"
          />
          <FlowCard
            iconClass="ic-burn"
            icon={<IconFlame />}
            label="Burn the source"
            desc="Identifiable data is irreversibly destroyed"
            showConnector={false}
          />
        </div>
      </section>

      {/* TAGLINE STRIP */}
      <div className="rsp-tagline-strip">
        <p>
          Translate behaviour. Synchronise the signal.{" "}
          <strong>Burn the identifiable source.</strong>
        </p>
      </div>
      </div>



      {/* WHAT RSP IS / IS NOT — TRUST SECTION */}
      <section className="rsp-section" id="what-rsp-is">
        <style dangerouslySetInnerHTML={{ __html: trustCss }} />
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">A trust document, not just a spec</div>
          <h2 className="rsp-h2">What RSP is — and what it is not.</h2>
          <p className="rsp-lead">
            RSP is the consent and coordination layer that governs how personal data, identity and
            permissions move between people and products across the Love Key ecosystem. Being clear
            about what it refuses to do matters as much as what it does.
          </p>
        </div>
        <div className="rsp-trust-grid">
          <div className="rsp-trust-col rsp-trust-is">
            <div className="rsp-trust-head">RSP is</div>
            <ul>
              <li>A consent layer — one profile, many hubs, presence without surveillance.</li>
              <li>Synchronisation without coercion, with minimisation on by default.</li>
              <li>Consent as a living, revocable state — never a one-time checkbox.</li>
              <li>Transparent about what moves between people and products, and why.</li>
            </ul>
          </div>
          <div className="rsp-trust-col rsp-trust-isnot">
            <div className="rsp-trust-head">RSP is not</div>
            <ul>
              <li>Not a surveillance system — it translates behaviour into signals, then burns the source.</li>
              <li>Not a data-selling mechanism — your data is not a product.</li>
              <li>Not something that operates without your knowledge or consent.</li>
              <li>Not a replacement for a product's privacy policy — it is the mechanism, not the legal document.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rsp-subhero">
        <div className="rsp-subhero-inner">
          <div>
            <span className="rsp-subhero-eyebrow">
              <span className="rsp-hero-eyebrow-dot" />
              NFT Tier 6 · Reciprocal Status Protocol
            </span>
            <h2>
              The Event Token.
              <br />
              <em>Proof without exposure.</em>
            </h2>
            <p>
              The Event Token is the cryptographic receipt of the Reciprocal Status Protocol. Every
              time two nodes genuinely coordinate, a token is minted — and the identifiable source
              data is burned before the token ever exists. It records that reciprocity happened,
              never who, where, or how.
            </p>
            <div className="rsp-subhero-actions">
              <Link to="/rsp/event-token" className="rsp-subhero-btn">
                About the Event Token →
              </Link>
            </div>
          </div>
          <ul className="rsp-subhero-roles">
            <li className="rsp-subhero-role">
              <div className="rsp-subhero-role-title">Proof of reciprocity</div>
              <div className="rsp-subhero-role-desc">
                One token per validated coordination event between RSP nodes.
              </div>
            </li>
            <li className="rsp-subhero-role">
              <div className="rsp-subhero-role-title">Source burned at mint</div>
              <div className="rsp-subhero-role-desc">
                Identifiable data is destroyed; the burn receipt is embedded in the token.
              </div>
            </li>
            <li className="rsp-subhero-role">
              <div className="rsp-subhero-role-title">Unbounded supply</div>
              <div className="rsp-subhero-role-desc">
                Auto-minted as the network coordinates — status that scales with trust.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* EXPLORE THE SITE */}
      <section className="rsp-section">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Explore RSP</div>
          <h2 className="rsp-h2">The full reference</h2>
          <p className="rsp-lead">
            Each part of RSP has its own page — principles, mechanics, dimensions, implementations
            and developer docs.
          </p>
        </div>
        <div className="rsp-vertical-grid">
          {sections.map((s, i) => (
            <Link className="rsp-vertical-card" to={s.to} key={s.to}>
              <div className="rsp-vc-tag">{String(i + 1).padStart(2, "0")}</div>
              <div className="rsp-vc-name">{s.label}</div>
              <p className="rsp-event-flow-desc" style={{ marginTop: 8 }}>
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

const trustCss = `
  .rsp-trust-grid {
    max-width: 1000px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }
  .rsp-trust-col {
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    background: var(--rsp-surface); padding: 24px 26px;
  }
  .rsp-trust-is { border-top: 3px solid oklch(62% .17 160); }
  .rsp-trust-isnot { border-top: 3px solid var(--rsp-primary); }
  .rsp-trust-head {
    font-size: .78rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    margin-bottom: 14px; color: var(--rsp-text);
  }
  .rsp-trust-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .rsp-trust-col li {
    position: relative; padding-left: 26px; font-size: .9rem; line-height: 1.55; color: var(--rsp-text-muted);
  }
  .rsp-trust-col li::before {
    position: absolute; left: 0; top: -1px; font-size: 1rem; font-weight: 700;
  }
  .rsp-trust-is li::before { content: '✓'; color: oklch(55% .15 160); }
  .rsp-trust-isnot li::before { content: '✕'; color: var(--rsp-primary); }
  @media (max-width: 700px) { .rsp-trust-grid { grid-template-columns: 1fr; } }
`;

const brandCss = `
  /* RSP brand identity — Orbitron / IBM Plex + circuit aesthetic (landing) */
  .rsp-brand .rsp-hero-eyebrow {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    letter-spacing: .14em; font-weight: 500;
  }
  .rsp-brand .rsp-h1 {
    font-family: 'Orbitron', 'DM Serif Display', sans-serif;
    font-weight: 700; letter-spacing: -.01em; line-height: 1.08;
    text-transform: none;
  }
  .rsp-brand .rsp-h1 em {
    font-style: normal; color: var(--rsp-primary);
    text-shadow: 0 0 26px oklch(70% .2 22 / .35);
  }
  .rsp-brand .rsp-hero-sub {
    font-family: 'IBM Plex Sans', 'DM Sans', sans-serif;
  }
  .rsp-brand .rsp-btn-primary,
  .rsp-brand .rsp-btn-outline,
  .rsp-brand .rsp-btn-pill-left,
  .rsp-brand .rsp-btn-pill-right {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    letter-spacing: .03em;
  }

  /* Tagline strip reads like an engraved circuit label */
  .rsp-brand .rsp-tagline-strip p {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    letter-spacing: .04em;
  }
  .rsp-brand .rsp-tagline-strip strong {
    font-family: 'Orbitron', sans-serif; font-weight: 600;
  }

  /* Circuit-board backdrop layer behind the hero */
  .rsp-brand .rsp-hero { position: relative; }
  .rsp-circuit {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%23c0362f' stroke-width='1.2'%3E%3Cpath d='M8 8h44v44h44'/%3E%3Cpath d='M8 80h34M96 52v56'/%3E%3Cpath d='M152 34H112v42h40'/%3E%3Cpath d='M40 152v-40h44'/%3E%3Cpath d='M8 120h30v32'/%3E%3Cpath d='M152 104h-28'/%3E%3C/g%3E%3Cg fill='%23c0362f'%3E%3Ccircle cx='8' cy='8' r='3.4'/%3E%3Ccircle cx='52' cy='52' r='3.4'/%3E%3Ccircle cx='96' cy='52' r='3.4'/%3E%3Ccircle cx='112' cy='76' r='3.4'/%3E%3Ccircle cx='40' cy='112' r='3.4'/%3E%3Ccircle cx='38' cy='120' r='3.4'/%3E%3Ccircle cx='124' cy='104' r='3.4'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 160px 160px;
    opacity: .07;
    -webkit-mask-image: radial-gradient(ellipse 80% 75% at 65% 35%, #000 30%, transparent 78%);
    mask-image: radial-gradient(ellipse 80% 75% at 65% 35%, #000 30%, transparent 78%);
  }
  /* keep hero content above the circuit layer */
  .rsp-brand .rsp-hero > *:not(.rsp-hero-backdrop):not(.rsp-circuit) { z-index: 1; }
`;
