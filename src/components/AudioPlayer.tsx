"use client";
import React, { useRef, useState, useEffect } from "react";

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

type Props = {
  src: string;
  /** "listen" = green pill, "watch" = red pill — same component handles audio + video links */
  variant?: "listen" | "watch";
  label?: string;
};

export function AudioPlayer({ src, variant = "listen", label }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState("");

  // Detect external video links (YouTube etc.) — they need a different "watch" treatment
  const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(src);
  const isVimeo = /vimeo\.com/i.test(src);
  const isExternalVideo = isYouTube || isVimeo;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => { setPlaying(false); setCurrent(0); a.currentTime = 0; };
    const onErr = () => setError("Could not load this audio. Check the URL or try again.");
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, []);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => setError("Browser blocked playback. Click again.")); }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current;
    if (!a || !duration) return;
    const v = Number(e.target.value);
    a.currentTime = (v / 100) * duration;
    setCurrent(a.currentTime);
  }

  function cycleSpeed() {
    const a = audioRef.current;
    if (!a) return;
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 0.75 : 1;
    setSpeed(next);
    a.playbackRate = next;
  }

  // YouTube / Vimeo: just give them a "Watch" button that opens the video
  if (isExternalVideo) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-[#B91C1C] hover:bg-[#8B1414] text-white transition shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        {label || "Watch"}
      </a>
    );
  }

  const colors = variant === "watch"
    ? { btn: "bg-[#B91C1C] hover:bg-[#8B1414] text-white", accent: "#B91C1C", soft: "bg-[#FEE2E2] dark:bg-white/5" }
    : { btn: "bg-[#2E7D42] hover:bg-[#1E5C2E] text-white", accent: "#2E7D42", soft: "bg-[#EDF7EF] dark:bg-white/5" };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition shadow-sm ${colors.btn}`}
      >
        {variant === "watch" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3v5zM3 19a2 2 0 0 0 2 2h1v-7H3v5z"/>
          </svg>
        )}
        {label || (variant === "watch" ? "Watch" : "Listen")}
      </button>
    );
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-full border border-[#D4EDD9] dark:border-white/10 ${colors.soft} max-w-full`}>
      <audio ref={audioRef} src={src} preload="metadata" playsInline />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className={`w-9 h-9 rounded-full grid place-items-center flex-shrink-0 ${colors.btn}`}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>

      <span className="text-[0.7rem] font-mono text-[#3D5444] dark:text-[#C8DFCC] tabular-nums whitespace-nowrap">
        {fmtTime(current)} / {fmtTime(duration)}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={seek}
        className="w-32 sm:w-44 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${pct}%, #D4EDD9 ${pct}%, #D4EDD9 100%)`,
        }}
        aria-label="Seek"
      />

      <button
        type="button"
        onClick={cycleSpeed}
        className="text-[0.7rem] font-bold text-[#3D5444] dark:text-[#C8DFCC] hover:text-[#1E5C2E] px-1.5 py-0.5 rounded tabular-nums"
        title="Playback speed"
      >
        {speed}×
      </button>

      <button
        type="button"
        onClick={() => { audioRef.current?.pause(); setPlaying(false); setOpen(false); }}
        aria-label="Close player"
        className="text-[#7A9480] hover:text-[#B91C1C] text-lg leading-none p-1"
      >
        ×
      </button>

      {error && (
        <span className="text-[0.68rem] text-[#B91C1C] font-semibold ml-1">{error}</span>
      )}
    </div>
  );
}
