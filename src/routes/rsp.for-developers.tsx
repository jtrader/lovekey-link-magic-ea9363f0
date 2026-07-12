import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp/for-developers")({
  head: () => ({
    meta: [
      { title: "RSP for Developers — Install & integrate · Love Key Link" },
      {
        name: "description",
        content:
          "Developer docs for @rsp-protocol/core and @rsp-protocol/react: install, core concepts and integration for consent, presence and revocation.",
      },
      { property: "og:title", content: "RSP for Developers" },
      {
        property: "og:description",
        content: "Install @rsp-protocol/core and @rsp-protocol/react and integrate RSP consent flows.",
      },
    ],
  }),
  component: RspForDevelopers,
});

function RspForDevelopers() {
  return (
    <section className="rsp-section" id="install">
      <div className="rsp-section-header">
        <div className="rsp-eyebrow">For developers</div>
        <h2 className="rsp-h2">Get started</h2>
        <p className="rsp-lead">Minimal install and links to packages and repository.</p>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "left" }}>
        <pre
          style={{
            background: "var(--rsp-surface)",
            border: "1px solid var(--rsp-border)",
            padding: 14,
            borderRadius: 8,
            overflowX: "auto",
            marginBottom: 12,
          }}
        >
          {`npm install @rsp-protocol/core
npm install @rsp-protocol/react`}
        </pre>

        <p style={{ marginTop: 0, fontSize: "0.92rem", color: "var(--rsp-text-muted)" }}>
          Packages:{" "}
          <a
            href="https://www.npmjs.com/package/@rsp-protocol/core"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--rsp-primary)" }}
          >
            @rsp-protocol/core
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/@rsp-protocol/react"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--rsp-primary)" }}
          >
            @rsp-protocol/react
          </a>
          . Source:{" "}
          <a
            href="https://github.com/rsp"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--rsp-primary)" }}
          >
            https://github.com/rsp
          </a>
          .
        </p>

        <pre
          style={{
            background: "var(--rsp-surface)",
            border: "1px solid var(--rsp-border)",
            padding: 14,
            borderRadius: 8,
            overflowX: "auto",
            marginTop: 12,
          }}
        >
          {`import { createConsent, hasConsent, translate, aggregate,
         toNodeSignal, markBurned, generateBurnReceipt } from '@rsp-protocol/core'`}
        </pre>
      </div>
    </section>
  );
}
