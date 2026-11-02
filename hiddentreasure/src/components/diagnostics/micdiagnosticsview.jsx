import React from "react";
import { Mic, Activity, RefreshCw, ArrowLeft } from "lucide-react";

export function MicDiagnosticsView({
  onBack,
  micHook,
}) {
  const {
    audioDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    isMicActive,
    micVolume,
    micError,
    loadAudioDevices,
    startMicrophone,
    stopMicrophone,
  } = micHook;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { stopMicrophone(); onBack(); }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </button>
          <h1 className="text-base font-bold text-white hidden sm:block">Hardware Telemetry Suite</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-mono">
          <Activity className="w-4 h-4" /> Live Audio Analyzer
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center">
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400 border border-emerald-500/30">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Microphone Diagnostics</h2>
                <p className="text-xs text-slate-400">Select input source & analyze live signal</p>
              </div>
            </div>
            <button
              onClick={loadAudioDevices}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Detect Devices
            </button>
          </div>

          {/* Device Selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Select Audio Input Device
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                if (isMicActive) stopMicrophone();
              }}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            >
              {audioDevices.length === 0 ? (
                <option value="">No devices found — click "Detect Devices" above</option>
              ) : (
                audioDevices.map((device, index) => (
                  <option key={device.deviceId || index} value={device.deviceId}>
                    {device.label || `Microphone ${index + 1}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Status & Control */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Sensor Status</p>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {isMicActive ? "STREAM ACTIVE [OK]" : "STANDBY"}
              </p>
            </div>

            {!isMicActive ? (
              <button
                onClick={startMicrophone}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" /> Start Test
              </button>
            ) : (
              <button
                onClick={stopMicrophone}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                Stop Test
              </button>
            )}
          </div>

          {micError && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-medium">
              {micError}
            </div>
          )}

          {/* Amplitude Meter */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Signal Amplitude Meter</span>
              <span className="text-emerald-400 font-bold">{micVolume}%</span>
            </div>
            <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${micVolume}%` }}
              ></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}