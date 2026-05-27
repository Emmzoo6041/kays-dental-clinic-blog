"use client";
import { useRef, MouseEvent, ReactNode, AnchorHTMLAttributes } from "react";
import { motion } from "framer-motion";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  strength?: number;
};

export function MagneticButton({
  children,
  strength = 0.25,
  className = "",
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.18s cubic-bezier(0.21,0.47,0.32,0.98)" }}
      className={className}
      {...(rest as any)}
    >
      {children}
    </motion.a>
  );
}
