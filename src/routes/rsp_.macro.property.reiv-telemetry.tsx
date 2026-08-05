import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MetricCard,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  StateBadge,
  Tag,
  stateClasses,
} from "@/components/rsp-property/PropertyUi";
import {
  REIV_QUARTER,
  average,
  categories,
  regions,
  reivRows,
  rowState,
  type PropertyCategory,
} from "@/lib/reiv-data";

export const Route = createFileRoute("/rsp_/macro/property/reiv-telemetry")({
  head: () => ({
    meta: [
      { title: "REIV Telemetry — @rsp/property · Love Key Link" },
      {
        name: "description",
        content:
          "Interactive regional real estate telemetry: days on market, reserve price variance, category volume and servicing capacity resolved into balanced, calibrating or suppressed states.",
      },
      { property: "og:title", content: "REIV Telemetry — @rsp/property" },
      {
        property: "og:description",
        content:
          "Parse regional property performance into equilibrium states: days on market, reserve variance, volume and agent capacity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReivTelemetry,
});

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100">
      <div
        className="h-1.5 rounded-full bg-[linear-gradient(135deg,#059669_0%,#10B981_50%,#34D399_100%)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ReivTelemetry() {
  const [region, setRegion] = useState<string>("All regions");
  const [category, setCategory] = useState<PropertyCategory | "All">("All");

  const rows = useMemo(
    () =>
      reivRows.filter(
        (r) =>
          (region === "All regions" || r.region === region) &&
          (category === "All" || r.category === category),
      ),
    [region, category],
  );

  const dom = average(rows.map((r) => r.daysOnMarket));
  const variance = average(rows.map((r) => r.reserveVariance));
  const volume = rows.reduce((a, r) => a + r.volume, 0);
  const capacity = average(rows.map((r) => r.capacityUsed));
  const maxVolume = Math.max(1, ...rows.map((r) => r.volume));

  const counts = rows.reduce(
    (acc, r) => {
      acc[rowState(r)] += 1;
      return acc;
    },
    { balanced: 0, calibrating: 0, suppressed: 0 },
  );

  return (
    <PropertyShell current="REIV Telemetry">
      <SectionHeading
        eyebrow="Bundled sample dataset · illustrative"
        title="REIV Telemetry"
        lead="Regional performance parsed into equilibrium states. Every figure here is anonymised at the region level — no vendor, buyer or individual agent is identifiable in the signal."
      />

      <div className="mb-8 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
            Region
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-xl border border-emerald-500/20 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-emerald-500/60"
          >
            {["All regions", ...regions].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PropertyCategory | "All")}
            className="rounded-xl border border-emerald-500/20 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-emerald-500/60"
          >
            {["All", ...categories].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="pb-2 font-mono text-xs text-slate-500">
          {REIV_QUARTER} · {rows.length} rows
        </span>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Median days on market"
          value={dom.toFixed(1)}
          unit="days"
          hint="Time from listing to unconditional sale."
          state={dom <= 30 ? "balanced" : dom <= 42 ? "calibrating" : "suppressed"}
        />
        <MetricCard
          label="Reserve price variance"
          value={`${variance >= 0 ? "+" : ""}${variance.toFixed(1)}`}
          unit="%"
          hint="Sale price against reserve across the selection."
          state={variance >= 2 ? "balanced" : variance >= -2 ? "calibrating" : "suppressed"}
        />
        <MetricCard
          label="Category volume"
          value={volume.toLocaleString()}
          unit="listings"
          hint="Total listings in the sampled quarter."
        />
        <MetricCard
          label="Servicing capacity used"
          value={capacity.toFixed(0)}
          unit="%"
          hint="Proxy for workforce stress S in the VES formula."
          state={capacity <= 75 ? "balanced" : capacity <= 90 ? "calibrating" : "suppressed"}
        />
      </div>

      <PropertyCard className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Equilibrium distribution</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["balanced", "calibrating", "suppressed"] as const).map((s) => (
            <div key={s} className={`rounded-xl border px-4 py-3 ${stateClasses[s]}`}>
              <div className="mb-1 font-mono text-[0.68rem] uppercase tracking-widest opacity-80">
                {s}
              </div>
              <div className="text-2xl font-semibold">{counts[s]}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Suppressed regions are not underperforming markets — they are markets where demand
          already exceeds what the local workforce can service. Under @rsp/property, free
          prominence in those regions rotates toward operators with spare capacity rather than
          toward whoever holds the longest-standing organic position.
        </p>
      </PropertyCard>

      <PropertyCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-emerald-500/15 bg-emerald-50/40 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              <th className="px-5 py-3">Suburb</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">DOM</th>
              <th className="px-5 py-3">Reserve Δ</th>
              <th className="px-5 py-3">Volume</th>
              <th className="px-5 py-3">
                <Tag>S</Tag>
              </th>
              <th className="px-5 py-3">State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.suburb}-${r.category}`} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{r.suburb}</div>
                  <div className="font-mono text-[0.68rem] text-slate-500">{r.region}</div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{r.category}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-700">{r.daysOnMarket}</td>
                <td
                  className={`px-5 py-3 font-mono text-xs ${
                    r.reserveVariance >= 0 ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {r.reserveVariance >= 0 ? "+" : ""}
                  {r.reserveVariance.toFixed(1)}%
                </td>
                <td className="w-40 px-5 py-3">
                  <div className="mb-1 font-mono text-xs text-slate-700">{r.volume}</div>
                  <Bar value={r.volume} max={maxVolume} />
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-700">{r.capacityUsed}%</td>
                <td className="px-5 py-3">
                  <StateBadge state={rowState(r)} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center font-mono text-xs text-slate-500">
                  No rows for this selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </PropertyCard>
    </PropertyShell>
  );
}
