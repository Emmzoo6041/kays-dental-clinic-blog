"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Auto-scrolling horizontal marquee that:
 * - Slides children leftward continuously
 * - Pauses when the user hovers
 * - Loops seamlessly (renders children twice back-to-back)
 * - Adjusts speed via the `speed` prop (pixels per second)
 */
export function Marquee({
  children,
  speed = 40,         // pixels per second; lower = slower
  gap = 28,           // pixels between cards
  pauseOnHover = true,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    // Measure one half of the track (it's duplicated) and compute duration
    if (!trackRef.current) return;
    const halfWidth = trackRef.current.scrollWidth / 2;
    setDuration(halfWidth / speed);
  }, [speed, children]);

  return (
    <div
      className={`marquee-wrap ${className}`}
      style={{ ["--gap" as any]: `${gap}px` }}
      data-pause-on-hover={pauseOnHover ? "true" : "false"}
    >
      <div
        ref={trackRef}
        className="marquee-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="marquee-row">{children}</div>
        {/* Duplicate so loop is seamless */}
        <div className="marquee-row" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
