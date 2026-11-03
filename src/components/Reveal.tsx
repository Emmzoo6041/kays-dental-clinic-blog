"use client";
import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

// Small distances + a long, soft ease-out: content settles in rather than sliding.
const variants: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 18 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -18 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 18 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -18 }, visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },         visible: { opacity: 1 } },
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  amount = 0.15,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={variants[direction]}
    >
      {children}
    </motion.div>
  );
}
