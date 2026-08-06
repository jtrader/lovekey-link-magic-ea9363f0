# @rsp/property — three-pronged Agent Equilibrium Score

Replace the "agents compete on commission" framing across the Property branch with the correct model: agents compete on **niche experience**, **availability / ability to serve**, and **offer agreement** (commission being one negotiable term, not the contest).

## The model to document and implement

**Agent Equilibrium Score (AES)** — a composite of three vectors, each shown separately so vendors see *why* an agent ranks where it does:

1. **Niche Experience Vector (NEV)** — how closely the agent's historical REIV record matches the vendor's proposed specification (property category, price band, suburb/region, campaign type). Built from days on market vs regional mean for that niche, sale-price variance against reserve, verified transaction volume in the postcode/typology, and buyer-competition depth (clearance / bidder density) the agent has historically been able to generate for comparable stock.
2. **Servicing Capacity Vector (SCV)** — the agent's real availability to serve this vendor now: workload stress `S`, actual vs target volume `V_A / V_T`, consumer experience `CX`, and open campaign slots in the timeframe the vendor nominated.
3. **Offer Agreement Vector (OAV)** — the commercial terms: commission rate, marketing contribution, campaign strategy. RSP computes a **recommended equilibrium commission** from NEV and SCV; the agent may accept it or **override** it up or down, and the override is scored, not hidden.

`AES = w1·NEV + w2·SCV + w3·OAV` with the weights published on the page. Auction results are presented as a **ranked list sorted by AES**, with rank 1 at the top and each vector broken out — never a commission-only leaderboard.

## Page changes

**Overview** (`/rsp/macro/property/overview`) — rewrite hero lead, the three-column comparison and the flow steps so "reverse auction on commission" becomes "three-pronged equilibrium evaluation". Add a short "What agents actually compete on" block naming the three vectors. Update the head description.

**REIV Telemetry** (`/rsp/macro/property/reiv-telemetry`) — add a panel explaining that these regional rows are the evidence base for the Niche Experience Vector: which columns feed NEV and how a vendor's spec selects the comparable slice.

**VES Simulator** (`/rsp/macro/property/ves-formula`) — extend from the single VES readout to the full AES: keep the existing VES/capacity sliders as the SCV term, add NEV inputs (niche DOM delta, reserve variance, niche volume, buyer-competition depth) and an OAV input (commission, with the RSP-recommended figure shown and an override toggle). Live AES readout, per-vector breakdown bars, state badge and plain-language interpretation of each move.

**Vendor Portal** (`/rsp/macro/property/vendor-portal`) — the simulated auction board becomes an AES board: each arriving agent shows NEV, SCV, the RSP-recommended commission, their actual offered commission (flagged when overridden), and the resulting AES; the list sorts by AES rank. Add a per-agent expand showing the three-vector breakdown and one line of reasoning. Copy changes from "bid their commission down" to "submit an offer against their measured fit".

**Specification** (`/rsp/macro/property/specification`) — update the executive summary, the ASCII dispatch diagram, the reverse-auction step table (step 5 becomes a three-vector offer), the telemetry channel table (add NEV inputs and buyer-competition depth), the VES/rotational-logic section (extend to AES), and the strategic-impact table row on agent pricing. Add a new numbered block covering the AES composition and the recommended-commission-with-override rule.

## Technical notes

- `src/lib/reiv-data.ts` gains typed agent records (historical niche performance per category/region), an `computeNev`, `computeScv`, `recommendedCommission`, `computeAes` set of pure functions, and an AES state mapping reusing the existing balanced / calibrating / suppressed bands. `computeVes` stays as the SCV core so nothing already built breaks.
- `src/components/rsp-property/PropertyUi.tsx` gains a small `VectorBars` / `AesBadge` presentation component reused by the simulator and the portal.
- No database or backend changes; the simulator and portal stay client-side simulations, and the portal keeps its "nothing is stored" disclosure.
- Existing emerald Property skin, `SpecTable` sorting/filtering and route metadata conventions are kept as-is.
