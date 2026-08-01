import React from "react";
export default function StrainEnginePage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 font-sans px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">The Event Strain Index (ESI)</h1>
      <div className="p-8 bg-[#161B26] border border-slate-800 rounded-xl my-8 text-center font-mono text-emerald-400 text-2xl">
        ESI = ( V_current / V_baseline ) * ( 1 + S_urgency / C_capacity )
      </div>
    </div>
  );
}