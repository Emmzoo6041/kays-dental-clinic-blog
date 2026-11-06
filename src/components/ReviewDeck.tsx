"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, type PanInfo } from "framer-motion";

type Review = { name: string; stars: number; role: string; text: string };

const spring = { type: "spring" as const, stiffness: 170, damping: 22, mass: 0.9 };

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-[#141614] dark:text-[#F2F2EF]" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function CardFace({ r, lines = 7 }: { r: Review; lines?: number }) {
  return (
    <div className="h-full flex flex-col p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <Stars n={r.stars} />
        <span className="font-display italic text-[2.6rem] leading-none text-[#D6D8D4] dark:text-white/20 -mt-1" aria-hidden>&ldquo;</span>
      </div>
      <p
        className="font-display italic text-[1.02rem] leading-[1.6] text-[#141614] dark:text-[#F2F2EF] mt-3 flex-1 overflow-hidden"
        style={{ display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical" }}
      >
        {r.text}
      </p>
      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#ECECEA] dark:border-white/10">
        <span className="w-9 h-9 rounded-full bg-[#141614] text-white dark:bg-white dark:text-[#141614] grid place-items-center text-sm font-semibold flex-shrink-0">
          {r.name[0]}
        </span>
        <span className="min-w-0">
          <span className="block text-[0.88rem] font-semibold text-[#141614] dark:text-[#F2F2EF] truncate">{r.name}</span>
          <span className="block text-[0.72rem] text-[#8A8E8A]">{r.role}</span>
        </span>
      </div>
    </div>
  );
}

const cardShell =
  "absolute top-0 rounded-[20px] bg-white dark:bg-[#1a1d1b] border border-[#E7E8E5] dark:border-white/10 shadow-[0_24px_50px_-28px_rgba(20,22,20,0.45)] will-change-transform";

/**
 * Patient reviews as a hand of playing cards.
 * Desktop: cards are dealt from a pile into a fan; one card is lifted at a time
 * (auto-advances, hover takes over). Phones: a stacked deck you swipe through.
 */
export function ReviewDeck({ reviews }: { reviews: Review[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [auto, setAuto] = useState(Math.floor(reviews.length / 2));
  const [order, setOrder] = useState(() => reviews.map((_, i) => i)); // phone deck order, front first
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => ro.disconnect();
  }, []);

  const isFan = width >= 760;
  const n = reviews.length;
  const mid = (n - 1) / 2;

  // Desktop: gently lift the next card every few seconds until someone hovers.
  useEffect(() => {
    if (!isFan || !inView || hover !== null || reduced) return;
    const t = setInterval(() => setAuto((a) => (a + 1) % n), 3200);
    return () => clearInterval(t);
  }, [isFan, inView, hover, n, reduced]);

  const lifted = hover ?? auto;

  /* ---------------------------- Desktop fan ---------------------------- */
  if (isFan) {
    const cardW = 300;
    const spread = Math.min(118, (width - cardW - 160) / Math.max(1, n - 1));
    return (
      <div ref={wrapRef} className="relative h-[500px] mt-6 select-none" onMouseLeave={() => setHover(null)}>
        {reviews.map((r, i) => {
          const off = i - mid;
          const up = i === lifted;
          const fanned = {
            x: off * spread - cardW / 2,
            y: up ? 14 : Math.abs(off) * Math.abs(off) * 6 + 56,
            rotate: up ? 0 : off * 4.5,
            scale: up ? 1.05 : 1,
            opacity: 1,
          };
          const pile = { x: -cardW / 2 + (i % 2 ? 6 : -6), y: 70, rotate: (i % 3 - 1) * 3, scale: 0.96, opacity: 0 };
          return (
            <motion.div
              key={r.name}
              className={`${cardShell} left-1/2 cursor-pointer`}
              style={{ width: cardW, height: 360, zIndex: up ? 50 : 20 - Math.round(Math.abs(off) * 2), transformOrigin: "50% 120%" }}
              initial={pile}
              animate={inView ? fanned : pile}
              transition={inView && !up && hover === null ? { ...spring, delay: reduced ? 0 : 0.05 + i * 0.07 } : spring}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              tabIndex={0}
              aria-label={`Review by ${r.name}`}
            >
              <CardFace r={r} />
            </motion.div>
          );
        })}
      </div>
    );
  }

  /* ---------------------------- Phone deck ----------------------------- */
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 500) next();
  };
  const cardW = Math.min(310, Math.max(240, width - 40));

  return (
    <div ref={wrapRef}>
      <div className="relative h-[410px]">
        {order.map((idx, depth) => {
          const r = reviews[idx];
          const front = depth === 0;
          const shown = Math.min(depth, 3);
          return (
            <motion.div
              key={r.name}
              className={`${cardShell} inset-x-0 mx-auto ${front ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{ width: cardW, height: 360, zIndex: 50 - depth }}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              animate={
                inView
                  ? {
                      opacity: depth > 3 ? 0 : 1,
                      y: shown * 10,
                      x: front ? 0 : (depth % 2 ? 1 : -1) * (6 + shown * 4),
                      rotate: front ? 0 : (depth % 2 ? 1 : -1) * (4 + shown * 2.5),
                      scale: 1 - shown * 0.04,
                    }
                  : { opacity: 0, y: 40 }
              }
              transition={{ ...spring, delay: inView && depth < 4 ? depth * 0.06 : 0 }}
              drag={front ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              whileDrag={{ rotate: 0, scale: 1.02 }}
              onDragEnd={front ? onDragEnd : undefined}
              aria-hidden={!front}
            >
              <CardFace r={r} lines={8} />
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-3 mt-2">
        <button type="button" onClick={prev} aria-label="Previous review" className="w-11 h-11 rounded-full border border-[#D6D8D4] dark:border-white/15 grid place-items-center text-[#141614] dark:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-[0.8rem] text-[#8A8E8A] tabular-nums w-12 text-center">{order[0] + 1} / {n}</span>
        <button type="button" onClick={next} aria-label="Next review" className="w-11 h-11 rounded-full border border-[#D6D8D4] dark:border-white/15 grid place-items-center text-[#141614] dark:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <p className="text-center text-[0.75rem] text-[#9A9E9A] mt-3">Swipe the card to see the next review</p>
    </div>
  );
}
