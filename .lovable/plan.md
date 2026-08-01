## Goal

Make the one-page Vertical Equilibrium Optimization branch summary downloadable from the VEO overview page (`/rsp/ethical-auction`). Today it only exists as a generated file in your documents, not on the site.

## Where PDFs live today (for reference)

- Header "White Paper" button (desktop + mobile) → RSP whitepaper
- `/rsp` overview → whitepaper + Law of Vibration chapter
- `/rsp/event-token` → whitepaper
- `/quiz` → chapter PDF; quiz results PDF generated in-browser

## Steps

1. Publish the existing `veo-branch-summary.pdf` to the site's CDN asset store, creating `src/assets/veo-branch-summary.pdf.asset.json` (same mechanism the whitepaper uses).
2. In `src/routes/rsp.ethical-auction.index.tsx`, add a download button near the top of the intro section (alongside the existing intro content), labelled something like "Download the VEO one-page summary (PDF)", using the existing button styling used elsewhere in the branch.
3. Confirm the link downloads correctly in the preview and that layout holds on mobile (768px) and desktop.

## Technical detail

- Asset created via `lovable-assets create --file /mnt/documents/veo-branch-summary.pdf`, output written to the `.asset.json` pointer; imported and referenced as `href={asset.url} download="veo-branch-summary.pdf"`.
- No backend or business-logic changes; presentation only.
