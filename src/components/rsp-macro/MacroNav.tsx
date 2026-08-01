import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { href: "/rsp/macro", label: "00. Index" },
  { href: "/rsp/macro/overview", label: "01. Overview" },
  { href: "/rsp/macro/telemetry", label: "02. Telemetry" },
  { href: "/rsp/macro/ves-formula", label: "03. VES Formula" },
  { href: "/rsp/macro/calibration", label: "04. Calibration" },
  { href: "/rsp/macro/governance", label: "05. Governance" },
] as const;

export function MacroNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0F17]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            <Link to="/rsp" className="hover:text-slate-200">
              LoveKey / RSP Protocol
            </Link>{" "}
            / <span className="text-emerald-400">@rsp/macro</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                  isActive
                    ? "border border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
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
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-6 pt-6 font-mono text-xs text-slate-500"
    >
      <Link to="/" className="hover:text-slate-300">
        Love Key Link
      </Link>
      <span aria-hidden="true">/</span>
      <Link to="/rsp" className="hover:text-slate-300">
        RSP
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-emerald-400" aria-current="page">
        @rsp/macro
      </span>
    </nav>
  );
}

function MacroFooter() {
  return (
    <footer className="mt-16 border-t border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-8 font-mono text-xs text-slate-500">
        <span className="uppercase tracking-widest">Elsewhere on Love Key Link</span>
        <Link to="/" className="hover:text-slate-300">
          Home
        </Link>
        <Link to="/rsp" className="hover:text-slate-300">
          RSP overview
        </Link>
        <Link to="/rsp/principles" className="hover:text-slate-300">
          Principles
        </Link>
        <Link to="/rsp/for-developers" className="hover:text-slate-300">
          Developers
        </Link>
        <Link to="/rsp/governance" className="hover:text-slate-300">
          Governance
        </Link>
        <Link to="/rsp/avatars" className="hover:text-slate-300">
          Identity Avatars
        </Link>
      </div>
    </footer>
  );
}

export function MacroShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F17] font-sans text-slate-200">
      <MacroNav />
      <MacroBreadcrumbs />
      <main className="mx-auto max-w-5xl px-6 pb-12 pt-6">{children}</main>
      <MacroFooter />
    </div>
  );
}

