import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AVATAR_PATHS, SiteHeader, areaMenus, isAuctionPath, isPulsePath } from "@/components/SiteHeader";
import lovekeyMark from "@/assets/lovekey-mark.png";
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json";
import { trackEvent } from "@/lib/analytics";
import { getCaseStudy } from "@/lib/case-studies";

export const Route = createFileRoute("/rsp")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Love Key Link / RSP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RspLayout,
});

const helpNetwork = [
  {
    title: "First Aid Angel",
    tag: "PREPARE",
    body: "Quick first aid guidance and support",
    href: "https://firstaidangel.org/",
  },
  {
    title: "Crisis Compass",
    tag: "RESPOND",
    body: "Emergency guidance for active crises",
    href: "https://crisis-compass.org/",
  },
  {
    title: "Aid Angel",
    tag: "RECOVER",
    body: "Recovery support after disaster",
    href: "https://aidangel.app/",
  },
  {
    title: "Guardian Guide",
    tag: "HEAL",
    body: "Mental health and emotional support",
    href: "https://guardianguide.org/",
  },
  {
    title: "Love Key",
    tag: "COORDINATE",
    body: "Connect with the Help Network",
    href: "https://lovekeyring.org/",
  },
  {
    title: "Love Key Ring",
    tag: "REACH",
    body: "A gentle way to reach help",
    href: "https://lovekey.com.au/?locale=AU#product-section",
  },
];

// ─── Styles ────────────────────────────────────────────────────────────────




