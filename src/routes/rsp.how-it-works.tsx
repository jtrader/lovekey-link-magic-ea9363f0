import { definePage, Link } from "@/lib/router";
import { useRef, useState } from "react";

export const Route = definePage("/rsp/how-it-works")({
  head: () => ({
    meta: [
      { title: "How RSP Works — Consent, presence, avatars & revocation · Love Key Link" },
      {
        name: "description",
        content:
          "A plain-language walkthrough of RSP: consent grants, identity context, presence, and how a represented self (avatar) moves from claim to revoke.",
      },
      { property: "og:title", content: "How RSP Works" },
      {
        property: "og:description",
        content:
          "Consent grants, identity context, presence and revocation — with a worked avatar example from claim to revoke.",
      },
    ],
  }),
  component: RspHowItWorks,
});

const steps = [
  {
    label: "Claim",
    anchor: "avatar-claim",
    desc: "Your avatar — name, likeness, voice or AI stand-in — is bound to you as a represented self you own.",
  },
  {
    label: "Grant",
    anchor: "avatar-grant",
    desc: "You allow a specific context to project that avatar, scoped to where, how and for how long it applies.",
  },
  {
    label: "Project",
    anchor: "avatar-project",
    desc: "RSP renders only what you permitted — presence signals show you live without exposing more than agreed.",
  },
  {
    label: "Revoke",
    anchor: "avatar-revoke",
    desc: "Withdraw consent and the projection stops everywhere it reached, the same as any other RSP grant.",
  },
];

const details = [
  {
    id: "avatar-claim",
    step: "01",
    title: "Claim — binding your represented self",
    body: "Claiming establishes that a given avatar is yours. Your display name, picture, likeness, recorded voice and any AI stand-in are linked to your core identity in the RSP model, so every later grant references one owner. Nothing is shared at this stage — claiming is about ownership, not exposure. This is the identity-context layer described under Consent modules, applied to representation rather than raw account data.",
  },
  {
    id: "avatar-grant",
    step: "02",
    title: "Grant — scoped, revocable permission",
    body: "A grant lets a specific context project part of your avatar. Each grant is scoped by where it applies (which hub or product), how it may be used (view-only likeness, live voice, an acting AI twin), and for how long (a single session, a fixed window, or until revoked). Grants are additive and never permanent — likeness and voice are always time- or session-bounded rather than a blanket hand-over.",
  },
  {
    id: "avatar-project",
    step: "03",
    title: "Project — rendering only what you allowed",
    body: "When others encounter you, RSP renders only the facets your active grants permit. Presence signals control how your avatar appears live — available, busy, quiet — so being seen never means being surveilled. Identity-exposure protection guards against unwanted visual or voice similarity, keeping an AI representation clearly tied to, and bounded by, your consent.",
  },
  {
    id: "avatar-revoke",
    step: "04",
    title: "Revoke — withdrawing a represented self",
    body: "Revocation withdraws a grant the same way it withdraws any other RSP permission. The projection stops everywhere the grant reached, AI stand-ins lose the authority to act or speak for you, and the change is recorded in the consent ledger without becoming a surveillance dashboard. Consent is a living state you can end at any time, not a one-time checkbox.",
  },
];

