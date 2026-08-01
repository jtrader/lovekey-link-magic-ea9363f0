import { Link } from "react-router-dom";
import { PulseTelemetryFlow } from "@/components/rsp/PulseTelemetryFlow";

export function PulseOverviewPage() {
  return (
    <main className="min-h-screen bg-[#0B0F17] px-6 py-12 font-sans text-slate-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
              @rsp/pulse v1.0
            </span>
            <span className="font-mono text-xs text-slate-500">
              LoveKey HELP Network Protocol Extension
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Global Population Pulse & Resource Allocation Standard
          </h1>
          <p className="max-w-3xl text-lg text-slate-400">
            Measuring real-time capacity, strain, and resource demand without human surveillance.
          </p>
        </header>

        <PulseTelemetryFlow />

        <nav className="my-16 grid gap-4 md:grid-cols-3" aria-label="@rsp/pulse pages">
          <PulseLink
            to="/rsp/pulse/applications/disaster-aid"
            title="Disaster & Humanitarian Aid Framework"
          >
            Real-time population strain sensing across the LoveKey HELP Network.
          </PulseLink>
          <PulseLink to="/rsp/pulse/strain-engine" title="Event Strain Index">
            Explore the capacity-aware population strain formula.
          </PulseLink>
          <PulseLink to="/rsp/pulse/spec" title="Open Specification">
            Read the foundation of the resource-equilibrium standard.
          </PulseLink>
        </nav>
      </div>
    </main>
  );
}

function PulseLink({
  to,
  title,
  children,
}: {
  to: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-slate-800 bg-[#161B26] p-6 transition-colors hover:border-emerald-500/50"
    >
      <h2 className="mb-2 text-lg font-bold text-emerald-400">{title} →</h2>
      <p className="text-sm text-slate-400">{children}</p>
    </Link>
  );
}
