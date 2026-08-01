import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import lovekeyMark from "@/assets/lovekey-mark.png";
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json";
import { rspCss } from "@/components/rsp-css";

// ─── Area switcher (3 main site areas) ───────────────────────────────────────

export const AVATAR_PATHS = [
  "/rsp/avatars",
  "/rsp/avatar-creator",
  "/rsp/how-it-works",
  "/rsp/dimensions",
  "/rsp/checklist",
  "/rsp/faq",
];

function isAvatarPath(pathname: string) {
  return AVATAR_PATHS.some((a) => pathname === a || pathname.startsWith(`${a}/`));
}

export function isAuctionPath(pathname: string) {
  return (
    pathname === "/rsp/ethical-auction" || pathname.startsWith("/rsp/ethical-auction/")
  );
}

type AreaLink = { to: string; label: string; exact?: boolean; children?: AreaLink[] };

function linkIsActive(pathname: string, l: AreaLink) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return l.exact ? path === l.to : path === l.to || path.startsWith(`${l.to}/`);
}

function menuHasActive(pathname: string, links: AreaLink[]): boolean {
  return links.some(
    (l) => linkIsActive(pathname, l) || (l.children ? menuHasActive(pathname, l.children) : false),
  );
}

type AreaMenu = {
  label: string;
  to: string;
  match: (pathname: string) => boolean;
  links: AreaLink[];
};

export const areaMenus: AreaMenu[] = [
  {
    label: "Love Key Link",
    to: "/",
    match: (p) => p === "/",
    links: [{ to: "/", label: "Home", exact: true }],
  },
  {
    label: "RSP",
    to: "/rsp",
    match: (p) => p !== "/" && !isAvatarPath(p) && !isAuctionPath(p),
    links: [
      { to: "/rsp", label: "Overview", exact: true },
      { to: "/rsp/principles", label: "Principles" },
      { to: "/rsp/implementations", label: "Implementations" },
      { to: "/rsp/case-studies", label: "Case Studies" },
      { to: "/rsp/event-token", label: "Event Token" },
      {
        to: "/rsp#pulse",
        label: "RSP Pulse",
        children: [
          { to: "/rsp#pulse", label: "Overview" },
          { to: "/rsp#pulse-spec", label: "Open Spec (@rsp/pulse)" },
          { to: "/rsp#pulse-strain", label: "Strain Engine (ESI)" },
          { to: "/rsp#pulse-disaster-aid", label: "Disaster & Humanitarian Aid" },
        ],
      },
      { to: "/rsp/for-developers", label: "Developers" },
      {
        to: "/rsp/macro",
        label: "Macro Equilibrium",
        children: [
          { to: "/rsp/macro", label: "Index", exact: true },
          { to: "/rsp/macro/overview", label: "Overview" },
          { to: "/rsp/macro/telemetry", label: "Telemetry" },
          { to: "/rsp/macro/ves-formula", label: "VES Formula" },
          { to: "/rsp/macro/calibration", label: "Calibration" },
          { to: "/rsp/macro/governance", label: "Governance" },
        ],
      },
      { to: "/rsp/governance", label: "Governance" },
    ],
  },
  {
    label: "Equilibrium Theory VEO",
    to: "/rsp/ethical-auction",
    match: isAuctionPath,
    links: [
      { to: "/rsp/ethical-auction", label: "Overview", exact: true },
      { to: "/rsp/ethical-auction/intent", label: "Pooled intent" },
      { to: "/rsp/ethical-auction/capacity", label: "Capacity & workforce" },
      { to: "/rsp/ethical-auction/experience", label: "Consumer experience" },
      { to: "/rsp/ethical-auction/equilibrium", label: "Equilibrium score" },
      { to: "/rsp/ethical-auction/adoption", label: "Calibration & adoption" },
      {
        to: "/rsp/macro",
        label: "Macro Equilibrium",
        children: [
          { to: "/rsp/macro", label: "Index", exact: true },
          { to: "/rsp/macro/overview", label: "Overview" },
          { to: "/rsp/macro/telemetry", label: "Telemetry" },
          { to: "/rsp/macro/ves-formula", label: "VES Formula" },
          { to: "/rsp/macro/calibration", label: "Calibration" },
          { to: "/rsp/macro/governance", label: "Governance" },
        ],
      },
    ],
  },
  {
    label: "Identity Avatars",
    to: "/rsp/avatars",
    match: isAvatarPath,
    links: [
      { to: "/rsp/avatars", label: "Overview", exact: true },
      { to: "/rsp/avatar-creator", label: "Avatar Creator" },
      { to: "/rsp/how-it-works", label: "How it works" },
      { to: "/rsp/dimensions", label: "Dimensions" },
      { to: "/rsp/checklist", label: "Checklist" },
      { to: "/rsp/faq", label: "FAQ" },
    ],
  },
];

