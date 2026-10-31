"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { CLINIC, waLink } from "@/lib/clinic";
import type { LoopScene } from "./hero3d/loopScene";

/**
 * Homepage hero: a coin with the tooth emblem rolls around a soft green ring, with a
 * short headline beside it. Kept deliberately simple — one object, plain background.
 */
export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<LoopScene | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;
  const isDarkNow = () =>
    themeRef.current ? themeRef.current === "dark" : document.documentElement.classList.contains("dark");
  const [webgl, setWebgl] = useState(true);
  const [hasIntro, setHasIntro] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  // Mount the 3D ring (loaded after the page so the text never waits for it)
  useEffect(() => {
    let cancelled = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("./hero3d/loopScene").then(({ createLoopScene, hasWebGL }) => {
      if (cancelled || !canvasRef.current) return;
      if (!hasWebGL()) { setWebgl(false); return; }
      try {
        sceneRef.current = createLoopScene(canvasRef.current, { dark: isDarkNow(), still });
      } catch {
        setWebgl(false);
      }
    });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resolvedTheme) sceneRef.current?.setDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  // Pause while scrolled out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => sceneRef.current?.setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only offer "Watch the intro" once the video file exists
  useEffect(() => {
    fetch(CLINIC.introVideo, { method: "HEAD" })
      .then((r) => setHasIntro(r.ok && (r.headers.get("content-type") || "").startsWith("video")))
      .catch(() => setHasIntro(false));
  }, []);

  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIntroOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introOpen]);

  return (
    // -mt cancels <main>'s pt-[72px]; on "/" the header has no spacer and sits on top of this section.
    <section ref={sectionRef} className="relative -mt-[72px] pt-[72px] bg-[#FAFAF8] dark:bg-[#0a1a0b] overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-[5vw] xl:px-8 grid lg:grid-cols-[1.1fr,1fr] items-center gap-2 lg:gap-10 min-h-[560px] lg:min-h-[640px] py-6 lg:py-0">
        {/* Ring */}
        <div className="relative h-[300px] sm:h-[380px] lg:h-[500px]">
          {webgl ? (
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden />
          ) : (
            <div className="absolute inset-0 grid place-items-center" aria-hidden>
              <div className="w-[78%] aspect-[2/1.1] rounded-[50%] border-[34px] border-[#a9dbb7] dark:border-[#7fc293]" />
            </div>
          )}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center lg:text-left pb-10 lg:pb-0"
        >
          <h1
            className="font-display font-bold text-[#163f22] dark:text-[#E8F5EC] leading-[1.05] tracking-[-0.015em]"
            style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)" }}
          >
            Healthy smiles start with a conversation.
          </h1>
          <p className="text-[#3D5444] dark:text-[#B9CCBE] text-[1.02rem] sm:text-[1.1rem] leading-[1.6] mt-4">
            Honest dental tips from {CLINIC.doctor}.
            <br />
            New articles, podcasts and videos every week.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-7">
            <a href="#articles" className="inline-flex items-center bg-[#2E7D42] hover:bg-[#1E5C2E] text-white font-bold text-sm px-6 py-3 rounded-full transition">
              Start reading
            </a>
            {hasIntro ? (
              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                className="inline-flex items-center gap-2 text-[#1E5C2E] dark:text-[#D4EDD9] font-bold text-sm px-5 py-3 rounded-full border-2 border-[#C8DFCC] dark:border-white/20 hover:border-[#2E7D42] transition"
              >
                ▶ Watch the intro
              </button>
            ) : (
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-[#1E5C2E] dark:text-[#D4EDD9] font-bold text-sm px-5 py-3 rounded-full border-2 border-[#C8DFCC] dark:border-white/20 hover:border-[#2E7D42] transition"
              >
                Ask Dr. Esther
              </a>
            )}
          </div>
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
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <video src={CLINIC.introVideo} poster={CLINIC.introPoster} controls autoPlay playsInline className="w-full max-h-[80vh] rounded-2xl bg-black" />
              <button
                type="button"
                onClick={() => setIntroOpen(false)}
                aria-label="Close video"
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center text-xl"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
