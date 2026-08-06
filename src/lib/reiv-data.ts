/**
 * Bundled sample REIV-style regional real-estate telemetry.
 * Illustrative figures only — used to demonstrate @rsp/property equilibrium states.
 */

export type PropertyCategory = "House" | "Unit" | "Townhouse" | "Land";

export type ReivRow = {
  region: string;
  suburb: string;
  category: PropertyCategory;
  /** Median days on market */
  daysOnMarket: number;
  /** Percentage variance of sale price against reserve (+ above reserve) */
  reserveVariance: number;
  /** Listings volume in the sampled quarter */
  volume: number;
  /** Auction clearance rate, percent */
  clearance: number;
  /** Agent servicing capacity used, percent (proxy for workforce stress S) */
  capacityUsed: number;
};

export const REIV_QUARTER = "Q2 2026 (sample)";

export const reivRows: ReivRow[] = [
  { region: "Inner Melbourne", suburb: "Carlton", category: "Unit", daysOnMarket: 41, reserveVariance: -2.4, volume: 186, clearance: 61, capacityUsed: 94 },
  { region: "Inner Melbourne", suburb: "Fitzroy", category: "House", daysOnMarket: 27, reserveVariance: 4.1, volume: 98, clearance: 78, capacityUsed: 72 },
  { region: "Inner Melbourne", suburb: "Richmond", category: "Townhouse", daysOnMarket: 33, reserveVariance: 1.2, volume: 141, clearance: 70, capacityUsed: 88 },
  { region: "Inner East", suburb: "Camberwell", category: "House", daysOnMarket: 24, reserveVariance: 6.8, volume: 112, clearance: 83, capacityUsed: 64 },
  { region: "Inner East", suburb: "Hawthorn", category: "Unit", daysOnMarket: 38, reserveVariance: -0.9, volume: 174, clearance: 66, capacityUsed: 91 },
  { region: "Inner East", suburb: "Balwyn", category: "House", daysOnMarket: 29, reserveVariance: 3.4, volume: 87, clearance: 76, capacityUsed: 70 },
  { region: "Outer East", suburb: "Ringwood", category: "House", daysOnMarket: 35, reserveVariance: 0.6, volume: 132, clearance: 68, capacityUsed: 79 },
  { region: "Outer East", suburb: "Croydon", category: "Townhouse", daysOnMarket: 44, reserveVariance: -3.1, volume: 96, clearance: 58, capacityUsed: 96 },
  { region: "North", suburb: "Preston", category: "House", daysOnMarket: 31, reserveVariance: 2.2, volume: 158, clearance: 72, capacityUsed: 81 },
  { region: "North", suburb: "Craigieburn", category: "Land", daysOnMarket: 62, reserveVariance: -5.7, volume: 74, clearance: 47, capacityUsed: 98 },
  { region: "West", suburb: "Footscray", category: "Unit", daysOnMarket: 48, reserveVariance: -4.2, volume: 163, clearance: 55, capacityUsed: 93 },
  { region: "West", suburb: "Werribee", category: "House", daysOnMarket: 39, reserveVariance: -1.4, volume: 149, clearance: 63, capacityUsed: 86 },
  { region: "Bayside", suburb: "Brighton", category: "House", daysOnMarket: 22, reserveVariance: 8.3, volume: 68, clearance: 86, capacityUsed: 58 },
  { region: "Bayside", suburb: "Mentone", category: "Townhouse", daysOnMarket: 30, reserveVariance: 2.9, volume: 91, clearance: 74, capacityUsed: 69 },
  { region: "Regional Victoria", suburb: "Ballarat", category: "House", daysOnMarket: 52, reserveVariance: -2.8, volume: 121, clearance: 54, capacityUsed: 84 },
  { region: "Regional Victoria", suburb: "Geelong", category: "Unit", daysOnMarket: 46, reserveVariance: -1.1, volume: 137, clearance: 60, capacityUsed: 89 },
];

export type TelemetryState = "balanced" | "calibrating" | "suppressed";

