import { Link } from "react-router-dom";

export function PulseStrainEnginePage() {
  return (
    <main className="min-h-screen bg-[#0B0F17] px-6 py-12 font-sans text-slate-200">
      <div className="mx-auto max-w-5xl">
        <Link to="/rsp/pulse" className="mb-8 inline-block text-sm text-emerald-400">
          ← Back to @rsp/pulse
        </Link>
        <h1 className="mb-4 text-3xl font-bold text-white">The Event Strain Index (ESI)</h1>
        <div className="my-8 overflow-x-auto rounded-xl border border-slate-800 bg-[#161B26] p-8 text-center font-mono text-2xl text-emerald-400">
          ESI = (V_current / V_baseline) × (1 + S_urgency / C_capacity)
        </div>
      </div>
    </main>
  );
}