// ─── Breadcrumb trail ────────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  "/rsp": "Overview",
  "/rsp/principles": "Principles",
  "/rsp/how-it-works": "How it works",
  "/rsp/dimensions": "Dimensions",
  "/rsp/checklist": "Identity checklist",
  "/rsp/implementations": "Implementations",
  "/rsp/case-studies": "Case Studies",
  "/rsp/event-token": "Event Token",
  "/rsp/for-developers": "For developers",
  "/rsp/governance": "Governance",
  "/rsp/faq": "FAQ",
  "/rsp/avatars": "Overview",
  "/rsp/avatar-creator": "Avatar Creator",
  "/rsp/spec-check": "Spec checklist",
  "/rsp/pulse": "Overview",
  "/rsp/pulse/summary": "Pulse Server Summary",
  "/rsp/pulse/server": "RSP Pulse Server",
  "/rsp/pulse/telemetry": "Global Telemetry",
  "/rsp/pulse/allocation": "Resource Allocation",
  "/rsp/pulse/spec": "Open Specification",
  "/rsp/pulse/strain-engine": "Strain Engine (ESI)",
  "/rsp/pulse/disaster-aid": "Disaster & Humanitarian Aid",
  "/rsp/ethical-auction": "Overview",
  "/rsp/ethical-auction/intent": "Pooled intent",
  "/rsp/ethical-auction/capacity": "Capacity & workforce",
  "/rsp/ethical-auction/experience": "Consumer experience",
  "/rsp/ethical-auction/equilibrium": "Equilibrium score",
  "/rsp/ethical-auction/adoption": "Calibration & adoption",
};

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAvatars = AVATAR_PATHS.some((a: string) => pathname === a || pathname.startsWith(`${a}/`));

  const crumbs: { label: string; to?: string }[] = [
    { label: "Love Key Link", to: "/" },
  ];

  if (isAuctionPath(pathname)) {
    crumbs.push({ label: "Equilibrium Theory VEO", to: "/rsp/ethical-auction" });
    if (pathname !== "/rsp/ethical-auction") {
      crumbs.push({ label: PAGE_LABELS[pathname] ?? "Page" });
    }
  } else if (isPulsePath(pathname)) {
    crumbs.push({ label: "Pulse", to: "/rsp/pulse" });
    if (pathname !== "/rsp/pulse") {
      crumbs.push({ label: PAGE_LABELS[pathname] ?? "Page" });
    }
  } else if (isAvatars) {
    crumbs.push({ label: "Identity Avatars", to: "/rsp/avatars" });
    if (pathname !== "/rsp/avatars") {
      crumbs.push({ label: PAGE_LABELS[pathname] ?? "Page" });
    }
  } else {
    crumbs.push({ label: "RSP", to: "/rsp" });
    if (pathname.startsWith("/rsp/case-studies/")) {
      crumbs.push({ label: "Case Studies", to: "/rsp/case-studies" });
      const cs = getCaseStudy(pathname.split("/")[3] ?? "");
      crumbs.push({ label: cs?.product ?? "Case study" });
    } else if (pathname !== "/rsp") {
      crumbs.push({ label: PAGE_LABELS[pathname] ?? "Page" });
    }
  }

  // Mark the final crumb as current (no link).
  const last = crumbs.length - 1;

  return (
    <nav className="rsp-crumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={`${c.label}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span className="rsp-crumb-sep" aria-hidden="true">/</span>}
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




// ─── Prev / Next pager (within RSP & Identity Avatars clusters) ──────────────

function ClusterPager({ variant }: { variant: "header" | "footer" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Only page within the multi-page clusters (RSP, Identity Avatars).
  const cluster = areaMenus.find(
    (m) => m.links.length > 1 && m.links.some((l) => l.to === pathname),
  );
  if (!cluster) return null;

  const idx = cluster.links.findIndex((l) => l.to === pathname);
  const prev = idx > 0 ? cluster.links[idx - 1] : null;
  const next = idx < cluster.links.length - 1 ? cluster.links[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      className={`rsp-pager rsp-pager-${variant}`}
      aria-label={`${cluster.label} pagination`}
    >
      {prev ? (
        <Link to={prev.to} className="rsp-pager-btn rsp-pager-prev">
          <span className="rsp-pager-arrow" aria-hidden="true">←</span>
          <span className="rsp-pager-text">
            <span className="rsp-pager-dir">Previous</span>
            <span className="rsp-pager-label">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span className="rsp-pager-spacer" />
      )}

      {variant === "footer" && (
        <span className="rsp-pager-cluster">{cluster.label}</span>
      )}

      {next ? (
        <Link to={next.to} className="rsp-pager-btn rsp-pager-next">
          <span className="rsp-pager-text">
            <span className="rsp-pager-dir">Next</span>
            <span className="rsp-pager-label">{next.label}</span>
          </span>
          <span className="rsp-pager-arrow" aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="rsp-pager-spacer" />
      )}
    </nav>
  );
}


// ─── Layout shell ────────────────────────────────────────────────────────────




function RspLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="rsp-root">
      <SiteHeader />

      <Breadcrumbs />
      <ClusterPager variant="header" />

      <Outlet />

      <ClusterPager variant="footer" />

      {/* FOOTER */}
      <footer className="rsp-footer">
        <div className="rsp-help">
          <h2 className="rsp-help-title">Love Key Help Network</h2>
          <div className="rsp-help-grid">
            {helpNetwork.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("help_network_tile_click", {
                    tile: tile.title,
                    tag: tile.tag,
                    location: "rsp_footer",
                  })
                }
                className="rsp-help-tile"
              >
                <div className="rsp-help-head">
                  <span className="rsp-help-name">{tile.title}</span>
                  <span className="rsp-help-tag">{tile.tag}</span>
                </div>
                <p className="rsp-help-body">{tile.body}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="rsp-footer-inner">
          <img
            src={lovekeyMark}
            alt="Love Key Link"
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
          <div className="rsp-footer-left">
            <strong>Love Key Link / RSP</strong> · Respectful Synchronised Protocol v1.6 · Part of
            the{" "}
            <a
              href="https://lovekeyring.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--rsp-primary)" }}
            >
              Love Key Help Network
            </a>{" "}
            · Copyright © 2026 Jack Oswald. All rights reserved unless otherwise licensed in
            writing.
          </div>
          <div className="rsp-footer-right">
            RSP NFTs are utility, provenance, access, participation, and certification tokens. Not
            investment products.
          </div>
        </div>
      </footer>
    </div>
  );
}
