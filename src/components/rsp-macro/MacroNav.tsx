import { SiteHeader } from "@/components/SiteHeader";
import { SiteBreadcrumbs, SitePager } from "@/components/SiteNavUi";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";
import { MacroKeyTerms } from "@/components/rsp-macro/MacroKeyTerms";
import { Link } from "@tanstack/react-router";

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
        <Link to="/rsp/pulse" className="hover:text-slate-600">
          Pulse
        </Link>
        <Link to="/rsp/macro/property/overview" className="hover:text-slate-600">
          Property
        </Link>
        <Link to="/resources" className="hover:text-slate-600">
          Resources
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
        <SiteBreadcrumbs tone="light" />
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-6 md:pb-12">
          <MacroKeyTerms />
          {children}
          <SitePager tone="light" />
        </main>
        <MacroFooter />
      </div>
    </GlossarySheetProvider>
  );
}
