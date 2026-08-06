/**
 * Single source of truth for the site's information architecture.
 *
 * Four content scopes (product, protocol, applications, avatars) plus a
 * resources shelf. Every page belongs to exactly one scope and one cluster,
 * which drives the header menus, breadcrumbs, the prev/next pager and the
 * branch hub cards.
 */

export type NavLink = {
  to: string;
  /** Optional in-page anchor appended to the link target. */
  hash?: string;
  label: string;
  blurb?: string;
  exact?: boolean;
};

export type NavCluster = {
  id: string;
  label: string;
  to: string;
  blurb?: string;
  links: NavLink[];
};

export type NavScope = {
  id: string;
  label: string;
  to: string;
  blurb?: string;
  /** Extra path prefixes owned by this scope that are not menu links. */
  owns?: string[];
  /** Render the desktop panel as a multi-column mega menu. */
  mega?: boolean;
  clusters: NavCluster[];
};

export const scopes: NavScope[] = [
  {
    id: "product",
    label: "Love Key Link",
    to: "/",
    blurb: "The coordination product built on RSP.",
    owns: ["/login", "/app", "/onboarding", "/invite", "/r", "/admin", "/quiz"],
    clusters: [
      {
        id: "product",
        label: "Love Key Link",
        to: "/",
        links: [
          { to: "/", label: "Home", exact: true, blurb: "Are my people okay?" },
          { to: "/", hash: "how", label: "How it works", blurb: "Claim, share, coordinate." },
          { to: "/", hash: "status", label: "Status model", blurb: "Presence without surveillance." },
          { to: "/", hash: "privacy", label: "Privacy", blurb: "What we never collect." },
          { to: "/quiz", label: "Wellbeing quiz", blurb: "Find your coordination profile." },
          { to: "/login", label: "Sign in", blurb: "Open your family hub." },
        ],
      },
    ],
  },
  {
    id: "protocol",
    label: "RSP",
    to: "/rsp",
    blurb: "The Respectful Synchronised Protocol itself.",
    clusters: [
      {
        id: "rsp",
        label: "RSP",
        to: "/rsp",
        blurb: "Consent-first coordination without surveillance.",
        links: [
          { to: "/rsp", label: "Overview", exact: true, blurb: "What the protocol is and why." },
          { to: "/rsp/principles", label: "Principles", blurb: "The commitments RSP makes." },
          { to: "/rsp/how-it-works", label: "How it works", blurb: "Claim, grant, project, revoke." },
          { to: "/rsp/dimensions", label: "Dimensions", blurb: "What each consent dimension governs." },
          { to: "/rsp/checklist", label: "Identity checklist", blurb: "Audit your own identity surface." },
          { to: "/rsp/event-token", label: "Event Token (NFT)", blurb: "Utility, provenance and access tokens." },
          { to: "/rsp/governance", label: "Governance", blurb: "Who changes the spec, and how." },
          { to: "/rsp/faq", label: "FAQ", blurb: "Plain-language answers." },
          { to: "/rsp/for-developers", label: "For developers", blurb: "Install and first API call." },
          { to: "/rsp/case-studies", label: "Case studies", blurb: "RSP applied in the wild." },
          { to: "/rsp/implementations", label: "Implementations", blurb: "Who has shipped what." },
        ],
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    to: "/rsp/pulse",
    blurb: "Protocol branches: Pulse, VEO, Macro and Property.",
    mega: true,
    clusters: [
      {
        id: "pulse",
        label: "Pulse",
        to: "/rsp/pulse",
        blurb: "Anonymised strain telemetry for crisis response.",
        links: [
          { to: "/rsp/pulse", label: "Overview", exact: true, blurb: "What Pulse measures." },
          { to: "/rsp/pulse/summary", label: "Pulse Server — Summary", blurb: "The calm explainer." },
          { to: "/rsp/pulse/server", label: "RSP Pulse Server", blurb: "Live regional dashboard." },
          { to: "/rsp/pulse/telemetry", label: "Global Telemetry", blurb: "Aggregate ESI view." },
          { to: "/rsp/pulse/allocation", label: "Resource Allocation", blurb: "Balancing responders." },
          { to: "/rsp/pulse/strain-engine", label: "Strain Engine (ESI)", blurb: "The ESI mathematics." },
          { to: "/rsp/pulse/disaster-aid", label: "Disaster & Humanitarian Aid", blurb: "Field framework." },
          { to: "/rsp/pulse/spec", label: "Open Spec (@rsp/pulse)", blurb: "Implementable specification." },
        ],
      },
      {
        id: "veo",
        label: "Equilibrium Theory VEO",
        to: "/rsp/ethical-auction",
        blurb: "Vertical Equilibrium Optimization — successor to SEO & SEM.",
        links: [
          { to: "/rsp/ethical-auction", label: "Overview", exact: true, blurb: "Why auctions break verticals." },
          { to: "/rsp/ethical-auction/intent", label: "Pooled intent", blurb: "Demand without tracking." },
          { to: "/rsp/ethical-auction/capacity", label: "Capacity & workforce", blurb: "Can they actually serve it?" },
          { to: "/rsp/ethical-auction/experience", label: "Consumer experience", blurb: "CX as a ranking input." },
          { to: "/rsp/ethical-auction/equilibrium", label: "Equilibrium score", blurb: "The paired organic/paid rank." },
          { to: "/rsp/ethical-auction/adoption", label: "Calibration & adoption", blurb: "Getting there safely." },
        ],
      },
      {
        id: "macro",
        label: "Macro Equilibrium",
        to: "/rsp/macro",
        blurb: "@rsp/macro — the open specification for capacity-aware ranking.",
        links: [
          { to: "/rsp/macro", label: "Index", exact: true, blurb: "Section index." },
          { to: "/rsp/macro/overview", label: "Overview", blurb: "Equilibrium vs. extraction." },
          { to: "/rsp/macro/telemetry", label: "Telemetry", blurb: "The three signals." },
          { to: "/rsp/macro/ves-formula", label: "VES Formula", blurb: "The ranking mathematics." },
          { to: "/rsp/macro/calibration", label: "Calibration", blurb: "The 90-day sandbox." },
          { to: "/rsp/macro/governance", label: "Governance", blurb: "Privacy safeguards." },
        ],
      },
      {
        id: "property",
        label: "Property",
        to: "/rsp/macro/property/overview",
        blurb: "@rsp/property — sell without surveillance.",
        links: [
          { to: "/rsp/macro/property/overview", label: "Overview", blurb: "Reverse auction, no data broker." },
          { to: "/rsp/macro/property/reiv-telemetry", label: "REIV Telemetry", blurb: "Regional market signals." },
          { to: "/rsp/macro/property/ves-formula", label: "VES Simulator", blurb: "Model agent capacity." },
          { to: "/rsp/macro/property/vendor-portal", label: "Vendor Portal", blurb: "Anonymised intent demo." },
          { to: "/rsp/macro/property/specification", label: "Specification", blurb: "The master spec v1.0." },
        ],
      },
    ],
  },
  {
    id: "avatars",
    label: "Identity Avatars",
    to: "/rsp/avatars",
    blurb: "Represented identity in AI-mediated ecosystems.",
    clusters: [
      {
        id: "avatars",
        label: "Identity Avatars",
        to: "/rsp/avatars",
        links: [
          { to: "/rsp/avatars", label: "Overview", exact: true, blurb: "Why avatars need consent." },
          { to: "/rsp/avatar-creator", label: "Avatar Creator", blurb: "Generate a stylised avatar." },
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    to: "/resources",
    blurb: "Every specification, summary and download in one place.",
    clusters: [
      {
        id: "resources",
        label: "Resources",
        to: "/resources",
        links: [
          { to: "/resources", label: "All downloads", exact: true, blurb: "Whitepaper and branch specs." },
          { to: "/rsp/spec-check", label: "Spec checklist", blurb: "Internal coverage tracker." },
        ],
      },
    ],
  },
];

export function normalizePath(p: string) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function matches(path: string, to: string, exact?: boolean) {
  if (exact || to === "/") return path === to;
  return path === to || path.startsWith(`${to}/`);
}

export type NavMatch = {
  scope: NavScope;
  cluster?: NavCluster;
  link?: NavLink;
};

/** Resolve a pathname to its scope / cluster / page using longest-prefix wins. */
export function matchPath(pathname: string): NavMatch | undefined {
  const path = normalizePath(pathname);
  let best: (NavMatch & { score: number }) | undefined;

  const consider = (score: number, m: NavMatch) => {
    if (score > 0 && (!best || score > best.score)) best = { ...m, score };
  };

  for (const scope of scopes) {
    for (const cluster of scope.clusters) {
      for (const link of cluster.links) {
        if (matches(path, link.to, link.exact)) {
          consider(link.to.length + (link.exact ? 0.5 : 0), { scope, cluster, link });
        }
      }
      if (matches(path, cluster.to)) consider(cluster.to.length - 0.5, { scope, cluster });
    }
    for (const owned of scope.owns ?? []) {
      if (matches(path, owned)) consider(owned.length - 1, { scope });
    }
  }

  return best ? { scope: best.scope, cluster: best.cluster, link: best.link } : undefined;
}

export function isLinkActive(pathname: string, link: NavLink) {
  return matches(normalizePath(pathname), link.to, link.exact);
}

export function isScopeActive(pathname: string, scope: NavScope) {
  return matchPath(pathname)?.scope.id === scope.id;
}

export function isClusterActive(pathname: string, cluster: NavCluster) {
  return matchPath(pathname)?.cluster?.id === cluster.id;
}

export type Crumb = { label: string; to?: string };

/** Home / Scope / [Cluster] / Page */
export function breadcrumbsFor(pathname: string, fallbackLabel?: string): Crumb[] {
  const path = normalizePath(pathname);
  const m = matchPath(path);
  const crumbs: Crumb[] = [{ label: "Love Key Link", to: "/" }];
  if (!m || path === "/") return crumbs;

  if (m.scope.id !== "product") crumbs.push({ label: m.scope.label, to: m.scope.to });

  const multiCluster = m.scope.clusters.length > 1;
  if (m.cluster && multiCluster) crumbs.push({ label: m.cluster.label, to: m.cluster.to });

  const leaf = m.link?.label ?? fallbackLabel;
  const leafTo = m.link?.to;
  const last = crumbs[crumbs.length - 1];
  if (leaf && !(last && last.to === leafTo)) crumbs.push({ label: leaf });
  else if (!leaf && fallbackLabel) crumbs.push({ label: fallbackLabel });

  return crumbs;
}

export type Pager = {
  clusterLabel: string;
  prev?: NavLink;
  next?: NavLink;
};

export function pagerFor(pathname: string): Pager | undefined {
  const m = matchPath(pathname);
  if (!m?.cluster || !m.link || m.cluster.links.length < 2) return undefined;
  const idx = m.cluster.links.findIndex((l) => l.to === m.link!.to);
  if (idx < 0) return undefined;
  const prev = idx > 0 ? m.cluster.links[idx - 1] : undefined;
  const next = idx < m.cluster.links.length - 1 ? m.cluster.links[idx + 1] : undefined;
  if (!prev && !next) return undefined;
  return { clusterLabel: m.cluster.label, prev, next };
}

export function clusterById(id: string): NavCluster | undefined {
  for (const s of scopes) for (const c of s.clusters) if (c.id === id) return c;
  return undefined;
}
