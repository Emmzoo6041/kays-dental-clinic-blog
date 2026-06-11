"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * Slider — horizontal scroll-snap carousel.
 *
 * - Cards flow continuously; user can drag/swipe freely.
 * - Four buttons: First, Prev, Next, Last.
 * - Mobile-friendly: large tap targets, swipe works natively.
 */
export function Slider({ children, accent = "#2E7D42" }: { children: React.ReactNode; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateBounds = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 1;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateBounds();
    el.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds);
    return () => {
      el.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    };
  }, [updateBounds]);

  function cardWidth(): number {
    const el = ref.current;
    if (!el) return 0;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return 0;
    // Card width + the gap between cards (we use gap-5 ≈ 20px)
    return firstChild.offsetWidth + 20;
  }

  const scrollBy = (delta: number) => {
    ref.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const goFirst = () => ref.current?.scrollTo({ left: 0, behavior: "smooth" });
  const goLast = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  };
  const goPrev = () => scrollBy(-cardWidth());
  const goNext = () => scrollBy(cardWidth());

  return (
    <div className="relative">
      {/* Strip */}
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 -mx-1 px-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 w-[88%] sm:w-[48%] lg:w-[31%]"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <SliderBtn label="First" disabled={atStart} onClick={goFirst} accent={accent} title="Go to first">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </SliderBtn>
        <SliderBtn label="Previous" disabled={atStart} onClick={goPrev} accent={accent} title="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </SliderBtn>
        <SliderBtn label="Next" disabled={atEnd} onClick={goNext} accent={accent} title="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </SliderBtn>
        <SliderBtn label="Last" disabled={atEnd} onClick={goLast} accent={accent} title="Go to last">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </SliderBtn>
      </div>
    </div>
  );
}

function SliderBtn({
  children, onClick, disabled, label, title, accent,
}: {
  children?: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
  title: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition border-2
        ${disabled
          ? "opacity-40 cursor-not-allowed border-[#D4EDD9] dark:border-white/10 text-[#7A9480]"
          : "border-[#D4EDD9] dark:border-white/15 text-[#3D5444] dark:text-[#C8DFCC] hover:text-white hover:border-transparent"
        }`}
      style={!disabled ? { ["--hover" as string]: accent } : undefined}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = accent;
          (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "";
        }
      }}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
