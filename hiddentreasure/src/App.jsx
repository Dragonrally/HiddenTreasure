import React, { useState, useEffect } from "react";
import { ComingSoonSplash } from "./components/public/ComingSoonSplash";
import { AdminHeader } from "./components/admin/AdminHeader";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { MicDiagnosticsView } from "./components/diagnostics/MicDiagnosticsView";
import { useMicrophone } from "./hooks/UseMicrophone";

export default function App() {
  // Explicit route indexer: "splash", "admin-dashboard", or "admin-diagnostics"
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace("#/", "");
    if (hash === "admin/diagnostics") return "admin-diagnostics";
    if (hash === "admin") return "admin-dashboard";
    return "splash";
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [adminPassword] = useState("1234");

  const micHook = useMicrophone();

  // Sync route changes to URL hash
  useEffect(() => {
    if (currentRoute === "splash") {
      window.location.hash = "#/splash";
    } else if (currentRoute === "admin-dashboard") {
      window.location.hash = "#/admin";
    } else if (currentRoute === "admin-diagnostics") {
      window.location.hash = "#/admin/diagnostics";
      micHook.loadAudioDevices();
    }
  }, [currentRoute]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setShowLoginModal(false);
      setPasswordInput("");
      setAuthError("");
      setCurrentRoute("admin-dashboard");
    } else {
      setAuthError("Incorrect Admin Password");
    }
  };

  const handleLock = () => {
    micHook.stopMicrophone();
    setCurrentRoute("splash");
  };

  // --- ROUTE 1: MICROPHONE DIAGNOSTICS PAGE ---
  if (currentRoute === "admin-diagnostics") {
    return (
      <MicDiagnosticsView
        onBack={() => setCurrentRoute("admin-dashboard")}
        micHook={micHook}
      />
    );
  }

  // --- ROUTE 2: ADMIN COMMAND CENTER ---
  if (currentRoute === "admin-dashboard") {
    return (
      <div className="min-h-screen bg-amber-50/40 text-amber-950 font-sans flex flex-col">
        <AdminHeader onLock={handleLock} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          <AdminDashboard onNavigateDiagnostics={() => setCurrentRoute("admin-diagnostics")} />
        </main>
      </div>
    );
  }

  // --- ROUTE 3: FRONT DOOR SPLASH (DEFAULT) ---
  return (
    <ComingSoonSplash
      showLoginModal={showLoginModal}
      setShowLoginModal={setShowLoginModal}
      passwordInput={passwordInput}
      setPasswordInput={setPasswordInput}
      authError={authError}
      onLogin={handleLogin}
    />
  );
}