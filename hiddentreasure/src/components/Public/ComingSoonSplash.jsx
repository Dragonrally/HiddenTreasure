import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { AdminLoginModal } from "./AdminLoginModal";

export function ComingSoonSplash({
  showLoginModal,
  setShowLoginModal,
  passwordInput,
  setPasswordInput,
  authError,
  onLogin,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-amber-100 flex flex-col justify-between p-6 relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-amber-900/60 hover:bg-amber-800 text-amber-300 text-xs px-3.5 py-2 rounded-xl border border-amber-700/60 flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto my-auto text-center space-y-6 py-12">
        <div className="inline-flex bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest gap-2 items-center">
          <Sparkles className="w-4 h-4 text-amber-400" /> Opening Soon in Frostproof, FL
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
          The Treasure Box <span className="block text-teal-400 text-2xl sm:text-3xl font-light mt-2">& Hidden Treasure Resale</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/90 max-w-lg mx-auto leading-relaxed">
          We are putting the finishing touches on our physical showroom and digital store. Quality antiques, verified electronics, and unique finds are on the way.
        </p>

        <div className="pt-6 border-t border-amber-800/60 max-w-xs mx-auto">
          <p className="text-xs text-amber-300 italic">"Ole But Still Useful"</p>
        </div>
      </div>

      <footer className="text-center text-[11px] text-amber-400/70 pb-4">
        © 2026 Cloud Nexus LLC • All Rights Reserved
      </footer>

      <AdminLoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        authError={authError}
        onLogin={onLogin}
      />
    </div>
  );
}