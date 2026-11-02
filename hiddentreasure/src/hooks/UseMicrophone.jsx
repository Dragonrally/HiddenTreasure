import { useState, useRef, useEffect, useCallback } from "react";

export function useMicrophone() {
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
      tempStream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((device) => device.kind === "audioinput");
      setAudioDevices(mics);
      if (mics.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(mics[0].deviceId);
      }
    } catch (err) {
      console.warn("Microphone access was denied or not allowed:", err.message);
      setMicError("Microphone permission denied. Please click the lock icon in your browser URL bar to allow microphone access.");
    }
  };

  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    setIsMicActive(false);
    setMicVolume(0);
  }, []);

  const startMicrophone = async () => {
    try {
      setMicError("");
      stopMicrophone();

      const constraints = {
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
        video: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      microphoneRef.current = stream;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((device) => device.kind === "audioinput");
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
      console.warn("Microphone access unavailable or denied:", err.message);
      setMicError("Microphone permission denied. Please check your browser permissions.");
      setIsMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    audioDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    isMicActive,
    micVolume,
    micError,
    loadAudioDevices,
    startMicrophone,
    stopMicrophone,
  };
}