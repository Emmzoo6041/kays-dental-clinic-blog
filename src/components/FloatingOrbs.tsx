"use client";
import { motion } from "framer-motion";

/**
 * Renders 3 soft animated gradient blobs in the background of whatever section.
 * Use inside a `relative overflow-hidden` parent.
 */
export function FloatingOrbs({ intensity = "normal" }: { intensity?: "subtle" | "normal" | "strong" }) {
  const opacity = intensity === "subtle" ? 0.35 : intensity === "strong" ? 0.7 : 0.5;

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(143,163,150,0.6) 0%, transparent 70%)", opacity }}
      />
      <motion.div
        animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,215,64,0.5) 0%, transparent 70%)", opacity }}
      />
      <motion.div
        animate={{ x: [0, 40, -30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-[320px] h-[320px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(143,163,150,0.35) 0%, transparent 70%)", opacity }}
      />
    </div>
  );
}
