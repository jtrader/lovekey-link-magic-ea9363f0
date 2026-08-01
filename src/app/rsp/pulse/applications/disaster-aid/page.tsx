import React from "react";
import Link from "next/link";
export default function DisasterAidPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 font-sans px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Disaster & Humanitarian Aid Framework</h1>
      <p className="text-slate-400 mb-8">Real-time population strain sensing across Prepare -> Respond -> Recover -> Heal -> Coordinate.</p>
      <div className="p-6 bg-[#161B26] border border-slate-800 rounded-xl space-y-4 text-sm">
        <h2 className="text-emerald-400 font-bold font-mono">Core Safeguards</h2>
        <p>1. Burn-on-write for Tier 4 critical data.</p>
        <p>2. Hard-coded commercial suppression in crisis states.</p>
        <p>3. k-Anonymity density threshold (N >= 50).</p>
      </div>
    </div>
  );
}