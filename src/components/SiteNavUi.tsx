import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { breadcrumbsFor, clusterById, pagerFor } from "@/lib/site-nav";

type Tone = "rsp" | "light";

/**
 * Site-wide breadcrumb trail, driven by the scope registry so every page —
 * including the macro/property branches outside the /rsp layout — shows the
 * same trail shape: Love Key Link / Scope / [Cluster] / Page.
 */
export function SiteBreadcrumbs({
  tone = "rsp",
  fallbackLabel,
}: {
  tone?: Tone;
  fallbackLabel?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = breadcrumbsFor(pathname, fallbackLabel);
  if (crumbs.length < 2) return null;
  const last = crumbs.length - 1;

  if (tone === "light") {
    return (
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-6 pt-6 font-mono text-xs text-slate-500"
      >
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === last || !c.to ? (
              <span className="text-emerald-700" aria-current="page">
                {c.label}
              </span>
            ) : (
              <Link to={c.to} className="hover:text-slate-700">
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <nav className="rsp-crumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={`${c.label}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {i > 0 && (
            <span className="rsp-crumb-sep" aria-hidden="true">
              /
            </span>
          )}
          {i === last || !c.to ? (
            <span className="rsp-crumb-current" aria-current="page">
              {c.label}
            </span>
          ) : (
            <Link to={c.to} className="rsp-crumb">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Prev/next pager within the current cluster. */
export function SitePager({
  variant = "footer",
  tone = "rsp",
}: {
  variant?: "header" | "footer";
  tone?: Tone;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pager = pagerFor(pathname);
  if (!pager) return null;
  const { prev, next, clusterLabel } = pager;

  if (tone === "light") {
    if (variant === "header") return null;
    return (
      <nav
        aria-label={`${clusterLabel} pagination`}
        className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/15 pt-8 font-mono text-xs"
      >
        {prev ? (
          <Link
            to={prev.to}
            className="rounded-xl border border-emerald-500/20 px-4 py-2 text-slate-600 transition-all hover:border-emerald-500/60 hover:text-emerald-700"
          >
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        <span className="hidden uppercase tracking-widest text-slate-400 sm:inline">
          {clusterLabel}
        </span>
        {next ? (
          <Link
            to={next.to}
            className="rounded-xl border border-emerald-500/20 px-4 py-2 text-slate-600 transition-all hover:border-emerald-500/60 hover:text-emerald-700"
          >
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    );
  }

  return (
    <nav className={`rsp-pager rsp-pager-${variant}`} aria-label={`${clusterLabel} pagination`}>
      {prev ? (
        <Link to={prev.to} className="rsp-pager-btn rsp-pager-prev">
          <span className="rsp-pager-arrow" aria-hidden="true">
            ←
          </span>
          <span className="rsp-pager-text">
            <span className="rsp-pager-dir">Previous</span>
            <span className="rsp-pager-label">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span className="rsp-pager-spacer" />
      )}

      {variant === "footer" && <span className="rsp-pager-cluster">{clusterLabel}</span>}

      {next ? (
        <Link to={next.to} className="rsp-pager-btn rsp-pager-next">
          <span className="rsp-pager-text">
            <span className="rsp-pager-dir">Next</span>
            <span className="rsp-pager-label">{next.label}</span>
          </span>
          <span className="rsp-pager-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      ) : (
        <span className="rsp-pager-spacer" />
      )}
    </nav>
  );
}

/**
 * Branch hub card grid — one card per page in a cluster, each with the
 * "what you'll learn" blurb from the nav registry.
 */
export function BranchHubGrid({
  clusterId,
  exclude = [],
  tone = "light",
}: {
  clusterId: string;
  exclude?: string[];
  tone?: Tone;
  children?: ReactNode;
}) {
  const cluster = clusterById(clusterId);
  if (!cluster) return null;
  const links = cluster.links.filter((l) => !exclude.includes(l.to));

  return (
    <ol className={tone === "light" ? "grid gap-4 md:grid-cols-2" : "rsp-hub-grid"}>
      {links.map((l, i) => (
        <li key={l.to}>
          <Link
            to={l.to}
            className={
              tone === "light"
                ? "flex h-full flex-col rounded-2xl border border-emerald-500/15 bg-white p-5 transition-all hover:border-emerald-500/50"
                : "rsp-hub-card"
            }
          >
            <span
              className={
                tone === "light"
                  ? "font-mono text-[0.68rem] uppercase tracking-widest text-emerald-700"
                  : "rsp-hub-num"
              }
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={
                tone === "light" ? "mt-2 text-lg font-semibold text-slate-900" : "rsp-hub-title"
              }
            >
              {l.label}
            </span>
            {l.blurb && (
              <span
                className={
                  tone === "light"
                    ? "mt-1.5 text-sm leading-relaxed text-slate-600"
                    : "rsp-hub-body"
                }
              >
                {l.blurb}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
