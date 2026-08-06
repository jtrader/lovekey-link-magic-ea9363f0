import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  GradientButton,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  Tag,
} from "@/components/rsp-property/PropertyUi";
import { CopyAnchor, DataTable } from "@/components/rsp-property/SpecTable";
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
  ["aes", "05", "Agent Equilibrium Score"],
  ["auction", "06", "Reverse-auction workflow"],
  ["sandbox", "07", "90-day calibration sandbox"],
  ["blueprint", "08", "Web integration blueprint"],
  ["impact", "09", "Strategic impact"],
] as const;

const vesRows: string[][] = [
  [
    "Saturated / overbooked",
    "S → 1.0 or CX ↓",
    "SCV decreases; AES falls and prominence is gracefully throttled.",
    "Protects vendors from poor service and teams from burnout.",
  ],
  [
    "Target revenue reached",
    "V_A ≫ V_T",
    "SCV decreases; exposure rotates to under-target peers.",
    "Prevents monopolisation by one or two dominant agencies.",
  ],
  [
    "Available / high capacity",
    "S < 0.4 and V_A < V_T",
    "SCV increases; matchmaking prominence amplifies.",
    "Routes listings to qualified, available agents.",
  ],
];

const aesRows: string[][] = [
  [
    "NEV",
    "0.45",
    "Niche experience",
    "Verified REIV record matched to the vendor's specification: days on market against the regional mean, sale price against reserve, niche transaction volume, and the buyer competition depth generated for comparable stock.",
  ],
  [
    "SCV",
    "0.35",
    "Ability to serve",
    "Real availability now: workforce stress S, actual against target velocity V_A / V_T, consumer experience CX, and open campaign slots inside the vendor's timeframe. Carried by the VES core.",
  ],
  [
    "OAV",
    "0.20",
    "Offer agreement",
    "The commercial terms the agent puts forward against the RSP-recommended equilibrium commission, including marketing contribution. Overrides are scored openly; an unsustainable undercut is discounted, not rewarded.",
  ],
];

const auctionRows: string[][] = [
  ["01", "Vendor", "Lists property characteristics for free.", "Contact details isolated in a vault tier."],
  ["02", "Engine", "Builds a low-resolution RSP intent signal.", "Identifiers burned on write."],
  ["03", "Engine", "Scores each agent's niche record (NEV) and capacity (SCV) against the spec.", "No personal data enters scoring."],
  ["04", "Agents", "Top-scoring unsaturated specialists receive an alert with the RSP-recommended commission.", "Property specs only; no vendor identity."],
  ["05", "Agents", "Return an offer agreement: accept the recommended rate or override it, with marketing and strategy.", "Offers are blind to vendor identity."],
  ["06", "Engine", "Resolves AES = 0.45·NEV + 0.35·SCV + 0.20·OAV and ranks agents, rank 1 first.", "Every vector is published to the vendor."],
  ["07", "Vendor", "Compares the ranked proposals side-by-side in a calm dashboard.", "No unsolicited cold calls."],
  ["08", "Engine", "Awards the chosen agent and decrypts contact info.", "Disclosure to the winning agent only."],
];


const telemetryRows: string[][] = [
  ["S", "Supply-side", "Workforce strain: overtime, appraisal backlog, campaign load per agent.", "Agency HR / workflow API"],
  ["V_A / V_T", "Supply-side", "Financial pace: actual volume against declared target.", "Accounting API"],
  ["CX", "Supply-side", "Consumer experience: response latency, satisfaction, follow-through.", "Vendor feedback + response logs"],
  ["Slots", "Supply-side", "Campaign slots open inside the vendor's nominated timeframe.", "Agency workflow API"],
  ["DOM_niche", "Performance", "Average sale speed for the property class vs regional mean.", "REIV transaction feed"],
  ["Variance_reserve", "Performance", "Final sale price versus vendor reserve on similar listings.", "REIV transaction feed"],
  ["Volume_suburb", "Performance", "Verified transaction density by postcode and typology (90 days).", "REIV transaction feed"],
  ["Depth_buyer", "Performance", "Buyer competition depth historically generated for comparable stock.", "REIV clearance + bidder records"],
  ["Intent signal", "Demand-side", "help_stage, theme, niche, location_scope, urgency.", "Anonymised vendor submission"],
  ["Offer terms", "Agreement", "Commission offered against the RSP recommendation, marketing contribution, strategy.", "Agent offer submission"],
];

