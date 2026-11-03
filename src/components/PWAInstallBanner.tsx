"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallBanner() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if previously dismissed in this browser
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-banner-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      // Show after a small delay so it doesn't compete with the loading screen
      setTimeout(() => setVisible(true), 4000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function install() {
    if (!evt) return;
    evt.prompt();
    evt.userChoice.then(() => setVisible(false));
  }
  function dismiss() {
    localStorage.setItem("pwa-banner-dismissed", "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && evt && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 240 }}
          className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:max-w-sm z-[80] glass rounded-2xl p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">🦷</div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">Install this app</p>
              <p className="text-xs text-[#555A56] dark:text-[#E2E3E0] mt-0.5">
                Add Dr. Esther&apos;s blog to your home screen for one-tap access.
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={install} className="btn btn-green !py-1.5 !px-3 text-xs">Install</button>
                <button onClick={dismiss} className="px-3 py-1.5 text-xs font-bold text-[#8A8E8A] hover:text-[#555A56]">Not now</button>
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss" className="text-[#8A8E8A] hover:text-[#555A56] -mt-1">✕</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
