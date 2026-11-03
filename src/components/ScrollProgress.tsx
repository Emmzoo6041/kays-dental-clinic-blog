"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140, damping: 30, restDelta: 0.001,
  });

  // Article pages use the ReadingProgress component instead, which is more relevant.
  if (pathname?.startsWith("/blog/")) return null;

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[120] bg-[#1B1F1C] dark:bg-white/70"
      aria-hidden
    />
  );
}