/**
 * Equilibrium state for a region row: fast-moving stock at or above reserve with
 * spare servicing capacity is balanced; saturated capacity with slow, under-reserve
 * stock is suppressed.
 */
export function rowState(row: ReivRow): TelemetryState {
  const pressure =
    (row.daysOnMarket - 30) * 0.9 +
    Math.max(0, row.capacityUsed - 75) * 1.4 +
    Math.max(0, -row.reserveVariance) * 2.2 +
    Math.max(0, 70 - row.clearance) * 0.8;
  if (pressure <= 10) return "balanced";
  if (pressure <= 32) return "calibrating";
  return "suppressed";
}

export const stateLabel: Record<TelemetryState, string> = {
  balanced: "Balanced",
  calibrating: "Calibrating",
  suppressed: "Suppressed",
};

export const regions = Array.from(new Set(reivRows.map((r) => r.region)));
export const categories = Array.from(new Set(reivRows.map((r) => r.category)));

export function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** VES = f(Relevance) × (CX / S) × (V_T / V_A) */
export function computeVes(input: {
  relevance: number;
  cx: number;
  s: number;
  vt: number;
  va: number;
}) {
  const fRelevance = Math.sqrt(Math.max(0, input.relevance) / 100);
  const cxOverS = input.cx / Math.max(1, input.s);
  const vtOverVa = input.vt / Math.max(1, input.va);
  const ves = fRelevance * cxOverS * vtOverVa;
  return { fRelevance, cxOverS, vtOverVa, ves };
}

export function vesState(ves: number): TelemetryState {
  if (ves >= 0.85) return "balanced";
  if (ves >= 0.5) return "calibrating";
  return "suppressed";
}

/* ------------------------------------------------------------------------- *
 * Agent Equilibrium Score (AES)
 *
 * Agents do NOT compete on commission. They compete on a three-pronged
 * evaluation, each vector scored 0–1 and published to the vendor:
 *
 *   1. NEV — Niche Experience Vector: how the agent's historical REIV record
 *      matches the vendor's proposed specification, including the buyer
 *      competition depth they have historically generated for comparable stock.
 *   2. SCV — Servicing Capacity Vector: their real availability to serve this
 *      vendor now (S, V_A/V_T, CX, open campaign slots in the timeframe).
 *   3. OAV — Offer Agreement Vector: the commercial terms. RSP recommends an
 *      equilibrium commission from NEV + SCV; the agent may override it, and
 *      the override is scored openly rather than hidden.
 *
 *   AES = w1·NEV + w2·SCV + w3·OAV
 * ------------------------------------------------------------------------- */

export const AES_WEIGHTS = { nev: 0.45, scv: 0.35, oav: 0.2 } as const;

export const priceBands = [
  "$400k – $600k",
  "$600k – $850k",
  "$850k – $1.2m",
  "$1.2m – $1.8m",
  "$1.8m+",
] as const;
export type PriceBand = (typeof priceBands)[number];

export const timeframes = [
  "Within 30 days",
  "1 – 3 months",
  "3 – 6 months",
  "Just exploring",
] as const;
export type Timeframe = (typeof timeframes)[number];

export type VendorSpec = {
  region: string;
  category: PropertyCategory;
  band: string;
  timeframe: string;
};

