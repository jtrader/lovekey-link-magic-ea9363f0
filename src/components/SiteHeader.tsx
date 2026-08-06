import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import lovekeyMark from "@/assets/lovekey-mark.png";
import { rspCss } from "@/components/rsp-css";
import { isLinkActive, matchPath, scopes, type NavCluster, type NavLink } from "@/lib/site-nav";

function ScopePanelLinks({
  cluster,
  pathname,
  variant,
  onNavigate,
  showLabel,
}: {
  cluster: NavCluster;
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate: () => void;
  showLabel: boolean;
}) {
  const itemClass = variant === "desktop" ? "rsp-menu-item" : "rsp-mobile-item";
  return (
    <div className="rsp-menu-col">
      {showLabel && (
        <div className="rsp-menu-col-head">
          <Link to={cluster.to} className="rsp-menu-col-title" onClick={onNavigate}>
            {cluster.label}
          </Link>
          {cluster.blurb && <span className="rsp-menu-col-blurb">{cluster.blurb}</span>}
        </div>
      )}
      {cluster.links.map((l: NavLink) => {
        const active = isLinkActive(pathname, l);
        if (l.href) {
          return (
            <a
              key={l.href}
              href={l.href}
              download={l.download}
              role={variant === "desktop" ? "menuitem" : undefined}
              className={itemClass}
              onClick={onNavigate}
            >
              {l.label}
            </a>
          );
        }
        return (
          <Link
            key={`${l.to}${l.hash ?? ""}`}
            to={l.to}
            hash={l.hash}
            role={variant === "desktop" ? "menuitem" : undefined}
            className={`${itemClass}${active ? " rsp-nav-active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}

function ScopeMenus() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentScopeId = matchPath(pathname)?.scope.id;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <ul className="rsp-menus" onMouseLeave={() => setOpenIdx(null)}>
      {scopes.map((scope, i) => {
        const current = scope.id === currentScopeId;
        const single = scope.clusters.length === 1 && scope.clusters[0]!.links.length <= 1;
        return (
          <li
            key={scope.id}
            className="rsp-menu"
            data-open={openIdx === i}
            onMouseEnter={() => setOpenIdx(i)}
          >
            {single ? (
              <Link
                to={scope.to}
                className={`rsp-menu-trigger${current ? " rsp-menu-current" : ""}`}
              >
                {scope.label}
              </Link>
            ) : (
              <button
                type="button"
                className={`rsp-menu-trigger${current ? " rsp-menu-current" : ""}`}
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx((o) => (o === i ? null : i))}
              >
                {scope.label}
                <span className="rsp-menu-caret" aria-hidden="true" />
              </button>
            )}
            {!single && openIdx === i && (
              <div
                className={`rsp-menu-panel${scope.mega ? " rsp-menu-mega" : ""}`}
                role="menu"
              >
                {scope.clusters.map((c) => (
                  <ScopePanelLinks
                    key={c.id}
                    cluster={c}
                    pathname={pathname}
                    variant="desktop"
                    onNavigate={() => setOpenIdx(null)}
                    showLabel={!!scope.mega}
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
 * Shared Love Key Link site header (logo + scope nav + mobile accordion).
 * `variant="macro"` adopts the light/mono style guide used by the
 * @rsp/macro and @rsp/property branches.
 */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "macro" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentScopeId = matchPath(pathname)?.scope.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openScope, setOpenScope] = useState<string | null>(currentScopeId ?? null);

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
                {variant === "macro"
                  ? "/ @rsp/macro"
                  : currentScopeId && currentScopeId !== "product"
                    ? `/ ${matchPath(pathname)?.scope.label}`
                    : ""}
              </span>
            </span>

          </Link>
          <div className="rsp-menus-wrap">
            <ScopeMenus />
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
            {scopes.map((scope) => {
              const expanded = openScope === scope.id;
              return (
                <div key={scope.id} className="rsp-mobile-group">
                  <button
                    type="button"
                    className={`rsp-mobile-group-label${
                      scope.id === currentScopeId ? " rsp-nav-active" : ""
                    }`}
                    aria-expanded={expanded}
                    onClick={() => setOpenScope((s) => (s === scope.id ? null : scope.id))}
                  >
                    {scope.label}
                    <span aria-hidden="true">{expanded ? "\u2212" : "+"}</span>
                  </button>
                  {expanded &&
                    scope.clusters.map((c) => (
                      <ScopePanelLinks
                        key={c.id}
                        cluster={c}
                        pathname={pathname}
                        variant="mobile"
                        onNavigate={() => setMenuOpen(false)}
                        showLabel={scope.clusters.length > 1}
                      />
                    ))}
                </div>
              );
            })}
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

  /* Scope menus: single-column panels, plus a multi-column mega panel for
     the Applications scope so every branch is visible at once. */
  .rsp-menu-panel { display: flex; flex-direction: column; }
  .rsp-menu-mega {
    display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 18px 26px; padding: 20px 22px; min-width: 620px; right: auto; left: 50%;
    transform: translateX(-50%);
  }
  .rsp-menu-col { display: flex; flex-direction: column; min-width: 0; }
  .rsp-menu-col-head { display: flex; flex-direction: column; gap: 2px; margin: 0 0 6px; padding: 0 10px; }
  .rsp-menu-col-title {
    font-size: .82rem; font-weight: 700; letter-spacing: .02em; color: var(--rsp-text);
    text-decoration: none;
  }
  .rsp-menu-col-title:hover { color: var(--rsp-primary); }
  .rsp-menu-col-blurb { font-size: .72rem; line-height: 1.35; color: var(--rsp-text-soft, #64748b); }
  .rsp-menu-mega .rsp-menu-item { font-size: .82rem; padding: 5px 10px; }

  .rsp-mobile-item {
    display: block; padding: 7px 4px 7px 14px; font-size: .9rem;
    color: var(--rsp-text-muted); text-decoration: none;
  }
  .rsp-mobile-item:hover { color: var(--rsp-text); }
  .rsp-mobile-item.rsp-nav-active { color: var(--rsp-primary); font-weight: 600; }
  button.rsp-mobile-group-label {
    display: flex; width: 100%; align-items: center; justify-content: space-between;
    background: none; border: 0; cursor: pointer; text-align: left;
  }
  button.rsp-mobile-group-label.rsp-nav-active { color: var(--rsp-primary); }

  @media (max-width: 1024px) {
    .rsp-menu-mega { min-width: 0; grid-template-columns: 1fr; }
  }

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
  .rsp-header-macro .rsp-menu-col-title,
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
