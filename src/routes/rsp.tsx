import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import lovekeyMark from "@/assets/lovekey-mark.png"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { lovable } from "@/integrations/lovable/index"

export const Route = createFileRoute('/rsp')({
  head: () => ({
    meta: [
      { title: 'RSP — Respectful Synchronised Protocol · Love Key Link' },
      {
        name: 'description',
        content:
          'RSP is a privacy-first coordination framework built into Love Key Link. Translate behaviour into weighted signals, synchronise the state, burn the identifiable source.',
      },
      { property: 'og:title', content: 'RSP — Respectful Synchronised Protocol' },
      {
        property: 'og:description',
        content:
          'A privacy-first coordination framework. Translate behaviour. Synchronise the signal. Burn the identifiable source.',
      },
    ],
  }),
  component: RSPPage,
})

// ─── Styles ────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  .rsp-root {
    --rsp-primary: oklch(60% .22 25);
    --rsp-primary-light: oklch(96% .012 20);
    --rsp-primary-glow: oklch(70% .2 22);
    --rsp-bg: oklch(99.5% .003 20);
    --rsp-bg-warm: oklch(98.5% .006 25);
    --rsp-surface: oklch(100% 0 0);
    --rsp-border: oklch(92% .008 20);
    --rsp-border-strong: oklch(85% .015 20);
    --rsp-text: oklch(18% .02 20);
    --rsp-text-muted: oklch(50% .02 20);
    --rsp-text-soft: oklch(65% .015 20);
    --rsp-radius: .875rem;
    --rsp-ease: cubic-bezier(.22,1,.36,1);

    font-family: 'DM Sans', sans-serif;
    background: var(--rsp-bg);
    color: var(--rsp-text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* NAV */
  .rsp-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--rsp-border);
    padding: 0 2rem;
  }
  .rsp-nav-inner {
    max-width: 1100px; margin: auto; height: 60px;
    display: flex; align-items: center; justify-content: space-between; gap: 2rem;
  }
  .rsp-nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; color: var(--rsp-text);
  }
  .rsp-nav-logo-mark {
    width: 80px; height: 80px;
    display: flex; align-items: center; justify-content: center;
  }
  .rsp-nav-logo-mark img { width: 80px; height: 80px; object-fit: contain; }
  .rsp-nav-logo-name { font-size: .92rem; font-weight: 500; letter-spacing: -.01em; }
  .rsp-nav-logo-sub { font-size: .78rem; color: var(--rsp-text-muted); margin-left: 2px; }
  .rsp-nav-links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
  .rsp-nav-links a {
    font-size: .85rem; color: var(--rsp-text-muted);
    text-decoration: none; transition: color .2s;
  }
  .rsp-nav-links a:hover { color: var(--rsp-text); }
  .rsp-nav-cta {
    font-size: .82rem; font-weight: 500;
    color: var(--rsp-primary); background: var(--rsp-primary-light);
    border: 1px solid oklch(88% .018 25); border-radius: 999px;
    padding: 6px 16px; text-decoration: none; white-space: nowrap; transition: all .2s;
  }
  .rsp-nav-cta:hover { background: oklch(93% .016 25); }

  /* HERO */
  .rsp-hero {
    max-width: 1100px; margin: 0 auto; padding: 80px 2rem 60px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .rsp-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .78rem; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--rsp-primary); background: var(--rsp-primary-light);
    border: 1px solid oklch(88% .018 25); border-radius: 999px;
    padding: 5px 14px; margin-bottom: 24px;
  }
  .rsp-hero-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--rsp-primary);
  }
  .rsp-h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    line-height: 1.05; letter-spacing: -.03em;
    color: var(--rsp-text); margin-bottom: 20px;
  }
  .rsp-h1 em { font-style: italic; color: var(--rsp-primary); }
  .rsp-hero-sub {
    font-size: 1.05rem; color: var(--rsp-text-muted);
    line-height: 1.7; max-width: 480px; margin-bottom: 36px;
  }
  .rsp-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .rsp-btn-primary {
    font-size: .88rem; font-weight: 500; color: white;
    background: var(--rsp-primary); border: none; border-radius: 999px;
    padding: 12px 24px; cursor: pointer; text-decoration: none;
    transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
  }
  .rsp-btn-primary:hover { background: var(--rsp-primary-glow); transform: translateY(-1px); }
  .rsp-btn-outline {
    font-size: .88rem; font-weight: 400; color: var(--rsp-text);
    background: transparent; border: 1px solid var(--rsp-border-strong);
    border-radius: 999px; padding: 12px 24px; cursor: pointer;
    text-decoration: none; transition: all .2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .rsp-btn-outline:hover { border-color: var(--rsp-primary); color: var(--rsp-primary); }

  /* FLOW CARDS */
  .rsp-hero-visual { display: flex; flex-direction: column; }
  .rsp-flow-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 20px 24px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 14px;
    animation: rspFadeUp .7s var(--rsp-ease) both;
  }
  .rsp-flow-card:nth-child(1) { animation-delay: .1s; }
  .rsp-flow-card:nth-child(3) { animation-delay: .2s; }
  .rsp-flow-card:nth-child(5) { animation-delay: .3s; }
  .rsp-flow-card:nth-child(7) { animation-delay: .4s; }
  .rsp-flow-card:nth-child(9) { animation-delay: .5s; }
  .rsp-flow-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rsp-flow-icon svg { width: 16px; height: 16px; }
  .ic-observe { background: oklch(94% .012 220); color: oklch(40% .14 220); }
  .ic-weight  { background: oklch(94% .014 140); color: oklch(38% .14 140); }
  .ic-sync    { background: oklch(94% .018 25);  color: var(--rsp-primary); }
  .ic-expire  { background: oklch(95% .012 60);  color: oklch(50% .14 55); }
  .ic-burn    { background: oklch(94% .01 300);  color: oklch(42% .14 300); }
  .rsp-flow-label { font-size: .82rem; font-weight: 500; color: var(--rsp-text); letter-spacing: -.01em; }
  .rsp-flow-desc  { font-size: .75rem; color: var(--rsp-text-muted); margin-top: 1px; }
  .rsp-flow-connector {
    width: 2px; height: 10px;
    background: linear-gradient(var(--rsp-border), var(--rsp-border-strong));
    margin: 0 17px;
  }

  /* TAGLINE STRIP */
  .rsp-tagline-strip {
    background: var(--rsp-bg-warm);
    border-top: 1px solid var(--rsp-border); border-bottom: 1px solid var(--rsp-border);
    padding: 28px 2rem; text-align: center;
  }
  .rsp-tagline-strip p {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem; letter-spacing: -.02em; color: var(--rsp-text-muted);
  }
  .rsp-tagline-strip strong { color: var(--rsp-text); }

  /* SECTIONS */
  .rsp-section { max-width: 1100px; margin: 0 auto; padding: 80px 2rem; }
  .rsp-section-header { text-align: center; margin-bottom: 56px; }
  .rsp-eyebrow {
    font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 12px;
  }
  .rsp-h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    letter-spacing: -.03em; line-height: 1.1; color: var(--rsp-text); margin-bottom: 14px;
  }
  .rsp-lead {
    font-size: 1rem; color: var(--rsp-text-muted);
    max-width: 560px; margin: 0 auto; line-height: 1.7;
  }

  /* PRINCIPLES */
  .rsp-principle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .rsp-principle-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 28px;
    transition: border-color .2s, transform .25s var(--rsp-ease);
  }
  .rsp-principle-card:hover { border-color: var(--rsp-border-strong); transform: translateY(-2px); }
  .rsp-pc-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--rsp-primary-light); border: 1px solid oklch(88% .018 25);
    display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
  }
  .rsp-pc-icon svg { width: 18px; height: 18px; color: var(--rsp-primary); }
  .rsp-pc-title { font-size: .95rem; font-weight: 500; color: var(--rsp-text); margin-bottom: 6px; letter-spacing: -.01em; }
  .rsp-pc-body  { font-size: .85rem; color: var(--rsp-text-muted); line-height: 1.65; }

  /* BURN CLAUSE */
  .rsp-burn-section {
    background: var(--rsp-bg-warm);
    border-top: 1px solid var(--rsp-border); border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-burn-inner {
    max-width: 1100px; margin: 0 auto; padding: 80px 2rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .rsp-burn-label {
    font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 16px;
  }
  .rsp-burn-quote {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem; line-height: 1.35; letter-spacing: -.02em;
    color: var(--rsp-text); margin-bottom: 24px;
  }
  .rsp-burn-quote em { font-style: italic; color: var(--rsp-primary); }
  .rsp-burn-body { font-size: .9rem; color: var(--rsp-text-muted); line-height: 1.75; }
  .rsp-burn-step {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-burn-step:last-child { border-bottom: none; }
  .rsp-burn-step-num {
    font-family: 'DM Serif Display', serif; font-size: 1.8rem;
    color: var(--rsp-primary); line-height: 1; flex-shrink: 0; width: 32px;
  }
  .rsp-burn-step-title { font-size: .88rem; font-weight: 500; color: var(--rsp-text); margin-bottom: 3px; }
  .rsp-burn-step-desc  { font-size: .8rem; color: var(--rsp-text-muted); }

  /* INSTALL */
  .rsp-install-section {
    background: var(--rsp-bg-warm);
    border-top: 1px solid var(--rsp-border); border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-install-inner {
    max-width: 820px; margin: 0 auto; padding: 80px 2rem;
    text-align: left;
  }
  .rsp-install-header { text-align: center; margin-bottom: 56px; }
  .rsp-install-eyebrow {
    font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-primary); margin-bottom: 12px;
  }
  .rsp-install-h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    letter-spacing: -.03em; line-height: 1.1; color: var(--rsp-text); margin-bottom: 14px;
  }
  .rsp-install-lead {
    font-size: 1rem; color: var(--rsp-text-muted);
    line-height: 1.7; margin-bottom: 36px;
  }
  .rsp-install-commands {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    padding: 14px; border-radius: 8px; overflow-x: auto; margin-bottom: 12px;
  }
  .rsp-install-packages {
    margin-top: 0; font-size: 0.92rem; color: var(--rsp-text-muted);
  }
  .rsp-install-packages a {
    color: var(--rsp-primary); text-decoration: none; transition: color .2s;
  }
  .rsp-install-packages a:hover {
    text-decoration: underline;
  }
  .rsp-install-example {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    padding: 14px; border-radius: 8px; overflow-x: auto; margin-top: 12px;
  }

  /* VERTICALS */
  .rsp-vertical-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .rsp-vertical-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 22px; transition: border-color .2s;
  }
  .rsp-vertical-card:hover { border-color: var(--rsp-border-strong); }
  .rsp-vc-tag {
    font-size: .72rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase;
    color: var(--rsp-text-soft); margin-bottom: 10px;
  }
  .rsp-vc-name { font-size: .9rem; font-weight: 500; color: var(--rsp-text); line-height: 1.35; }

  /* SIGNAL MODEL */
  .rsp-signal-section {
    background: var(--rsp-bg-warm);
    border-top: 1px solid var(--rsp-border); border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-signal-inner { max-width: 1100px; margin: 0 auto; padding: 80px 2rem; }
  .rsp-signal-states { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
  .rsp-state-pill {
    font-size: .78rem; font-weight: 400; color: var(--rsp-text);
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: 999px; padding: 6px 14px; transition: all .2s; cursor: default;
  }
  .rsp-state-pill:hover,
  .rsp-state-pill.active {
    background: var(--rsp-primary-light);
    border-color: oklch(88% .018 25); color: var(--rsp-primary);
  }
  .rsp-signal-weights {
    margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .rsp-weight-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: calc(var(--rsp-radius) - 4px); gap: 12px;
  }
  .rsp-weight-name { font-size: .82rem; color: var(--rsp-text-muted); }
  .rsp-weight-bar-wrap { flex: 1; height: 4px; background: var(--rsp-border); border-radius: 2px; max-width: 100px; }
  .rsp-weight-bar { height: 4px; border-radius: 2px; background: var(--rsp-primary); opacity: .7; }
  .rsp-weight-val { font-size: .82rem; font-weight: 500; color: var(--rsp-text); min-width: 28px; text-align: right; }

  /* TIERS */
  .rsp-tier-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
  .rsp-tier-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 24px; transition: all .2s;
  }
  .rsp-tier-card:hover { border-color: var(--rsp-border-strong); transform: translateY(-2px); }
  .rsp-tier-card.genesis {
    border-color: oklch(80% .04 25); background: var(--rsp-primary-light);
  }
  .rsp-tier-num {
    font-family: 'DM Serif Display', serif; font-size: 2.4rem;
    line-height: 1; color: var(--rsp-border-strong); margin-bottom: 10px;
  }
  .rsp-tier-card.genesis .rsp-tier-num { color: var(--rsp-primary); }
  .rsp-tier-name { font-size: .88rem; font-weight: 500; color: var(--rsp-text); margin-bottom: 4px; }
  .rsp-tier-desc { font-size: .78rem; color: var(--rsp-text-muted); line-height: 1.5; }
  .rsp-tier-supply {
    font-size: .72rem; font-weight: 500; color: var(--rsp-text-soft);
    margin-top: 10px; letter-spacing: .03em; text-transform: uppercase;
  }

  /* CREDITS */
  .rsp-credits-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 40px;
  }
  .rsp-credit-card {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); padding: 24px; text-align: center; transition: border-color .2s;
  }
  .rsp-credit-card:hover { border-color: var(--rsp-border-strong); }
  .rsp-credit-name {
    font-size: .78rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase;
    color: var(--rsp-text-muted); margin-bottom: 8px;
  }
  .rsp-credit-price {
    font-family: 'DM Serif Display', serif; font-size: 2rem;
    color: var(--rsp-text); margin-bottom: 2px;
  }
  .rsp-credit-credits { font-size: .82rem; color: var(--rsp-primary); font-weight: 500; }
  .rsp-credit-note { font-size: .72rem; color: var(--rsp-text-soft); margin-top: 6px; }

  /* FOOTER */
  .rsp-footer { border-top: 1px solid var(--rsp-border); padding: 40px 2rem; }
  .rsp-footer-inner {
    max-width: 1100px; margin: auto;
    display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  }
  .rsp-footer-left { font-size: .8rem; color: var(--rsp-text-muted); max-width: 620px; }
  .rsp-footer-left strong { color: var(--rsp-text); }
  .rsp-footer-right { font-size: .75rem; color: var(--rsp-text-soft); max-width: 320px; }

  /* ANIMATION */
  @keyframes rspFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE */
  @media (max-width: 800px) {
    .rsp-hero, .rsp-burn-inner { grid-template-columns: 1fr; }
    .rsp-hero-visual { display: none; }
    .rsp-principle-grid, .rsp-credits-grid { grid-template-columns: 1fr 1fr; }
    .rsp-signal-weights { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .rsp-principle-grid, .rsp-credits-grid, .rsp-tier-grid { grid-template-columns: 1fr; }
    .rsp-nav-links { display: none; }
    .rsp-nav { padding: 0 1.2rem; }
    .rsp-section { padding: 56px 1.2rem; }
  }
`

// ─── Icons ────────────────────────────────────────────────────────────────

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const IconEye = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconScale = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3v18M6 7h12M6 7l-3 7h6l-3-7Zm12 0-3 7h6l-3-7Z" />
  </svg>
)
const IconSync = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 4v4h-4M3 20v-4h4" />
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
const IconFlame = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1.5 2 2 2-1-2 1-5 1-7Z" />
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
const IconLayers = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13l9 5 9-5M3 16.5 12 21l9-4.5" />
  </svg>
)
const IconHeart = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1 4 2.5 1-1.5 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z" />
  </svg>
)

// ─── Sub-components ────────────────────────────────────────────────────────

function FlowCard({
  iconClass,
  icon,
  label,
  desc,
  showConnector = true,
}: {
  iconClass: string
  icon: React.ReactNode
  label: string
  desc: string
  showConnector?: boolean
}) {
  return (
    <>
      <div className="rsp-flow-card">
        <div className={`rsp-flow-icon ${iconClass}`}>{icon}</div>
        <div>
          <div className="rsp-flow-label">{label}</div>
          <div className="rsp-flow-desc">{desc}</div>
        </div>
      </div>
      {showConnector && <div className="rsp-flow-connector" />}
    </>
  )
}

function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="rsp-principle-card">
      <div className="rsp-pc-icon">{icon}</div>
      <div className="rsp-pc-title">{title}</div>
      <div className="rsp-pc-body">{body}</div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

function RSPPage() {
  const { user, loading } = useAuth()
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [signingIn, setSigningIn] = useState<string | null>(null)

  async function startCheckout(tier: string) {
    setCheckoutError(null)
    setLoadingTier(tier)
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          tier,
          successUrl: `${window.location.origin}/rsp?purchase=success`,
          cancelUrl: `${window.location.origin}/rsp?purchase=cancelled`,
        },
      })
      if (error || !data?.url) {
        setCheckoutError('Could not start checkout. Please try again.')
        setLoadingTier(null)
        return
      }
      window.location.href = data.url
    } catch {
      setCheckoutError('Could not start checkout. Please try again.')
      setLoadingTier(null)
    }
  }

  // Resume a pending purchase after the user signs in and returns to /rsp
  useEffect(() => {
    if (loading || !user) return
    const pending = sessionStorage.getItem('pending_rsp_tier')
    if (pending) {
      sessionStorage.removeItem('pending_rsp_tier')
      setShowSignIn(false)
      void startCheckout(pending)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  async function handleBuy(tier: string) {
    setCheckoutError(null)
    if (!user) {
      // Remember the tier so we can resume after sign-in, then show inline panel
      sessionStorage.setItem('pending_rsp_tier', tier)
      setShowSignIn(true)
      return
    }
    await startCheckout(tier)
  }

  async function handleSignIn(provider: 'google' | 'apple') {
    setSigningIn(provider)
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + '/rsp',
      })
      if (result.error) {
        setCheckoutError('Sign-in failed. Please try again.')
        setSigningIn(null)
        return
      }
      // On success the page redirects; the useEffect resumes checkout on return.
    } catch {
      setCheckoutError('Sign-in failed. Please try again.')
      setSigningIn(null)
    }
  }

  async function handleCheckBalance() {
    setBalanceError(null)
    if (!user) {
      setShowSignIn(true)
      return
    }
    setBalanceLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('get-balance')
      if (error || !data) {
        setBalanceError('Could not load your balance. Please try again.')
        setBalanceLoading(false)
        return
      }
      setBalance(data.balance ?? 0)
    } catch {
      setBalanceError('Could not load your balance. Please try again.')
    } finally {
      setBalanceLoading(false)
    }
  }

  return (
    <div className="rsp-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav className="rsp-nav">
        <div className="rsp-nav-inner">
          <Link to="/" className="rsp-nav-logo">
            <span className="rsp-nav-logo-mark">
              <img src={lovekeyMark} alt="Love Key Link" />
            </span>
            <span>
              <span className="rsp-nav-logo-name">Love Key Link</span>
              <span className="rsp-nav-logo-sub">/ RSP</span>
            </span>
          </Link>
          <ul className="rsp-nav-links">
            <li><a href="#protocol">Protocol</a></li>
            <li><a href="#burn">Burn Clause</a></li>
            <li><a href="#verticals">Verticals</a></li>
            <li><a href="#tiers">NFT Tiers</a></li>
            <li><a href="#credits">Credits</a></li>
          </ul>
          <a href="#tiers" className="rsp-nav-cta">Genesis NFT →</a>
          <button
            type="button"
            className="rsp-nav-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`rsp-burger-bar${menuOpen ? ' open-1' : ''}`} />
            <span className={`rsp-burger-bar${menuOpen ? ' open-2' : ''}`} />
            <span className={`rsp-burger-bar${menuOpen ? ' open-3' : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="rsp-nav-mobile">
            <a href="#protocol" onClick={() => setMenuOpen(false)}>Protocol</a>
            <a href="#burn" onClick={() => setMenuOpen(false)}>Burn Clause</a>
            <a href="#verticals" onClick={() => setMenuOpen(false)}>Verticals</a>
            <a href="#tiers" onClick={() => setMenuOpen(false)}>NFT Tiers</a>
            <a href="#credits" onClick={() => setMenuOpen(false)}>Credits</a>
            <a href="#tiers" className="rsp-nav-cta" onClick={() => setMenuOpen(false)}>Genesis NFT →</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="rsp-hero">
        <div>
          <div className="rsp-hero-eyebrow">
            <span className="rsp-hero-eyebrow-dot" />
            Respectful Synchronised Protocol
          </div>
          <h1 className="rsp-h1">
            Synchronisation
            <br />
            <em>without coercion.</em>
          </h1>
          <p className="rsp-hero-sub">
            RSP is a privacy-first coordination framework built into the core of Love Key Link.
            Translate behaviour into weighted signals. Synchronise the state. Burn the
            identifiable source.
          </p>
          <div className="rsp-hero-actions">
            <a href="#protocol" className="rsp-btn-primary">Explore the protocol →</a>
            <Link to="/app" className="rsp-btn-outline">Open Love Key Link</Link>
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
          Translate behaviour. Synchronise the signal.{' '}
          <strong>Burn the identifiable source.</strong>
        </p>
      </div>

      {/* PROTOCOL / PRINCIPLES */}
      <section className="rsp-section" id="protocol">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Core principles</div>
          <h2 className="rsp-h2">Built on respectful coordination</h2>
          <p className="rsp-lead">
            RSP defines how Love Key Link observes, interprets, and forgets — without surveilling,
            profiling, or coercing anyone.
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
        </div>
      </section>

      {/* INSTALL */}
      <section className="rsp-section" id="install">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Install</div>
          <h2 className="rsp-h2">Get started</h2>
          <p className="rsp-lead">Minimal install and links to packages and repository.</p>
        </div>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
          <pre style={{ background: 'var(--rsp-surface)', border: '1px solid var(--rsp-border)', padding: 14, borderRadius: 8, overflowX: 'auto', marginBottom: 12 }}>
{`npm install @rsp-protocol/core
npm install @rsp-protocol/react`}
          </pre>

          <p style={{ marginTop: 0, fontSize: '0.92rem', color: 'var(--rsp-text-muted)' }}>
            Packages: <a href="https://www.npmjs.com/package/@rsp-protocol/core" target="_blank" rel="noopener noreferrer">@rsp-protocol/core</a>,{' '}
            <a href="https://www.npmjs.com/package/@rsp-protocol/react" target="_blank" rel="noopener noreferrer">@rsp-protocol/react</a>. Source: {' '}
            <a href="https://github.com/rsp" target="_blank" rel="noopener noreferrer">https://github.com/rsp</a>.
          </p>

          <pre style={{ background: 'var(--rsp-surface)', border: '1px solid var(--rsp-border)', padding: 14, borderRadius: 8, overflowX: 'auto', marginTop: 12 }}>
{`import { createConsent, hasConsent, translate, aggregate, 
         toNodeSignal, markBurned, generateBurnReceipt } from '@rsp-protocol/core'`}
          </pre>
        </div>
      </section>

      {/* BURN CLAUSE */}
      <section className="rsp-burn-section" id="burn">
        <div className="rsp-burn-inner">
          <div>
            <div className="rsp-burn-label">Key Clause — v1.6</div>
            <div className="rsp-burn-quote">
              When behaviour is translated into a signal,{' '}
              <em>burn the identifiable source.</em>
            </div>
            <p className="rsp-burn-body">
              When user behaviour is translated, synchronised, aggregated, or converted into a
              protocol signal, any identifiable source information should be removed, destroyed,
              cryptographically erased, or irreversibly decoupled as soon as it is no longer
              necessary — unless retention is required by law, explicit consent, safety, or
              legitimate accountability.
            </p>
          </div>
          <div>
            {[
              { n: '1', title: 'Translate behaviour', desc: 'Raw events converted to weighted, low-resolution signals' },
              { n: '2', title: 'Synchronise the signal', desc: 'Aggregate to a node state — resonant, friction, cooling, etc.' },
              { n: '3', title: 'Burn the identifiable source', desc: 'Delete, anonymise, cryptographically erase, or irreversibly decouple' },
            ].map((s) => (
              <div className="rsp-burn-step" key={s.n}>
                <div className="rsp-burn-step-num">{s.n}</div>
                <div>
                  <div className="rsp-burn-step-title">{s.title}</div>
                  <div className="rsp-burn-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="rsp-section" id="verticals">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">Integration verticals</div>
          <h2 className="rsp-h2">Where RSP applies</h2>
          <p className="rsp-lead">
            RSP is designed for any system where group coordination intersects with privacy —
            human, AI, or hybrid.
          </p>
        </div>
        <div className="rsp-vertical-grid">
          {[
            'AI Model Congregations & Multi-Agent Systems',
            'LMS & Online Education',
            'Product Analytics & UX',
            'Customer Support & AI Service Operations',
            'Workplace Collaboration',
            'Healthcare & Care Coordination',
            'Governance, DAOs & Civic Coordination',
            'Cybersecurity & Incident Response',
            'Creator Platforms & Communities',
            'E-commerce & Marketplaces',
          ].map((name, i) => (
            <div className="rsp-vertical-card" key={name}>
              <div className="rsp-vc-tag">{String(i + 1).padStart(2, '0')}</div>
              <div className="rsp-vc-name">{name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNAL MODEL */}
      <section className="rsp-signal-section">
        <div className="rsp-signal-inner">
          <div className="rsp-section-header">
            <div className="rsp-eyebrow">Signal model — v1.6</div>
            <h2 className="rsp-h2">Visual states & weights</h2>
            <p className="rsp-lead">
              RSP reduces raw behaviour to 13 low-resolution visual states. Signal weights control
              how strongly each event contributes.
            </p>
          </div>
          <div className="rsp-signal-states">
            {['resonant','active','aware','dormant','friction','overload','drop_off',
              'support_needed','cooling','converting','mastery',
              'coordination_degraded','coordination_healthy'].map((s) => (
              <span className="rsp-state-pill" key={s}>{s}</span>
            ))}
          </div>
          <div className="rsp-signal-weights">
            {[
              { name: 'Completion / conversion', pct: 100, val: 25 },
              { name: 'Return visit',            pct: 80,  val: 20 },
              { name: 'Safety escalation',       pct: 80,  val: 20 },
              { name: 'Resource download',       pct: 60,  val: 15 },
              { name: 'Human correction',        pct: 48,  val: 12 },
              { name: 'Form interaction',        pct: 48,  val: 12 },
              { name: 'Active minute',           pct: 40,  val: 10 },
              { name: 'Agent handoff',           pct: 40,  val: 10 },
            ].map((w) => (
              <div className="rsp-weight-row" key={w.name}>
                <span className="rsp-weight-name">{w.name}</span>
                <div className="rsp-weight-bar-wrap">
                  <div className="rsp-weight-bar" style={{ width: `${w.pct}%` }} />
                </div>
                <span className="rsp-weight-val">{w.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="rsp-section" id="tiers">
        <div className="rsp-section-header">
          <div className="rsp-eyebrow">NFT tier structure</div>
          <h2 className="rsp-h2">Provenance, access & certification</h2>
          <p className="rsp-lead">
            RSP NFTs are utility tokens — provenance, access, participation, and certification.
            Not investment products.
          </p>
        </div>
        <div className="rsp-tier-grid">
          {[
            { n: '0', name: 'Genesis NFT',        desc: 'Origin, provenance, and symbolic protocol anchor.',          supply: 'Supply: 1',                    genesis: true  },
            { n: '1', name: 'Founder Pass',        desc: 'Early supporter access, private updates, feedback windows.', supply: 'Supply: 25–100 · 100 credits',  genesis: false },
            { n: '2', name: 'Builder Pass',        desc: 'SDK access, templates, checklists, priority review.',        supply: 'Supply: 100–500 · 250 credits', genesis: false },
            { n: '3', name: 'Certification Badge', desc: 'Verifiable credential for RSP-aligned people or systems.',   supply: 'Issued after review',           genesis: false },
            { n: '4', name: 'Partner Licence',     desc: 'Commercial partner and brand-use licence marker.',           supply: 'Approval-based',                genesis: false },
            { n: '5', name: 'Audit Token',         desc: 'Proof of completed review, workshop, or assessment.',        supply: 'Service-based issuance',        genesis: false },
          ].map((t) => (
            <div className={`rsp-tier-card${t.genesis ? ' genesis' : ''}`} key={t.n}>
              <div className="rsp-tier-num">{t.n}</div>
              <div className="rsp-tier-name">{t.name}</div>
              <div className="rsp-tier-desc">{t.desc}</div>
              <div className="rsp-tier-supply">{t.supply}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CREDITS */}
      <section className="rsp-signal-section" id="credits">
        <div className="rsp-signal-inner">
          <div className="rsp-section-header">
            <div className="rsp-eyebrow">RSP Coordination Credits</div>
            <h2 className="rsp-h2">Prepaid service credits</h2>
            <p className="rsp-lead">
              1 RSP Credit = £1 of redeemable RSP service value. Credits are not cash,
              not fiat-redeemable, not investments.
            </p>
          </div>
          <div className="rsp-credits-grid">
            {[
              { key: 'starter', name: 'Starter', price: '£25',    credits: '25 credits',    note: '1:1 value'   },
              { key: 'builder', name: 'Builder', price: '£100',   credits: '110 credits',   note: '10% bonus'   },
              { key: 'pro',     name: 'Pro',     price: '£250',   credits: '285 credits',   note: '14% bonus'   },
              { key: 'partner', name: 'Partner', price: '£1,000', credits: '1,200 credits', note: '20% bonus'   },
            ].map((c) => (
              <div className="rsp-credit-card" key={c.name}>
                <div className="rsp-credit-name">{c.name}</div>
                <div className="rsp-credit-price">{c.price}</div>
                <div className="rsp-credit-credits">{c.credits}</div>
                <div className="rsp-credit-note">{c.note}</div>
                <button
                  type="button"
                  onClick={() => handleBuy(c.key)}
                  disabled={loadingTier !== null}
                  className="rsp-btn-primary"
                  style={{ marginTop: 16, fontSize: '.8rem', padding: '8px 18px', display: 'inline-flex', cursor: loadingTier ? 'wait' : 'pointer', opacity: loadingTier && loadingTier !== c.key ? 0.6 : 1 }}
                >
                  {loadingTier === c.key ? 'Redirecting…' : 'Buy →'}
                </button>
              </div>
            ))}
          </div>
          {checkoutError && (
            <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--rsp-primary)', marginTop: 16 }}>
              {checkoutError}
            </p>
          )}

          {showSignIn && !user && (
            <div
              style={{
                maxWidth: 420,
                margin: '24px auto 0',
                padding: '24px',
                borderRadius: 'var(--rsp-radius)',
                border: '1px solid var(--rsp-border-strong)',
                background: 'var(--rsp-surface)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '.95rem', marginBottom: 6 }}>
                Sign in to buy credits
              </div>
              <p style={{ fontSize: '.8rem', color: 'var(--rsp-text-muted)', marginBottom: 16 }}>
                Use the account you already trust. We&apos;ll bring you right back to complete your purchase.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleSignIn('google')}
                  disabled={signingIn !== null}
                  className="rsp-btn-outline"
                  style={{ justifyContent: 'center', cursor: signingIn ? 'wait' : 'pointer' }}
                >
                  {signingIn === 'google' ? 'Connecting…' : 'Continue with Google'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSignIn('apple')}
                  disabled={signingIn !== null}
                  className="rsp-btn-outline"
                  style={{ justifyContent: 'center', cursor: signingIn ? 'wait' : 'pointer' }}
                >
                  {signingIn === 'apple' ? 'Connecting…' : 'Continue with Apple'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignIn(false)}
                  style={{
                    marginTop: 4,
                    background: 'none',
                    border: 'none',
                    color: 'var(--rsp-text-soft)',
                    fontSize: '.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--rsp-text-muted)', marginTop: 16 }}>
            Credits are fulfilled automatically after payment. A confirmation email is sent once your credits are active.
          </p>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              type="button"
              onClick={handleCheckBalance}
              disabled={balanceLoading}
              className="rsp-btn-outline"
              style={{ fontSize: '.8rem', padding: '8px 18px', cursor: balanceLoading ? 'wait' : 'pointer' }}
            >
              {balanceLoading ? 'Checking…' : 'Check my credit balance'}
            </button>
            {balance !== null && !balanceError && (
              <p style={{ fontSize: '.9rem', color: 'var(--rsp-text)', marginTop: 12 }}>
                Your balance: <strong>{balance} credits</strong>
              </p>
            )}
            {balanceError && (
              <p style={{ fontSize: '.8rem', color: 'var(--rsp-primary)', marginTop: 12 }}>
                {balanceError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rsp-footer">
        <div className="rsp-footer-inner">
          <img src={lovekeyMark} alt="Love Key Link" style={{ width: 96, height: 96, objectFit: 'contain' }} />
          <div className="rsp-footer-left">
            <strong>Love Key Link / RSP</strong> · Respectful Synchronised Protocol v1.6 ·
            Copyright © 2026 Jack Oswald. All rights reserved unless otherwise licensed in writing.
          </div>
          <div className="rsp-footer-right">
            RSP NFTs are utility, provenance, access, participation, and certification tokens.
            Not investment products.
          </div>
        </div>
      </footer>
    </div>
  )
}
