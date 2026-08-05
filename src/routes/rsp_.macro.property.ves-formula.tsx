import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MetricCard,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  StateBadge,
  Tag,
} from "@/components/rsp-property/PropertyUi";
import { computeVes, vesState } from "@/lib/reiv-data";

export const Route = createFileRoute("/rsp_/macro/property/ves-formula")({
  head: () => ({
    meta: [
      { title: "VES Simulator — @rsp/property · Love Key Link" },
      {
        name: "description",
        content:
          "Interactive Vertical Equilibrium Score calculator for real estate: adjust relevance, consumer experience, workforce stress and financial velocity to see prominence change.",
      },
      { property: "og:title", content: "VES Simulator — @rsp/property" },
      {
        property: "og:description",
        content:
          "VES = f(Relevance) × (CX / S) × (V_T / V_A) — model how servicing capacity, not ad spend, decides which agency is shown.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VesSimulator,
});

type Sliders = { relevance: number; cx: number; s: number; vt: number; va: number };

const defaults: Sliders = { relevance: 82, cx: 88, s: 72, vt: 100, va: 92 };

const controls: {
  key: keyof Sliders;
  tag: string;
  label: string;
  min: number;
  max: number;
  hint: string;
}[] = [
  { key: "relevance", tag: "Relevance", label: "Listing relevance match", min: 0, max: 100, hint: "How closely the agency's track record matches the vendor's category, region and price band." },
  { key: "cx", tag: "CX", label: "Consumer experience index", min: 0, max: 100, hint: "Vendor and buyer satisfaction: response times, appraisal accuracy, campaign follow-through." },
  { key: "s", tag: "S", label: "Workforce stress / capacity used", min: 1, max: 100, hint: "Percentage of servicing capacity already committed. Higher stress suppresses prominence." },
  { key: "vt", tag: "V_T", label: "Target financial velocity", min: 10, max: 150, hint: "Listings the office is resourced to carry this cycle." },
  { key: "va", tag: "V_A", label: "Actual financial velocity", min: 10, max: 150, hint: "Listings actually being carried right now." },
];

function VesSimulator() {
  const [v, setV] = useState<Sliders>(defaults);
  const { fRelevance, cxOverS, vtOverVa, ves } = computeVes(v);
  const state = vesState(ves);
  const baselineBid = 3200;
  const equilibriumRank = ves * 100;

  return (
    <PropertyShell current="VES Simulator">
      <SectionHeading
        eyebrow="Interactive capacity calculator"
        title="Vertical Equilibrium Score"
        lead="Move the inputs and watch prominence follow capacity. Nothing here rewards spend — an agency that is already saturated loses rank until it can serve what it holds."
      />

      <PropertyCard className="mb-8">
        <p className="text-center font-mono text-base text-emerald-800 md:text-lg">
          VES = f(<Tag>Relevance</Tag>) × (<Tag>CX</Tag> / <Tag>S</Tag>) × (<Tag>V_T</Tag> /{" "}
          <Tag>V_A</Tag>)
        </p>
      </PropertyCard>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <PropertyCard>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Inputs</h2>
          <div className="space-y-6">
            {controls.map((c) => (
              <div key={c.key}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor={c.key} className="text-sm font-medium text-slate-800">
                    <Tag>{c.tag}</Tag> <span className="ml-2">{c.label}</span>
                  </label>
                  <span className="font-mono text-sm text-emerald-700">{v[c.key]}</span>
                </div>
                <input
                  id={c.key}
                  type="range"
                  min={c.min}
                  max={c.max}
                  value={v[c.key]}
                  onChange={(e) => setV((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
                  className="w-full accent-emerald-600"
                />
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{c.hint}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setV(defaults)}
            className="mt-6 rounded-xl border border-emerald-500/25 px-4 py-2 font-mono text-xs uppercase tracking-widest text-emerald-700 transition-all hover:border-emerald-500/60"
          >
            Reset
          </button>
        </PropertyCard>

        <div className="space-y-4">
          <MetricCard
            label="Vertical Equilibrium Score"
            value={ves.toFixed(3)}
            hint="Above 0.85 the agency is issued free prominence; below 0.50 exposure rotates away."
            state={state}
          />
          <MetricCard label="Equilibrium ad rank" value={equilibriumRank.toFixed(1)} unit="pts" />
          <PropertyCard className="p-5">
            <h3 className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              Component breakdown
            </h3>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between">
                <span>f(Relevance)</span>
                <span className="text-emerald-700">{fRelevance.toFixed(3)}</span>
              </li>
              <li className="flex justify-between">
                <span>CX / S</span>
                <span className="text-emerald-700">{cxOverS.toFixed(3)}</span>
              </li>
              <li className="flex justify-between">
                <span>V_T / V_A</span>
                <span className="text-emerald-700">{vtOverVa.toFixed(3)}</span>
              </li>
            </ul>
          </PropertyCard>
          <PropertyCard className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
                Legacy portal equivalent
              </h3>
              <StateBadge state="suppressed" />
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              To hold the same position on a legacy portal this office would spend roughly{" "}
              <span className="font-mono text-slate-900">
                ${(baselineBid * Math.max(0.4, 2 - ves)).toFixed(0)}
              </span>{" "}
              per campaign — regardless of whether it can service the enquiry.
            </p>
          </PropertyCard>
        </div>
      </div>

      <PropertyCard>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Reading the result</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Push <Tag>S</Tag> above 90 and VES collapses even with perfect relevance — the market
          signal is that this office is already holding demand it cannot serve. Pull{" "}
          <Tag>V_A</Tag> back below <Tag>V_T</Tag> and prominence returns immediately, with no
          spend and no re-bidding. That reversibility is the whole point: equilibrium is a
          throttle, not a ranking penalty.
        </p>
      </PropertyCard>
    </PropertyShell>
  );
}
