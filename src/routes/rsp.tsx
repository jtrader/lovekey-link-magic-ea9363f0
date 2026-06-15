import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import lovekeyMark from "@/assets/lovekey-mark.png"
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json"
import rspLogo from "@/assets/rsp-logo.png.asset.json"
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

const helpNetwork = [
  { title: "First Aid Angel", tag: "PREPARE", body: "Quick first aid guidance and support", href: "https://firstaidangel.org/" },
  { title: "Crisis Compass", tag: "RESPOND", body: "Emergency guidance for active crises", href: "https://crisis-compass.org/" },
  { title: "Aid Angel", tag: "RECOVER", body: "Recovery support after disaster", href: "https://aidangel.app/" },
  { title: "Guardian Guide", tag: "HEAL", body: "Mental health and emotional support", href: "https://guardianguide.org/" },
  { title: "Love Key", tag: "COORDINATE", body: "Connect with the HELP Network", href: "https://lovekeyring.org/" },
  { title: "Love Key Ring", tag: "REACH", body: "A gentle way to reach help", href: "https://lovekey.com.au/?locale=AU#product-section" },
]

// ─── Styles ────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  html:has(.rsp-root) { scroll-behavior: smooth; }


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
  .rsp-scroll-track {
    position: absolute; left: 0; right: 0; bottom: 0; height: 6px; z-index: 2;
  }
  .rsp-scroll-progress {
    position: absolute; left: 0; bottom: 0; height: 2px;
    transform-origin: left; transform: scaleX(0);
    width: 100%; background: linear-gradient(90deg, var(--rsp-primary), var(--rsp-primary-glow));
    transition: transform .15s var(--rsp-ease);
  }
  .rsp-scroll-tooltip {
    position: absolute; bottom: 10px; transform: translateX(-50%);
    background: var(--rsp-text); color: var(--rsp-bg);
    font-size: .72rem; font-weight: 500; letter-spacing: .01em; white-space: nowrap;
    padding: 4px 10px; border-radius: 999px; pointer-events: none;
    box-shadow: 0 4px 14px oklch(18% .02 20 / .22);
    opacity: 0; transition: opacity .2s var(--rsp-ease);
  }
  .rsp-scroll-tooltip::after {
    content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
    border: 4px solid transparent; border-top-color: var(--rsp-text);
  }
  .rsp-scroll-track:hover .rsp-scroll-tooltip { opacity: 1; }
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
  .rsp-nav-links a { position: relative; padding-bottom: 4px; }
  .rsp-nav-links a::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    height: 2px; width: 0; border-radius: 2px; background: var(--rsp-primary);
    transition: width .25s var(--rsp-ease);
  }
  .rsp-nav-links a:hover::after { width: 100%; }
  .rsp-nav-links a.rsp-nav-active {
    color: var(--rsp-primary); font-weight: 600;
    background: var(--rsp-primary-light);
    border-radius: 999px; padding: 4px 14px;
    box-shadow: 0 1px 6px oklch(60% .22 25 / .14);
  }
  .rsp-nav-links a.rsp-nav-active::after {
    left: 14px; width: calc(100% - 28px); height: 2.5px; bottom: 1px;
  }
  .rsp-nav-mobile a.rsp-nav-active {
    color: var(--rsp-primary); font-weight: 600;
    background: var(--rsp-primary-light);
    border-radius: 8px; padding-left: 12px; padding-right: 12px;
    border-left: 3px solid var(--rsp-primary);
  }
  .rsp-nav-cta {
    font-size: .82rem; font-weight: 500;
    color: var(--rsp-primary); background: var(--rsp-primary-light);
    border: 1px solid oklch(88% .018 25); border-radius: 999px;
    padding: 6px 16px; text-decoration: none; white-space: nowrap; transition: all .2s;
  }
  .rsp-nav-cta:hover { background: oklch(93% .016 25); }
  .rsp-nav-burger {
    display: none; flex-direction: column; justify-content: center; gap: 5px;
    width: 40px; height: 40px; padding: 8px;
    background: none; border: none; cursor: pointer; margin-left: auto;
  }
  .rsp-burger-bar {
    display: block; width: 22px; height: 2px; border-radius: 2px;
    background: var(--rsp-text); transition: transform .25s var(--rsp-ease), opacity .2s var(--rsp-ease);
  }
  .rsp-burger-bar.open-1 { transform: translateY(7px) rotate(45deg); }
  .rsp-burger-bar.open-2 { opacity: 0; }
  .rsp-burger-bar.open-3 { transform: translateY(-7px) rotate(-45deg); }
  .rsp-nav-mobile {
    display: flex; flex-direction: column; gap: 4px;
    padding: 12px 0 16px; border-top: 1px solid var(--rsp-border);
  }
  .rsp-nav-mobile a {
    font-size: .92rem; color: var(--rsp-text-muted);
    text-decoration: none; padding: 10px 4px; transition: color .2s;
  }
  .rsp-nav-mobile a:hover { color: var(--rsp-text); }
  .rsp-nav-mobile .rsp-nav-cta {
    align-self: flex-start; margin-top: 8px; color: var(--rsp-primary);
  }

  /* HERO */
  .rsp-hero {
    position: relative; overflow: hidden;
    max-width: 1100px; margin: 0 auto; padding: 80px 2rem 60px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .rsp-hero-backdrop {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 560px; max-width: 60%; aspect-ratio: 1; pointer-events: none; z-index: 0;
    background-size: contain; background-repeat: no-repeat; background-position: center;
    opacity: .22;
    -webkit-mask-image: radial-gradient(circle at center, black 48%, transparent 72%);
    mask-image: radial-gradient(circle at center, black 48%, transparent 72%);
    animation: rsp-backdrop-pulse 7s var(--rsp-ease) infinite;
  }
  @keyframes rsp-backdrop-pulse {
    0%, 100% { opacity: .18; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: .3; transform: translate(-50%, -50%) scale(1.04); }
  }
  .rsp-hero > *:not(.rsp-hero-backdrop) { position: relative; z-index: 1; }
  @media (max-width: 800px) {
    .rsp-hero-backdrop { width: 520px; max-width: 110%; opacity: .1; }
    @keyframes rsp-backdrop-pulse {
      0%, 100% { opacity: .09; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: .15; transform: translate(-50%, -50%) scale(1.04); }
    }
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

  /* EVENT TOKEN */
  .rsp-event-section {
    background: var(--rsp-bg-warm);
    border-top: 1px solid var(--rsp-border); border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-fullname {
    font-family: 'DM Serif Display', serif;
    font-style: italic; color: var(--rsp-primary); white-space: nowrap;
  }
  .rsp-fullname-abbr {
    font-size: .78em; font-weight: 600; letter-spacing: .04em;
    color: var(--rsp-text); white-space: nowrap;
  }
  .rsp-event-inner {
    max-width: 1100px; margin: 0 auto; padding: 80px 2rem;
  }
  .rsp-event-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; margin-top: 56px;
  }
  .rsp-event-carries {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); overflow: hidden;
  }
  .rsp-event-carries-header {
    padding: 14px 20px; border-bottom: 1px solid var(--rsp-border);
    font-size: .72rem; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--rsp-text-muted);
  }
  .rsp-event-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 20px; border-bottom: 1px solid var(--rsp-border);
    font-size: .84rem; color: var(--rsp-text);
  }
  .rsp-event-row:last-child { border-bottom: none; }
  .rsp-event-row-yes { color: oklch(45% .14 140); font-size: .9rem; flex-shrink: 0; }
  .rsp-event-row-no  { color: oklch(50% .14 25);  font-size: .9rem; flex-shrink: 0; }
  .rsp-event-row-sub { font-size: .74rem; color: var(--rsp-text-muted); margin-top: 1px; }
  .rsp-event-flow { display: flex; flex-direction: column; gap: 0; }
  .rsp-event-flow-step {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-event-flow-step:last-child { border-bottom: none; }
  .rsp-event-flow-icon {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--rsp-primary-light); border: 1px solid oklch(88% .018 25);
  }
  .rsp-event-flow-icon svg { width: 16px; height: 16px; color: var(--rsp-primary); }
  .rsp-event-flow-title { font-size: .88rem; font-weight: 500; color: var(--rsp-text); margin-bottom: 3px; }
  .rsp-event-flow-desc  { font-size: .78rem; color: var(--rsp-text-muted); line-height: 1.6; }
  .rsp-event-quote {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem; line-height: 1.35; letter-spacing: -.02em;
    color: var(--rsp-text); margin-bottom: 20px;
  }
  .rsp-event-quote em { font-style: italic; color: var(--rsp-primary); }
  .rsp-event-body { font-size: .88rem; color: var(--rsp-text-muted); line-height: 1.8; margin-bottom: 24px; }
  .rsp-event-receipt {
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: calc(var(--rsp-radius) - 2px); padding: 16px 20px;
    font-size: .78rem; color: var(--rsp-text-muted); font-family: monospace; line-height: 1.8;
  }
  .rsp-event-receipt-label {
    font-family: 'DM Sans', sans-serif; font-size: .7rem; font-weight: 500;
    letter-spacing: .08em; text-transform: uppercase; color: var(--rsp-text-soft);
    margin-bottom: 10px;
  }
  .rsp-event-receipt-key { color: var(--rsp-text-soft); }
  .rsp-event-receipt-val { color: var(--rsp-text); }
  .rsp-event-receipt-burned { color: var(--rsp-primary); }



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
    display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 16px;
  }
  .rsp-footer-left { font-size: .8rem; color: var(--rsp-text-muted); max-width: 620px; }
  .rsp-footer-left strong { color: var(--rsp-text); }
  .rsp-footer-right { font-size: .75rem; color: var(--rsp-text-soft); max-width: 320px; }
  .rsp-help { max-width: 800px; margin: 0 auto 48px; }
  .rsp-help-title { text-align: center; font-size: 1rem; font-weight: 600; color: var(--rsp-text); margin-bottom: 24px; }
  .rsp-help-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .rsp-help-tile {
    display: block; text-align: left; border: 1px solid var(--rsp-border); border-radius: 16px;
    background: var(--rsp-card, rgba(255,255,255,0.02)); padding: 16px 20px; transition: transform .2s, box-shadow .2s;
  }
  .rsp-help-tile:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -12px rgba(0,0,0,0.4); }
  .rsp-help-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .rsp-help-name { font-size: 1.125rem; font-weight: 600; color: var(--rsp-text); }
  .rsp-help-tag { font-size: .7rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--rsp-text-muted); }
  .rsp-help-body { margin-top: 4px; font-size: .875rem; color: var(--rsp-text-muted); }
  @media (max-width: 640px) { .rsp-help-grid { grid-template-columns: 1fr; } }

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
    .rsp-event-grid { grid-template-columns: 1fr; gap: 40px; }
    .rsp-signal-weights { grid-template-columns: 1fr; }
    .rsp-nav-links { display: none; }
    .rsp-nav-inner > .rsp-nav-cta { display: inline-flex; margin-left: auto; }
    .rsp-nav-burger { display: flex; }
  }
  @media (max-width: 600px) {
    .rsp-principle-grid, .rsp-credits-grid, .rsp-tier-grid { grid-template-columns: 1fr; }
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  useEffect(() => {
    const ids = ["protocol", "install", "burn", "verticals", "tiers", "event-token", "credits"]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const navActive = (id: string) => (activeSection === id ? "rsp-nav-active" : undefined)

  const sectionLabels: Record<string, string> = {
    protocol: "Protocol",
    install: "Install",
    burn: "Burn Clause",
    verticals: "Verticals",
    tiers: "NFT Tiers",
    "event-token": "Event Token",
    credits: "Credits",
  }
  const currentSectionLabel = sectionLabels[activeSection] ?? "Top"

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
        <div className="rsp-scroll-track">
          <div
            className="rsp-scroll-progress"
            aria-hidden="true"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
          <div
            className="rsp-scroll-tooltip"
            role="status"
            style={{ left: `${Math.min(94, Math.max(6, scrollProgress * 100))}%` }}
          >
            {currentSectionLabel}
          </div>
        </div>
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
            <li><a href="#protocol" className={navActive("protocol")}>Protocol</a></li>
            <li><a href="#burn" className={navActive("burn")}>Burn Clause</a></li>
            <li><a href="#verticals" className={navActive("verticals")}>Verticals</a></li>
            <li><a href="#tiers" className={navActive("tiers")}>NFT Tiers</a></li>
            <li><a href="#event-token" className={navActive("event-token")}>Event Token</a></li>
            <li><a href="#credits" className={navActive("credits")}>Credits</a></li>
            <li><a href={whitepaperAsset.url} download="rsp-whitepaper.pdf">White Paper</a></li>
          </ul>
          
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
            <a href="#protocol" className={navActive("protocol")} onClick={() => setMenuOpen(false)}>Protocol</a>
            <a href="#burn" className={navActive("burn")} onClick={() => setMenuOpen(false)}>Burn Clause</a>
            <a href="#verticals" className={navActive("verticals")} onClick={() => setMenuOpen(false)}>Verticals</a>
            <a href="#tiers" className={navActive("tiers")} onClick={() => setMenuOpen(false)}>NFT Tiers</a>
            <a href="#event-token" className={navActive("event-token")} onClick={() => setMenuOpen(false)}>Event Token</a>
            <a href="#credits" className={navActive("credits")} onClick={() => setMenuOpen(false)}>Credits</a>
            <a href={whitepaperAsset.url} download="rsp-whitepaper.pdf" onClick={() => setMenuOpen(false)}>White Paper</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="rsp-hero">
        <div className="rsp-hero-backdrop" style={{ backgroundImage: `url(${rspLogo.url})` }} aria-hidden="true" />
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
            <a href={whitepaperAsset.url} download="rsp-whitepaper.pdf" className="rsp-btn-outline">Download white paper ↓</a>
            <a href="https://etherscan.io/token/0xA1755730C6F66dbe3de29e24F4Db9F448ef3FDD5" target="_blank" rel="noopener noreferrer" className="rsp-btn-outline">Genesis NFT →</a>
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
            RSP defines how an application observes, interprets, and forgets — without surveilling,
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
            { n: '6', name: 'Event Token',         desc: 'Signal proof that coordination happened. Source identity burned at mint.', supply: 'Unbounded · auto-minted',       genesis: false },
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

      {/* EVENT TOKEN */}
      <section className="rsp-event-section" id="event-token">
        <div className="rsp-event-inner">
          <div className="rsp-section-header">
            <div className="rsp-eyebrow">NFT Tier 6 · Event Token</div>
            <h2 className="rsp-h2">Proof that coordination happened.</h2>
            <p className="rsp-lead">
              The <span className="rsp-fullname">Reciprocal&nbsp;Status&nbsp;Protocol</span> is the
              native credential of the{' '}
              <span className="rsp-fullname-abbr">Respectful Synchronisation Protocol (RSP)</span> —
              a cryptographic record that a validated coordination event occurred, with source
              identity destroyed before the token exists.
            </p>
          </div>

          <div className="rsp-event-grid">
            <div>
              <div className="rsp-event-quote">
                The token proves the event.<br />
                <em>It cannot prove who caused it.</em>
              </div>
              <p className="rsp-event-body">
                Every validated coordination event across RSP nodes produces one Event Token. It
                carries the signal — event type, weight, node state, a blurred timestamp — but
                the source identity is cryptographically destroyed at or before mint. The burn
                receipt hash embedded in the token proves that destruction happened. You can
                verify the coordination. You cannot recover the person.
              </p>
              <p className="rsp-event-body">
                Minting is automatic. Once a validation delay clears and the event commits to
                node state, the token is issued. Supply is unbounded: one token per validated
                event, across every node, forever.
              </p>
              <div className="rsp-event-receipt">
                <div className="rsp-event-receipt-label">Example token payload</div>
                <div><span className="rsp-event-receipt-key">event_type    </span><span className="rsp-event-receipt-val">coordination.resonant</span></div>
                <div><span className="rsp-event-receipt-key">signal_weight </span><span className="rsp-event-receipt-val">20</span></div>
                <div><span className="rsp-event-receipt-key">node_state    </span><span className="rsp-event-receipt-val">resonant</span></div>
                <div><span className="rsp-event-receipt-key">timestamp     </span><span className="rsp-event-receipt-val">2026-06-16T14:00Z <span style={{ color: 'var(--rsp-text-soft)', fontSize: '.7rem' }}>(hour-level blur)</span></span></div>
                <div><span className="rsp-event-receipt-key">burn_receipt  </span><span className="rsp-event-receipt-burned">0xd4e8…f1a2</span></div>
                <div><span className="rsp-event-receipt-key">source_id     </span><span className="rsp-event-receipt-burned">∅ destroyed</span></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="rsp-event-carries">
                <div className="rsp-event-carries-header">What the token carries</div>
                {[
                  { yes: true, label: 'Event type',          sub: 'e.g. coordination.resonant, safety.escalation' },
                  { yes: true, label: 'Signal weight',       sub: 'Normalised 0–25 contribution value' },
                  { yes: true, label: 'Node state at event', sub: 'resonant, friction, cooling, etc.' },
                  { yes: true, label: 'Blurred timestamp',   sub: 'Hour-level resolution only — not exact time' },
                  { yes: true, label: 'Burn receipt hash',   sub: 'Proof that source identity was destroyed' },
                ].map((r) => (
                  <div className="rsp-event-row" key={r.label}>
                    <span className="rsp-event-row-yes">✓</span>
                    <div>
                      <div>{r.label}</div>
                      <div className="rsp-event-row-sub">{r.sub}</div>
                    </div>
                  </div>
                ))}
                <div className="rsp-event-carries-header" style={{ borderTop: '1px solid var(--rsp-border)' }}>What it never carries</div>
                {[
                  { label: 'Identity',        sub: 'No user ID, account reference, or profile link' },
                  { label: 'Raw location',    sub: 'No coordinates, IP address, or device signal' },
                  { label: 'Message content', sub: 'No text, media, or payload from the event' },
                  { label: 'Exact timestamp', sub: 'Sub-hour precision is discarded before mint' },
                ].map((r) => (
                  <div className="rsp-event-row" key={r.label}>
                    <span className="rsp-event-row-no">✗</span>
                    <div>
                      <div>{r.label}</div>
                      <div className="rsp-event-row-sub">{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rsp-event-flow">
                {[
                  { icon: <IconEye />,    title: 'Event validated',           desc: 'A coordination event clears the validation delay and commits to node state.' },
                  { icon: <IconFlame />,  title: 'Source identity burned',    desc: 'Identifiable data is cryptographically destroyed. A burn receipt hash is generated.' },
                  { icon: <IconLayers />, title: 'Token auto-minted',         desc: 'The Event Token is issued with signal data and burn receipt. Supply unbounded.' },
                  { icon: <IconShield />, title: 'Verifiable, not traceable', desc: 'Anyone can verify the coordination happened. No one can recover who caused it.' },
                ].map((s) => (
                  <div className="rsp-event-flow-step" key={s.title}>
                    <div className="rsp-event-flow-icon">{s.icon}</div>
                    <div>
                      <div className="rsp-event-flow-title">{s.title}</div>
                      <div className="rsp-event-flow-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              {
                key: 'standard',
                name: 'RSP Certification (standard)',
                credits: '100 credits',
                desc: 'A structured review of your system, product, or organisation against the RSP framework. Covers the five core principles: privacy by destruction, weighted signals, non-coercive synchronisation, consent architecture, and burn clause compliance. Results in a written assessment and recommendations.',
              },
              {
                key: 'full',
                name: 'RSP Certification (full + badge issuance)',
                credits: '250 credits',
                desc: 'Everything in the standard review, plus formal issuance of an RSP Certification Badge — a verifiable on-chain credential (NFT Tier 3) confirming RSP alignment. Suitable for products, platforms, and organisations that want to demonstrate privacy-first coordination publicly.',
              },
              {
                key: 'partner',
                name: 'RSP Partner Certification',
                credits: '1,000 credits',
                desc: 'Full certification for organisations building on RSP at scale — covering enterprise systems, multi-agent architectures, or commercial integrations. Includes a Partner Licence marker (NFT Tier 4), co-authorship credit in the RSP registry, and ongoing alignment support as the protocol evolves.',
              },
              {
                key: 'certifier',
                name: 'RSP Certifier Licence',
                credits: '1,000 credits (£1,000)',
                desc: "At 125 credits per badge issuance, the licence pays for itself after 8 certifications. A busy certifier doing one a month recovers the cost in under a year, then it's pure margin. That feels like the right balance — serious commitment, clear ROI.",
              },
            ].map((c) => (
              <div className="rsp-credit-card" key={c.name}>
                <div className="rsp-credit-name">{c.name}</div>
                <div className="rsp-credit-credits">{c.credits}</div>
                <div className="rsp-credit-note">{c.desc}</div>
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
        <div className="rsp-help">
          <h2 className="rsp-help-title">Love Key HELP Network</h2>
          <div className="rsp-help-grid">
            {helpNetwork.map((tile) => (
              <a key={tile.title} href={tile.href} target="_blank" rel="noopener noreferrer" className="rsp-help-tile">
                <div className="rsp-help-head">
                  <span className="rsp-help-name">{tile.title}</span>
                  <span className="rsp-help-tag">{tile.tag}</span>
                </div>
                <p className="rsp-help-body">{tile.body}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="rsp-footer-inner">
          <img src={lovekeyMark} alt="Love Key Link" style={{ width: 96, height: 96, objectFit: 'contain' }} />
          <div className="rsp-footer-left">
            <strong>Love Key Link / RSP</strong> · Respectful Synchronised Protocol v1.6 ·
            Part of the <a href="https://lovekeyring.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rsp-primary)' }}>Love Key HELP Network</a> ·
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
