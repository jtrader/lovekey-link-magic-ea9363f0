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
