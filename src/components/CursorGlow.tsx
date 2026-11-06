"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[60] mix-blend-multiply dark:mix-blend-screen"
      style={{
        left: pos.x,
        top: pos.y,
        width: 360,
        height: 360,
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, rgba(143,163,150,0.18) 0%, rgba(181,166,124,0.08) 35%, transparent 70%)",
        filter: "blur(20px)",
      }}
    />
  );
}
