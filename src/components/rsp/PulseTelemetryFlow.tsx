import React from "react";
export const PulseTelemetryFlow: React.FC = () => (
  <div className="w-full bg-[#161B26] p-6 rounded-xl border border-slate-800 text-slate-200 my-8">
    <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">@rsp/pulse Telemetry Architecture — Edge Signal to Anonymized Pool</h4>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs font-mono">
      <div className="p-4 bg-[#0B0F17] rounded-lg border border-slate-700"><span className="text-amber-400 block font-bold mb-1">1. MULTI-LINGUAL INTENT</span><span>100+ Countries / 50 Languages Edge Actions</span></div>
      <div className="p-4 bg-[#0B0F17] rounded-lg border border-emerald-500/30"><span className="text-emerald-400 block font-bold mb-1">2. BURN-ON-WRITE</span><span>PII, IP & Coordinates Destroyed at Edge</span></div>
      <div className="p-4 bg-[#0B0F17] rounded-lg border border-slate-700"><span className="text-blue-400 block font-bold mb-1">3. K-ANONYMITY POOL</span><span>Regional Aggregation (N >= 50 Threshold)</span></div>
      <div className="p-4 bg-[#0B0F17] rounded-lg border border-slate-700"><span className="text-purple-400 block font-bold mb-1">4. MACRO ESI & BALANCE</span><span>Resource Allocation for Institutions</span></div>
    </div>
  </div>
);