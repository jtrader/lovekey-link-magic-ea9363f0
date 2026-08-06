import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AesBadge,
  MetricCard,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  Tag,
  VectorBars,
} from "@/components/rsp-property/PropertyUi";
import {
  AES_WEIGHTS,
  computeAes,
  type AgentRecord,
  type PropertyCategory,
  type VendorSpec,
} from "@/lib/reiv-data";

export const Route = createFileRoute("/rsp_/macro/property/ves-formula")({
  head: () => ({
    meta: [
      { title: "AES Simulator — @rsp/property · Love Key Link" },
      {
        name: "description",
        content:
          "Interactive Agent Equilibrium Score calculator: model niche experience, ability to serve and the offer agreement to see how an agent ranks for a vendor's specification.",
      },
      { property: "og:title", content: "AES Simulator — @rsp/property" },
      {
        property: "og:description",
        content:
          "AES = 0.45·NEV + 0.35·SCV + 0.20·OAV — model how experience, availability and offer terms decide which agent is best placed to sell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AesSimulator,
});

type Inputs = {
  regionMatch: boolean;
  categoryMatch: boolean;
  bandMatch: boolean;
  domDelta: number;
  reserveVariance: number;
  nicheVolume: number;
  buyerDepth: number;
  cx: number;
  s: number;
  vt: number;
  va: number;
  openSlots: number;
  override: number;
  absorbMarketing: boolean;
};

const defaults: Inputs = {
  regionMatch: true,
  categoryMatch: true,
  bandMatch: true,
  domDelta: -4,
  reserveVariance: 3.5,
  nicheVolume: 72,
  buyerDepth: 82,
  cx: 88,
  s: 72,
  vt: 100,
  va: 92,
  openSlots: 3,
  override: 0,
  absorbMarketing: true,
};

const spec: VendorSpec = {
  region: "Inner East",
  category: "House" as PropertyCategory,
  band: "$850k – $1.2m",
  timeframe: "1 – 3 months",
};

type Control = {
  key: keyof Inputs;
  tag: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint: string;
};

const nevControls: Control[] = [
  { key: "domDelta", tag: "DOM Δ", label: "Days on market vs regional mean", min: -12, max: 12, suffix: " d", hint: "Negative means this agent sells comparable stock faster than the regional mean." },
  { key: "reserveVariance", tag: "Reserve Δ", label: "Sale price against vendor reserve", min: -6, max: 10, step: 0.1, suffix: "%", hint: "Historical result against reserve on listings matching the vendor's specification." },
  { key: "nicheVolume", tag: "Volume", label: "Verified niche transactions (90d)", min: 0, max: 160, hint: "Verified REIV transactions in this postcode and typology over a rolling 90 days." },
  { key: "buyerDepth", tag: "Depth", label: "Buyer competition depth generated", min: 0, max: 100, hint: "How much genuine buyer competition the agent has historically found for comparable stock." },
];

const scvControls: Control[] = [
  { key: "cx", tag: "CX", label: "Consumer experience index", min: 0, max: 100, hint: "Vendor and buyer satisfaction: response times, appraisal accuracy, campaign follow-through." },
  { key: "s", tag: "S", label: "Workforce stress / capacity used", min: 1, max: 100, suffix: "%", hint: "Percentage of servicing capacity already committed. High stress means the agent cannot serve what they hold." },
  { key: "vt", tag: "V_T", label: "Target financial velocity", min: 10, max: 150, hint: "Listings the office is resourced to carry this cycle." },
  { key: "va", tag: "V_A", label: "Actual financial velocity", min: 10, max: 150, hint: "Listings actually being carried right now." },
  { key: "openSlots", tag: "Slots", label: "Campaign slots open in the vendor's timeframe", min: 0, max: 6, hint: "Availability to actually start this campaign when the vendor needs it." },
];

function AesSimulator() {
  const [v, setV] = useState<Inputs>(defaults);

  const agent = useMemo<AgentRecord>(
    () => ({
      id: "sim",
      agency: "Simulated agent",
      regions: v.regionMatch ? [spec.region] : ["Elsewhere"],
      categories: v.categoryMatch ? [spec.category] : (["Land"] as PropertyCategory[]),
      bands: v.bandMatch ? [spec.band] : ["$1.8m+"],
      domDelta: v.domDelta,
      reserveVariance: v.reserveVariance,
      nicheVolume: v.nicheVolume,
      buyerDepth: v.buyerDepth,
      capacityUsed: v.s,
      cx: v.cx,
      vt: v.vt,
      va: v.va,
      openSlots: v.openSlots,
      marketing: v.absorbMarketing ? "Vendor-paid $0 — absorbed" : "Vendor-paid $1,400",
      commissionOverride: v.override,
    }),
    [v],
  );

  const r = computeAes(agent, spec);

  function slider(c: Control) {
    const value = v[c.key] as number;
    return (
      <div key={c.key}>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label htmlFor={c.key} className="text-sm font-medium text-slate-800">
            <Tag>{c.tag}</Tag> <span className="ml-2">{c.label}</span>
          </label>
          <span className="font-mono text-sm text-emerald-700">
            {value}
            {c.suffix ?? ""}
          </span>
        </div>
        <input
          id={c.key}
          type="range"
          min={c.min}
          max={c.max}
          step={c.step ?? 1}
          value={value}
          onChange={(e) => setV((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
          className="w-full accent-emerald-600"
        />
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{c.hint}</p>
      </div>
    );
  }

  function toggle(key: keyof Inputs, label: string) {
    return (
      <label className="flex items-center gap-2 rounded-lg border border-emerald-500/20 px-3 py-2 font-mono text-xs text-slate-600">
        <input
          type="checkbox"
          checked={v[key] as boolean}
          onChange={(e) => setV((p) => ({ ...p, [key]: e.target.checked }))}
          className="accent-emerald-600"
        />
        {label}
      </label>
    );
  }

  return (
    <PropertyShell current="AES Simulator">
      <SectionHeading
        eyebrow="Interactive three-vector calculator"
        title="Agent Equilibrium Score"
        lead="Agents do not compete on commission. They are evaluated on what they have verifiably sold in the vendor's niche, whether they can serve the listing now, and the offer agreement they put forward. Move the inputs and watch the ranking respond."
      />

      <PropertyCard className="mb-8">
        <p className="text-center font-mono text-base text-emerald-800 md:text-lg">
          AES = {AES_WEIGHTS.nev}·<Tag>NEV</Tag> + {AES_WEIGHTS.scv}·<Tag>SCV</Tag> +{" "}
          {AES_WEIGHTS.oav}·<Tag>OAV</Tag>
        </p>
        <p className="mt-3 text-center font-mono text-xs text-slate-500">
          SCV ← VES = f(Relevance) × (CX / S) × (V_T / V_A)
        </p>
        <p className="mt-4 text-center text-xs text-slate-500">
          Vendor specification under test: {spec.category} · {spec.region} · {spec.band} ·{" "}
          {spec.timeframe}
        </p>
      </PropertyCard>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <PropertyCard>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">
              1 · Niche experience <Tag>NEV</Tag>
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              Verified REIV history, weighted by how closely it matches the vendor's specification.
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {toggle("regionMatch", "Region match")}
              {toggle("categoryMatch", "Category match")}
              {toggle("bandMatch", "Price band match")}
            </div>
            <div className="space-y-6">{nevControls.map(slider)}</div>
          </PropertyCard>

          <PropertyCard>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">
              2 · Ability to serve <Tag>SCV</Tag>
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              Availability and service capacity right now, carried by the VES core.
            </p>
            <div className="space-y-6">{scvControls.map(slider)}</div>
          </PropertyCard>

          <PropertyCard>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">
              3 · Offer agreement <Tag>OAV</Tag>
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              RSP recommends{" "}
              <span className="font-mono text-emerald-700">{r.recommended.toFixed(2)}%</span> as the
              equilibrium commission for this experience and capacity profile. The agent may
              override it.
            </p>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor="override" className="text-sm font-medium text-slate-800">
                <Tag>Override</Tag> <span className="ml-2">Commission offered</span>
              </label>
              <span className="font-mono text-sm text-emerald-700">
                {r.offered.toFixed(2)}%{" "}
                {r.overridden && (
                  <span className="text-amber-600">
                    ({v.override > 0 ? "+" : ""}
                    {v.override.toFixed(2)} override)
                  </span>
                )}
              </span>
            </div>
            <input
              id="override"
              type="range"
              min={-0.8}
              max={0.8}
              step={0.05}
              value={v.override}
              onChange={(e) => setV((p) => ({ ...p, override: Number(e.target.value) }))}
              className="w-full accent-emerald-600"
            />
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              Offering under the recommendation helps the vendor, but an unsustainable undercut is
              discounted rather than rewarded — an agreement the agent cannot fund is not a better
              offer.
            </p>
            <div className="mt-4">{toggle("absorbMarketing", "Agent absorbs marketing spend")}</div>
          </PropertyCard>

          <button
            type="button"
            onClick={() => setV(defaults)}
            className="rounded-xl border border-emerald-500/25 px-4 py-2 font-mono text-xs uppercase tracking-widest text-emerald-700 transition-all hover:border-emerald-500/60"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <MetricCard
            label="Agent Equilibrium Score"
            value={r.aes.toFixed(3)}
            hint="Above 0.72 the agent is presented at the top of the vendor's ranked list; below 0.50 they fall behind better-placed peers."
            state={r.state}
          />
          <MetricCard
            label="RSP recommended commission"
            value={`${r.recommended.toFixed(2)}%`}
            hint="The equilibrium of niche experience and ability to serve — before any override."
          />
          <MetricCard
            label="Commission offered"
            value={`${r.offered.toFixed(2)}%`}
            hint={
              r.overridden
                ? "Agent has overridden the RSP recommendation; the override is shown to the vendor."
                : "Agent accepted the RSP recommendation unchanged."
            }
          />
          <PropertyCard className="p-5">
            <h3 className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              Vector breakdown
            </h3>
            <VectorBars
              vectors={[
                { key: "NEV", label: "niche experience", value: r.nev, weight: AES_WEIGHTS.nev },
                { key: "SCV", label: "ability to serve", value: r.scv, weight: AES_WEIGHTS.scv },
                { key: "OAV", label: "offer agreement", value: r.oav, weight: AES_WEIGHTS.oav },
              ]}
            />
          </PropertyCard>
          <PropertyCard className="p-5">
            <h3 className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              Inside the vectors
            </h3>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              {[
                ["Spec match", r.breakdown.match],
                ["Sale speed", r.breakdown.speed],
                ["Price against reserve", r.breakdown.price],
                ["Buyer competition depth", r.breakdown.depth],
                ["Niche volume", r.breakdown.volume],
                ["VES core", r.breakdown.ves],
                ["Slot availability", r.breakdown.slots],
              ].map(([label, value]) => (
                <li key={label as string} className="flex justify-between">
                  <span>{label}</span>
                  <span className="text-emerald-700">{(value as number).toFixed(3)}</span>
                </li>
              ))}
            </ul>
          </PropertyCard>
          <PropertyCard className="p-5">
            <div className="mb-2 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              As the vendor sees it
            </div>
            <AesBadge aes={r.aes} state={r.state} />
          </PropertyCard>
        </div>
      </div>

      <PropertyCard>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Reading the result</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Turn off the category match and NEV collapses even with a flawless sales record — the
          history no longer describes the property this vendor is selling. Push <Tag>S</Tag> above
          90 and the capacity vector falls away: the agent is holding demand they cannot serve, so
          the listing routes elsewhere until they can. And drag the commission override far below
          the recommendation: the score does not simply climb. Price is one term in an agreement,
          not the contest.
        </p>
      </PropertyCard>
    </PropertyShell>
  );
}
