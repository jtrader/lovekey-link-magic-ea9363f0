import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp/avatars")({
  head: () => ({
    meta: [
      { title: "Identity Avatars — Own your represented self · Love Key Link" },
      {
        name: "description",
        content:
          "Your avatar is your represented self online — name, likeness, voice and AI stand-ins. Learn how RSP keeps it claimed, consented, projected and revocable.",
      },
      { property: "og:title", content: "Identity Avatars" },
      {
        property: "og:description",
        content:
          "The hub for everything about avatars in RSP: how it works, the consent dimensions, an interactive checklist, and plain-language answers.",
      },
    ],
  }),
  component: RspAvatars,
});

const avatarPages = [
  {
    to: "/rsp/avatar-creator",
    label: "Avatar Creator",
    desc: "Upload or snap a photo and generate a stylized AI profile picture — with a likeness gauge to dial how closely it resembles you.",
  },
  {
    to: "/rsp/how-it-works",
    label: "How it works",
    desc: "Walk your represented self from Claim to Revoke — bind it, grant it, project it, withdraw it.",
  },
  {
    to: "/rsp/dimensions",
    label: "Dimensions",
    desc: "The consent dimensions RSP tracks for likeness, voice, presence and AI stand-ins.",
  },
  {
    to: "/rsp/checklist",
    label: "Identity checklist",
    desc: "An interactive, step-by-step checklist to secure your avatar on this device.",
  },
  {
    to: "/rsp/faq",
    label: "FAQ",
    desc: "Plain-language answers on avatars, likeness consent and what happens when you leave.",
  },
] as const;

function RspAvatars() {
  return (
    <>
      <section className="rsp-section" id="avatars-hub">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Identity Avatars</div>
          <h2 className="rsp-h2">Own your represented self.</h2>
          <p className="rsp-lead">
            Online, most people show up through an avatar — a name and picture, a curated profile, a
            creator persona, a voice, and increasingly an AI stand-in that can act on their behalf.
            RSP treats that avatar as something you own and control, not something a platform can
            quietly reuse. This is the home for everything about how RSP protects it.
          </p>
        </div>

        <div className="rsp-vertical-grid">
          {avatarPages.map((s, i) => (
            <Link className="rsp-vertical-card" to={s.to} key={s.to}>
              <div className="rsp-vc-tag">{String(i + 1).padStart(2, "0")}</div>
              <div className="rsp-vc-name">{s.label}</div>
              <p className="rsp-event-flow-desc" style={{ marginTop: 8 }}>
                {s.desc}
              </p>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/rsp/how-it-works" className="rsp-btn-primary">
            Start with the walkthrough →
          </Link>
        </div>
      </section>
    </>
  );
}
