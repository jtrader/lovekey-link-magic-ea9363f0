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
      {/* HERO */}
      <section className="rsp-hero">
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

      {/* EVENT TOKEN SUB-HERO */}
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
