import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AesBadge,
  GradientButton,
  MetricCard,
  PropertyCard,
  PropertyShell,
  SectionHeading,
  Tag,
  VectorBars,
} from "@/components/rsp-property/PropertyUi";
import {
  AES_WEIGHTS,
  agentRecords,
  categories,
  computeAes,
  priceBands,
  rankByAes,
  regions,
  timeframes,
  type AesResult,
  type PropertyCategory,
} from "@/lib/reiv-data";

export const Route = createFileRoute("/rsp_/macro/property/vendor-portal")({
  head: () => ({
    meta: [
      { title: "Vendor Portal — @rsp/property · Love Key Link" },
      {
        name: "description",
        content:
          "A privacy-first vendor portal: publish an anonymised RSP intent signal for free and receive agents ranked by niche experience, ability to serve and their offer agreement.",
      },
      { property: "og:title", content: "Vendor Portal — @rsp/property" },
      {
        property: "og:description",
        content:
          "Register free, stay anonymous, and compare agents on a published three-vector equilibrium score rather than a commission race.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorPortal,
});

function hashSignal(parts: string[]) {
  const raw = parts.join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i += 1) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `rsp:int:${h.toString(16).padStart(8, "0")}`;
}

function reason(r: AesResult) {
  const parts: string[] = [];
  parts.push(
    r.breakdown.match >= 0.95
      ? "Verified record in this exact category, region and price band."
      : r.breakdown.match >= 0.7
        ? "Partial match to the specification — adjacent niche experience."
        : "Little verified history in this niche; experience vector discounted.",
  );
  parts.push(
    r.scv >= 0.7
      ? "Capacity free to start this campaign now."
      : r.scv >= 0.45
        ? "Workload is tightening; start date may slip."
        : "Already holding more demand than it can service.",
  );
  parts.push(
    r.overridden
      ? `Offer overridden ${r.offered < r.recommended ? "below" : "above"} the RSP recommendation of ${r.recommended.toFixed(2)}%.`
      : "Offer accepted at the RSP recommended rate.",
  );
  return parts.join(" ");
}

function VendorPortal() {
  const [region, setRegion] = useState(regions[0]!);
  const [category, setCategory] = useState<PropertyCategory>(categories[0]!);
  const [band, setBand] = useState<string>(priceBands[1]!);
  const [timeframe, setTimeframe] = useState<string>(timeframes[1]!);
  const [published, setPublished] = useState(false);
  const [offers, setOffers] = useState<AesResult[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const spec = useMemo(
    () => ({ region, category, band, timeframe }),
    [region, category, band, timeframe],
  );
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
    setOffers([]);
    setOpen(null);
    setPublished(true);
    agentRecords.forEach((a, i) => {
      const t = setTimeout(
        () => {
          const result = computeAes(a, spec);
          setOffers((prev) => rankByAes([...prev, result]));
        },
        700 + i * 850,
      );
      timers.current.push(t);
    });
  }

  const best = offers[0];

  return (
    <PropertyShell current="Vendor Portal">
      <SectionHeading
        eyebrow="Simulated demo · nothing is stored"
        title="Vendor Portal"
        lead="Publish an anonymised intent signal for free. Agents see the shape of the opportunity — never your name, address or contact details — and are returned to you ranked on three published vectors: what they have sold in your niche, whether they can serve you now, and the offer agreement they put forward."
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
              label="Agents evaluated"
              value={offers.length}
              hint={
                published
                  ? "Agents scored against your specification."
                  : "Publish to open the evaluation."
              }
            />
            <MetricCard
              label="Best equilibrium fit"
              value={best ? best.aes.toFixed(3) : "—"}
              hint={
                best
                  ? `${best.agent.agency} at ${best.offered.toFixed(2)}% commission.`
                  : "No offers yet."
              }
              {...(best ? { state: best.state } : {})}
            />
          </div>

          <PropertyCard className="p-0">
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Equilibrium board</h2>
                <p className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-400">
                  Ranked by AES · rank 1 first
                </p>
              </div>
              {published && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  live
                </span>
              )}
            </div>
            {!published && (
              <p className="px-5 py-10 text-center font-mono text-xs text-slate-500">
                Publish your signal to see agents evaluated.
              </p>
            )}
            {published && offers.length === 0 && (
              <p className="px-5 py-10 text-center font-mono text-xs text-slate-500">
                Waiting for the first offer…
              </p>
            )}
            <ul>
              {offers.map((o, i) => {
                const isOpen = open === o.agent.id;
                return (
                  <li key={o.agent.id} className="border-b border-slate-100 last:border-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : o.agent.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-emerald-50/40"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-900">{o.agent.agency}</span>
                          <AesBadge aes={o.aes} rank={i + 1} state={o.state} />
                        </div>
                        <div className="mt-1 font-mono text-[0.68rem] text-slate-500">
                          NEV {o.nev.toFixed(2)} · SCV {o.scv.toFixed(2)} · OAV {o.oav.toFixed(2)} ·{" "}
                          {o.agent.marketing}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg text-emerald-700">
                          {o.offered.toFixed(2)}%
                        </div>
                        <div className="font-mono text-[0.68rem] text-slate-400">
                          {o.overridden
                            ? `override · rec ${o.recommended.toFixed(2)}%`
                            : "at RSP recommendation"}
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-[#FAFBF9] px-5 py-4">
                        <VectorBars
                          className="mb-3"
                          vectors={[
                            { key: "NEV", label: "niche experience", value: o.nev, weight: AES_WEIGHTS.nev },
                            { key: "SCV", label: "ability to serve", value: o.scv, weight: AES_WEIGHTS.scv },
                            { key: "OAV", label: "offer agreement", value: o.oav, weight: AES_WEIGHTS.oav },
                          ]}
                        />
                        <p className="text-xs leading-relaxed text-slate-600">{reason(o)}</p>
                        <p className="mt-2 font-mono text-[0.68rem] text-slate-500">
                          S {o.agent.capacityUsed}% · CX {o.agent.cx} · slots {o.agent.openSlots} ·
                          DOM Δ {o.agent.domDelta}d · reserve Δ{" "}
                          {o.agent.reserveVariance >= 0 ? "+" : ""}
                          {o.agent.reserveVariance}% · niche vol {o.agent.nicheVolume}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </PropertyCard>

          <PropertyCard className="p-5">
            <p className="text-sm leading-relaxed text-slate-600">
              Ordering is by <Tag>AES</Tag>, not by the lowest number. A saturated office can always
              undercut on commission — under equilibrium it simply is not shown first, because the
              service it is offering is one it cannot currently deliver and the niche record behind
              it does not match your property. Commission is the agent's own term: RSP publishes the
              rate it recommends for each agent, and any override is shown beside it.
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
