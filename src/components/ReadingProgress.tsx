"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Tracks how far the user has scrolled through the article body.
 * Pass a `targetId` of the element being read.
 */
export function ReadingProgress({ targetId = "article-body" }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) { setProgress(1); return; }
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return (
    <motion.div
      style={{ scaleX: progress, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[120] bg-gradient-to-r from-[#2B3D32] via-[#B5A67C] to-[#2B3D32]"
      transition={{ type: "spring", stiffness: 140, damping: 30 }}
      aria-hidden
    />
  );
}
