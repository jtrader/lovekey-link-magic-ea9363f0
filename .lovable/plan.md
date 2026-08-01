## Goal

Make it unmistakable throughout the Vertical Equilibrium Optimization branch that the model governs **both organic ranking (SEO) and paid auctions (SEM)** — not just paid clicks. Copy-only changes; no logic or layout work.

## Changes by page

**/rsp/ethical-auction (index)**
- Intro lead: reframe from "Search ranking and pay-per-click auctions" to explicitly state both distribution channels are governed by the same equilibrium layer, and that VEO is the successor to SEO *and* SEM.
- Legacy-model bullets:
  - "Capable competitors starve while dominant players pay for clicks **and inherit organic traffic** they cannot service."
  - Top-players bullet: make clear dominance comes from *both* ad budget and legacy organic authority.
  - Dead-lead bullet: note leads arrive via both paid and organic listings.
- Ethical Auction bullets: state prominence rotation applies to organic results and paid placements alike; throttling covers both.
- "Respectful Intent Score" section: clarify the score multiplies into paid Ad Rank *and* acts as an organic ranking modifier — add one line under the formula and rename the table's third column to "Ranking / auction effect", with each row's text touching both surfaces where natural.
- Architecture flow: "Rotational exposure" node text to say prominence across organic and paid results.

**/rsp/ethical-auction/intent**
- The "how does a new entrant get seen?" comparison row currently says "Only by outbidding the incumbents" — extend to "Only by outbidding incumbents or out-aging their domain authority", with the VEO counterpart covering both surfaces.

**/rsp/ethical-auction/capacity** and **/experience**
- Already mention "paid bids and organic prominence" in places; make the remaining capacity/response rows consistent so every throttle/boost description names both channels.

**/rsp/ethical-auction/equilibrium**
- VES description: state the multiplier is applied to both the paid auction rank and the organic ranking signal, not just "on top of conventional relevance and bidding".

**/rsp/ethical-auction/adoption**
- Search-engine benefits: mention improved organic result quality alongside auction inventory.
- Business benefits: add that baseline exposure is guaranteed across organic and paid, not budget-dependent.

**Metadata**
- Tighten the index page description (and the branch subtitle where it appears in `src/components/rsp-ethical-auction.tsx`) so "organic (SEO) and paid (SEM)" appears explicitly for search snippets.

## Technical notes

Edits confined to `src/routes/rsp.ethical-auction.*.tsx` and the header/subtitle strings in `src/components/rsp-ethical-auction.tsx`. No component API, styling, or data changes.
