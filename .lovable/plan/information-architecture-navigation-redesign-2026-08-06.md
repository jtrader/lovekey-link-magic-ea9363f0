# Information architecture + navigation redesign

A full audit of the site's scopes, protocol branches, tokens and menus, followed by a single coherent navigation schema and a set of repeatable page layouts.

## What the audit found

**Five top-level menus that don't describe five real things.** "Love Key Link", "RSP", "Pulse", "Equilibrium Theory VEO", "Identity Avatars" mix a product, a protocol, and three protocol branches at the same level, so nothing signals which is a parent and which is a child.

**"RSP" is a catch-all.** Its active rule is "any path that isn't one of the other areas", so `/login`, `/quiz`, `/admin`, `/invite/...` all light up RSP in the header.

**Identity Avatars owns pages that aren't about avatars.** `/rsp/how-it-works`, `/rsp/dimensions`, `/rsp/checklist`, `/rsp/faq` are general protocol pages listed under the Avatars menu, so the protocol's own core explainer pages are unreachable from the RSP menu.

**Macro and Property are duplicated.** Both appear as expandable branches inside the RSP menu *and* inside the VEO menu — ten repeated links, and no single canonical home.

**Two competing chromes.** Macro/Property pages live outside the `/rsp` layout and render their own `MacroShell` nav bar underneath the site header, so those pages have two navigation strips, two breadcrumb systems, and a different visual language from the rest of RSP.

**Orphans and gaps.** `/rsp/spec-check` is in no menu. The app itself (`/login`, `/app`, `/quiz`) is absent from navigation entirely. NFT/token material is one page (`/rsp/event-token`) with related token language scattered across the RSP overview, governance and home footer. Downloadable artefacts (whitepaper, VEO summary, macro summary, property spec MD + ZIP) are scattered across five pages with only the whitepaper in the header.

## The new schema

Four scopes, each with one hub page and one menu:

```text
Love Key Link (product)      Home · How it works · Help Network · Quiz · Sign in
RSP (the protocol)           Overview · Principles · How it works · Dimensions
                             Identity checklist · Event Token (NFT) · Governance
                             FAQ · For developers · Case studies · Implementations
Applications (branches)      Pulse         -> overview, server, telemetry, allocation,
                                              strain engine, disaster aid, open spec
                             VEO           -> overview, intent, capacity, experience,
                                              equilibrium, adoption
                             Macro         -> index, overview, telemetry, VES, calibration,
                                              governance
                             Property      -> overview, REIV telemetry, VES simulator,
                                              vendor portal, specification
Identity Avatars             Overview · Avatar Creator · Creator guide
Resources                    Whitepaper · VEO summary · Macro spec · Property spec (MD/ZIP)
                             · Spec checklist (internal)
```

Every branch lives under Applications exactly once. Avatars keeps only avatar pages; the protocol explainers return to RSP. Macro and Property stop being duplicated.

## Navigation behaviour

- Header becomes four scope triggers plus a Resources link and a single primary CTA. Applications opens a two-column mega panel with one column per branch — branch name, one-line descriptor, its pages — so the whole branch tree is visible in one glance instead of behind expanders.
- Active state resolves by explicit path ownership per scope, replacing the "everything else is RSP" rule. App routes (`/login`, `/app`, `/quiz`, `/invite`) map to the product scope.
- Mobile: accordion by scope, one open at a time, current scope pre-expanded and the current page marked.
- One breadcrumb system for all pages, including Macro and Property.

## Page layouts

- **Branch hub** (Pulse, VEO, Macro, Property, Avatars): one-line definition, status/version chip, 3 key metrics or claims, a card grid of the branch's pages with a one-line "what you'll learn", download for that branch's artefact, and "next" pointer.
- **Content page**: sticky in-page contents on desktop, lead paragraph that states the takeaway before the detail, callouts for formulas/terms, prev/next pager, and a related-branch strip at the foot.
- **Interactive page** (simulators, telemetry, vendor portal): controls first, result read-out pinned above the fold, explanation underneath.
- Consistent card, chip and table treatments across all scopes so Macro/Property/Pulse stop looking like three different sites.

## Technical notes

- `areaMenus` in `src/components/SiteHeader.tsx` is rewritten as a scope registry with explicit `owns: string[]` path prefixes; `MenuBranch` is replaced by a mega-panel renderer for the Applications scope.
- `MacroShell` in `src/components/rsp-macro/MacroNav.tsx` drops its own nav strip and breadcrumbs, keeping only the glossary/key-terms rail; Macro/Property pages inherit the shared breadcrumbs and pager.
- Breadcrumb and pager logic move out of `src/routes/rsp.tsx` into a shared module driven by the same scope registry, so Macro/Property (routed at `rsp_.macro.*`) get the same trail.
- New shared layout primitives (`BranchHub`, `PageLead`, `OnThisPage`, `RelatedStrip`) added under `src/components/rsp-shared.tsx`.
- A `/resources` route collects every downloadable artefact; existing per-page download buttons stay.
- Route paths do not change, so no published URL breaks.

## Sequence

1. Scope registry + header/mega-menu + mobile accordion.
2. Unified breadcrumbs/pager; strip the duplicate Macro nav.
3. Branch hub layout applied to Pulse, VEO, Macro, Property, Avatars.
4. Content/interactive page layout pass and shared card/table styling.
5. Resources page and header CTA wiring.
