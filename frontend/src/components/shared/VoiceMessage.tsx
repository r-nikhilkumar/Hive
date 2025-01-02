import React, { useState, useRef, useEffect } from "react";

const VoiceMessage = ({ audioBlob }: { audioBlob: Blob }) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioSrc(url);
    }
  }, [audioBlob]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateCurrentTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const drawVisualizer = () => {
    if (audioRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const renderFrame = () => {
        if (ctx) {
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            ctx.fillStyle = `rgb(${barHeight + 100},50,150)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          }

          if (isPlaying) {
            requestAnimationFrame(renderFrame);
          }
        }
      };

      renderFrame();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("play", drawVisualizer);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", drawVisualizer);
      }
    };
  }, [audioRef, isPlaying]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "10px",
      }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        style={{
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "100%",
        }}
      ></canvas>
      <audio
        ref={audioRef}
        src={audioSrc || ""}
        onTimeUpdate={updateCurrentTime}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: "none" }}
      ></audio>
      <button
        onClick={handlePlayPause}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          backgroundColor: isPlaying ? "#ff5e57" : "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "300px",
          fontSize: "14px",
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default VoiceMessage;
