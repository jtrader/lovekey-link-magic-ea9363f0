## Goal

Fix the ideological framing across the Vertical Equilibrium Optimization (VEO) branch. The correct legacy-model critique is:

- **Dominant vertical players rank organically for free** and absorb traffic they cannot fully serve.
- **Capable competitors must pay for clicks** just to reach the same demand — paying to serve need the incumbents are already wasting.
- VEO's correction: prominence on **both** surfaces follows real serviceability, so capable operators earn organic exposure without buying it, and saturated incumbents lose free organic overflow rather than simply being outbid.

Anything implying "incumbents pay for clicks" or "capable competitors gain organic while dominants must pay" is wrong and gets rewritten.

## Content changes

**`src/routes/rsp.ethical-auction.index.tsx`**
- Rewrite the legacy bullet at line 70 to the correct asymmetry: dominant players receive free organic traffic they cannot service, while capable competitors are forced to buy clicks to be seen at all.
- Adjust the surrounding legacy bullets (68–69) so free organic capture by incumbents and paid entry cost for challengers read as two halves of the same distortion.
- Tune the equilibrium bullets (78) and the ranking-formula lead (90) so the fix is stated as: organic prominence stops being a free incumbency annuity, and paid spend stops being the entry fee for capable operators.
- Add a short **worked example** block under the formula section, written with the corrected ideology: a saturated incumbent holding position 1 organically with a 5-day callback backlog, versus a capable operator with same-day capacity paying for clicks to be visible — then what VEO changes for each (VES throttles the incumbent's free organic exposure; the capable operator earns organic prominence and lowers paid dependence).

**`src/routes/rsp.ethical-auction.intent.tsx`** (line ~122)
- The "how does a small operator get seen" row already reads correctly ("only by outbidding incumbents or out-aging their domain authority") — extend the answer side to state that under VEO capacity earns organic prominence directly, removing the pay-to-be-seen tax.

**`src/routes/rsp.ethical-auction.equilibrium.tsx`** (lines ~34, 149–152)
- Reframe the Operator A/B comparison so the incumbent's advantage is explicitly free organic dominance plus budget, and the challenger's disadvantage is having to buy visibility despite having capacity.

**`src/routes/rsp.ethical-auction.capacity.tsx`** (lines ~34, 102–120)
- Ensure each engine action names both effects in the right direction: saturation removes *free organic prominence* first, not only paid bids; headroom restores organic prominence so the operator does not have to pay for reach.

**`src/routes/rsp.ethical-auction.adoption.tsx`** (lines ~113–125)
- Merchant benefits: stop paying for clicks purely to overcome incumbent organic dominance; incumbents stop absorbing unserviceable organic overflow.

**`src/routes/rsp.ethical-auction.experience.tsx`** (line ~81)
- Same directional correction in the rotation sentence.

## Technical notes

Text-only edits inside existing JSX in the six `rsp.ethical-auction.*.tsx` route files, plus one new worked-example block on the index page reusing existing `ea-*` classes (no new CSS unless the example needs a two-column compare, in which case the existing `.ea-compare` pattern from the equilibrium page is reused). Meta descriptions on the index page get a light wording pass to match. No data, routing, or navigation changes.
