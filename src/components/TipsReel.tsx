"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TIPS, tipPoster, tipVideo, type Tip } from "@/lib/tips";

const ease = [0.16, 1, 0.3, 1] as const;

function TipCard({ tip, index, onOpen }: { tip: Tip; index: number; onOpen: () => void }) {
  const vRef = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  // Desktop hover: silent preview. (Touch devices skip this and just open the player.)
  const start = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setPreviewing(true);
    const v = vRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  };
  const stop = () => {
    setPreviewing(false);
    vRef.current?.pause();
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={start}
      onMouseLeave={stop}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: Math.min(index, 4) * 0.06, ease }}
      className="group relative snap-start flex-shrink-0 w-[68vw] max-w-[280px] sm:w-[260px] lg:w-[calc((100%-3*20px)/4)] lg:max-w-none text-left"
      aria-label={`Play: ${tip.title}`}
    >
      <div className="relative aspect-[5/6] rounded-[20px] overflow-hidden bg-[#1b1e1c] shadow-[0_30px_60px_-40px_rgba(20,22,20,0.55)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tipPoster(tip.slug)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
        <video
          ref={vRef}
          src={tipVideo(tip.slug)}
          muted
          playsInline
          loop
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${previewing ? "opacity-100" : "opacity-0"}`}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 via-45% to-transparent" />
        <span className="absolute top-3 left-3 text-[0.7rem] font-semibold text-white bg-black/35 backdrop-blur px-2 py-0.5 rounded-full tabular-nums">
          {tip.duration}
        </span>
        <span className="absolute left-4 right-4 bottom-4">
          <span className="block text-white font-semibold leading-snug text-[0.98rem] line-clamp-3">{tip.title}</span>
          <span className="mt-2 inline-flex items-center gap-2 text-[0.78rem] text-white/80">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-white text-[#141614] transition-transform duration-500 group-hover:scale-110">
              <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden><path d="M2 1.2v7.6L8.6 5z" fill="currentColor" /></svg>
            </span>
            Watch
          </span>
        </span>
      </div>
      <p className="text-[0.82rem] text-[#8A8E8A] mt-2.5 leading-snug pr-2">{tip.blurb}</p>
    </motion.button>
  );
}

function Player({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const tip = TIPS[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [onClose, onStep]);

  const arrow = "grid place-items-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] bg-[#0b0c0b]/90 backdrop-blur-md flex items-center justify-center gap-3 sm:gap-6 p-3"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tip.title}
    >
      <button type="button" aria-label="Previous video" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${arrow} hidden sm:grid`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>

      <motion.div
        key={tip.slug}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease }}
        className="relative h-[86vh] max-h-[860px] aspect-[9/16] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={tipVideo(tip.slug)}
          poster={tipPoster(tip.slug)}
          controls
          autoPlay
          playsInline
          onEnded={() => onStep(1)}
          className="w-full h-full object-contain rounded-[18px] bg-black"
        />
        <button type="button" onClick={onClose} aria-label="Close video" className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white grid place-items-center text-xl backdrop-blur transition-colors">
          ×
        </button>
        <div className="absolute -bottom-10 inset-x-0 flex items-center justify-between sm:justify-center gap-4 text-white/80 text-[0.8rem]">
          <button type="button" onClick={() => onStep(-1)} className="sm:hidden px-3 py-1">‹ Prev</button>
          <span className="tabular-nums">{index + 1} / {TIPS.length}</span>
          <button type="button" onClick={() => onStep(1)} className="sm:hidden px-3 py-1">Next ›</button>
        </div>
      </motion.div>

      <button type="button" aria-label="Next video" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${arrow} hidden sm:grid`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </motion.div>
  );
}

/** Homepage "Quick video tips": a swipeable row of portrait shorts, opening into a player. */
export function TipsReel() {
  const [open, setOpen] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { onScroll(); }, []);

  const scrollBy = (dir: number) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + TIPS.length) % TIPS.length)), []);
  const close = useCallback(() => setOpen(null), []);

  const navBtn = "grid place-items-center w-10 h-10 rounded-full border border-[#D6D8D4] dark:border-white/15 text-[#141614] dark:text-white hover:border-[#141614] dark:hover:border-white/40 transition-colors disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div>
      <div
        ref={rowRef}
        onScroll={onScroll}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent
      >
        {TIPS.map((t, i) => (
          <TipCard key={t.slug} tip={t} index={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} disabled={edges.start} className={navBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} disabled={edges.end} className={navBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <AnimatePresence>{open !== null && <Player index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </div>
  );
}
