# Claude Code Prompt — Official RSP Site (lovekeylink.com/rsp)

Formalizes the Respectful Synchronisation Protocol as a standalone,
properly documented public-facing section of LoveKeyLink — the canonical
reference for RSP's principles, architecture, and implementations across
the LoveKey HELP Network and Twinly, replacing scattered internal
documentation with one authoritative site.

## Context & purpose

RSP has been implemented across multiple products (Twinly's supporter/
creator consent layer, content-library access control, cross-site
identity, escalation/agency delegation, identity-exposure protection) but
has no single formal public reference. This task builds that reference:
part specification, part documentation, part public trust page — serving
three audiences: (1) people affected by RSP-governed systems who want to
understand what it does with their data, (2) developers integrating
`@rsp/core`/`@rsp/react` into new products, (3) LoveKey ecosystem
stakeholders who need the formal spec as a reference point.

A core through-line the site should make explicit: increasingly, the thing
being coordinated and protected is not just raw data but a person's
**avatar** — their represented self online (display identity, likeness,
voice, presence signal, and AI-driven stand-ins). RSP governs how that
represented self is projected, borrowed, and revoked across contexts, so
avatars deserve first-class treatment throughout the site rather than being
folded silently into "identity."

## Tech stack

Match existing LoveKeyLink infrastructure: TanStack Start, Cloudflare
Workers, Vite, Bun, Supabase (project `fuxvcotvflvkrketdpqt` if this
site shares the backend, or confirm if a dedicated project is intended).
RSP packages consumed as existing `file:` dependencies
(`@rsp/core`, `@rsp/react`) per established monorepo convention
(`git@github.com:jtrader/RSP.git`).

## Site structure

```
/rsp                        — Landing: what RSP is, why it exists
/rsp/principles             — Core principles (synchronisation without coercion, etc.)
/rsp/how-it-works            — Plain-language explanation of consent grants,
                               identity context, presence, revocation
/rsp/dimensions              — The tracked consent dimensions (permissions,
                               identity exposure, presence, support signals)
/rsp/avatars                 — Avatars & represented identity: the role of
                               avatars in online ecosystems and how RSP
                               governs likeness, voice, and AI stand-ins
/rsp/implementations          — Where RSP is deployed (Twinly, LoveKey HELP
                               Network products), what it governs in each
/rsp/event-token              — RSP Event Token subsystem overview (ERC-721
                               on Base, whitepaper link, contract reference)
/rsp/for-developers            — @rsp/core and @rsp/react docs: install,
                               core concepts, API reference, integration guide
/rsp/governance                — Who maintains RSP, how principles get
                               updated, versioning approach
/rsp/faq                     — Plain-language Q&A for non-technical visitors
```

## 1. Landing page (`/rsp`)

### Requirements
- Lead with the plain-language explanation, not technical jargon: RSP is
  the consent and coordination layer that governs how personal data,
  identity, and permissions move between people and products in the
  LoveKey ecosystem — "presence without surveillance," "one profile,
  multiple hubs," synchronisation without coercion
- State clearly and early what RSP is *not*: not a surveillance system,
  not a data-selling mechanism, not something that operates without the
  person's knowledge — this page is a trust document as much as a spec
- Include a short framing line on avatars: in today's online climate a
  person is increasingly experienced by others *through their avatar* —
  a display identity, likeness, voice, or AI stand-in — and RSP treats
  that represented self as something the person owns and controls, not
  something a platform can quietly reuse. Link to `/rsp/avatars` for depth.
- Visual identity: use the established RSP brand (metallic red ring logo,
  Orbitron/IBM Plex fonts, circuit aesthetic) consistent with existing RSP
  materials (workplace poster, visual brand identity work)
- Link out to the deeper sections rather than trying to explain everything on one page

### Deliverables
1. Landing page copy + layout matching established RSP visual identity
2. Navigation to all sub-sections listed above

## 2. Core principles (`/rsp/principles`)

