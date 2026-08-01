import { Link } from "react-router-dom";

export function PulseDisasterAidPage() {
  return (
    <main className="min-h-screen bg-[#0B0F17] px-6 py-12 font-sans text-slate-200">
      <div className="mx-auto max-w-5xl">
        <Link to="/rsp/pulse" className="mb-8 inline-block text-sm text-emerald-400">
          ← Back to @rsp/pulse
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Disaster & Humanitarian Aid Framework
        </h1>
        <p className="mb-8 text-slate-400">
          Real-time population strain sensing across Prepare → Respond → Recover → Heal →
          Coordinate.
        </p>
        <section className="space-y-4 rounded-xl border border-slate-800 bg-[#161B26] p-6 text-sm">
          <h2 className="font-mono font-bold text-emerald-400">Core Safeguards</h2>
          <ol className="list-decimal space-y-3 pl-5">
            <li>Burn-on-write for Tier 4 critical data.</li>
            <li>Hard-coded commercial suppression in crisis states.</li>
            <li>k-Anonymity density threshold (N &gt;= 50).</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
