import { Link } from "react-router-dom";

export function PulseSpecPage() {
  return (
    <main className="min-h-screen bg-[#0B0F17] px-6 py-12 font-sans text-slate-200">
      <div className="mx-auto max-w-4xl">
        <Link to="/rsp/pulse" className="mb-8 inline-block text-sm text-emerald-400">
          ← Back to @rsp/pulse
        </Link>
        <h1 className="mb-4 text-3xl font-bold text-white">@rsp/pulse v1.0 Open Specification</h1>
        <p className="text-slate-400">
          Open specification for macro population strain sensing and resource equilibrium.
        </p>
      </div>
    </main>
  );
}
