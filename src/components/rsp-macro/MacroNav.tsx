import { SiteHeader } from "@/components/SiteHeader";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";
import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { href: "/rsp/macro", label: "00. Index" },
  { href: "/rsp/macro/overview", label: "01. Overview" },
  { href: "/rsp/macro/telemetry", label: "02. Telemetry" },
  { href: "/rsp/macro/ves-formula", label: "03. VES Formula" },
  { href: "/rsp/macro/calibration", label: "04. Calibration" },
  { href: "/rsp/macro/governance", label: "05. Governance" },
] as const;

function normalize(p: string) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

export function useMacroActive() {
  const pathname = useRouterState({ select: (s) => normalize(s.location.pathname) });
  const active =
    navItems.find((i) => i.href !== "/rsp/macro" && pathname.startsWith(i.href)) ??
    navItems[0];
  return { pathname, active };
}

export function MacroNav() {
  const { pathname, active } = useMacroActive();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-[#F5F7FB]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-600">
            <Link to="/rsp" className="hover:text-slate-700">
              LoveKey / RSP Protocol
            </Link>{" "}
            / <span className="text-emerald-700">@rsp/macro</span>
          </span>
        </div>
        {/* Mobile: show which section you are on */}
        <div className="w-full font-mono text-[0.7rem] uppercase tracking-widest text-emerald-700 sm:hidden">
          You are here: {active.label}
        </div>
        <div className="-mx-6 flex w-[calc(100%+3rem)] snap-x items-center gap-1 overflow-x-auto px-6 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-center sm:gap-2 sm:overflow-visible sm:px-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || item.href === active.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 snap-start rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                  isActive
                    ? "border border-emerald-500/40 bg-emerald-50 text-emerald-700"
                    : "border border-transparent text-slate-600 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function MacroBreadcrumbs() {
  const { pathname, active } = useMacroActive();
  const onIndex = pathname === "/rsp/macro";
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-6 pt-6 font-mono text-xs text-slate-600"
    >
      <Link to="/" className="hover:text-slate-600">
        Love Key Link
      </Link>
      <span aria-hidden="true">/</span>
      <Link to="/rsp" className="hover:text-slate-600">
        RSP
      </Link>
      <span aria-hidden="true">/</span>
      {onIndex ? (
        <span className="text-emerald-700" aria-current="page">
          @rsp/macro
        </span>
      ) : (
        <>
          <Link to="/rsp/macro" className="hover:text-slate-600">
            @rsp/macro
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-emerald-700" aria-current="page">
            {active.label.replace(/^\d+\.\s*/, "")}
          </span>
        </>
      )}
    </nav>
  );
}

function MacroFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-8 font-mono text-xs text-slate-600">
        <span className="uppercase tracking-widest">Elsewhere on Love Key Link</span>
        <Link to="/" className="hover:text-slate-600">
          Home
        </Link>
        <Link to="/rsp" className="hover:text-slate-600">
          RSP overview
        </Link>
        <Link to="/rsp/principles" className="hover:text-slate-600">
          Principles
        </Link>
        <Link to="/rsp/for-developers" className="hover:text-slate-600">
          Developers
        </Link>
        <Link to="/rsp/governance" className="hover:text-slate-600">
          Governance
        </Link>
        <Link to="/rsp/avatars" className="hover:text-slate-600">
          Identity Avatars
        </Link>
      </div>
    </footer>
  );
}

export function MacroShell({ children }: { children: React.ReactNode }) {
  return (
    <GlossarySheetProvider>
      <div className="min-h-screen bg-[#F5F7FB] font-sans text-slate-700">
        <SiteHeader variant="macro" />
        <MacroNav />
        <MacroBreadcrumbs />
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-6 md:pb-12">{children}</main>
        <MacroFooter />
      </div>
    </GlossarySheetProvider>
  );
}