function MenuBranch({
  link,
  pathname,
  variant,
  onNavigate,
}: {
  link: AreaLink;
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate: () => void;
}) {
  const hasChildren = !!link.children?.length;
  const childActive = hasChildren ? menuHasActive(pathname, link.children!) : false;
  const [expanded, setExpanded] = useState(childActive);
  useEffect(() => {
    if (childActive) setExpanded(true);
  }, [childActive]);

  const active = linkIsActive(pathname, link);
  const itemClass =
    variant === "desktop"
      ? `rsp-menu-item${active ? " rsp-nav-active" : ""}`
      : active
        ? "rsp-nav-active"
        : undefined;
  const subClass = variant === "desktop" ? "rsp-menu-item rsp-menu-subitem" : "rsp-mobile-subitem";

  return (
    <Fragment>
      <div className="rsp-menu-branch">
        <Link
          to={link.to}
          role={variant === "desktop" ? "menuitem" : undefined}
          className={itemClass}
          aria-current={active ? "page" : undefined}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
        {hasChildren && (
          <button
            type="button"
            className="rsp-menu-expand"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label} links`}
            onClick={(e) => {
              e.preventDefault();
              setExpanded((v) => !v);
            }}
          >
            <span aria-hidden="true">{expanded ? "\u2212" : "+"}</span>
          </button>
        )}
      </div>
      {hasChildren &&
        expanded &&
        link.children!.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            role={variant === "desktop" ? "menuitem" : undefined}
            className={`${subClass}${linkIsActive(pathname, c) ? " rsp-nav-active" : ""}`}
            aria-current={linkIsActive(pathname, c) ? "page" : undefined}
            onClick={onNavigate}
          >
            {c.label}
          </Link>
        ))}
    </Fragment>
  );
}

function AreaMenus() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <ul className="rsp-menus" onMouseLeave={() => setOpenIdx(null)}>
      {areaMenus.map((menu, i) => {
        const current = menu.match(pathname) || menuHasActive(pathname, menu.links);
        const single = menu.links.length <= 1;
        return (
          <li
            key={menu.label}
            className="rsp-menu"
            data-open={openIdx === i}
            onMouseEnter={() => setOpenIdx(i)}
          >
            {single ? (
              <Link
                to={menu.to}
                className={`rsp-menu-trigger${current ? " rsp-menu-current" : ""}`}
              >
                {menu.label}
              </Link>
            ) : (
              <button
                type="button"
                className={`rsp-menu-trigger${current ? " rsp-menu-current" : ""}`}
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx((o) => (o === i ? null : i))}
              >
                {menu.label}
                <span className="rsp-menu-caret" aria-hidden="true" />
              </button>
            )}
            {!single && openIdx === i && (
              <div className="rsp-menu-panel" role="menu">
                {menu.links.map((l) => (
                  <MenuBranch
                    key={l.to}
                    link={l}
                    pathname={pathname}
                    variant="desktop"
                    onNavigate={() => setOpenIdx(null)}
                  />
                ))}

              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Shared Love Key Link site header (logo + area dropdown nav + mobile menu).
 * `variant="macro"` adopts the @rsp/macro light/mono style guide.
 */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "macro" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={`rsp-root rsp-header-shell${variant === "macro" ? " rsp-header-macro" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: rspCss + headerCss }} />
      <nav className="rsp-nav">
        <div className="rsp-nav-inner">
          <Link to="/" className="rsp-nav-logo">
            <span className="rsp-nav-logo-mark">
              <img src={lovekeyMark} alt="Love Key Link" />
            </span>
            <span>
              <span className="rsp-nav-logo-name">Love Key Link</span>
              <span className="rsp-nav-logo-sub">
                {variant === "macro" ? "/ @rsp/macro" : "/ RSP"}
              </span>
            </span>
          </Link>
          <div className="rsp-menus-wrap">
            <AreaMenus />
            <a className="rsp-nav-cta" href={whitepaperAsset.url} download="rsp-whitepaper.pdf">
              White Paper
            </a>
          </div>

          <button
            type="button"
            className="rsp-nav-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`rsp-burger-bar${menuOpen ? " open-1" : ""}`} />
            <span className={`rsp-burger-bar${menuOpen ? " open-2" : ""}`} />
            <span className={`rsp-burger-bar${menuOpen ? " open-3" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="rsp-nav-mobile">
            {areaMenus.map((menu) => (
              <div key={menu.label} className="rsp-mobile-group">
                <div className="rsp-mobile-group-label">{menu.label}</div>
                {menu.links.map((l) => (
                  <MenuBranch
                    key={l.to}
                    link={l}
                    pathname={pathname}
                    variant="mobile"
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </div>
            ))}
            <div className="rsp-mobile-group">
              <a
                href={whitepaperAsset.url}
                download="rsp-whitepaper.pdf"
                onClick={() => setMenuOpen(false)}
              >
                White Paper
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

/* Header-only overrides so the shared nav can sit on any page, plus the
   @rsp/macro style-guide skin (mono type, slate palette, subtle borders). */
const headerCss = `
  .rsp-header-shell { min-height: 0; overflow: visible; background: transparent; }

  .rsp-header-macro {
    --rsp-primary: #b45309;
    --rsp-primary-light: #fffbeb;
    --rsp-primary-glow: #f59e0b;
    --rsp-border: #e2e8f0;
    --rsp-border-strong: #cbd5e1;
    --rsp-text: #0f172a;
    --rsp-text-muted: #475569;
    --rsp-text-soft: #64748b;
  }
  .rsp-header-macro .rsp-nav {
    background: rgba(245,247,251,.92);
    border-bottom: 1px solid #e2e8f0;
  }
  .rsp-header-macro .rsp-nav-logo-name,
  .rsp-header-macro .rsp-nav-logo-sub,
  .rsp-header-macro .rsp-menu-trigger,
  .rsp-header-macro .rsp-menu-item,
  .rsp-header-macro .rsp-nav-cta,
  .rsp-header-macro .rsp-mobile-group-label,
  .rsp-header-macro .rsp-nav-mobile a {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
    letter-spacing: .02em;
  }
  .rsp-header-macro .rsp-menu-panel,
  .rsp-header-macro .rsp-nav-mobile {
    background: #ffffff;
    border-color: #e2e8f0;
  }
`;