const impactRows: string[][] = [
  [
    "Vendor privacy",
    "Contact details harvested and sold to multiple agencies; cold calls.",
    "Low-resolution signals; vendor anonymous until contract awarded.",
  ],
  [
    "Matching mechanics",
    "Paid ranking, legacy domain authority, large ad budgets.",
    "Three-vector AES: verified niche experience, ability to serve, offer agreement.",
  ],
  [
    "Basis of competition",
    "A single headline number — whoever discounts commission hardest.",
    "Experience matched to the vendor's specification, availability to serve, then terms.",
  ],
  [
    "Agent pricing",
    "High upfront ad placement costs regardless of outcome.",
    "Free vendor registration; RSP recommends an equilibrium commission the agent may override openly.",
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
];


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
            pricing side: vendors list for free and agents compete for the right to sell.
            Combining that reverse auction with RSP and its macroeconomic extension (
            <Tag>@rsp/macro</Tag> / VEO) elevates it into <Tag>@rsp/property</Tag> — and changes
            what is actually being competed for. Agents do not win on the lowest commission. They
            are evaluated on three vectors: verified niche experience matched to the vendor's
            specification, present ability to serve, and the offer agreement they put forward
            against an RSP-recommended equilibrium commission. Listings are routed by that composite
            score rather than vendor lead data sold to the highest bidder.
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
          <DataTable
            caption="All telemetry channels"
            columns={["Parameter", "Stream", "What it measures", "Source"]}
            filterLabel="Filter telemetry channels"
            minWidth={680}
            rows={telemetryRows.map((r) => ({
              key: r[0],
              text: [...r],
              cells: [
                <Tag>{r[0]}</Tag>,
                <span className="font-medium text-slate-800">{r[1]}</span>,
                <span>{r[2]}</span>,
                <span className="font-mono text-xs text-slate-500">{r[3]}</span>,
              ],
            }))}
          />
        </Block>

        <Block id="ves" n="04" title="Vertical Equilibrium Score & rotational logic">
          <Ascii>{`VES = f(Relevance) × (CX / S) × (V_T / V_A)`}</Ascii>
          <DataTable
            caption="Rotational logic by agent condition"
            columns={["Agent condition", "Telemetry shift", "Algorithm action", "Market outcome"]}
            filterLabel="Filter conditions"
            rows={vesRows.map((r) => ({
              key: r[0],
              text: [...r],
              cells: [
                <span className="font-medium text-slate-800">{r[0]}</span>,
                <span className="font-mono text-xs">{r[1]}</span>,
                <span>{r[2]}</span>,
                <span>{r[3]}</span>,
              ],
            }))}
          />
        </Block>

        <Block id="aes" n="05" title="Agent Equilibrium Score — the three-pronged evaluation">
          <p>
            VES describes an agent's standing in the vertical. The{" "}
            <strong className="text-slate-800">Agent Equilibrium Score</strong> is what a specific
            vendor sees: the same telemetry resolved against one specification, plus the agent's own
            offer agreement.
          </p>
          <Ascii>{`AES = 0.45 · NEV  +  0.35 · SCV  +  0.20 · OAV

  NEV  niche experience   matched REIV record vs the vendor's spec
  SCV  ability to serve   VES capacity core: CX / S, V_T / V_A, open slots
  OAV  offer agreement    offered commission vs RSP recommendation

  Recommended commission = g(NEV, SCV)   bounded 1.4% – 3.2%
  Board order            = AES rank ascending (rank 1 shown first)`}</Ascii>
          <DataTable
            caption="The three evaluation vectors"
            columns={["Vector", "Weight", "Measures", "Composition"]}
            filterLabel="Filter vectors"
            minWidth={680}
            rows={aesRows.map((r) => ({
              key: r[0],
              text: [...r],
              cells: [
                <Tag>{r[0]}</Tag>,
                <span className="font-mono text-xs text-emerald-700">{r[1]}</span>,
                <span className="font-medium text-slate-800">{r[2]}</span>,
                <span>{r[3]}</span>,
              ],
            }))}
          />
          <p className="text-sm">
            RSP publishes a recommended commission for each agent — the rate at which that agent's
            experience and available capacity sit in equilibrium for this listing. Agents may accept
            it or override it, and the override is shown to the vendor beside the recommendation. An
            undercut from a saturated office does not buy rank: OAV is discounted where the terms are
            not serviceable, and it carries only a fifth of the weight in any case.
          </p>
        </Block>

        <Block id="auction" n="06" title="Telemetry-aware reverse-auction workflow">
          <Ascii>{`VENDOR                    @rsp/property ENGINE                 AGENTS
  |-- 1. property characteristics -->|                            |
  |                          2. low-res RSP signal                |
  |                        + REIV feed -> NEV, capacity -> SCV    |
  |                                  |-- 3. anonymous alert ----->|
  |                                  |   (+ recommended rate)     |
  |                                  |<-- 4. offer agreements ----|
  |                          5. AES = .45NEV + .35SCV + .20OAV    |
  |<-- 6. ranked proposals ----------|   (rank 1 first)           |
  |-- 7. award preferred agent ----->|                            |
  |                                  |-- 8. decrypt contact ----->|`}</Ascii>
          <DataTable
            caption="Reverse-auction steps"
            columns={["Step", "Actor", "Action", "Privacy posture"]}
            filterLabel="Filter auction steps"
            rows={auctionRows.map((r) => ({ key: r[0], text: [...r], cells: [
              <span className="font-mono text-xs text-emerald-700">{r[0]}</span>,
              <span className="font-medium text-slate-800">{r[1]}</span>,
              <span>{r[2]}</span>,
              <span>{r[3]}</span>,
            ] }))}
          />
        </Block>

        <Block id="sandbox" n="07" title="Mandatory 90-day calibration sandbox">

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

        <Block id="blueprint" n="08" title="Web integration blueprint">
          <Ascii>{`lovekeylink.com/rsp
└── /macro
    └── /property
        ├── /overview        (ideology & Bid2Sell evolution)
        ├── /reiv-telemetry  (niche matchmaking & REIV feed logic)
        ├── /ves-formula     (AES simulator: NEV, SCV, OAV)
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
            agents who hold the exact experience and availability to handle the listing, with terms
            offered against a published equilibrium rate rather than a race to the bottom.

          </blockquote>
        </Block>

        <Block id="impact" n="09" title="Strategic impact">
          <DataTable
            caption="Legacy portals compared with @rsp/property"
            columns={["Dimension", "Legacy portals", "@rsp/property"]}
            filterLabel="Filter dimensions"
            minWidth={620}
            rows={impactRows.map(([dim, legacy, rsp]) => ({
              key: dim,
              text: [dim, legacy, rsp],
              cells: [
                <span className="font-medium text-slate-800">{dim}</span>,
                <span>{legacy}</span>,
                <span className="text-emerald-800">{rsp}</span>,
              ],
            }))}
          />
        </Block>
      </div>
    </PropertyShell>
  );
}
