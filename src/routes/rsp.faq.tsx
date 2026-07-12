import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp/faq")({
  head: () => ({
    meta: [
      { title: "RSP FAQ — Plain-language answers · Love Key Link" },
      {
        name: "description",
        content:
          "Plain-language answers about RSP and avatars: what an avatar is, why it matters, AI likeness consent, best practices, and what happens when you leave.",
      },
      { property: "og:title", content: "RSP FAQ" },
      {
        property: "og:description",
        content: "Plain-language answers about RSP, avatars, likeness consent and revocation.",
      },
    ],
  }),
  component: RspFaq,
});

function RspFaq() {
  return (
    <section className="rsp-section" id="faq">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Avatar FAQ</div>
        <h2 className="rsp-h2">Plain-language answers</h2>
        <p className="rsp-lead">
          Common questions about how RSP handles avatars, likeness and AI stand-ins.
        </p>
      </div>
      <div className="rsp-faq">
        {[
          {
            q: "What exactly is an avatar in RSP?",
            a: "Your avatar is your represented self online — the name and picture others see, your curated profile, a creator persona, your voice, and any AI stand-in that can act for you. RSP treats all of these as one identity you own, not as scattered data platforms can reuse.",
          },
          {
            q: "Why do avatars matter so much right now?",
            a: "In today's online environment most interaction happens through representation rather than in person. Reputation, relationships and trust ride on the avatar, not the raw account behind it. As AI-generated likeness, voice cloning and impersonation become common, keeping a represented self tied to the real person it belongs to is essential.",
          },
          {
            q: "Can an AI twin use my face or voice without my agreement?",
            a: "No. Likeness and voice are context-scoped grants, never a permanent hand-over. Whether an AI stand-in may speak or act for you is an explicit permission you set per context and per session, and it stops the moment you revoke it.",
          },
          {
            q: "What are best practices for managing my avatar?",
            a: "Grant the minimum needed for each context, prefer time- or session-limited permissions over open-ended ones, keep sensitive likeness and voice grants separate from everyday presence, review what you've projected periodically, and revoke anything you no longer actively use.",
          },
          {
            q: "What happens to my avatar if I leave a product?",
            a: "Revoking consent withdraws the projection everywhere it reached, just like any other RSP grant. Your represented self stops being rendered in that context rather than lingering after you've gone.",
          },
        ].map((f) => (
          <details className="rsp-faq-item" key={f.q}>
            <summary className="rsp-faq-q">{f.q}</summary>
            <div className="rsp-faq-a">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
