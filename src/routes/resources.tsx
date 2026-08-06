import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteBreadcrumbs } from "@/components/SiteNavUi";
import whitepaper from "@/assets/rsp-whitepaper.pdf.asset.json";
import lawOfVibration from "@/assets/RSP_Chapter_Law_of_Vibration.pdf.asset.json";
import veoSummary from "@/assets/veo-branch-summary.pdf.asset.json";
import macroSummary from "@/assets/macro-spec-summary.pdf.asset.json";
import propertySpecMd from "@/assets/rsp-property-spec.md.asset.json";
import propertySpecZip from "@/assets/rsp-property-spec.zip.asset.json";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — RSP specifications, summaries & downloads" },
      {
        name: "description",
        content:
          "Every Love Key Link download in one shelf: the RSP whitepaper, the VEO one-page summary, the @rsp/macro open specification and the @rsp/property master specification.",
      },
      { property: "og:title", content: "RSP Resources — specifications & downloads" },
      {
        property: "og:description",
        content:
          "Whitepaper, VEO summary, @rsp/macro open spec and the @rsp/property specification package, collected in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

type Item = {
  title: string;
  scope: string;
  desc: string;
  href: string;
  filename: string;
  kind: string;
  size: number;
  page?: string;
};

const items: Item[] = [
  {
    title: "RSP Whitepaper",
    scope: "Protocol",
    desc: "The full Respectful Synchronised Protocol paper — consent dimensions, revocation, and the coordination model.",
    href: whitepaper.url,
    filename: "rsp-whitepaper.pdf",
    kind: "PDF",
    size: 0,
    page: "/rsp",
  },
  {
    title: "Chapter — The Law of Vibration",
    scope: "Protocol",
    desc: "Companion chapter on presence, resonance and gentle state signalling.",
    href: lawOfVibration.url,
    filename: "RSP_Chapter_Law_of_Vibration.pdf",
    kind: "PDF",
    size: lawOfVibration.size,
    page: "/rsp/principles",
  },
  {
    title: "VEO branch — one-page summary",
    scope: "Applications / VEO",
    desc: "Vertical Equilibrium Optimization at a glance: the asymmetry, the paired organic/paid formula and key takeaways.",
    href: veoSummary.url,
    filename: "veo-branch-summary.pdf",
    kind: "PDF",
    size: veoSummary.size,
    page: "/rsp/ethical-auction",
  },
  {
    title: "@rsp/macro v1.0 — open specification summary",
    scope: "Applications / Macro",
    desc: "Tripartite telemetry, the VES formula, the variable reference table and the 90-day calibration timeline.",
    href: macroSummary.url,
    filename: "macro-spec-summary.pdf",
    kind: "PDF",
    size: macroSummary.size,
    page: "/rsp/macro",
  },
  {
    title: "@rsp/property — master specification (Markdown)",
    scope: "Applications / Property",
    desc: "The full property equilibrium and reverse-auction specification in source form.",
    href: propertySpecMd.url,
    filename: "RSP_Property_Equilibrium_Specification.md",
    kind: "MD",
    size: propertySpecMd.size,
    page: "/rsp/macro/property/specification",
  },
  {
    title: "@rsp/property — specification package",
    scope: "Applications / Property",
    desc: "The complete specification archive, including supporting reference material.",
    href: propertySpecZip.url,
    filename: "rsp-property-specification-v1.zip",
    kind: "ZIP",
    size: propertySpecZip.size,
    page: "/rsp/macro/property/specification",
  },
];

function fmtSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans text-slate-700">
      <SiteHeader variant="macro" />
      <SiteBreadcrumbs tone="light" />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 font-mono text-xs text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Specifications &amp; downloads
        </div>
        <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Resources
        </h1>
        <p className="mb-10 max-w-3xl text-xl font-light leading-relaxed text-slate-600">
          Every specification, summary and companion document published across the protocol and
          its branches — collected in one shelf instead of scattered across pages.
        </p>

        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <li
              key={it.href}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700">
                  {it.scope}
                </span>
                <span className="rounded-md border border-slate-200 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-slate-500">
                  {it.kind}
                  {it.size ? ` · ${fmtSize(it.size)}` : ""}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-slate-900">{it.title}</h2>
              <p className="mb-5 text-sm leading-relaxed text-slate-600">{it.desc}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                <a
                  href={it.href}
                  download={it.filename}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 px-3.5 py-2 font-mono text-xs text-emerald-700 transition-all hover:border-emerald-600 hover:bg-emerald-100"
                >
                  <span aria-hidden="true">↓</span>
                  Download
                </a>
                {it.page && (
                  <Link
                    to={it.page}
                    className="rounded-lg border border-slate-200 px-3.5 py-2 font-mono text-xs text-slate-600 transition-all hover:border-slate-400 hover:text-slate-800"
                  >
                    Read the page →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8 font-mono text-xs text-slate-600">
          <span className="uppercase tracking-widest">Internal</span>
          <Link
            to="/rsp/spec-check"
            className="rounded-lg border border-slate-200 px-3 py-1.5 transition-all hover:border-slate-400 hover:text-slate-800"
          >
            RSP spec checklist →
          </Link>
        </div>
      </main>
    </div>
  );
}
