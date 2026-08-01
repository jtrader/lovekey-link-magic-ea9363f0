import React from "react";
import { PulseTelemetryFlow } from "@/components/rsp/PulseTelemetryFlow";
export default function RSPPulseOverview() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 font-sans px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono rounded-full">@rsp/pulse v1.0</span>
          <span className="text-xs font-mono text-slate-500">LoveKey HELP Network Protocol Extension</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Global Population Pulse & Resource Allocation Standard</h1>
        <p className="text-lg text-slate-400 max-w-3xl">Measuring real-time capacity, strain, and resource demand without human surveillance.</p>
      </div>
      <PulseTelemetryFlow />
      <div className="my-16">
        <a href="/rsp#pulse-disaster-aid" className="p-6 bg-[#161B26] border border-slate-800 hover:border-emerald-500/50 block rounded-xl">
          <h3 className="text-lg font-bold text-emerald-400 mb-2">Disaster & Humanitarian Aid Framework -&gt;</h3>
          <p className="text-sm text-slate-400">Real-time population strain sensing across Crisis Compass, AidAngel, Guardian Guide, and FirstAidAngel.</p>
        </a>
      </div>
    </div>
  );
}