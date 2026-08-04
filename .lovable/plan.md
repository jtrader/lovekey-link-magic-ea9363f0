# RSP Pulse Server — Summary View

An editorial, calm summary page explaining what the Pulse Server is, how it works, and why it exists — sitting alongside the live dashboard under the Pulse menu.

## What gets built

A new page at `/rsp/pulse/summary` titled "Inside the RSP Pulse Server", with a short intro and five cards in the existing RSP light theme (warm surfaces, muted earth tones, IBM Plex Mono eyebrows, no dashboard chrome):

1. **The Core Telemetry Engine** — macro population strain sensing; the Event Strain Index as equilibrium between regional support capacity and network demand; low-resolution weighted signals so coordination never becomes surveillance.
2. **Ecosystem Placement and Scope** — nested beneath the Pulse hierarchy in the protocol navigation; edge actions from 100+ countries and 50 languages; categorical contexts only ("Home", "In Transit"), never high-precision spatial tracking.
3. **Privacy Mechanics and Edge Escrow** — edge-to-anonymised-pool architecture; PII and exact IPs burned on write at the device edge; regional telemetry held in escrow until k-anonymity density N ≥ 50.
4. **Real-Time Temporal Dynamics** — 15-minute sliding window against a trailing 30-day regional baseline; instant detection of surgency and network stress; graceful decay of source links.
5. **The Humanitarian Imperative** — empowers the Help Network; routes responder resources across Prepare, Respond, Recover, Heal; capacity balancing without commercial tracking.

Each card gets a soft ambient accent tint and a line-art icon reused from the existing RSP icon set. Section 5 additionally renders the four coordination stages as a quiet inline row.

Closing links out to the live Pulse Server dashboard, Global Telemetry and the Open Spec.

## Navigation

Add "Pulse Server — Summary" to the Pulse dropdown in `SiteHeader.tsx`, directly under Overview, and add a matching card to the Pulse Overview grid.

## Technical notes

- New route file `src/routes/rsp.pulse.summary.tsx` (route head with unique title/description/OG tags), rendering a new presentational component `src/components/rsp/PulseSummary.tsx`.
- Styling via a scoped `<style>` block in the component, matching the pattern used by `PulseServerUi.tsx` / `PulseTelemetryFlow.tsx`, using existing `--rsp-*` tokens only.
- Static content only — no database reads, no changes to `pulse-telemetry.ts` or the live dashboard.