### Requirements
- Formalize the principle set already established informally across prior
  RSP work: synchronisation without coercion, presence without
  surveillance, consent as a living/revocable state rather than a
  one-time checkbox, minimization by default
- Add an avatar-sovereignty principle: a person's represented self (avatar,
  likeness, voice, AI stand-in) is projected only with active consent and
  can be withdrawn — likeness is never a permanent grant. Frame this as a
  natural extension of "consent as a living, revocable state" applied to
  identity representation rather than raw data.
- Incorporate the Law of Vibration chapter's Who/What/Where/How/Why
  compromise framework as a formal section if it's meant to be part of the
  public-facing principles (confirm with the team whether this stays
  internal documentation or becomes public-facing content — default to
  keeping the more esoteric/thematic framing internal unless explicitly
  directed to publish it, since a public spec page benefits from being
  read as rigorous engineering/policy documentation first)

### Deliverables
1. Principles page with each principle stated plainly, one paragraph each, avoiding jargon

## 3. How it works (`/rsp/how-it-works`)

### Requirements
- Plain-language walkthrough of the actual mechanics already built across
  the RSP integration tasks: what a consent grant is, how identity context
  resolution works, how revocation propagates, how presence/support
  signals function — written for someone without an engineering
  background, with a technical deep-dive link out to `/rsp/for-developers`
  for anyone who wants the real spec
