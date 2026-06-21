"use client";
import React, { useRef, useState, useEffect } from "react";

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Detect what kind of media a URL points to
function detectMedia(url: string): { kind: "youtube" | "vimeo" | "video" | "audio"; embedSrc?: string } {
  if (!url) return { kind: "audio" };
  if (/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/.test(url)) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    return { kind: "youtube", embedSrc: m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : undefined };
  }
  if (/vimeo\.com\/(\d+)/.test(url)) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return { kind: "vimeo", embedSrc: m ? `https://player.vimeo.com/video/${m[1]}` : undefined };
  }
  // File extension based detection (works on Supabase storage URLs too)
  if (/\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(url)) return { kind: "video" };
  return { kind: "audio" };
}

type Props = {
  src: string;
  /** "listen" = green, "watch" = red */
  variant?: "listen" | "watch";
  label?: string;
};

export function AudioPlayer({ src, variant = "listen", label }: Props) {
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState("");

  const media = detectMedia(src);
  const isLocalVideo = media.kind === "video";
  const isExternalEmbed = media.kind === "youtube" || media.kind === "vimeo";

  useEffect(() => {
    if (!open || isExternalEmbed) return;
    const m = mediaRef.current;
    if (!m) return;

    const onTime = () => setCurrent(m.currentTime);
    const onMeta = () => {
      if (isFinite(m.duration) && m.duration > 0) setDuration(m.duration);
    };
    const onDur = () => onMeta();
    const onEnd = () => { setPlaying(false); setCurrent(0); m.currentTime = 0; };
    const onErr = () => setError("Could not load this media. Check the URL or try again.");
    const onCanPlay = () => onMeta();

    m.addEventListener("timeupdate", onTime);
    m.addEventListener("loadedmetadata", onMeta);
    m.addEventListener("durationchange", onDur);
    m.addEventListener("canplay", onCanPlay);
    m.addEventListener("ended", onEnd);
    m.addEventListener("error", onErr);

    // If metadata isn't preloaded automatically, force-load it
    if (m.readyState === 0) {
      try { m.load(); } catch { /* ignore */ }
    } else if (isFinite(m.duration) && m.duration > 0) {
      onMeta();
    }

    return () => {
      m.removeEventListener("timeupdate", onTime);
      m.removeEventListener("loadedmetadata", onMeta);
      m.removeEventListener("durationchange", onDur);
      m.removeEventListener("canplay", onCanPlay);
      m.removeEventListener("ended", onEnd);
      m.removeEventListener("error", onErr);
    };
  }, [open, src, isExternalEmbed]);

  function togglePlay() {
    const m = mediaRef.current;
    if (!m) return;
    if (playing) {
      m.pause();
      setPlaying(false);
    } else {
      m.play().then(() => setPlaying(true)).catch(() => setError("Browser blocked playback. Click again."));
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const m = mediaRef.current;
    if (!m || !duration) return;
    const v = Number(e.target.value);
    m.currentTime = (v / 100) * duration;
    setCurrent(m.currentTime);
  }

  function cycleSpeed() {
    const m = mediaRef.current;
    if (!m) return;
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 0.75 : 1;
    setSpeed(next);
    m.playbackRate = next;
  }

  const colors = variant === "watch"
    ? { btn: "bg-[#B91C1C] hover:bg-[#8B1414] text-white", accent: "#B91C1C", soft: "bg-[#FEE2E2] dark:bg-white/5" }
    : { btn: "bg-[#2E7D42] hover:bg-[#1E5C2E] text-white", accent: "#2E7D42", soft: "bg-[#EDF7EF] dark:bg-white/5" };

  // YouTube / Vimeo: open in modal-like inline embed when expanded; otherwise pill button
  if (isExternalEmbed) {
    if (!open) {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition shadow-sm ${colors.btn}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          {label || "Watch"}
        </button>
      );
    }
    return (
      <div className="w-full max-w-3xl">
        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
          <iframe
            src={media.embedSrc}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-2 text-xs text-[#7A9480] hover:text-[#B91C1C]"
        >
          × Close player
        </button>
      </div>
    );
  }

  // Collapsed: branded pill button
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition shadow-sm ${colors.btn}`}
      >
        {(isLocalVideo || variant === "watch") ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3v5zM3 19a2 2 0 0 0 2 2h1v-7H3v5z"/>
          </svg>
        )}
        {label || (isLocalVideo ? "Watch" : variant === "watch" ? "Watch" : "Listen")}
      </button>
    );
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  // Local video: show video element + controls
  if (isLocalVideo) {
    return (
      <div className="w-full max-w-3xl space-y-2">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            preload="metadata"
            controls
            playsInline
            crossOrigin="anonymous"
            className="w-full h-full"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[#7A9480] hover:text-[#B91C1C]"
        >
          × Close player
        </button>
        {error && <p className="text-xs text-[#B91C1C] font-semibold">⚠ {error}</p>}
      </div>
    );
  }

  // Local audio: branded pill player
  return (
    <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-full border border-[#D4EDD9] dark:border-white/10 ${colors.soft} max-w-full`}>
      <audio
        ref={mediaRef as React.RefObject<HTMLAudioElement>}
        src={src}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
      />

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
        {fmtTime(current)} / {duration > 0 ? fmtTime(duration) : "—:—"}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={seek}
        className="w-32 sm:w-44 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${pct}%, #D4EDD9 ${pct}%, #D4EDD9 100%)` }}
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
        onClick={() => { (mediaRef.current as HTMLAudioElement | null)?.pause(); setPlaying(false); setOpen(false); }}
        aria-label="Close player"
        className="text-[#7A9480] hover:text-[#B91C1C] text-lg leading-none p-1"
      >
        ×
      </button>

      {error && <span className="text-[0.68rem] text-[#B91C1C] font-semibold ml-1">{error}</span>}
    </div>
  );
}
