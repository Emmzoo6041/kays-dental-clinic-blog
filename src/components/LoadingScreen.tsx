"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[200] bg-[#F2F2EF] dark:bg-[#0e100f] grid place-items-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-7xl"
            >
              🦷
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="h-[3px] bg-[#2B3D32] dark:bg-[#8FA396] rounded-full max-w-[160px]"
            />
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-[#1B1F1C] dark:text-[#E7E8E5] text-sm tracking-wider"
            >
              Conversations with a Dentist
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