export type AgentRecord = {
  id: string;
  agency: string;
  /** Regions the agent has verified REIV transactions in. */
  regions: string[];
  /** Property categories the agent has a verified niche record in. */
  categories: PropertyCategory[];
  /** Price bands the agent regularly transacts in. */
  bands: string[];
  /** Days on market against the regional mean for this niche (negative = faster). */
  domDelta: number;
  /** Historical sale price against vendor reserve, percent. */
  reserveVariance: number;
  /** Verified transactions in the niche over a rolling 90 days. */
  nicheVolume: number;
  /** Buyer competition depth generated for comparable stock, 0–100. */
  buyerDepth: number;
  /** Workforce stress S, percent of servicing capacity committed. */
  capacityUsed: number;
  /** Consumer experience index, 0–100. */
  cx: number;
  /** Target financial velocity. */
  vt: number;
  /** Actual financial velocity. */
  va: number;
  /** Campaign slots open inside the vendor's timeframe. */
  openSlots: number;
  /** Marketing terms carried into the offer agreement. */
  marketing: string;
  /** How the agent chooses to move off the RSP recommendation, in points. */
  commissionOverride: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** How closely an agent's verified record matches the vendor's specification, 0–1. */
export function specMatch(agent: AgentRecord, spec: VendorSpec) {
  const region = agent.regions.includes(spec.region) ? 1 : 0.45;
  const category = agent.categories.includes(spec.category) ? 1 : 0.4;
  const band = agent.bands.includes(spec.band) ? 1 : 0.55;
  return clamp01(region * 0.35 + category * 0.4 + band * 0.25);
}

/** Niche Experience Vector — historical REIV performance against the vendor's spec. */
export function computeNev(agent: AgentRecord, spec: VendorSpec) {
  const match = specMatch(agent, spec);
  const speed = clamp01((10 - agent.domDelta) / 20); // −10 days → 1.0
  const price = clamp01((agent.reserveVariance + 4) / 12); // +8% → 1.0
  const depth = clamp01(agent.buyerDepth / 100);
  const volume = clamp01(Math.log10(Math.max(1, agent.nicheVolume)) / 2); // 100 sales → 1.0
  const performance = speed * 0.28 + price * 0.28 + depth * 0.26 + volume * 0.18;
  return {
    match,
    speed,
    price,
    depth,
    volume,
    nev: clamp01(match * performance + (match - 1) * 0.05),
  };
}

/** Servicing Capacity Vector — can this agent actually serve the listing now? */
export function computeScv(agent: AgentRecord, spec: VendorSpec) {
  const { ves } = computeVes({
    relevance: 100,
    cx: agent.cx,
    s: agent.capacityUsed,
    vt: agent.vt,
    va: agent.va,
  });
  const urgent = spec.timeframe === "Within 30 days" || spec.timeframe === "1 – 3 months";
  const slots = clamp01(agent.openSlots / (urgent ? 4 : 2));
  const scv = clamp01(clamp01(ves / 1.4) * 0.7 + slots * 0.3);
  return { ves, slots, scv };
}

/**
 * The commission RSP recommends as the equilibrium of experience and capacity.
 * Deep niche experience earns a higher rate; spare capacity and a stronger
 * ability to serve moderates it. Vendors always see this figure beside the
 * agent's actual offer.
 */
export function recommendedCommission(nev: number, scv: number) {
  const rate = 1.55 + nev * 1.35 - scv * 0.35;
  return Math.round(Math.min(3.2, Math.max(1.4, rate)) * 100) / 100;
}

/**
 * Offer Agreement Vector — how the agent's offered terms sit against the
 * recommendation. Offering under the recommendation helps the vendor, but an
 * unsustainable undercut is discounted rather than rewarded: an agreement the
 * agent cannot fund is not a better offer.
 */
export function computeOav(offered: number, recommended: number, absorbsMarketing: boolean) {
  const delta = (recommended - offered) / recommended; // >0 = below recommendation
  let score: number;
  if (delta >= 0) score = 0.72 + Math.min(delta, 0.15) * 1.6 - Math.max(0, delta - 0.15) * 1.4;
  else score = 0.72 + delta * 1.1;
  return {
    delta,
    overridden: Math.abs(offered - recommended) >= 0.05,
    oav: clamp01(score + (absorbsMarketing ? 0.08 : 0)),
  };
}

export type AesResult = {
  agent: AgentRecord;
  nev: number;
  scv: number;
  oav: number;
  aes: number;
  recommended: number;
  offered: number;
  overridden: boolean;
  state: TelemetryState;
  breakdown: ReturnType<typeof computeNev> & ReturnType<typeof computeScv>;
};

export function computeAes(agent: AgentRecord, spec: VendorSpec): AesResult {
  const nevParts = computeNev(agent, spec);
  const scvParts = computeScv(agent, spec);
  const recommended = recommendedCommission(nevParts.nev, scvParts.scv);
  const offered =
    Math.round(Math.min(3.5, Math.max(1.2, recommended + agent.commissionOverride)) * 100) / 100;
  const { oav, overridden } = computeOav(
    offered,
    recommended,
    agent.marketing.toLowerCase().includes("absorbed"),
  );
  const aes =
    nevParts.nev * AES_WEIGHTS.nev + scvParts.scv * AES_WEIGHTS.scv + oav * AES_WEIGHTS.oav;
  return {
    agent,
    nev: nevParts.nev,
    scv: scvParts.scv,
    oav,
    aes,
    recommended,
    offered,
    overridden,
    state: aesState(aes),
    breakdown: { ...nevParts, ...scvParts },
  };
}

export function aesState(aes: number): TelemetryState {
  if (aes >= 0.72) return "balanced";
  if (aes >= 0.5) return "calibrating";
  return "suppressed";
}

/** Rank 1 first: highest equilibrium fit at the top of the vendor's list. */
export function rankByAes(results: AesResult[]) {
  return [...results].sort((a, b) => b.aes - a.aes);
}

export const agentRecords: AgentRecord[] = [
  { id: "meridian", agency: "Meridian & Co.", regions: ["Inner Melbourne", "Inner East"], categories: ["House", "Townhouse"], bands: ["$850k – $1.2m", "$1.2m – $1.8m"], domDelta: -7, reserveVariance: 5.4, nicheVolume: 64, buyerDepth: 88, capacityUsed: 62, cx: 91, vt: 100, va: 78, openSlots: 4, marketing: "Vendor-paid $0 — absorbed", commissionOverride: 0 },
  { id: "northline", agency: "Northline Property", regions: ["North", "West"], categories: ["House", "Land"], bands: ["$400k – $600k", "$600k – $850k"], domDelta: 2, reserveVariance: 1.1, nicheVolume: 112, buyerDepth: 71, capacityUsed: 88, cx: 84, vt: 100, va: 104, openSlots: 1, marketing: "Vendor-paid $1,400", commissionOverride: -0.35 },
  { id: "harbourfield", agency: "Harbourfield Agents", regions: ["Bayside", "Inner Melbourne"], categories: ["Unit", "Townhouse"], bands: ["$600k – $850k", "$850k – $1.2m"], domDelta: -3, reserveVariance: 3.2, nicheVolume: 87, buyerDepth: 80, capacityUsed: 71, cx: 87, vt: 100, va: 88, openSlots: 3, marketing: "Vendor-paid $0 — absorbed", commissionOverride: 0.1 },
  { id: "cassia", agency: "Cassia Residential", regions: ["West", "Regional Victoria"], categories: ["Unit", "House"], bands: ["$400k – $600k", "$600k – $850k"], domDelta: 6, reserveVariance: -2.6, nicheVolume: 143, buyerDepth: 58, capacityUsed: 95, cx: 79, vt: 100, va: 118, openSlots: 0, marketing: "Vendor-paid $2,100", commissionOverride: -0.6 },
  { id: "ellsworth", agency: "Ellsworth Group", regions: ["Inner East", "Bayside"], categories: ["House"], bands: ["$1.2m – $1.8m", "$1.8m+"], domDelta: -9, reserveVariance: 7.6, nicheVolume: 41, buyerDepth: 93, capacityUsed: 58, cx: 93, vt: 100, va: 71, openSlots: 4, marketing: "Vendor-paid $0 — absorbed", commissionOverride: 0.25 },
  { id: "rowan", agency: "Rowan & Kestrel", regions: ["Outer East", "North"], categories: ["Townhouse", "Land", "House"], bands: ["$600k – $850k", "$850k – $1.2m"], domDelta: 0, reserveVariance: 2.0, nicheVolume: 96, buyerDepth: 74, capacityUsed: 76, cx: 82, vt: 100, va: 92, openSlots: 2, marketing: "Vendor-paid $900", commissionOverride: -0.15 },
];
