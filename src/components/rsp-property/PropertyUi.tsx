import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteBreadcrumbs, SitePager } from "@/components/SiteNavUi";
import type { TelemetryState } from "@/lib/reiv-data";
import { stateLabel } from "@/lib/reiv-data";

export const propertyNav = [
  { to: "/rsp/macro/property/overview", label: "01. Overview" },
  { to: "/rsp/macro/property/reiv-telemetry", label: "02. REIV Telemetry" },
  { to: "/rsp/macro/property/ves-formula", label: "03. VES Simulator" },
  { to: "/rsp/macro/property/vendor-portal", label: "04. Vendor Portal" },
  { to: "/rsp/macro/property/specification", label: "05. Specification" },
] as const;

export const stateClasses: Record<TelemetryState, string> = {
  balanced: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  calibrating: "border-amber-500/30 bg-amber-50 text-amber-700",
  suppressed: "border-rose-500/30 bg-rose-50 text-rose-700",
};

const stateDot: Record<TelemetryState, string> = {
  balanced: "bg-emerald-500",
  calibrating: "bg-amber-500",
  suppressed: "bg-rose-500",
};

export function StateBadge({ state, className = "" }: { state: TelemetryState; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-widest ${stateClasses[state]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${stateDot[state]}`} />
      {stateLabel[state]}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-emerald-500/20 bg-emerald-50 px-1.5 py-0.5 font-mono text-[0.75em] text-emerald-700">
      {children}
    </code>
  );
}

export function PropertyCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-emerald-500/15 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(5,150,105,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  hint,
  state,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  state?: TelemetryState;
}) {
  return (
    <PropertyCard className="p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
          {label}
        </span>
        {state && <StateBadge state={state} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight text-slate-900">{value}</span>
        {unit && <span className="font-mono text-sm text-slate-500">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-slate-500">{hint}</p>}
    </PropertyCard>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 font-mono text-xs text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        {eyebrow}
      </div>
      <h1 className="mb-4 bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent md:text-5xl">
        {title}
      </h1>
      {lead && (
        <p className="max-w-3xl text-xl font-light leading-relaxed text-slate-600">{lead}</p>
      )}
    </header>
  );
}

export function GradientButton({
  to,
  href,
  children,
  onClick,
  type,
  disabled,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#059669_0%,#10B981_50%,#34D399_100%)] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.8)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50";
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function PropertyShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#FAFBF9] font-sans text-slate-700">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.18),rgba(250,251,249,0)_65%)]"
      />
      <div className="relative">
        <SiteHeader variant="macro" />
        <SiteBreadcrumbs tone="light" fallbackLabel={current} />
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-8">
          {children}
          <SitePager tone="light" />
        </main>
        <footer className="border-t border-emerald-500/15">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-8 font-mono text-xs text-slate-500">
            <span className="uppercase tracking-widest">@rsp/property v0.1 draft</span>
            <Link to="/rsp/macro" className="hover:text-emerald-700">
              Macro Equilibrium
            </Link>
            <Link
              to="/rsp/ethical-auction"
              search={{ inc: 40, comp: 85 }}
              className="hover:text-emerald-700"
            >

              VEO
            </Link>
            <Link to="/rsp/principles" className="hover:text-emerald-700">
              RSP principles
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
