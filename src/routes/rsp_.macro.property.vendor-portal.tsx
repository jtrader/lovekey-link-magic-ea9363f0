import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  GradientButton,
  MetricCard,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  StateBadge,
  Tag,
} from "@/components/rsp-property/PropertyUi";
import { categories, computeVes, regions, vesState, type PropertyCategory } from "@/lib/reiv-data";

export const Route = createFileRoute("/rsp_/macro/property/vendor-portal")({
  head: () => ({
    meta: [
      { title: "Vendor Portal — @rsp/property · Love Key Link" },
      {
        name: "description",
        content:
          "A privacy-first vendor portal: publish an anonymised RSP intent signal for free and watch agents compete in a live commission reverse auction.",
      },
      { property: "og:title", content: "Vendor Portal — @rsp/property" },
      {
        property: "og:description",
        content:
          "Register free, stay anonymous, and let capable agents bid their commission down against measured servicing capacity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorPortal,
});

const priceBands = ["$400k – $600k", "$600k – $850k", "$850k – $1.2m", "$1.2m – $1.8m", "$1.8m+"];
const timeframes = ["Within 30 days", "1 – 3 months", "3 – 6 months", "Just exploring"];

type Bid = {
  id: number;
  agency: string;
  commission: number;
  capacityUsed: number;
  cx: number;
  ves: number;
  marketing: string;
};

const agencyPool = [
  { agency: "Meridian & Co.", capacityUsed: 62, cx: 91, marketing: "Vendor-paid $0 — absorbed" },
  { agency: "Northline Property", capacityUsed: 88, cx: 84, marketing: "Vendor-paid $1,400" },
  { agency: "Harbourfield Agents", capacityUsed: 71, cx: 87, marketing: "Vendor-paid $0 — absorbed" },
  { agency: "Cassia Residential", capacityUsed: 95, cx: 79, marketing: "Vendor-paid $2,100" },
  { agency: "Ellsworth Group", capacityUsed: 58, cx: 93, marketing: "Vendor-paid $0 — absorbed" },
  { agency: "Rowan & Kestrel", capacityUsed: 76, cx: 82, marketing: "Vendor-paid $900" },
];

function hashSignal(parts: string[]) {
  const raw = parts.join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i += 1) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `rsp:int:${h.toString(16).padStart(8, "0")}`;
}

function VendorPortal() {
  const [region, setRegion] = useState(regions[0]!);
  const [category, setCategory] = useState<PropertyCategory>(categories[0]!);
  const [band, setBand] = useState(priceBands[1]!);
  const [timeframe, setTimeframe] = useState(timeframes[1]!);
  const [published, setPublished] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const signal = useMemo(
    () => hashSignal([region, category, band, timeframe]),
    [region, category, band, timeframe],
  );

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function publish() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBids([]);
    setPublished(true);
    agencyPool.forEach((a, i) => {
      const t = setTimeout(
        () => {
          const commission = 2.2 - (100 - a.capacityUsed) * 0.008 + (i % 3) * 0.06;
          const { ves } = computeVes({
            relevance: 70 + ((i * 7) % 25),
            cx: a.cx,
            s: a.capacityUsed,
            vt: 100,
            va: a.capacityUsed,
          });
          setBids((prev) =>
            [
              ...prev,
              {
                id: i,
                agency: a.agency,
                commission: Math.max(1.25, Number(commission.toFixed(2))),
                capacityUsed: a.capacityUsed,
                cx: a.cx,
                ves,
                marketing: a.marketing,
              },
            ].sort((x, y) => y.ves - x.ves),
          );
        },
        700 + i * 850,
      );
      timers.current.push(t);
    });
  }

  const best = bids[0];

  return (
    <PropertyShell current="Vendor Portal">
      <SectionHeading
        eyebrow="Simulated demo · nothing is stored"
        title="Vendor Portal"
        lead="Publish an anonymised intent signal for free. Agents see the shape of the opportunity — never your name, address or contact details — and bid their commission down against measured servicing capacity."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <PropertyCard>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Your intent</h2>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              publish();
            }}
          >
            <Field label="Region">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={inputCls}
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Property category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Price band">
              <select value={band} onChange={(e) => setBand(e.target.value)} className={inputCls}>
                {priceBands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Timeframe">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={inputCls}
              >
                {timeframes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-4">
              <div className="mb-1 font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700">
                Anonymised signal
              </div>
              <code className="break-all font-mono text-xs text-slate-700">{signal}</code>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Identifiers are burned on write. Agents receive the bucket above and nothing else
                until you choose to reveal yourself.
              </p>
            </div>

            <GradientButton type="submit">
              {published ? "Republish signal" : "Publish anonymised signal"}
            </GradientButton>
            <p className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-400">
              Vendor cost: $0.00 — always
            </p>
          </form>
        </PropertyCard>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Live bids"
              value={bids.length}
              hint={published ? "Agents responding to your signal." : "Publish to open the auction."}
            />
            <MetricCard
              label="Best commission"
              value={best ? `${best.commission.toFixed(2)}%` : "—"}
              hint={best ? `Leading bid from ${best.agency}.` : "No bids yet."}
              {...(best ? { state: vesState(best.ves) } : {})}
            />
          </div>

          <PropertyCard className="p-0">
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Reverse auction board</h2>
              {published && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  live
                </span>
              )}
            </div>
            {!published && (
              <p className="px-5 py-10 text-center font-mono text-xs text-slate-500">
                Publish your signal to see agents compete.
              </p>
            )}
            {published && bids.length === 0 && (
              <p className="px-5 py-10 text-center font-mono text-xs text-slate-500">
                Waiting for the first bid…
              </p>
            )}
            <ul>
              {bids.map((b, i) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.68rem] text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-slate-900">{b.agency}</span>
                      <StateBadge state={vesState(b.ves)} />
                    </div>
                    <div className="mt-1 font-mono text-[0.68rem] text-slate-500">
                      S {b.capacityUsed}% · CX {b.cx} · VES {b.ves.toFixed(3)} · {b.marketing}
                    </div>
                  </div>
                  <span className="font-mono text-lg text-emerald-700">
                    {b.commission.toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </PropertyCard>

          <PropertyCard className="p-5">
            <p className="text-sm leading-relaxed text-slate-600">
              Ordering is by <Tag>VES</Tag>, not by the lowest number. A saturated office can always
              undercut on commission — under equilibrium it simply is not shown first, because the
              service it is bidding to provide is one it cannot currently deliver.
            </p>
          </PropertyCard>
        </div>
      </div>
    </PropertyShell>
  );
}

const inputCls =
  "w-full rounded-xl border border-emerald-500/20 bg-white px-3 py-2.5 font-mono text-xs text-slate-700 outline-none transition-colors focus:border-emerald-500/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
