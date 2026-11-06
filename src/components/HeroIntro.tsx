"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CLINIC } from "@/lib/clinic";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Homepage hero, minimal: italic serif headline on the left, Dr. Esther's intro video
 * on the right (a short silent loop; "Watch the intro" opens the full video with sound).
 */
export function HeroIntro() {
  const [open, setOpen] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);

  // Pause the silent loop while the full video is open, or for reduced-motion users.
  useEffect(() => {
    const v = loopRef.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open || still) v.pause();
    else v.play().catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    // -mt cancels <main>'s pt-[72px]; on "/" the header has no spacer and floats over this section.
    <section className="relative -mt-[72px] pt-[72px] bg-[#FAFAF9] dark:bg-[#0e100f] overflow-hidden">
      {/* Soft grey glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[18%] -left-[12%] w-[80vw] max-w-[900px] aspect-square rounded-full opacity-90 dark:opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(120,124,130,0.16), rgba(120,124,130,0.06) 55%, transparent)" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-[5vw] xl:px-8 grid lg:grid-cols-[1.12fr,1fr] items-center gap-12 lg:gap-16 pt-12 pb-16 sm:pt-16 lg:py-0 lg:min-h-[700px]">
        {/* Text */}
        <div className="text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="text-[0.74rem] font-semibold tracking-[0.16em] uppercase text-[#6B706C] dark:text-[#A6AAA6]"
          >
            Conversations with a Dentist
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            className="display-italic text-[#141614] dark:text-[#F2F2EF] leading-[1.02] mt-4"
            style={{ fontSize: "clamp(2.7rem, 5.6vw, 4.6rem)" }}
          >
            Healthy smiles start with a conversation.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.16, ease }}
            className="text-[#555A56] dark:text-[#B6BAB6] text-[1.04rem] sm:text-[1.1rem] leading-[1.65] mt-6 max-w-[30rem]"
          >
            Honest dental advice from {CLINIC.doctor}, paediatric dentist in Kampala. New articles, podcasts and videos every week.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.24, ease }}
            className="flex flex-wrap items-center gap-3 mt-9"
          >
            <a
              href="#articles"
              className="inline-flex items-center h-12 px-6 rounded-[10px] bg-[#141614] hover:bg-[#2B3D32] text-white dark:bg-[#F2F2EF] dark:text-[#141614] dark:hover:bg-white font-semibold text-[0.92rem] transition-colors duration-300"
            >
              Start reading
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2.5 h-12 pl-3 pr-5 rounded-[10px] border border-[#D6D8D4] dark:border-white/15 hover:border-[#141614] dark:hover:border-white/40 text-[#141614] dark:text-[#F2F2EF] font-semibold text-[0.92rem] transition-colors duration-300"
            >
              <span className="grid place-items-center w-7 h-7 rounded-full bg-[#141614] dark:bg-white text-white dark:text-[#141614] transition-transform duration-500 group-hover:scale-110">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 1.2v7.6L8.6 5z" fill="currentColor" /></svg>
              </span>
              Watch the intro
            </button>
          </motion.div>
        </div>

        {/* Video card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="relative w-full max-w-[340px] sm:max-w-[400px] mx-auto lg:mr-0"
        >
          {/* dot grid */}
          <div
            aria-hidden
            className="absolute -top-6 -left-8 w-40 h-40 text-[#141614]/25 dark:text-white/20"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.4px, transparent 1.6px)",
              backgroundSize: "12px 12px",
              WebkitMaskImage: "linear-gradient(135deg, black 20%, transparent 75%)",
              maskImage: "linear-gradient(135deg, black 20%, transparent 75%)",
            }}
          />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play Dr. Esther's intro video"
            className="group relative block w-full aspect-[4/5] rounded-[22px] overflow-hidden bg-[#E8E8E6] dark:bg-[#1b1e1c] shadow-[0_40px_80px_-40px_rgba(20,22,20,0.45)]"
          >
            <video
              ref={loopRef}
              src={CLINIC.introLoop}
              poster={CLINIC.introPoster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover object-[50%_28%] scale-[1.01] transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute left-4 right-4 bottom-4 flex items-center justify-between text-white">
              <span className="text-left leading-tight">
                <span className="block text-[0.95rem] font-semibold">Meet {CLINIC.doctor.replace("Lukwago", "").trim()}</span>
                <span className="block text-[0.75rem] text-white/75">Intro · 1 min</span>
              </span>
              <span className="grid place-items-center w-11 h-11 rounded-full bg-white/90 text-[#141614] backdrop-blur transition-transform duration-500 group-hover:scale-110">
                <svg width="13" height="13" viewBox="0 0 10 10" aria-hidden><path d="M2 1.2v7.6L8.6 5z" fill="currentColor" /></svg>
              </span>
            </span>
          </button>

          {/* rotating badge */}
          <div aria-hidden className="absolute -left-10 sm:-left-14 top-[58%] w-[112px] h-[112px] sm:w-[128px] sm:h-[128px] rounded-full bg-[#ECEAE4] dark:bg-[#232624] ring-1 ring-black/5 dark:ring-white/10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] grid place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-spin-slow text-[#3a3e3b] dark:text-[#C9CCC8]">
              <defs>
                <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text fontSize="8.6" fill="currentColor" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                <textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">KAY&apos;S DENTAL CLINIC • KAMPALA • PAEDIATRIC CARE •</textPath>
              </text>
            </svg>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[#141614] dark:text-[#F2F2EF]"><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7" /></svg>
          </div>
        </motion.div>
      </div>

      {/* Full intro video */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[200] bg-[#0b0c0b]/85 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Intro video"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.5, ease }}
              className="relative h-[86vh] max-h-[860px] aspect-[9/16] max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={CLINIC.introVideo}
                poster={CLINIC.introPoster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain rounded-[18px] bg-black"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close video"
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white grid place-items-center text-xl backdrop-blur transition-colors"
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
