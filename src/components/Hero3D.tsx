"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { CLINIC, waLink } from "@/lib/clinic";
import type { SmileScene } from "./hero3d/smileScene";

/**
 * Homepage hero: a dentist ball and a patient ball roll along a glowing track and meet
 * in the middle, then the headline fades in. The 3D scene loads after the page, so the
 * text is never blocked; without WebGL (or with reduced motion) a still version shows.
 */
export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SmileScene | null>(null);
  const { resolvedTheme } = useTheme();
  // The scene loads asynchronously, so keep the latest theme where it can read it.
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;
  const isDarkNow = () =>
    themeRef.current ? themeRef.current === "dark" : document.documentElement.classList.contains("dark");
  const [showText, setShowText] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [hasIntro, setHasIntro] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  // Mount the 3D scene
  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Never leave the headline hidden, even if the scene is slow to load.
    const failsafe = window.setTimeout(() => setShowText(true), reduce ? 0 : 3400);

    import("./hero3d/smileScene").then(({ createSmileScene, hasWebGL }) => {
      if (cancelled || !canvasRef.current) return;
      if (!hasWebGL()) { setWebgl(false); setShowText(true); return; }
      try {
        sceneRef.current = createSmileScene(canvasRef.current, {
          dark: isDarkNow(),
          still: reduce,
          onMeet: () => setShowText(true),
        });
        // In case the theme resolved while the scene was loading
        sceneRef.current.setDark(isDarkNow());
      } catch {
        setWebgl(false);
        setShowText(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Follow light / dark mode
  useEffect(() => {
    if (resolvedTheme) sceneRef.current?.setDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  // Pause rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => sceneRef.current?.setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only offer "Watch the intro" once the intro video file actually exists
  useEffect(() => {
    fetch(CLINIC.introVideo, { method: "HEAD" })
      .then((r) => setHasIntro(r.ok && (r.headers.get("content-type") || "").startsWith("video")))
      .catch(() => setHasIntro(false));
  }, []);

  // Close the intro with Escape
  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIntroOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introOpen]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.9, delay: showText ? delay : 0, ease: [0.21, 0.47, 0.32, 0.98] as const },
  });

  return (
    // -mt cancels <main>'s pt-[72px]; the header skips its spacer on "/" so the scene runs up behind it.
    <section
      ref={sectionRef}
      className="relative -mt-[72px] w-full h-[100svh] min-h-[600px] max-h-[980px] overflow-hidden bg-[#ECE8DF] dark:bg-[#26332a]"
    >
      {webgl ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,#f5c55a_0%,transparent_45%),linear-gradient(160deg,#f4f1ea,#e2ddd1)] dark:bg-[radial-gradient(ellipse_at_50%_85%,#6b4a12_0%,transparent_45%),linear-gradient(160deg,#26332a,#18231b)]" />
      )}

      {/* Copy — sits in the open space inside the U */}
      <div className="relative z-10 h-full max-w-[1280px] mx-auto px-5 sm:px-[5vw] flex flex-col items-center text-center pt-[108px] sm:pt-[124px] lg:pt-[13vh]">
        <motion.span {...fade(0)} className="inline-flex items-center gap-2 text-[0.68rem] sm:text-[0.72rem] font-extrabold tracking-[0.2em] uppercase text-[#2E7D42] dark:text-[#8fd6a3]">
          <span className="w-5 h-px bg-current" />
          Conversations with a Dentist
          <span className="w-5 h-px bg-current" />
        </motion.span>

        <motion.h1
          {...fade(0.1)}
          className="font-display font-bold text-[#163f22] dark:text-[#E8F5EC] leading-[1.06] tracking-[-0.015em] mt-4 max-w-[15ch] lg:max-w-[21ch]"
          style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.9rem)" }}
        >
          Every healthy smile starts with a conversation.
        </motion.h1>

        <motion.p {...fade(0.22)} className="text-[#3D5444] dark:text-[#B9CCBE] text-[0.98rem] sm:text-[1.08rem] leading-[1.65] max-w-[34rem] mt-5">
          {CLINIC.doctor} shares honest, practical advice on caring for your teeth and your family&apos;s, in articles, podcasts and short videos.
        </motion.p>

        <motion.div {...fade(0.34)} className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <a href="#articles" className="inline-flex items-center gap-2 bg-[#2E7D42] hover:bg-[#1E5C2E] text-white font-bold text-sm px-6 py-3 rounded-full shadow-[0_10px_24px_-10px_rgba(30,92,46,0.7)] transition">
            Start reading
          </a>
          {hasIntro ? (
            <button
              type="button"
              onClick={() => setIntroOpen(true)}
              className="inline-flex items-center gap-2.5 bg-white/80 dark:bg-white/10 backdrop-blur border border-[#C8DFCC] dark:border-white/20 text-[#1E5C2E] dark:text-[#D4EDD9] font-bold text-sm pl-2 pr-5 py-2 rounded-full hover:bg-white transition"
            >
              <span className="w-7 h-7 rounded-full bg-[#1E5C2E] text-white grid place-items-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
              </span>
              Watch the intro
            </button>
          ) : (
            <a href={waLink()} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur border border-[#C8DFCC] dark:border-white/20 text-[#1E5C2E] dark:text-[#D4EDD9] font-bold text-sm px-6 py-3 rounded-full hover:bg-white transition">
              💬 Ask Dr. Esther
            </a>
          )}
        </motion.div>
      </div>

      {/* Intro video pop-up */}
      <AnimatePresence>
        {introOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setIntroOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Intro video"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={CLINIC.introVideo} poster={CLINIC.introPoster} controls autoPlay playsInline className="w-full max-h-[80vh] rounded-2xl bg-black" />
              <button
                type="button"
                onClick={() => setIntroOpen(false)}
                aria-label="Close video"
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center text-xl"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
