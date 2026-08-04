import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { IconEye, IconLayers, IconShield, IconClock, IconHeart } from "@/components/rsp-shared";

type Card = {
  n: string;
  tint: string;
  icon: ReactNode;
  title: string;
  eyebrow: string;
  body: ReactNode;
};

const CARDS: Card[] = [
  {
    n: "01",
    tint: "sage",
    icon: <IconEye />,
    eyebrow: "Strain sensing",
    title: "The Core Telemetry Engine",
    body: (
      <>
        The RSP Pulse Server is the macro population strain-sensing architecture for the ecosystem.
        It visualises the <strong>Event Strain Index</strong> — a mathematical model of the
        equilibrium between regional support capacity and network demand. Human behaviour is
        translated into low-resolution weighted signals, so care coordination never becomes a
        surveillance mechanism.
      </>
    ),
  },
  {
    n: "02",
    tint: "clay",
    icon: <IconLayers />,
    eyebrow: "Placement",
    title: "Ecosystem Placement and Scope",
    body: (
      <>
        The server sits directly beneath the Pulse hierarchy in the main protocol navigation. It
        processes edge actions from over <strong>100 countries across 50 languages</strong>, working
        entirely on categorical contexts — “Home”, “In Transit” — and explicitly rejecting
        high-precision spatial tracking.
      </>
    ),
  },
  {
    n: "03",
    tint: "stone",
    icon: <IconShield />,
    eyebrow: "Privacy",
    title: "Privacy Mechanics and Edge Escrow",
    body: (
      <>
        Populations are protected by an edge-to-anonymised-pool architecture. All personally
        identifiable information and exact IP addresses fall under a strict{" "}
        <strong>burn-on-write</strong> safeguard and are destroyed at the device edge. Regional
        telemetry is held mathematically in escrow until a k-anonymity density threshold of{" "}
        <strong>N ≥ 50</strong> is reached — zero individual traceability before anything renders.
      </>
    ),
  },
  {
    n: "04",
    tint: "wheat",
    icon: <IconClock />,
    eyebrow: "Temporal model",
    title: "Real-Time Temporal Dynamics",
    body: (
      <>
        Data is calculated continuously on a dynamic temporal model: a{" "}
        <strong>15-minute sliding window</strong> of current telemetry volume evaluated against a{" "}
        <strong>trailing 30-day regional baseline</strong>. Sudden surgency factors and network
        stress surface instantly, while source links decay gracefully once they are no longer
        needed.
      </>
    ),
  },
  {
    n: "05",
    tint: "rose",
    icon: <IconHeart />,
    eyebrow: "Purpose",
    title: "The Humanitarian Imperative",
    body: (
      <>
        This architecture empowers the Help Network with accurate, privacy-preserving macro data. It
        lets emergency responders and global aid networks route resources efficiently across every
        stage of emergency coordination — and lets institutions balance capacity without commercial
        tracking or exposing vulnerable populations.
      </>
    ),
  },
];

const STAGES = ["Prepare", "Respond", "Recover", "Heal"];

export function PulseSummary() {
  return (
    <div className="psum">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="psum-cards">
        {CARDS.map((c) => (
          <article key={c.n} className={`psum-card psum-${c.tint}`}>
            <div className="psum-card-aside">
              <span className="psum-icon">{c.icon}</span>
              <span className="psum-n">{c.n}</span>
            </div>
            <div className="psum-card-main">
              <div className="psum-eyebrow">{c.eyebrow}</div>
              <h2 className="psum-title">{c.title}</h2>
              <p className="psum-body">{c.body}</p>
              {c.n === "05" && (
                <div className="psum-stages">
                  {STAGES.map((s) => (
                    <span className="psum-stage" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="psum-onward">
        <Link to="/rsp/pulse/server" className="psum-link">
          See the live Pulse Server →
        </Link>
        <Link to="/rsp/pulse/telemetry" className="psum-link">
          Global telemetry →
        </Link>
        <Link to="/rsp/pulse/spec" className="psum-link">
          Open specification →
        </Link>
      </div>
    </div>
  );
}

const css = `
  .psum { max-width: 880px; margin: 0 auto; }

  .psum-cards { display: flex; flex-direction: column; gap: 18px; }

  .psum-card {
    display: grid; grid-template-columns: 64px 1fr; gap: 20px;
    padding: 26px 28px;
    background: var(--rsp-surface);
    border: 1px solid var(--rsp-border);
    border-left: 3px solid var(--psum-accent, var(--rsp-border-strong));
    border-radius: var(--rsp-radius);
  }
  .psum-card-aside {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .psum-icon {
    display: grid; place-items: center; width: 44px; height: 44px;
    border-radius: 50%; background: var(--psum-tint, var(--rsp-bg-warm));
    color: var(--psum-accent, var(--rsp-primary));
  }
  .psum-icon svg { width: 21px; height: 21px; }
  .psum-n {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: .7rem; letter-spacing: .1em; color: var(--rsp-text-muted);
  }
  .psum-eyebrow {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: .66rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--rsp-text-muted); margin-bottom: 6px;
  }
  .psum-title {
    font-size: 1.16rem; font-weight: 600; color: var(--rsp-text);
    margin: 0 0 8px; line-height: 1.35;
  }
  .psum-body {
    margin: 0; font-size: 1rem; line-height: 1.72; color: var(--rsp-text-soft, var(--rsp-text-muted));
  }
  .psum-body strong { color: var(--rsp-text); font-weight: 600; }

  .psum-stages { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .psum-stage {
    padding: 5px 13px; border-radius: 999px;
    background: var(--psum-tint, var(--rsp-bg-warm));
    border: 1px solid var(--rsp-border);
    font-size: .78rem; color: var(--rsp-text); letter-spacing: .02em;
  }

  .psum-sage  { --psum-tint: oklch(94% .028 155); --psum-accent: oklch(62% .07 155); }
  .psum-clay  { --psum-tint: oklch(94% .028 60);  --psum-accent: oklch(62% .07 55); }
  .psum-stone { --psum-tint: oklch(94% .012 250); --psum-accent: oklch(62% .05 250); }
  .psum-wheat { --psum-tint: oklch(95% .035 95);  --psum-accent: oklch(64% .07 85); }
  .psum-rose  { --psum-tint: oklch(94% .028 20);  --psum-accent: oklch(63% .07 20); }

  .psum-onward {
    display: flex; flex-wrap: wrap; gap: 10px 22px;
    margin-top: 30px; padding-top: 22px; border-top: 1px solid var(--rsp-border);
  }
  .psum-link { font-size: .92rem; color: var(--rsp-primary); text-decoration: none; }
  .psum-link:hover { text-decoration: underline; }

  @media (max-width: 560px) {
    .psum-card { grid-template-columns: 1fr; gap: 14px; padding: 22px 20px; }
    .psum-card-aside { flex-direction: row; gap: 12px; }
  }
`;
