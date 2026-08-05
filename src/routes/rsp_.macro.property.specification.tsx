import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  GradientButton,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  Tag,
} from "@/components/rsp-property/PropertyUi";
import specMd from "@/assets/rsp-property-spec.md.asset.json";
import specZip from "@/assets/rsp-property-spec.zip.asset.json";

export const Route = createFileRoute("/rsp_/macro/property/specification")({
  head: () => ({
    meta: [
      { title: "@rsp/property Master Specification v1.0 — Love Key Link" },
      {
        name: "description",
        content:
          "The full @rsp/property master specification: Bid2Sell reverse auctions, REIV telemetry, tripartite operational telemetry, the VES formula and the 90-day calibration sandbox.",
      },
      { property: "og:title", content: "@rsp/property Master Specification v1.0" },
      {
        property: "og:description",
        content:
          "Telemetry-driven, capacity-aware real estate equilibrium: the canonical @rsp/property specification.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertySpecification,
});

function Ascii({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-emerald-500/15 bg-[#F8FAF8] p-4 font-mono text-[0.68rem] leading-relaxed text-slate-600">
      {children}
    </pre>
  );
}

function Block({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="group scroll-mt-24">
      <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-semibold tracking-tight text-slate-900">
        <span className="font-mono text-sm text-emerald-600">{n}</span>
        <a href={`#${id}`} className="hover:text-emerald-700">
          {title}
        </a>
        <CopyAnchor id={id} label={title} />
      </h2>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

const toc = [
  ["exec", "01", "Executive summary"],
  ["ideology", "02", "Philosophical foundation"],
  ["telemetry", "03", "Tripartite telemetry"],
  ["ves", "04", "VES & rotational logic"],
  ["auction", "05", "Reverse-auction workflow"],
  ["sandbox", "06", "90-day calibration sandbox"],
  ["blueprint", "07", "Web integration blueprint"],
  ["impact", "08", "Strategic impact"],
] as const;

function PropertySpecification() {
  return (
    <PropertyShell current="Specification">
      <SectionHeading
        eyebrow="Master specification v1.0"
        title="@rsp/property — Real Estate Equilibrium Specification"
        lead="The canonical document behind this branch: how Bid2Sell's reverse auction, the Respectful Synchronised Protocol and Vertical Equilibrium Optimization combine into a telemetry-driven, capacity-aware property market."
      />

      <div className="mb-10 flex flex-wrap gap-3">
        <GradientButton href={specMd.url}>Download specification (.md)</GradientButton>
        <a
          href={specZip.url}
          className="inline-flex items-center justify-center rounded-xl border border-emerald-500/25 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-slate-600 transition-all hover:border-emerald-500/60 hover:text-emerald-700"
        >
          Download package (.zip)
        </a>
      </div>

      <PropertyCard className="mb-12">
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
          Contents
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {toc.map(([id, n, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="flex items-baseline gap-2 font-mono text-xs text-slate-600 hover:text-emerald-700"
              >
                <span className="text-emerald-600">{n}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </PropertyCard>

      <div className="space-y-14">
        <Block id="exec" n="01" title="Executive summary">
          <p>
            The modern real estate portal ecosystem operates as a winner-take-all extraction engine.
            Listing platforms reward accumulated domain authority and historical advertising spend —
            stocks of legacy advantage — rather than an agent's present operational capacity and
            verified niche performance. A dominant agency can hold top organic placement while buried
            under campaign backlog, causing client delays and staff burnout, while highly capable local
            specialists pay exorbitant per-click costs to remain visible to demand they could easily clear.
          </p>
          <p>
            <strong className="text-slate-800">Bid2Sell</strong> introduced the structural fix on the
            pricing side: vendors list for free and agents compete for the right to sell by offering
            discounted commissions and tailored marketing. Combining that reverse auction with RSP and
            its macroeconomic extension (<Tag>@rsp/macro</Tag> / VEO) elevates it into{" "}
            <Tag>@rsp/property</Tag> — listings routed to agents with verified niche competence and
            immediate physical capacity, rather than vendor lead data sold to the highest bidder.
          </p>
        </Block>

        <Block id="ideology" n="02" title="Philosophical & ideological foundation">
          <p>
            The shift is from <strong className="text-slate-800">surveillance-driven lead extraction</strong>{" "}
            to <strong className="text-slate-800">telemetry-balanced market equilibrium</strong>.
          </p>
          <Ascii>{`  DEMAND TELEMETRY        REIV TELEMETRY         CAPACITY TELEMETRY
  Anonymised vendor       Niche sales analytics  S, V_A/V_T, CX
  intent signals          DOM, reserve variance  workforce + finance
         \\                      |                      /
          \\_____________________|_____________________/
                               |
                  VERTICAL EQUILIBRIUM SCORE (VES)
                               |
                REVERSE-AUCTION DISPATCH (commission bidding)`}</Ascii>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-slate-800">Vendors</strong> — lower commission, transparent agent
              comparison, complete data privacy.
            </li>
            <li>
              <strong className="text-slate-800">Agents</strong> — pre-qualified listings without upfront
              ad placement fees or bidding against multi-million-dollar budgets.
            </li>
            <li>
              <strong className="text-slate-800">Institutes (REIV)</strong> — accredited transaction feeds
              become objective trust baselines.
            </li>
            <li>
              <strong className="text-slate-800">Workforce & community</strong> — teams protected from
              chronic overwork; faster, more responsive transactions.
            </li>
          </ul>
          <p>
            Vendors navigating a downsize, a deceased estate or a family home sale should not be subjected
            to behavioural profiling or cold-call funnels. Intent is pooled anonymously at the regional
            vertical level; raw contact details stay encrypted and decoupled until a contract is awarded.
          </p>
        </Block>

        <Block id="telemetry" n="03" title="Tripartite telemetry pipeline">
          <p>
            Three streams feed one coordination pipeline: demand-side vendor intent, REIV performance
            feeds, and supply-side operational capacity.
          </p>
          <PropertyCard>
            <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              I. Inbound vendor intent (demand-side)
            </p>
            <p className="mb-3">
              A 4-bedroom Victorian home in Bendigo, 30-day timeline, $850k–$900k becomes a
              low-resolution signal:
            </p>
            <Ascii>{`help_stage: prepare
theme: real_estate_listing
niche: heritage_residential
location_scope: local_3550
urgency: medium`}</Ascii>
            <p className="mt-3 text-sm">
              Identifiers, IP addresses and contact details are burned on write or isolated in a vault
              tier. Agents see property characteristics and zero personal contact information.
            </p>
          </PropertyCard>
          <PropertyCard>
            <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              II. REIV market performance (niche fingerprinting)
            </p>
            <Ascii>{`f(Niche Relevance) = w1 · DOM_niche + w2 · Variance_reserve + w3 · Volume_suburb`}</Ascii>
            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-sm">
              <li>
                <Tag>DOM_niche</Tag> — average sale speed for this property class against the regional mean.
              </li>
              <li>
                <Tag>Variance_reserve</Tag> — historical final sale price versus vendor reserve on similar
                listings.
              </li>
              <li>
                <Tag>Volume_suburb</Tag> — verified transaction density in the postcode and typology across
                a rolling 90-day window.
              </li>
            </ul>
          </PropertyCard>
          <PropertyCard>
            <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              III. Supply-side operational telemetry (capacity & health)
            </p>
            <ul className="ml-5 list-disc space-y-1.5 text-sm">
              <li>
                <Tag>S</Tag> — workforce strain: overtime, appraisal backlog, campaign load per agent.
              </li>
              <li>
                <Tag>V_A / V_T</Tag> — financial pace: actual volume against the agency's declared target.
              </li>
              <li>
                <Tag>CX</Tag> — consumer experience: response latency, vendor satisfaction, follow-through.
              </li>
            </ul>
          </PropertyCard>
        </Block>

        <Block id="ves" n="04" title="Vertical Equilibrium Score & rotational logic">
          <Ascii>{`VES = f(Relevance) × (CX / S) × (V_T / V_A)`}</Ascii>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-500/20 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Agent condition</th>
                  <th className="py-2 pr-4">Telemetry shift</th>
                  <th className="py-2 pr-4">Algorithm action</th>
                  <th className="py-2">Market outcome</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-800">Saturated / overbooked</td>
                  <td className="py-3 pr-4 font-mono text-xs">S → 1.0 or CX ↓</td>
                  <td className="py-3 pr-4">VES decreases; prominence gracefully throttled.</td>
                  <td className="py-3">Protects vendors from poor service and teams from burnout.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-800">Target revenue reached</td>
                  <td className="py-3 pr-4 font-mono text-xs">V_A ≫ V_T</td>
                  <td className="py-3 pr-4">VES decreases; exposure rotates to under-target peers.</td>
                  <td className="py-3">Prevents monopolisation by one or two dominant agencies.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-800">Available / high capacity</td>
                  <td className="py-3 pr-4 font-mono text-xs">S &lt; 0.4 and V_A &lt; V_T</td>
                  <td className="py-3 pr-4">VES increases; matchmaking prominence amplifies.</td>
                  <td className="py-3">Routes listings to qualified, available agents.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Block>

        <Block id="auction" n="05" title="Telemetry-aware reverse-auction workflow">
          <Ascii>{`VENDOR                    @rsp/property ENGINE                 AGENTS
  |-- 1. property characteristics -->|                            |
  |                          2. low-res RSP signal                |
  |                             + REIV feed + VES                 |
  |                                  |-- 3. anonymous alert ----->|
  |                                  |<-- 4. reverse bids --------|
  |<-- 5. comparative proposals -----|   (commission, strategy)   |
  |-- 6. award preferred agent ----->|                            |
  |                                  |-- 7. decrypt contact ----->|`}</Ascii>
          <ol className="ml-5 list-decimal space-y-1.5 text-sm">
            <li>Vendor lists for free; contact details isolated in a secure vault tier.</li>
            <li>Engine queries REIV feeds and evaluates active agent capacity (VES).</li>
            <li>Top 3–5 matched, unsaturated local specialists receive an anonymised alert.</li>
            <li>Agents submit commission fees, marketing contributions and sales strategy.</li>
            <li>Vendor compares proposals side-by-side — no unsolicited cold calls.</li>
            <li>On award, contact information is decrypted and shared with the winning agent only.</li>
          </ol>
        </Block>

        <Block id="sandbox" n="06" title="Mandatory 90-day calibration sandbox">
          <Ascii>{`MONTH 1                 MONTH 2                  MONTH 3
Equal exposure          UI/UX remediation        Telemetry sync
10 agents, equal        fix landing pages,       calibrate S, V_T/V_A
leads; measure          profiles & response      and CX baselines
conversion delta        bottlenecks                      |
                                                         v
                                                   DAY 91: GO-LIVE`}</Ascii>
          <p className="text-sm">
            Regional pools of ten agencies onboard together so no participant inherits a distorted
            baseline. The Rotational Equilibrium Engine activates only on day 91, once standard
            deviations for each telemetry channel are established.
          </p>
        </Block>

        <Block id="blueprint" n="07" title="Web integration blueprint">
          <Ascii>{`lovekeylink.com/rsp
└── /macro
    └── /property
        ├── /overview        (ideology & Bid2Sell evolution)
        ├── /reiv-telemetry  (niche matchmaking & REIV feed logic)
        ├── /ves-formula     (capacity-aware auction mathematics)
        ├── /vendor-portal   (reverse-auction matchmaking interface)
        └── /specification   (this document)`}</Ascii>
          <p className="text-sm">
            Telemetry state colours are consistent across the branch: emerald for balanced, amber for
            calibrating, ruby for suppressed. The branch renders in the Love Key light theme rather than
            the specification's original dark palette, matching the rest of @rsp/macro.
          </p>
          <blockquote className="border-l-2 border-emerald-500/40 pl-4 italic text-slate-600">
            "Sell your property with confidence, clarity, and zero surveillance." @rsp/property turns real
            estate lead generation into an ethical coordination standard — connecting sellers with local
            agents who hold the exact experience and availability to handle the listing, while agents
            compete on commission and marketing value.
          </blockquote>
        </Block>

        <Block id="impact" n="08" title="Strategic impact">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-500/20 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Dimension</th>
                  <th className="py-2 pr-4">Legacy portals</th>
                  <th className="py-2">@rsp/property</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  [
                    "Vendor privacy",
                    "Contact details harvested and sold to multiple agencies; cold calls.",
                    "Low-resolution signals; vendor anonymous until contract awarded.",
                  ],
                  [
                    "Matching mechanics",
                    "Paid ranking, legacy domain authority, large ad budgets.",
                    "Objective REIV niche performance × capacity telemetry (VES).",
                  ],
                  [
                    "Agent pricing",
                    "High upfront ad placement costs regardless of outcome.",
                    "Free vendor registration; result-based model for agents.",
                  ],
                  [
                    "Market equity",
                    "Winner-take-all: top giants hoard leads while overbooked.",
                    "Dynamic rotation to capable mid-tier agents when giants saturate.",
                  ],
                  [
                    "Workforce impact",
                    "Agent burnout, unserviced leads, dissatisfied clients.",
                    "Stress protection: leads throttle when workload peaks.",
                  ],
                ].map(([dim, legacy, rsp]) => (
                  <tr key={dim} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-800">{dim}</td>
                    <td className="py-3 pr-4">{legacy}</td>
                    <td className="py-3 text-emerald-800">{rsp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      </div>
    </PropertyShell>
  );
}
