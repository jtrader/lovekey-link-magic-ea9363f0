import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

const devCss = `
  .rsp-qs { max-width: 860px; margin: 0 auto; text-align: left; }
  .rsp-qs-step {
    position: relative; padding: 0 0 8px 0; margin-bottom: 32px;
  }
  .rsp-qs-step:last-child { margin-bottom: 0; }
  .rsp-qs-head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
  .rsp-qs-num {
    flex: none; width: 30px; height: 30px; border-radius: 50%;
    display: grid; place-items: center; font-size: .9rem; font-weight: 700;
    color: #fff; background: var(--rsp-primary);
  }
  .rsp-qs-title { font-size: 1.05rem; font-weight: 600; color: var(--rsp-text); }
  .rsp-qs-desc { font-size: .92rem; color: var(--rsp-text-muted); margin: 0 0 12px 42px; }

  .rsp-code { position: relative; margin-left: 42px; }
  .rsp-code-tabs { display: flex; gap: 4px; margin-bottom: -1px; }
  .rsp-code-tab {
    font-family: inherit; font-size: .78rem; font-weight: 500; cursor: pointer;
    color: var(--rsp-text-muted); background: transparent;
    border: 1px solid transparent; border-bottom: none;
    border-radius: 8px 8px 0 0; padding: 6px 14px; transition: color .15s, background .15s;
  }
  .rsp-code-tab[data-active="true"] {
    color: var(--rsp-text); background: var(--rsp-surface);
    border-color: var(--rsp-border);
  }
  .rsp-code-box {
    position: relative; background: var(--rsp-surface);
    border: 1px solid var(--rsp-border); border-radius: 10px;
    overflow: hidden;
  }
  .rsp-code-box.has-tabs { border-top-left-radius: 0; }
  .rsp-code-pre {
    margin: 0; padding: 16px 52px 16px 16px; overflow-x: auto;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: .84rem; line-height: 1.65; color: var(--rsp-text);
    background: none;
  }
  .rsp-code-pre .tok-c { color: var(--rsp-text-soft); }
  .rsp-code-copy {
    position: absolute; top: 10px; right: 10px;
    display: inline-flex; align-items: center; gap: 5px;
    font-family: inherit; font-size: .72rem; font-weight: 500; cursor: pointer;
    color: var(--rsp-text-muted); background: var(--rsp-bg-warm);
    border: 1px solid var(--rsp-border); border-radius: 7px; padding: 5px 9px;
    transition: color .15s, border-color .15s, background .15s;
  }
  .rsp-code-copy:hover { color: var(--rsp-text); border-color: var(--rsp-border-strong); }
  .rsp-code-copy[data-copied="true"] { color: oklch(48% .13 150); border-color: oklch(80% .08 150); }

  .rsp-qs-links {
    margin: 36px 0 0 42px; font-size: .9rem; color: var(--rsp-text-muted);
  }
  .rsp-qs-links a { color: var(--rsp-primary); text-decoration: none; }
  .rsp-qs-links a:hover { text-decoration: underline; }

  @media (max-width: 640px) {
    .rsp-qs-desc, .rsp-code, .rsp-qs-links { margin-left: 0; }
  }
`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="rsp-code-copy"
      data-copied={copied}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const INSTALL = {
  npm: "npm install @rsp-protocol/core @rsp-protocol/react",
  pnpm: "pnpm add @rsp-protocol/core @rsp-protocol/react",
  yarn: "yarn add @rsp-protocol/core @rsp-protocol/react",
  bun: "bun add @rsp-protocol/core @rsp-protocol/react",
};

type PkgManager = keyof typeof INSTALL;

const FIRST_CALL = `import { createConsent, hasConsent } from '@rsp-protocol/core'

// 1. Create a revocable consent grant: who may do what, in which context.
const grant = createConsent({
  subject: 'user_123',        // the person the data is about
  audience: 'twinly',         // the product asking for access
  scope: 'profile.read',      // the permission being granted
  context: 'supporter',       // identity context this applies to
})

// 2. Check the grant before doing anything with the data.
if (hasConsent(grant, 'profile.read')) {
  // ...safe to read the profile field here
}`;

const REACT_USAGE = `import { RspProvider, useConsent } from '@rsp-protocol/react'

function App() {
  return (
    <RspProvider subject="user_123">
      <ProfileCard />
    </RspProvider>
  )
}

function ProfileCard() {
  // Reactive: re-renders when the grant is revoked.
  const { allowed } = useConsent('profile.read', { audience: 'twinly' })
  if (!allowed) return <p>Profile hidden</p>
  return <p>Profile visible</p>
}`;

function CodeBlock({ code, tabs }: { code: string; tabs?: React.ReactNode }) {
  return (
    <div className="rsp-code">
      {tabs}
      <div className={`rsp-code-box${tabs ? " has-tabs" : ""}`}>
        <CopyButton text={code} />
        <pre className="rsp-code-pre">{code}</pre>
      </div>
    </div>
  );
}

function RspForDevelopers() {
  const [pm, setPm] = useState<PkgManager>("npm");

  return (
    <section className="rsp-section" id="quickstart">
      <style dangerouslySetInnerHTML={{ __html: devCss }} />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow">For developers</div>
        <h2 className="rsp-h2">Integration quickstart</h2>
        <p className="rsp-lead">
          Install the packages, create your first revocable consent grant, and check a
          permission — copy-pastable, in a few minutes.
        </p>
      </div>

      <div className="rsp-qs">
        {/* Step 1 — install */}
        <div className="rsp-qs-step">
          <div className="rsp-qs-head">
            <span className="rsp-qs-num">1</span>
            <span className="rsp-qs-title">Install the packages</span>
          </div>
          <p className="rsp-qs-desc">
            <code>@rsp-protocol/core</code> holds the consent primitives;{" "}
            <code>@rsp-protocol/react</code> adds hooks and components for React apps.
          </p>
          <CodeBlock
            code={INSTALL[pm]}
            tabs={
              <div className="rsp-code-tabs" role="tablist" aria-label="Package manager">
                {(Object.keys(INSTALL) as PkgManager[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={pm === key}
                    data-active={pm === key}
                    className="rsp-code-tab"
                    onClick={() => setPm(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        {/* Step 2 — first API call */}
        <div className="rsp-qs-step">
          <div className="rsp-qs-head">
            <span className="rsp-qs-num">2</span>
            <span className="rsp-qs-title">Your first API call</span>
          </div>
          <p className="rsp-qs-desc">
            Create a consent grant and check it with the core API before touching any data.
          </p>
          <CodeBlock code={FIRST_CALL} />
        </div>

        {/* Step 3 — react */}
        <div className="rsp-qs-step">
          <div className="rsp-qs-head">
            <span className="rsp-qs-num">3</span>
            <span className="rsp-qs-title">Wire it into React (optional)</span>
          </div>
          <p className="rsp-qs-desc">
            Wrap your app in <code>RspProvider</code> and read grants with{" "}
            <code>useConsent</code> — the UI reacts automatically when consent is revoked.
          </p>
          <CodeBlock code={REACT_USAGE} />
        </div>

        <p className="rsp-qs-links">
          Packages:{" "}
          <a
            href="https://www.npmjs.com/package/@rsp-protocol/core"
            target="_blank"
            rel="noopener noreferrer"
          >
            @rsp-protocol/core
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/@rsp-protocol/react"
            target="_blank"
            rel="noopener noreferrer"
          >
            @rsp-protocol/react
          </a>
          . Source:{" "}
          <a href="https://github.com/rsp" target="_blank" rel="noopener noreferrer">
            github.com/rsp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
