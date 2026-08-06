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
          "@rsp/property merges free vendor registration with RSP equilibrium: agents are ranked on niche experience, ability to serve and their offer agreement — not on who cuts commission hardest.",
      },
      { property: "og:title", content: "Sell Without Surveillance — @rsp/property" },
      {
        property: "og:description",
        content:
          "An open real estate equilibrium platform: vendors list free, and agents are evaluated on a three-pronged Agent Equilibrium Score — niche experience, servicing capacity and offer agreement.",
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
  "Where agents do compete, they compete on one number — the commission — and the vendor learns nothing about fit.",
  "Buyer enquiry data is resold as leads, often several times over.",
  "Behavioural profiles follow buyers across the open web long after the campaign ends.",
];

const equilibrium = [
  "Vendors register for free and never pay for visibility — the intent signal is the product.",
  "Agents are evaluated on three vectors: niche experience, ability to serve, and their offer agreement.",
  "RSP recommends an equilibrium commission from experience and capacity; the agent may override it, openly.",
  "Results are ranked by the Agent Equilibrium Score, rank 1 first — never by the lowest number alone.",
  "Identifiers are burned on write: only coarse buckets and anonymised telemetry persist.",
];

const vectors = [
  {
    key: "NEV",
    title: "Niche experience",
    desc: "Verified REIV history matched to the vendor's exact specification — category, price band, region — including days on market against the regional mean, sale price against reserve, and the buyer competition depth the agent has historically generated for comparable stock.",
  },
  {
    key: "SCV",
    title: "Ability to serve",
    desc: "Real availability right now: workload stress S, actual against target volume V_A / V_T, consumer experience CX, and open campaign slots inside the timeframe the vendor nominated.",
  },
  {
    key: "OAV",
    title: "Offer agreement",
    desc: "The commercial terms. RSP computes a recommended equilibrium commission from NEV and SCV; the agent can accept it or override it up or down, and the override is scored in the open rather than hidden behind a headline rate.",
  },
];

const flow = [
  { tag: "01", title: "Vendor intent", desc: "Property type, region, price band and timeframe — no name, address or contact." },
  { tag: "02", title: "Anonymised signal", desc: "Raw identifiers burned on write; the signal is a coarse, k-anonymous bucket." },
  { tag: "03", title: "Three-vector evaluation", desc: "Each responding agent is scored on niche experience, ability to serve and their offer agreement." },
  { tag: "04", title: "Ranked equilibrium", desc: "AES resolves who is genuinely best placed to sell this property today; the vendor selects from rank 1 down." },
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
        lead="Bid2Sell showed vendors never have to pay to be found. RSP shows the market never has to be tracked to be matched. @rsp/property merges the two — and replaces the commission race with a three-pronged evaluation: what the agent has actually sold in this niche, whether they can serve you now, and the offer agreement they put on the table."
      />


      <div className="mb-10 flex flex-wrap gap-3">
        <GradientButton to="/rsp/macro/property/vendor-portal">
          Open the vendor portal →
        </GradientButton>
        <Link
          to="/rsp/macro/property/ves-formula"
          className="inline-flex items-center rounded-xl border border-emerald-500/25 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-emerald-700 transition-all hover:border-emerald-500/60"
        >
          Run the AES simulator
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

      <h2 className="mb-2 text-2xl font-semibold text-slate-900">
        What agents actually compete on
      </h2>
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-600">
        The right to sell a property is not awarded to whoever names the smallest number. It is a
        three-pronged evaluation, and every vector is published to the vendor so the ranking can be
        read rather than trusted.
      </p>
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        {vectors.map((v) => (
          <PropertyCard key={v.key} className="h-full p-5">
            <Tag>{v.key}</Tag>
            <h3 className="mb-2 mt-3 text-base font-semibold text-slate-900">{v.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{v.desc}</p>
          </PropertyCard>
        ))}
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
          The Agent Equilibrium Score
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          The three vectors resolve into one published score. Servicing capacity is carried by the
          same VES the macro specification defines; niche experience is drawn from verified REIV
          history matched to the vendor's specification; the offer agreement is measured against the
          commission RSP itself recommends.
        </p>
        <p className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-4 text-center font-mono text-sm text-emerald-800">
          AES = 0.45·<Tag>NEV</Tag> + 0.35·<Tag>SCV</Tag> + 0.20·<Tag>OAV</Tag>
        </p>
        <p className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-4 text-center font-mono text-xs text-emerald-800">
          <Tag>SCV</Tag> ← VES = f(Relevance) × (<Tag>CX</Tag> / <Tag>S</Tag>) × (<Tag>V_T</Tag> /{" "}
          <Tag>V_A</Tag>)
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          An office already at 96% of its servicing capacity carries a high <Tag>S</Tag>, so its
          capacity vector collapses and it drops down the ranking even if it undercuts every other
          agent — not as a penalty, but because the service it is offering is one it cannot
          currently deliver. Equally, a cheap rate from an agent with no verified record in the
          vendor's niche cannot buy its way past an agent who has repeatedly sold that exact stock
          above reserve and has the slots free to do it again.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Commission is the one term the agent controls outright. RSP publishes a recommended
          equilibrium rate for each agent, and any override — up or down — is shown beside it. An
          unsustainable undercut is discounted rather than rewarded: an agreement the agent cannot
          fund is not a better offer.
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
