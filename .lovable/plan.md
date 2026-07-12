# Multi-page RSP site with its own menu

Turn the current single-scroll `/rsp` page into nine linked pages that share one navigation menu, header, and visual system.

## Structure (TanStack file routing)

```
src/routes/rsp.tsx              -> layout: shared shell (nav menu + <Outlet/> + footer)
src/routes/rsp.index.tsx        -> /rsp            Landing
src/routes/rsp.principles.tsx   -> /rsp/principles
src/routes/rsp.how-it-works.tsx -> /rsp/how-it-works
src/routes/rsp.dimensions.tsx   -> /rsp/dimensions
src/routes/rsp.implementations.tsx -> /rsp/implementations
src/routes/rsp.event-token.tsx  -> /rsp/event-token
src/routes/rsp.for-developers.tsx  -> /rsp/for-developers
src/routes/rsp.governance.tsx   -> /rsp/governance
src/routes/rsp.faq.tsx          -> /rsp/faq
```

`rsp.tsx` becomes a layout route (renders `<Outlet/>`), so `/rsp` no longer renders the big page directly — the landing moves to `rsp.index.tsx`.

## Shared shell

Extract the current CSS string and nav into `src/components/RspShell.tsx`:
- Exports the shared `css` and a `RspShell` wrapper (logo -> `/`, the cross-route menu, mobile burger menu, footer, scroll-progress bar).
- Menu uses `<Link to="/rsp/principles">` etc. with `activeProps` highlighting the current route (replacing the current in-page `#anchor` scroll-spy).
- Every subpage renders inside `RspShell`.

## Content mapping (from the existing page)

- Landing (`/rsp`): hero + "what RSP is / what it is not" summary + a grid of cards linking to all sub-sections. Keeps the Chapter PDF / Quiz / Genesis NFT / white paper actions.
- Principles: the Core-principles cards (incl. Avatar sovereignty) + Journey steps.
- How it works: Consent modules + the Avatars "How it works" step flow, the per-step detail blocks, and the Maya worked example.
- Dimensions: the Avatars dimension grid + consent data-model reference.
- Implementations: the Verticals section.
- Event token: the Event Token section + white paper link.
- For developers: the Install section + package/repo references.
- Governance: the NFT Tiers, Credits, and Burn-clause governance content.
- FAQ: the Avatar FAQ accordion.

Each page gets its own `head()` with a unique title + description + og:title/og:description.

## Technical notes

- `rsp.tsx` layout: `createFileRoute("/rsp")` with `component: () => <Outlet/>` (import `Outlet`).
- `rsp.index.tsx`: `createFileRoute("/rsp/")`.
- Shared icons/`PrincipleCard` move into `RspShell.tsx` (or a small `rsp-shared.tsx`) so every page can import them.
- Cross-page links use `<Link>`; in-page jumps within a single page keep `#anchors`.
- Verify with `tsgo --noEmit` after the split.

## Note

This is a structural refactor. The current `/rsp` deep-link anchors (e.g. `/rsp#consent`) will change to real routes (`/rsp/how-it-works`). If you have external links pointing at those anchors, tell me and I'll add redirects.
