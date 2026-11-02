import React from "react";
import { ShieldCheck, Mic } from "lucide-react";

export function AdminDashboard({ onNavigateDiagnostics }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl w-fit border border-emerald-200">
          <ShieldCheck className="w-5 h-5" /> Admin Session Active
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-amber-950">Store Command Center</h2>
          <p className="text-sm text-amber-800">
            Manage your store inventory, review incoming consignments, or launch hardware diagnostic suites below.
          </p>
        </div>

        {/* Diagnostic Navigation Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div 
            onClick={onNavigateDiagnostics}
            className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-100 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group space-y-3"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Microphone Diagnostics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test and monitor system audio inputs, select specific microphone hardware, and check live signal amplitude.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
