import React from "react";
import { Store, LogOut } from "lucide-react";

export function AdminHeader({ onLock }) {
  return (
    <header className="bg-amber-950 text-amber-100 shadow-md border-b border-amber-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-xl text-amber-950">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">THE TREASURE BOX | Admin Control Center</h1>
            <p className="text-[11px] text-amber-300 italic">Frostproof, FL</p>
          </div>
        </div>
        
        <button
          onClick={onLock}
          className="bg-red-900/80 hover:bg-red-800 text-red-100 text-xs px-3.5 py-2 rounded-lg font-bold border border-red-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Back to Splash</span>
        </button>
      </div>
    </header>
  );
}