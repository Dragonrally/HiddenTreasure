import React, { useState } from "react";
import ComingSoonSplash from "./public/comingsoonsplash/ComingSoonSplash";
import { AdminHeader } from "./components/admin/AdminHeader";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { MicDiagnosticsView } from "./components/diagnostics/MicDiagnosticsView";
import { useMicrophone } from "./hooks/UseMicrophone";

export default function App() {
  // Argon Controller State: "splash" | "admin-dashboard" | "admin-diagnostics"
  const [currentView, setCurrentView] = useState("splash");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [adminPassword] = useState("1234");

  const micHook = useMicrophone();

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setShowLoginModal(false);
      setPasswordInput("");
      setAuthError("");
      setCurrentView("admin-dashboard");
    } else {
      setAuthError("Incorrect Admin Password");
    }
  };

  const handleLock = () => {
    micHook.stopMicrophone();
    setCurrentView("splash");
  };

  // --- VIEW 1: MICROPHONE DIAGNOSTICS SUITE ---
  if (currentView === "admin-diagnostics") {
    return (
      <MicDiagnosticsView
        onBack={() => setCurrentView("admin-dashboard")}
        onSplash={() => setCurrentView("splash")}
        micHook={micHook}
      />
    );
  }

  // --- VIEW 2: ADMIN COMMAND CENTER ---
  if (currentView === "admin-dashboard") {
    return (
      <div className="min-h-screen bg-amber-50/40 text-amber-950 font-sans flex flex-col">
        <AdminHeader onLock={handleLock} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          <AdminDashboard onNavigateDiagnostics={() => setCurrentView("admin-diagnostics")} />
        </main>
      </div>
    );
  }

  // --- VIEW 3: PUBLIC COMING SOON SPLASH (DEFAULT) ---
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