- Use a concrete example (e.g. "when you set who can see part of your
  profile, here's literally what happens") rather than abstract description
- Include one worked example centred on an avatar (e.g. "when you allow a
  creator's AI twin to speak in your voice for a single session, here's what
  is granted, where it applies, and how revoking it takes effect") so the
  avatar case is shown as concrete mechanics, not an abstract worry.

### Deliverables
1. How-it-works page with at least one concrete worked example

## 4. Dimensions (`/rsp/dimensions`)

### Requirements
- Document each consent dimension RSP currently tracks, based on what's
  actually been implemented: permissions/visibility grants, identity
  context (role/presence resolution), identity exposure (visual/voice
  similarity protection), support signals — as a structured reference,
  not just prose
- Treat avatar/likeness representation as an explicit dimension (or a
  clearly-labelled facet of identity exposure): what visual and voice
  likeness may be rendered, in which contexts, and whether AI-generated
  stand-ins are permitted — with its own example and revocability row.
- This page effectively formalizes the RSP data model that's been built
  incrementally across the Twinly integration tasks — pull the actual
  grant schema shape from the codebase rather than re-describing it from
  memory, so this stays accurate as the implementation evolves

### Deliverables
1. Structured reference table: dimension name, what it governs, example, revocability

## 4b. Avatars & represented identity (`/rsp/avatars`)

### Requirements
- Explain, for a general audience, why avatars matter in the current online
  ecosystem: most online interaction now happens through a represented self
  rather than face-to-face — a chosen name and picture, a curated profile, a
  streamer/creator persona, a voice, and increasingly an AI stand-in or
  "twin" that can act or speak on someone's behalf. This shift makes the
  avatar, not just the underlying account data, the thing that carries a
  person's reputation, relationships, and trust.
- Name the current-climate stakes plainly and honestly (without overstating
  what RSP guarantees): impersonation, deepfaked likeness and voice cloning,
  persona reuse without permission, and blurred lines between a real person
  and an AI representation of them. Position RSP as the consent layer that
  keeps a represented self tied to the person it belongs to.
- Explain what RSP actually does here, mapped to already-built mechanics:
  likeness/voice grants are scoped by context, presence signals control how
  an avatar appears "live" to others, identity-exposure protection guards
  against unwanted visual/voice similarity, and revocation withdraws a
  represented self the same way it withdraws any other grant.
- Cross-reference `/rsp/dimensions` (the avatar/likeness dimension),
  `/rsp/implementations` (Twinly's creator twins and supporter personas),
  and `/rsp/principles` (avatar sovereignty). Keep this page as the single
  human-readable "why avatars" narrative and let the other pages carry the
  structured detail.

### Deliverables
1. Plain-language page on the role and importance of avatars in online
   ecosystems, mapped to concrete RSP mechanics, honestly scoped

## 5. Implementations (`/rsp/implementations`)

### Requirements
- List where RSP is actually deployed and what it governs in each case:
  Twinly (supporter profile visibility, content library access, cross-site
  identity, escalation/agency delegation, identity-exposure protection),
  and any LoveKey HELP Network products where RSP is or will be integrated
- Where a product uses avatars, creator "twins," or AI stand-ins, call out
  what RSP governs for that represented self specifically (e.g. Twinly
  creator twins and supporter personas) so the avatar coverage is concrete
  per product rather than generic.
- Keep this page honestly current — flag it as something that needs
  updating whenever a new product integrates RSP, don't let it go stale

### Deliverables
1. Implementations list, structured so new entries are easy to add

## 6. Event Token subsystem (`/rsp/event-token`)

### Requirements
- Summarize the existing RSP Event Token work (ERC-721 on Base, 38 tests
  passing, trusted backend relayer via `rsp-mint` Supabase Edge Function,
  ZK permissionless minting flagged as a v2 path) — link to the existing
  whitepaper PDF rather than re-writing it from scratch
- Explain in plain language what the Event Token actually does/represents
  for a non-technical visitor, separate from the whitepaper's technical depth

### Deliverables
1. Event Token summary page + link to existing whitepaper

## 7. For developers (`/rsp/for-developers`)

### Requirements
- Real API documentation for `@rsp/core` (8 modules, 34 tests) and
  `@rsp/react` (3 hooks, 4 components, 27 tests) — pull actual
  signatures/exports from the packages rather than inventing example API
  shapes
- Install instructions matching the `file:` dependency convention already
  in use
- A basic integration walkthrough (e.g. "add a consent grant, check a
  permission, handle revocation") using real package APIs
- Where the packages expose likeness/avatar or identity-exposure grants,
  document those APIs alongside the general grant APIs so integrators can
  wire up avatar consent without guessing.

### Deliverables
1. API reference generated/maintained from actual package source (consider
   auto-generation from TypeScript types/JSDoc if the packages are
   annotated, to keep this from drifting out of sync)
2. Integration quickstart guide

## 8. Governance (`/rsp/governance`)

### Requirements
- Explain who maintains RSP, how the principle set or spec could change
  over time, and versioning approach (RSP v1.0 reference already exists
  per the RPMS-style versioning pattern used elsewhere — confirm current
  version number with the team)
- This section matters most if RSP is ever positioned as something other
  products/teams outside the immediate LoveKey ecosystem might adopt —
  worth writing with that possibility in mind even if it's not the
  immediate goal

### Deliverables
1. Governance/versioning page

## 9. FAQ (`/rsp/faq`)

### Requirements
- Plain-language answers to likely visitor questions: "does this mean
  Twinly can see my data on other sites," "can I revoke access," "what
  happens to my data if I stop using a product," "is this the same as a
  privacy policy" (clarify the relationship — RSP is the mechanism,
  privacy policy is the legal document; the two should cross-reference
  each other, not be confused as the same thing)
- Add avatar-focused questions: "can an AI twin use my face or voice
  without me agreeing," "what happens to my avatar/likeness if I leave a
  product," "can I stop a creator persona built from my likeness" — answer
  honestly and point to `/rsp/avatars`.

### Deliverables
1. FAQ page, cross-linked to the site's actual privacy policy

## Non-negotiables
- No content on this site should overstate what RSP guarantees — same
  honesty standard as the identity-protection page from the prior task.
  This applies with extra care to avatar/likeness claims: describe what RSP
  controls (grants, scope, revocation) without implying it can prevent all
  off-platform misuse or deepfakes.
- This site is public-facing: it must be written for a general audience
  first, with technical depth available but not required to understand
  the core trust proposition
- Developer documentation must reflect actual package APIs, not
  aspirational/invented ones — verify against source before publishing
- Cross-reference rather than duplicate: link to the whitepaper, privacy
  policy, and existing RSP materials rather than re-writing them
