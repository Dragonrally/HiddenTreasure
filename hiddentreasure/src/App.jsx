import React, { useState } from 'react';
import { Store, Lock, Unlock, ShieldCheck, Sparkles, LogOut, Package, Wrench, Inbox } from 'lucide-react';

export default function App() {
  // Gated Access States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Default admin password (can be changed in settings later)
  const [adminPassword] = useState('1234');

  // Handle Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAdminUnlocked(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('Incorrect Admin Password');
    }
  };

  // --- IF ADMIN IS LOGGED IN: SHOW FULL SITE / COMMAND CENTER ---
  if (isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-amber-50/40 text-amber-950 font-sans flex flex-col">
        {/* Admin Top Bar */}
        <header className="bg-amber-950 text-amber-100 shadow-md border-b border-amber-900 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 p-2 rounded-xl text-amber-950">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">THE TREASURE BOX | Admin Control Center</h1>
                <p className="text-[11px] text-amber-300 italic">Frostproof, FL • Gated Mode Bypass Active</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="bg-red-900/80 hover:bg-red-800 text-red-100 text-xs px-3.5 py-2 rounded-lg font-bold border border-red-700 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Return to Coming Soon</span>
            </button>
          </div>
        </header>

        {/* Admin Dashboard Preview */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl w-fit border border-emerald-200">
              <ShieldCheck className="w-5 h-5" /> Admin Session Active
            </div>
            <h2 className="text-2xl font-extrabold text-amber-950">Welcome to your Store Command Center</h2>
            <p className="text-sm text-amber-800">
              While the public sees the "Coming Soon" landing page, you have full access to inventory, consignment queues, and diagnostic tools here.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // --- PUBLIC: COMING SOON LANDING PAGE ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-amber-100 flex flex-col justify-between p-6 relative">
      
      {/* Top Admin Button (Subtle & Discreet) */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-amber-900/60 hover:bg-amber-800 text-amber-300 text-xs px-3.5 py-2 rounded-xl border border-amber-700/60 flex items-center gap-1.5 transition-colors shadow-lg"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Main Center Coming Soon Content */}
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

      {/* Footer */}
      <footer className="text-center text-[11px] text-amber-400/70 pb-4">
        © 2026 Cloud Nexus LLC • All Rights Reserved
      </footer>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200 text-amber-950 relative space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-amber-900 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">Admin Portal Access</h3>
              <p className="text-xs text-amber-700">Enter your password to preview or manage the live site. (Default: <code className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-900">1234</code>)</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <input
                type="password"
                autoFocus
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-2xl text-center text-lg font-bold tracking-widest text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              
              {authError && (
                <p className="text-xs font-bold text-red-600 text-center bg-red-50 p-2 rounded-xl">{authError}</p>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); setPasswordInput(''); setAuthError(''); }}
                  className="w-1/2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors"
                >
                  Unlock Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}