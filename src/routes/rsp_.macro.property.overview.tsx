import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  GradientButton,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  Tag,
  propertyNav,
} from "@/components/rsp-property/PropertyUi";

export const Route = createFileRoute("/rsp_/macro/property/overview")({
  head: () => ({
    meta: [
      { title: "Sell Without Surveillance — @rsp/property overview · Love Key Link" },
      {
        name: "description",
        content:
          "@rsp/property merges free vendor registration and agent reverse-auction bidding with RSP equilibrium: anonymised intent, capacity-aware prominence, no data resale.",
      },
      { property: "og:title", content: "Sell Without Surveillance — @rsp/property" },
      {
        property: "og:description",
        content:
          "An open real estate equilibrium platform: vendors list free, agents compete on commission, and prominence follows servicing capacity rather than ad spend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertyOverview,
});

const legacy = [
  "Vendors fund portal depth packages before a single buyer is qualified.",
  "Agents buy suburb prominence; capacity to actually service the listing is never measured.",
  "Buyer enquiry data is resold as leads, often several times over.",
  "Behavioural profiles follow buyers across the open web long after the campaign ends.",
];

const equilibrium = [
  "Vendors register for free and never pay for visibility — the intent signal is the product.",
  "Agents compete in a reverse auction, bidding commission down against measured service quality.",
  "Prominence is issued by VES, so saturated offices step back and capable operators step forward.",
  "Identifiers are burned on write: only coarse buckets and anonymised telemetry persist.",
];

const flow = [
  { tag: "01", title: "Vendor intent", desc: "Property type, region, price band and timeframe — no name, address or contact." },
  { tag: "02", title: "Anonymised signal", desc: "Raw identifiers burned on write; the signal is a coarse, k-anonymous bucket." },
  { tag: "03", title: "Reverse auction", desc: "Agents bid commission down, with capacity and CX telemetry attached to every bid." },
  { tag: "04", title: "Equilibrium match", desc: "VES resolves who can genuinely service the listing today, not who spent the most." },
];

function Row({ children }: { children: ReactNode }) {
  return <li className="flex gap-2">{children}</li>;
}

function PropertyOverview() {
  return (
    <PropertyShell current="Overview">
      <SectionHeading
        eyebrow="@rsp/property — open real estate equilibrium"
        title="Sell Without Surveillance"
        lead="Bid2Sell showed vendors never have to pay to be found. RSP shows the market never has to be tracked to be matched. @rsp/property merges the two: free vendor registration, agents competing on commission, and prominence issued by measured servicing capacity."
      />

      <div className="mb-10 flex flex-wrap gap-3">
        <GradientButton to="/rsp/macro/property/vendor-portal">
          Open the vendor portal →
        </GradientButton>
        <Link
          to="/rsp/macro/property/ves-formula"
          className="inline-flex items-center rounded-xl border border-emerald-500/25 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-emerald-700 transition-all hover:border-emerald-500/60"
        >
          Run the VES simulator
        </Link>
      </div>

      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <PropertyCard className="border-rose-500/20">
          <h2 className="mb-3 text-xl font-semibold text-slate-900">Legacy portal extraction</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            {legacy.map((l) => (
              <Row key={l}>
                <span className="text-rose-500">–</span>
                {l}
              </Row>
            ))}
          </ul>
        </PropertyCard>
        <PropertyCard>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">RSP equilibrium</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            {equilibrium.map((l) => (
              <Row key={l}>
                <span className="text-emerald-600">+</span>
                {l}
              </Row>
            ))}
          </ul>
        </PropertyCard>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-slate-900">How a listing moves</h2>
      <ol className="mb-12 grid gap-4 md:grid-cols-4">
        {flow.map((f) => (
          <li key={f.tag}>
            <PropertyCard className="h-full p-5">
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700">
                {f.tag}
              </span>
              <h3 className="mb-2 mt-2 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </PropertyCard>
          </li>
        ))}
      </ol>

      <PropertyCard className="mb-12">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">
          The vertical equilibrium score, applied to property
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Prominence in @rsp/property is resolved by the same VES the macro specification defines:
          relevance scaled by consumer experience over workforce stress, and target over actual
          financial velocity.
        </p>
        <p className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-4 text-center font-mono text-sm text-emerald-800">
          VES = f(Relevance) × (<Tag>CX</Tag> / <Tag>S</Tag>) × (<Tag>V_T</Tag> / <Tag>V_A</Tag>)
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          An office already at 96% of its servicing capacity carries a high <Tag>S</Tag>, so its VES
          falls and its free prominence is withdrawn — not as a penalty, but because the demand it
          holds cannot be served. A capable operator with spare capacity and strong <Tag>CX</Tag>{" "}
          rises without paying for the privilege.
        </p>
      </PropertyCard>

      <div className="flex flex-wrap items-center gap-3 border-t border-emerald-500/15 pt-8">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
          In this branch
        </span>
        {propertyNav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="rounded-lg border border-emerald-500/20 px-3 py-1.5 font-mono text-xs text-slate-600 transition-all hover:border-emerald-500/60 hover:text-emerald-700"
          >
            {n.label}
          </Link>
        ))}
      </div>
    </PropertyShell>
  );
}
