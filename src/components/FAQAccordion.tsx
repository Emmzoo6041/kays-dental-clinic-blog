"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i} className="bg-white dark:bg-white/5 border-2 border-[#C8DFCC] dark:border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#EDF7EF]/40 dark:hover:bg-white/5 transition"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base sm:text-lg font-semibold text-[#1E5C2E] dark:text-[#D4EDD9]">
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-7 h-7 rounded-full bg-[#EDF7EF] dark:bg-white/10 grid place-items-center flex-shrink-0 text-[#2E7D42] text-lg font-bold"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[#3D5444] dark:text-[#C8DFCC] leading-relaxed whitespace-pre-line">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
