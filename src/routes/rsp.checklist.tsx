import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/rsp/checklist")({
  head: () => ({
    meta: [
      { title: "RSP Identity Checklist — Protect your represented self · Love Key Link" },
      {
        name: "description",
        content:
          "An interactive RSP identity checklist. Walk through claiming, granting, projecting and revoking your avatar and likeness — one consent-safe step at a time.",
      },
      { property: "og:title", content: "RSP Identity Checklist" },
      {
        property: "og:description",
        content:
          "Interactive checklist to keep your avatar, likeness and AI stand-ins tied to you — through claim, grant, project and revoke.",
      },
    ],
  }),
  component: RspChecklist,
});

type Item = { id: string; label: string; hint: string };
type Group = { key: string; tag: string; title: string; desc: string; items: Item[] };

const groups: Group[] = [
  {
    key: "claim",
    tag: "CLAIM",
    title: "Claim your identity",
    desc: "Tie every representation of you back to the person it belongs to.",
    items: [
      {
        id: "claim-name",
        label: "Link your name and handle to your core identity",
        hint: "The name and handle others see should resolve to you, not float free.",
      },
      {
        id: "claim-photo",
        label: "Register your profile photo and visual likeness",
        hint: "Your picture is part of your avatar — claim it so it can't be reused unowned.",
      },
      {
        id: "claim-voice",
        label: "Register your voice signature",
        hint: "Voice is increasingly cloneable; claiming it makes cloning a violation, not a grey area.",
      },
      {
        id: "claim-ai",
        label: "Declare any AI model or stand-in that can act as you",
        hint: "An AI twin only belongs to you if you've claimed it under your identity.",
      },
    ],
  },
  {
    key: "grant",
    tag: "GRANT",
    title: "Grant with intention",
    desc: "Share the minimum needed, scoped to a context and a moment.",
    items: [
      {
        id: "grant-min",
        label: "Grant only the minimum each context needs",
        hint: "Presence rarely needs voice or likeness — keep grants narrow.",
      },
      {
        id: "grant-scoped",
        label: "Prefer session- or time-limited grants",
        hint: "A grant that expires on its own is safer than one you must remember to pull back.",
      },
      {
        id: "grant-separate",
        label: "Keep sensitive likeness and voice grants separate",
        hint: "Don't bundle everyday presence with the ability to speak or appear as you.",
      },
      {
        id: "grant-consent",
        label: "Confirm consent is explicit and logged",
        hint: "Every grant should leave a record in your consent ledger.",
      },
    ],
  },
  {
    key: "project",
    tag: "PROJECT",
    title: "Project safely",
    desc: "Show up as yourself while nothing extra leaks.",
    items: [
      {
        id: "project-render",
        label: "Verify only granted signals are rendered",
        hint: "Others should see exactly what you allowed — availability, voice, likeness — and no more.",
      },
      {
        id: "project-noleak",
        label: "Confirm no identifiable source data is exposed",
        hint: "RSP translates the signal and burns the identifiable source behind it.",
      },
      {
        id: "project-review",
        label: "Review where your avatar currently appears",
        hint: "Periodically check every context your represented self is active in.",
      },
    ],
  },
  {
    key: "revoke",
    tag: "REVOKE",
    title: "Revoke cleanly",
    desc: "Withdraw a projection everywhere it reached.",
    items: [
      {
        id: "revoke-unused",
        label: "Revoke anything you no longer actively use",
        hint: "Idle grants are risk. If it isn't in use, pull it back.",
      },
      {
        id: "revoke-everywhere",
        label: "Confirm past projections stop when you revoke",
        hint: "Revoking should stop your avatar being rendered, not just hide it.",
      },
      {
        id: "revoke-logged",
        label: "Check the change is recorded in your consent ledger",
        hint: "Every revocation should be logged, the same as every grant.",
      },
    ],
  },
];

const STORAGE_KEY = "rsp-identity-checklist-v1";
const allIds = groups.flatMap((g) => g.items.map((i) => i.id));

function RspChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, hydrated]);

  const done = useMemo(() => allIds.filter((id) => checked[id]).length, [checked]);
  const pct = Math.round((done / allIds.length) * 100);

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const reset = () => setChecked({});

  return (
    <section className="rsp-section" id="checklist">
      <style dangerouslySetInnerHTML={{ __html: chkCss }} />

      <div className="rsp-section-header">
        <div className="rsp-eyebrow">Interactive</div>
        <h2 className="rsp-h2">RSP identity checklist</h2>
        <p className="rsp-lead">
          Walk your represented self through the full RSP lifecycle — claim, grant, project and
          revoke. Tick each step as you complete it. Your progress is saved on this device.
        </p>
      </div>

      <div className="rsp-chk-progress">
        <div className="rsp-chk-progress-head">
          <span className="rsp-chk-progress-label">
            {done} of {allIds.length} steps complete
          </span>
          <span className="rsp-chk-progress-pct">{pct}%</span>
        </div>
        <div className="rsp-chk-bar">
          <div className="rsp-chk-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <div className="rsp-chk-complete">
            Your represented self is fully synchronised — claimed, granted, projected and
            revocable.
          </div>
        )}
      </div>

      <div className="rsp-chk-groups">
        {groups.map((g) => {
          const gDone = g.items.filter((i) => checked[i.id]).length;
          return (
            <div className="rsp-chk-group" key={g.key}>
              <div className="rsp-chk-group-head">
                <span className={`rsp-chk-tag rsp-chk-tag-${g.key}`}>{g.tag}</span>
                <div>
                  <div className="rsp-chk-group-title">{g.title}</div>
                  <div className="rsp-chk-group-desc">{g.desc}</div>
                </div>
                <span className="rsp-chk-group-count">
                  {gDone}/{g.items.length}
                </span>
              </div>
              <ul className="rsp-chk-list">
                {g.items.map((item) => {
                  const isOn = !!checked[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`rsp-chk-item${isOn ? " on" : ""}`}
                        onClick={() => toggle(item.id)}
                        aria-pressed={isOn}
                      >
                        <span className="rsp-chk-box" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M5 12l5 5 9-11" />
                          </svg>
                        </span>
                        <span className="rsp-chk-text">
                          <span className="rsp-chk-label">{item.label}</span>
                          <span className="rsp-chk-hint">{item.hint}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="rsp-chk-actions">
        <button type="button" className="rsp-chk-reset" onClick={reset} disabled={done === 0}>
          Reset checklist
        </button>
      </div>
    </section>
  );
}

const chkCss = `
  .rsp-chk-progress {
    max-width: 760px; margin: 0 auto 40px;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 20px 24px;
  }
  .rsp-chk-progress-head {
    display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;
  }
  .rsp-chk-progress-label { font-size: .9rem; font-weight: 500; color: var(--rsp-text); }
  .rsp-chk-progress-pct { font-size: 1.4rem; font-weight: 600; color: var(--rsp-primary); }
  .rsp-chk-bar {
    height: 8px; border-radius: 999px; background: var(--rsp-primary-light); overflow: hidden;
  }
  .rsp-chk-bar-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, var(--rsp-primary), var(--rsp-primary-glow));
    transition: width .4s var(--rsp-ease);
  }
  .rsp-chk-complete {
    margin-top: 14px; font-size: .85rem; color: var(--rsp-primary); font-weight: 500;
  }

  .rsp-chk-groups {
    max-width: 760px; margin: 0 auto;
    display: flex; flex-direction: column; gap: 22px;
  }
  .rsp-chk-group {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); overflow: hidden;
  }
  .rsp-chk-group-head {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 22px; background: var(--rsp-bg-warm);
    border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-chk-tag {
    flex-shrink: 0; font-size: .68rem; font-weight: 600; letter-spacing: .12em;
    padding: 5px 10px; border-radius: 999px; color: #fff;
  }
  .rsp-chk-tag-claim { background: oklch(60% .18 250); }
  .rsp-chk-tag-grant { background: oklch(62% .17 160); }
  .rsp-chk-tag-project { background: oklch(66% .17 60); }
  .rsp-chk-tag-revoke { background: var(--rsp-primary); }
  .rsp-chk-group-title { font-size: 1.02rem; font-weight: 600; color: var(--rsp-text); }
  .rsp-chk-group-desc { font-size: .82rem; color: var(--rsp-text-muted); margin-top: 2px; }
  .rsp-chk-group-count {
    margin-left: auto; flex-shrink: 0; font-size: .8rem; font-weight: 600;
    color: var(--rsp-text-soft); font-variant-numeric: tabular-nums;
  }

  .rsp-chk-list { list-style: none; margin: 0; padding: 8px; }
  .rsp-chk-item {
    display: flex; align-items: flex-start; gap: 14px; width: 100%; text-align: left;
    background: transparent; border: none; cursor: pointer;
    padding: 12px 14px; border-radius: .6rem; transition: background .18s var(--rsp-ease);
  }
  .rsp-chk-item:hover { background: var(--rsp-bg-warm); }
  .rsp-chk-box {
    flex-shrink: 0; width: 22px; height: 22px; margin-top: 1px;
    border: 2px solid var(--rsp-border-strong); border-radius: 6px;
    display: grid; place-items: center;
    transition: background .18s var(--rsp-ease), border-color .18s var(--rsp-ease);
  }
  .rsp-chk-box svg {
    width: 15px; height: 15px; fill: none; stroke: #fff; stroke-width: 3;
    stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset .25s var(--rsp-ease);
  }
  .rsp-chk-item.on .rsp-chk-box { background: var(--rsp-primary); border-color: var(--rsp-primary); }
  .rsp-chk-item.on .rsp-chk-box svg { stroke-dashoffset: 0; }
  .rsp-chk-text { display: flex; flex-direction: column; gap: 2px; }
  .rsp-chk-label { font-size: .94rem; font-weight: 500; color: var(--rsp-text); transition: color .18s; }
  .rsp-chk-hint { font-size: .8rem; color: var(--rsp-text-muted); line-height: 1.5; }
  .rsp-chk-item.on .rsp-chk-label { color: var(--rsp-text-soft); text-decoration: line-through; }

  .rsp-chk-actions { max-width: 760px; margin: 28px auto 0; text-align: center; }
  .rsp-chk-reset {
    font-size: .82rem; font-weight: 500; color: var(--rsp-text-muted);
    background: transparent; border: 1px solid var(--rsp-border);
    padding: 9px 20px; border-radius: 999px; cursor: pointer;
    transition: border-color .18s, color .18s;
  }
  .rsp-chk-reset:hover:not(:disabled) { border-color: var(--rsp-primary); color: var(--rsp-primary); }
  .rsp-chk-reset:disabled { opacity: .45; cursor: not-allowed; }
`;
