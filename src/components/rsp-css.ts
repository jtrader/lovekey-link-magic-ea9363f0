export const rspCss = `
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
    position: sticky; top: 0; z-index: 80;
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
  .rsp-btn-group { display: inline-flex; gap: 0; }
  .rsp-btn-pill-left, .rsp-btn-pill-right {
    font-size: .88rem; font-weight: 500; color: white;
    background: var(--rsp-primary); border: none;
    padding: 12px 24px; cursor: pointer; text-decoration: none;
    transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
  }
  .rsp-btn-pill-left:hover, .rsp-btn-pill-right:hover { background: var(--rsp-primary-glow); }
  .rsp-btn-pill-left { border-radius: 999px 0 0 999px; }
  .rsp-btn-pill-right { border-radius: 0 999px 999px 0; border-left: 1px solid rgba(255,255,255,0.25); }

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

  /* AVATAR STEP FLOW */
  .rsp-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 40px; }
  .rsp-step {
    position: relative; padding: 24px 20px;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-right: none;
  }
  .rsp-step:first-child { border-radius: var(--rsp-radius) 0 0 var(--rsp-radius); }
  .rsp-step:last-child { border-right: 1px solid var(--rsp-border); border-radius: 0 var(--rsp-radius) var(--rsp-radius) 0; }
  .rsp-step:not(:last-child)::after {
    content: ""; position: absolute; top: 50%; right: -7px; z-index: 2;
    width: 12px; height: 12px; transform: translateY(-50%) rotate(45deg);
    background: var(--rsp-surface);
    border-top: 1px solid var(--rsp-border); border-right: 1px solid var(--rsp-border);
  }
  .rsp-step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 999px;
    background: var(--rsp-primary); color: white;
    font-size: .82rem; font-weight: 600; margin-bottom: 14px;
  }
  .rsp-step-label { font-size: .92rem; font-weight: 600; color: var(--rsp-text); letter-spacing: -.01em; margin-bottom: 6px; }
  .rsp-step-desc { font-size: .82rem; line-height: 1.5; color: var(--rsp-text-muted); }
  a.rsp-step { text-decoration: none; transition: background .2s var(--rsp-ease), border-color .2s var(--rsp-ease); }
  a.rsp-step:hover { background: var(--rsp-bg-warm); border-color: var(--rsp-border-strong); }
  .rsp-step-more { display: block; font-size: .72rem; font-weight: 500; color: var(--rsp-primary); margin-top: 3px; opacity: 0; transition: opacity .2s var(--rsp-ease); }
  a.rsp-step:hover .rsp-step-more, a.rsp-step:focus-visible .rsp-step-more { opacity: 1; }

  /* AVATAR STEP DETAILS */
  .rsp-avatar-details { max-width: 820px; margin: 48px auto 0; display: flex; flex-direction: column; gap: 14px; }
  .rsp-avatar-detail {
    display: flex; gap: 20px; padding: 24px;
    background: var(--rsp-surface); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius); scroll-margin-top: 100px;
  }
  .rsp-avatar-detail:target { border-color: var(--rsp-primary); background: var(--rsp-bg-warm); }
  .rsp-avatar-detail-step {
    font-family: 'DM Serif Display', serif; font-size: 1.6rem;
    color: var(--rsp-primary); line-height: 1; flex-shrink: 0; opacity: .8;
  }
  .rsp-avatar-detail-title { font-size: 1rem; font-weight: 600; color: var(--rsp-text); letter-spacing: -.01em; margin: 0 0 8px; }
  .rsp-avatar-detail-body { font-size: .88rem; line-height: 1.6; color: var(--rsp-text-muted); margin: 0; }

  /* AVATAR WORKED EXAMPLE */
  .rsp-example {
    max-width: 760px; margin: 40px auto 0; padding: 32px;
    background: var(--rsp-bg-warm); border: 1px solid var(--rsp-border);
    border-radius: var(--rsp-radius);
  }
  .rsp-example-intro { font-size: .95rem; line-height: 1.6; color: var(--rsp-text); margin: 0 0 24px; }
  .rsp-example-flow { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .rsp-example-item { display: flex; gap: 16px; padding-bottom: 22px; position: relative; }
  .rsp-example-item:not(:last-child)::before {
    content: ""; position: absolute; left: 13px; top: 30px; bottom: 0;
    width: 2px; background: var(--rsp-border-strong);
  }
  .rsp-example-num {
    flex-shrink: 0; z-index: 1; width: 28px; height: 28px; border-radius: 999px;
    background: var(--rsp-primary); color: white;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: .78rem; font-weight: 600;
  }
  .rsp-example-tag {
    display: inline-block; font-size: .72rem; font-weight: 600; letter-spacing: .04em;
    text-transform: uppercase; color: var(--rsp-primary); margin: 4px 0 4px;
  }
  .rsp-example-body { font-size: .86rem; line-height: 1.55; color: var(--rsp-text-muted); margin: 0; }



  @media (max-width: 860px) {
    .rsp-steps { grid-template-columns: 1fr; }
    .rsp-step { border-right: 1px solid var(--rsp-border); border-bottom: none; }
    .rsp-step:first-child { border-radius: var(--rsp-radius) var(--rsp-radius) 0 0; }
    .rsp-step:last-child { border-bottom: 1px solid var(--rsp-border); border-radius: 0 0 var(--rsp-radius) var(--rsp-radius); }
    .rsp-step:not(:last-child)::after {
      top: auto; bottom: -7px; right: 50%; transform: translateX(50%) rotate(135deg);
    }
  }

  /* AVATAR FAQ */
  .rsp-faq { max-width: 760px; margin: 40px auto 0; }
  .rsp-faq-item {
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    background: var(--rsp-surface); margin-bottom: 10px; overflow: hidden;
  }
  .rsp-faq-item[open] { border-color: var(--rsp-border-strong); }
  .rsp-faq-q {
    list-style: none; cursor: pointer; padding: 18px 22px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    font-size: .95rem; font-weight: 500; color: var(--rsp-text); letter-spacing: -.01em;
  }
  .rsp-faq-q::-webkit-details-marker { display: none; }
  .rsp-faq-q::after {
    content: "+"; font-size: 1.2rem; color: var(--rsp-text-muted);
    transition: transform .2s var(--rsp-ease); flex-shrink: 0;
  }
  .rsp-faq-item[open] .rsp-faq-q::after { transform: rotate(45deg); color: var(--rsp-primary); }
  .rsp-faq-a { padding: 0 22px 20px; font-size: .88rem; line-height: 1.6; color: var(--rsp-text-muted); }



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

  /* EVENT TOKEN SUB-HERO */
  .rsp-subhero {
    position: relative; overflow: hidden;
    background:
      radial-gradient(120% 140% at 85% 0%, color-mix(in oklab, var(--rsp-primary) 16%, transparent), transparent 60%),
      linear-gradient(135deg, oklch(20% .03 25), oklch(26% .05 22));
    color: var(--rsp-bg);
    padding: 72px 2rem;
  }
  .rsp-subhero-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1.2fr .8fr; gap: 48px; align-items: center;
    position: relative; z-index: 1;
  }
  .rsp-subhero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .72rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--rsp-primary-glow);
    border: 1px solid color-mix(in oklab, var(--rsp-primary) 40%, transparent);
    background: color-mix(in oklab, var(--rsp-primary) 12%, transparent);
    padding: 6px 14px; border-radius: 999px; margin-bottom: 20px;
  }
  .rsp-subhero h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05; letter-spacing: -.03em;
    margin-bottom: 18px;
  }
  .rsp-subhero h2 em { color: var(--rsp-primary-glow); font-style: italic; }
  .rsp-subhero p {
    font-size: 1.05rem; line-height: 1.7;
    color: color-mix(in oklab, var(--rsp-bg) 80%, transparent);
    max-width: 540px; margin-bottom: 18px;
  }
  .rsp-subhero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }
  .rsp-subhero-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(90deg, var(--rsp-primary), var(--rsp-primary-glow));
    color: oklch(100% 0 0); font-weight: 600; font-size: .95rem;
    padding: 12px 22px; border-radius: 999px; text-decoration: none;
    transition: transform .2s var(--rsp-ease), box-shadow .2s var(--rsp-ease);
    box-shadow: 0 10px 30px -10px color-mix(in oklab, var(--rsp-primary) 60%, transparent);
  }
  .rsp-subhero-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -10px color-mix(in oklab, var(--rsp-primary) 70%, transparent); }
  .rsp-subhero-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid color-mix(in oklab, var(--rsp-bg) 35%, transparent);
    color: var(--rsp-bg); font-weight: 600; font-size: .95rem;
    padding: 12px 22px; border-radius: 999px; text-decoration: none;
    transition: background .2s var(--rsp-ease);
  }
  .rsp-subhero-btn-ghost:hover { background: color-mix(in oklab, var(--rsp-bg) 12%, transparent); }
  .rsp-subhero-roles { list-style: none; display: grid; gap: 14px; margin: 0; padding: 0; }
  .rsp-subhero-role {
    border: 1px solid color-mix(in oklab, var(--rsp-bg) 18%, transparent);
    background: color-mix(in oklab, var(--rsp-bg) 6%, transparent);
    border-radius: var(--rsp-radius); padding: 16px 18px;
    backdrop-filter: blur(4px);
  }
  .rsp-subhero-role-title { font-weight: 700; font-size: .95rem; margin-bottom: 4px; }
  .rsp-subhero-role-desc { font-size: .85rem; line-height: 1.5; color: color-mix(in oklab, var(--rsp-bg) 70%, transparent); }
  @media (max-width: 800px) {
    .rsp-subhero { padding: 48px 1.2rem; }
    .rsp-subhero-inner { grid-template-columns: 1fr; gap: 32px; }
  }



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
  #journey .rsp-journey-card {
    position: relative; overflow: hidden; padding-top: 30px;
    background:
      radial-gradient(120% 140% at 100% 0%, var(--rsp-primary-light) 0%, transparent 55%),
      var(--rsp-surface);
    border-radius: calc(var(--rsp-radius) + 2px);
  }
  #journey .rsp-journey-card::before {
    content: ""; position: absolute; inset: 0 auto 0 0; width: 3px;
    background: linear-gradient(180deg, var(--rsp-primary), transparent);
    opacity: 0; transition: opacity .25s var(--rsp-ease);
  }
  #journey .rsp-journey-card:hover::before { opacity: 1; }
  #journey .rsp-journey-card:hover {
    box-shadow: 0 18px 40px -24px color-mix(in oklab, var(--rsp-primary) 45%, transparent);
  }
  .rsp-journey-step {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 600; letter-spacing: .04em;
    color: var(--rsp-primary);
    width: 34px; height: 34px; border-radius: 9px; margin-bottom: 14px;
    background: var(--rsp-primary-light);
    border: 1px solid oklch(88% .018 25);
    font-variant-numeric: tabular-nums;
  }
  #journey .rsp-journey-card h3 { letter-spacing: -.01em; }
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
    font-size: .78rem; color: var(--rsp-text-muted); font-family: 'IBM Plex Mono', ui-monospace, monospace; line-height: 1.8;
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
    display: block; text-align: left; border: 1px solid var(--rsp-border); border-radius: 14px;
    background: var(--rsp-card, rgba(255,255,255,0.02)); padding: 16px 20px;
    transition: border-color .2s, box-shadow .2s;
  }
  .rsp-help-tile:hover { border-color: rgba(229,57,53,0.55); box-shadow: 0 0 0 1px rgba(229,57,53,0.35), 0 0 22px 2px rgba(229,57,53,0.35); }
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
    .rsp-nav-links, .rsp-menus-wrap { display: none; }
    .rsp-nav-inner > .rsp-nav-cta { display: inline-flex; margin-left: auto; }
    .rsp-nav-burger { display: flex; }
  }
  @media (max-width: 600px) {
    .rsp-principle-grid, .rsp-credits-grid, .rsp-tier-grid { grid-template-columns: 1fr; }
    .rsp-nav { padding: 0 1.2rem; }
    .rsp-section { padding: 56px 1.2rem; }
  }

  /* AREA SWITCHER (Love Key Link · RSP · Identity Avatars) */
  .rsp-areabar {
    position: sticky; top: 60px; z-index: 49;
    background: rgba(255,255,255,.82); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--rsp-border);
  }
  .rsp-areabar-inner {
    max-width: 1100px; margin: auto;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 2rem;
  }
  .rsp-area {
    font-size: .8rem; font-weight: 500; color: var(--rsp-text-muted);
    text-decoration: none; padding: 7px 18px; border-radius: 999px;
    border: 1px solid transparent;
    transition: color .2s var(--rsp-ease), background .2s var(--rsp-ease), border-color .2s var(--rsp-ease);
  }
  .rsp-area:hover { color: var(--rsp-text); background: var(--rsp-bg-warm); }
  .rsp-area-active, .rsp-area-active:hover {
    color: #fff; background: var(--rsp-primary); border-color: var(--rsp-primary);
  }
  @media (max-width: 600px) {
    .rsp-areabar-inner { padding: 8px 1rem; gap: 4px; }
    .rsp-area { padding: 6px 12px; font-size: .74rem; }
  }

  /* BREADCRUMB */
  .rsp-crumbs {
    max-width: 1100px; margin: auto;
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
    padding: 12px 2rem 0;
    font-size: .78rem; color: var(--rsp-text-muted);
  }
  .rsp-crumb { color: var(--rsp-text-muted); text-decoration: none; transition: color .2s var(--rsp-ease); }
  .rsp-crumb:hover { color: var(--rsp-primary); }
  .rsp-crumb-current { color: var(--rsp-text); font-weight: 600; }
  .rsp-crumb-sep { color: var(--rsp-text-soft); opacity: .7; }
  @media (max-width: 600px) { .rsp-crumbs { padding: 10px 1.2rem 0; font-size: .72rem; } }

  /* DROPDOWN MENUS (Love Key Link · RSP · Identity Avatars) */
  .rsp-menus-wrap { display: flex; align-items: center; gap: 1.5rem; }
  .rsp-menus { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
  .rsp-menu { position: relative; }
  .rsp-menu-trigger {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: inherit; font-size: .85rem; font-weight: 500;
    color: var(--rsp-text-muted); background: none; border: none;
    cursor: pointer; padding: 6px 2px; transition: color .2s;
  }
  .rsp-menu-trigger:hover, .rsp-menu[data-open="true"] .rsp-menu-trigger { color: var(--rsp-text); }
  .rsp-menu-trigger.rsp-menu-current { color: var(--rsp-primary); font-weight: 600; }
  .rsp-menu-caret {
    width: 8px; height: 8px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg) translateY(-1px); transition: transform .2s var(--rsp-ease); opacity: .7;
  }
  .rsp-menu[data-open="true"] .rsp-menu-caret { transform: rotate(-135deg) translateY(-1px); }
  .rsp-menu-panel {
    position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
    min-width: 220px; background: var(--rsp-surface);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    box-shadow: 0 12px 34px oklch(18% .02 20 / .14); padding: 8px;
    display: flex; flex-direction: column; gap: 2px; z-index: 60;
    animation: rspFadeUp .18s var(--rsp-ease);
  }
  .rsp-menu-panel::before {
    content: ''; position: absolute; bottom: 100%; left: 0; right: 0; height: 12px;
  }
  .rsp-menu-item {
    display: block; font-size: .84rem; color: var(--rsp-text-muted);
    text-decoration: none; padding: 8px 12px; border-radius: 8px; transition: background .15s, color .15s;
    white-space: nowrap;
  }
  .rsp-menu-item:hover { background: var(--rsp-bg-warm); color: var(--rsp-text); }
  .rsp-menu-subitem { padding-left: 26px; font-size: .8rem; }
  .rsp-menu-branch { display: flex; align-items: center; }
  .rsp-menu-branch > a { flex: 1; }
  .rsp-menu-expand { background: none; border: 0; cursor: pointer; color: var(--rsp-muted, #64748b);
    font-size: .95rem; line-height: 1; padding: 4px 10px; }
  .rsp-menu-expand:hover { color: var(--rsp-primary); }
  .rsp-menu-subitem.rsp-nav-active { box-shadow: inset 3px 0 0 var(--rsp-primary); }
  .rsp-mobile-subitem { padding-left: 18px; font-size: .85rem; }
  .rsp-mobile-subitem.rsp-nav-active { box-shadow: inset 3px 0 0 var(--rsp-primary); }
  .rsp-menu-item.rsp-nav-active { color: var(--rsp-primary); font-weight: 600; background: var(--rsp-primary-light); }

  /* Mobile grouped menu */
  .rsp-mobile-group { padding: 8px 0; border-top: 1px solid var(--rsp-border); }
  .rsp-mobile-group:first-child { border-top: none; }
  .rsp-mobile-group-label {
    font-size: .74rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: var(--rsp-text-soft); padding: 6px 4px;
  }
  .rsp-mobile-group a {
    display: block; font-size: .9rem; color: var(--rsp-text-muted);
    text-decoration: none; padding: 8px 14px; transition: color .2s;
  }
  .rsp-mobile-group a:hover { color: var(--rsp-text); }
  .rsp-mobile-group a.rsp-mobile-subitem { padding-left: 28px; font-size: .84rem; }
  .rsp-mobile-group a.rsp-nav-active { color: var(--rsp-primary); font-weight: 600; }
  @media (max-width: 800px) { .rsp-menus { display: none; } }

  /* PREV / NEXT PAGER */
  .rsp-pager {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: stretch; gap: 12px;
  }
  .rsp-pager-header {
    padding: 14px 2rem 0; justify-content: space-between;
  }
  .rsp-pager-footer {
    padding: 8px 2rem 40px; align-items: center; justify-content: space-between;
  }
  .rsp-pager-btn {
    display: inline-flex; align-items: center; gap: 12px;
    text-decoration: none; color: var(--rsp-text);
    border: 1px solid var(--rsp-border); border-radius: var(--rsp-radius);
    background: var(--rsp-surface); padding: 10px 16px;
    transition: border-color .2s var(--rsp-ease), box-shadow .2s var(--rsp-ease), transform .2s var(--rsp-ease);
    max-width: 46%;
  }
  .rsp-pager-btn:hover {
    border-color: var(--rsp-border-strong);
    box-shadow: 0 6px 20px oklch(18% .02 20 / .08);
    transform: translateY(-1px);
  }
  .rsp-pager-next { text-align: right; }
  .rsp-pager-arrow {
    font-size: 1.1rem; color: var(--rsp-primary); flex: none; line-height: 1;
  }
  .rsp-pager-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .rsp-pager-next .rsp-pager-text { align-items: flex-end; }
  .rsp-pager-dir {
    font-size: .68rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    color: var(--rsp-text-soft);
  }
  .rsp-pager-label {
    font-size: .9rem; font-weight: 500; color: var(--rsp-text);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
  }
  .rsp-pager-cluster {
    font-size: .74rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: var(--rsp-text-soft); text-align: center; flex: none;
  }
  .rsp-pager-spacer { flex: 1; }
  /* header pager: compact, arrows only + short label */
  .rsp-pager-header .rsp-pager-btn { padding: 7px 14px; }
  .rsp-pager-header .rsp-pager-dir { display: none; }
  @media (max-width: 600px) {
    .rsp-pager-header { padding: 12px 1.2rem 0; }
    .rsp-pager-footer { padding: 8px 1.2rem 32px; }
    .rsp-pager-cluster { display: none; }
    .rsp-pager-btn { max-width: 48%; }
    .rsp-pager-footer .rsp-pager-dir { display: none; }
  }
`;
