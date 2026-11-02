import React, { useState, useEffect, useRef } from "react";
import { Mic, Activity, RefreshCw } from "lucide-react";

export default function App() {
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState("");
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const loadAudioDevices = async () => {
    try {
      setMicError("");
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      tempStream.getTracks().forEach(track => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === "audioinput");
      setAudioDevices(mics);
      
      if (mics.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(mics[0].deviceId);
      }
    } catch (err) {
      console.error(err);
      setMicError("Microphone permission denied. Please allow microphone access in your browser.");
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    setIsMicActive(false);
    setMicVolume(0);
  };

  const startMicrophone = async () => {
    try {
      setMicError("");
      stopMicrophone();

      const constraints = {
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
        video: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      microphoneRef.current = stream;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === "audioinput");
      setAudioDevices(mics);

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicActive(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setMicVolume(Math.round((average / 255) * 100));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.error(err);
      setMicError("Microphone access denied or selected device unavailable.");
      setIsMicActive(false);
    }
  };

  useEffect(() => {
    loadAudioDevices();
    return () => {
      stopMicrophone();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Direct Microphone Diagnostics</h1>
              <p className="text-xs text-slate-400">Isolated Test Harness • Hardware Telemetry</p>
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
    </div>
  );
}
