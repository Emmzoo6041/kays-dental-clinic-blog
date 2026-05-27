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
      className="fixed top-0 left-0 right-0 h-[3px] z-[120] bg-gradient-to-r from-[#2E7D42] via-[#E6B800] to-[#2E7D42]"
      aria-hidden
    />
  );
}
