import React, { useState, useEffect, useRef } from 'react';
import { Mic, Video, Monitor, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const HardwareDiagnostics = () => {
  // States
  const [micStatus, setMicStatus] = useState('idle');
  const [micError, setMicError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const [camStatus, setCamStatus] = useState('idle');
  const [camError, setCamError] = useState('');
  const [camInfo, setCamInfo] = useState(null);

  const [monitorInfo, setMonitorInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown',
  });

  // Refs for media streams and audio analysis
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const videoRef = useRef(null);
  const camStreamRef = useRef(null);

  // --- 1. Microphone Diagnostics & Signal Meter ---
  const startMicTest = async () => {
    setMicStatus('checking');
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      setMicStatus('active');

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioLevel(Math.round((average / 255) * 100));
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
    } catch (err) {
      setMicStatus('error');
      setMicError(err.message || 'Microphone permission denied or unavailable.');
    }
  };

  const stopMicTest = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(function(track) { track.stop(); });
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicStatus('idle');
    setAudioLevel(0);
  };

  // --- 2. Webcam Diagnostics ---
  const startCamTest = async () => {
    setCamStatus('checking');
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      camStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      setCamInfo({
        label: track.label || 'Default Camera',
        width: settings.width || 0,
        height: settings.height || 0,
      });
      setCamStatus('active');
    } catch (err) {
      setCamStatus('error');
      setCamError(err.message || 'Camera permission denied or unavailable.');
    }
  };

  const stopCamTest = () => {
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach(function(track) { track.stop(); });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamStatus('idle');
    setCamInfo(null);
  };

  // --- 3. Monitor Diagnostics ---
  useEffect(() => {
    const handleResize = () => {
      setMonitorInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown',
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      stopMicTest();
      stopCamTest();
    };
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Hardware Diagnostics</h1>
        <p className="mt-1 text-gray-600">Check your microphone, camera, and display.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Mic aria-hidden="true" />
            <h2 className="text-lg font-semibold">Microphone</h2>
            <span className="ml-auto text-sm capitalize">{micStatus}</span>
          </div>
          {micError && <p className="flex items-center gap-2 text-sm text-red-600"><AlertCircle size={16} />{micError}</p>}
          <div className="h-3 overflow-hidden rounded bg-gray-200" aria-label={`Audio level: ${audioLevel}%`}>
            <div className="h-full bg-green-500 transition-all" style={{ width: `${audioLevel}%` }} />
          </div>
          <button
            type="button"
            onClick={micStatus === 'active' ? stopMicTest : startMicTest}
            disabled={micStatus === 'checking'}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {micStatus === 'checking' && <RefreshCw size={16} className="mr-2 inline animate-spin" />}
            {micStatus === 'active' ? 'Stop microphone test' : 'Test microphone'}
          </button>
        </section>

        <section className="rounded-lg border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Video aria-hidden="true" />
            <h2 className="text-lg font-semibold">Camera</h2>
            <span className="ml-auto text-sm capitalize">{camStatus}</span>
          </div>
          {camError && <p className="flex items-center gap-2 text-sm text-red-600"><AlertCircle size={16} />{camError}</p>}
          {camInfo && <p className="text-sm">{camInfo.label} — {camInfo.width} × {camInfo.height}</p>}
          <video ref={videoRef} autoPlay playsInline muted className="w-full rounded bg-black" />
          <button
            type="button"
            onClick={camStatus === 'active' ? stopCamTest : startCamTest}
            disabled={camStatus === 'checking'}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {camStatus === 'checking' && <RefreshCw size={16} className="mr-2 inline animate-spin" />}
            {camStatus === 'active' ? 'Stop camera test' : 'Test camera'}
          </button>
        </section>
      </div>

      <section className="rounded-lg border p-5">
        <div className="mb-4 flex items-center gap-2">
          <Monitor aria-hidden="true" />
          <h2 className="text-lg font-semibold">Display</h2>
          <CheckCircle2 size={18} className="text-green-600" />
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div><dt className="text-gray-500">Window size</dt><dd>{monitorInfo.width} × {monitorInfo.height}</dd></div>
          <div><dt className="text-gray-500">Screen size</dt><dd>{monitorInfo.screenWidth} × {monitorInfo.screenHeight}</dd></div>
          <div><dt className="text-gray-500">Color depth</dt><dd>{monitorInfo.colorDepth}-bit</dd></div>
          <div><dt className="text-gray-500">Pixel ratio</dt><dd>{monitorInfo.pixelRatio}</dd></div>
          <div><dt className="text-gray-500">Orientation</dt><dd>{monitorInfo.orientation}</dd></div>
        </dl>
      </section>
    </div>
  );
};