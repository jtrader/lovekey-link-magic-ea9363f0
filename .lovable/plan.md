# @rsp/property — Real estate equilibrium & reverse auction

A new four-page branch nested under Macro Equilibrium, reusing the existing macro shell (site header, breadcrumbs, glossary) with a fresh light green "property" skin.

## Pages

**1. Overview — `/rsp/macro/property/overview`**
"Sell Without Surveillance". Hero with gradient headline, a side-by-side comparison of legacy portal extraction (paid depth, vendor-paid advertising, data resale, lead reselling) versus RSP equilibrium (free vendor registration, agents compete on commission, anonymised intent, capacity-based prominence). Flow diagram: Vendor intent → Anonymised signal → Agent reverse auction → Equilibrium match. Links to the other three pages.

**2. REIV Telemetry — `/rsp/macro/property/reiv-telemetry`**
Interactive dashboard over a bundled sample regional dataset (suburb/region rows with Days on Market, Reserve Price Variance, Category Volume, clearance). Region selector plus category filter, metric cards, a sortable table and simple bar/sparkline visuals. Each row gets a telemetry state — Balanced, Calibrating or Suppressed — derived from the data.

**3. VES Simulator — `/rsp/macro/property/ves-formula`**
Sliders for Relevance, CX, S (stress), V_T and V_A. Live `VES = f(Relevance) × (CX / S) × (V_T / V_A)` readout with monospace parameter tags, a state badge, per-term breakdown bars and plain-language interpretation of what each move does to agent prominence.

**4. Vendor Portal — `/rsp/macro/property/vendor-portal`**
Privacy-first vendor form (property type, region, price band, timeframe — no name/address/contact). On submit it renders the generated anonymised RSP intent signal (hashed token, coarse buckets only) and a live reverse-auction board where simulated agents arrive over time with commission offers, capacity and CX scores, sorted by equilibrium fit. Front-end only — nothing is stored or sent anywhere; the page states this plainly.

## Navigation

Add a "Property" group inside the Macro Equilibrium menu in the site header (Overview, REIV Telemetry, VES Simulator, Vendor Portal), add a Property card to the macro index page, and extend the macro nav/breadcrumbs so the property routes highlight correctly.

## Design

Off-white `#FAFBF9` canvas with soft ambient green gradients, white cards with `emerald-500/15` borders and soft shadows, emerald gradient (`#059669 → #10B981 → #34D399`) on primary buttons, active tabs and hero text. Clean sans headers with monospace tags for `S`, `V_A/V_T`, `CX`, `VES`. State colours: emerald balanced, amber calibrating, ruby suppressed. Fully responsive; sliders and tables usable on mobile.

## Technical notes

- Routes follow the existing escaped-prefix convention: `src/routes/rsp_.macro.property.overview.tsx` etc., each with its own `head()` metadata.
- Shared UI in `src/components/rsp-property/` (PropertyShell, state badge, metric card, telemetry table, VES gauge, auction board).
- Sample REIV data in `src/lib/reiv-data.ts` as a typed constant; all derived metrics computed client-side.
- No database changes; vendor portal and bid feed are simulated in component state.
