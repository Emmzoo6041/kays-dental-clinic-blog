"use client";
import { useEffect, useRef, useState } from "react";
import { CLINIC, waLink } from "@/lib/clinic";

/**
 * HeroVideo — full-width intro video hero.
 *
 * - Plays CLINIC.introVideo muted, looping, in the background.
 * - "Watch with sound" restarts the video from the beginning with audio on.
 * - Until the video file exists (or if it fails to load), the poster photo shows instead.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Respect people who prefer less motion: show the poster frame, don't autoplay.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);

  function watchWithSound() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  }

  return (
    // -mt cancels <main>'s pt-[72px]; the header skips its spacer on "/" so the video runs up behind the transparent header.
    <section className="relative -mt-[72px] w-full h-[100svh] min-h-[560px] max-h-[940px] overflow-hidden bg-[#0d2a14]">
      {/* Background media */}
      {videoOk ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={CLINIC.introVideo}
          poster={CLINIC.introPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={CLINIC.introPoster} alt={`${CLINIC.name}, Kampala`} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a14]/90 via-[#0d2a14]/35 to-[#0d2a14]/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2a14]/55 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1280px] mx-auto px-[5vw] flex flex-col justify-end pb-14 sm:pb-20">
        <span className="inline-flex items-center gap-2 w-fit text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#FFD740] mb-4">
          <span className="w-6 h-px bg-[#FFD740]" />
          {CLINIC.name} · Kampala
        </span>

        <h1
          className="font-display font-bold text-white leading-[1.05] max-w-3xl"
          style={{ fontSize: "clamp(2.3rem, 6vw, 4.6rem)" }}
        >
          Conversations with <em className="italic text-[#FFD740]">a Dentist</em>
        </h1>

        <p className="text-white/85 text-[1.02rem] sm:text-[1.12rem] leading-[1.6] max-w-xl mt-4">
          Honest dental advice from {CLINIC.doctor} — read it, listen to it, or watch it.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-7">
          {videoOk && (
            <button
              type="button"
              onClick={watchWithSound}
              className="inline-flex items-center gap-2.5 bg-white text-[#1E5C2E] font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:bg-[#FFD740] transition"
            >
              <span className="w-6 h-6 rounded-full bg-[#1E5C2E] text-white grid place-items-center text-[0.6rem]">▶</span>
              Watch the intro
            </button>
          )}
          <a
            href="#articles"
            className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold text-sm px-6 py-3 rounded-full transition"
          >
            Explore content
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-white/85 hover:text-white font-semibold text-sm px-2 py-3 transition"
          >
            💬 WhatsApp Dr. Esther →
          </a>
        </div>
      </div>

      {/* Sound toggle */}
      {videoOk && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="absolute z-10 bottom-6 right-6 w-11 h-11 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur border border-white/25 text-white grid place-items-center transition"
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" />
            </svg>
          )}
        </button>
      )}
    </section>
  );
}
