"use client";
import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

const variants: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 28 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -28 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 28 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -28 }, visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },         visible: { opacity: 1 } },
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  amount = 0.2,
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
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      variants={variants[direction]}
    >
      {children}
    </motion.div>
  );
}