function RspHowItWorks() {
  const [active, setActive] = useState<string>(details[0].id);
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const select = (id: string) => {
    setActive(id);
    detailRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="rsp-section" id="avatars">
      <style dangerouslySetInnerHTML={{ __html: walkCss }} />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow">How it works</div>
        <h2 className="rsp-h2">Avatars are how people show up online now.</h2>
        <p className="rsp-lead">
          Most online interaction happens through a represented self — a name and picture, a curated
          profile, a creator persona, a voice, and increasingly an AI stand-in that can act on
          someone's behalf. RSP treats that avatar as something the person owns and controls, not
          something a platform can quietly reuse. See the full set of tracked consent dimensions on
          the{" "}
          <Link to="/rsp/dimensions" style={{ color: "var(--rsp-primary)" }}>
            Dimensions
          </Link>{" "}
          page.
        </p>
      </div>

      <p className="rsp-walk-hint">Select a step to see how it works ↓</p>

      <div className="rsp-steps" role="tablist" aria-label="Avatar lifecycle steps">
        {steps.map((s, i) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === s.anchor}
            aria-controls={s.anchor}
            className={`rsp-step${active === s.anchor ? " rsp-step-active" : ""}`}
            onClick={() => select(s.anchor)}
            key={s.label}
          >
            <div className="rsp-step-num">{i + 1}</div>
            <div className="rsp-step-label">
              {s.label}
              <span className="rsp-step-more">View detail →</span>
            </div>
            <div className="rsp-step-desc">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="rsp-avatar-details">
        {details.map((d) => (
          <div
            className={`rsp-avatar-detail${active === d.id ? " rsp-avatar-detail-active" : ""}`}
            id={d.id}
            key={d.id}
            ref={(el) => {
              detailRefs.current[d.id] = el;
            }}
          >
            <div className="rsp-avatar-detail-step">{d.step}</div>
            <div>
              <h3 className="rsp-avatar-detail-title">{d.title}</h3>
              <p className="rsp-avatar-detail-body">{d.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rsp-eyebrow" style={{ textAlign: "center", marginTop: 64 }}>
        Worked example
      </div>
      <div className="rsp-example">
        <p className="rsp-example-intro">
          Maya is a recovery coach who records short encouragement clips. Here is how her
          represented self moves through RSP — from claiming her avatar to revoking it.
        </p>
        <ol className="rsp-example-flow">
          {[
            {
              tag: "Claim",
              body: "Maya links her name, photo, recorded voice and a permitted AI voice model to her core identity. Nothing is shared yet — she simply owns her represented self.",
            },
            {
              tag: "Grant",
              body: "She grants the Recovery Circle hub a session-scoped voice grant so her AI stand-in can read new encouragement messages aloud during evening check-ins only.",
            },
            {
              tag: "Project",
              body: "During check-in, members hear Maya's voice on today's message and see her presence as available. They cannot access her likeness elsewhere or generate new clips — RSP renders only what she allowed.",
            },
            {
              tag: "Revoke",
              body: "When Maya pauses coaching, she revokes the grant. The AI voice can no longer speak for her, past projections stop, and the change is logged in her consent ledger.",
            },
          ].map((e, i) => (
            <li className="rsp-example-item" key={e.tag}>
              <span className="rsp-example-num">{i + 1}</span>
              <div>
                <span className="rsp-example-tag">{e.tag}</span>
                <p className="rsp-example-body">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const walkCss = `
  .rsp-walk-hint {
    text-align: center; font-size: .82rem; color: var(--rsp-text-muted);
    margin: 0 0 20px;
  }
  .rsp-step {
    cursor: pointer; text-align: left; font: inherit; color: inherit;
    background: var(--rsp-surface);
    transition: border-color .2s var(--rsp-ease), box-shadow .2s var(--rsp-ease),
      transform .2s var(--rsp-ease), background .2s var(--rsp-ease);
  }
  .rsp-step:hover { transform: translateY(-2px); background: var(--rsp-bg-warm); border-color: var(--rsp-border-strong); }
  .rsp-step:hover .rsp-step-more, .rsp-step:focus-visible .rsp-step-more { opacity: 1; }
  .rsp-step-active {
    border-color: var(--rsp-primary);
    box-shadow: 0 0 0 1px var(--rsp-primary), 0 10px 30px -12px var(--rsp-primary-glow);
  }
  .rsp-step-active .rsp-step-num {
    background: var(--rsp-primary); color: #fff; border-color: var(--rsp-primary);
  }
  .rsp-step-active .rsp-step-more { opacity: 1; color: var(--rsp-primary); }

  .rsp-avatar-detail {
    transition: border-color .3s var(--rsp-ease), box-shadow .3s var(--rsp-ease),
      background .3s var(--rsp-ease);
    scroll-margin-top: 90px;
  }
  .rsp-avatar-detail-active {
    border-color: var(--rsp-primary);
    background: var(--rsp-bg-warm);
    box-shadow: 0 0 0 1px var(--rsp-primary), 0 16px 40px -18px var(--rsp-primary-glow);
  }
  .rsp-avatar-detail-active .rsp-avatar-detail-step { color: var(--rsp-primary); }
`;
