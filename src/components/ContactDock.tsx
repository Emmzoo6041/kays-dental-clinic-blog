"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CLINIC, waLink } from "@/lib/clinic";
import { PhoneIcon, ChatIcon } from "./ContactIcons";

/**
 * Always-visible contact: call + WhatsApp numbers in a small pill (bottom-right).
 * Phones get two round buttons instead. Hides while the footer (which lists both numbers) is on screen.
 */
export function ContactDock() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    const footer = document.querySelector("footer");
    let io: IntersectionObserver | undefined;
    if (footer) {
      io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { rootMargin: "0px 0px -40px 0px" });
      io.observe(footer);
    }
    return () => { clearTimeout(t); io?.disconnect(); };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;
  const visible = show && !footerVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[70] right-4 bottom-4 sm:right-6 sm:bottom-6"
        >
          {/* Tablet / desktop: pill with both numbers */}
          <div className="hidden sm:flex items-stretch rounded-full bg-white/90 dark:bg-[#1a1d1b]/90 backdrop-blur-xl border border-[#E2E3E0] dark:border-white/10 shadow-[0_18px_40px_-20px_rgba(20,22,20,0.45)] text-[#141614] dark:text-[#F2F2EF] overflow-hidden">
            <a href={`tel:${CLINIC.phoneIntl}`} className="flex items-center gap-2.5 pl-4 pr-4 py-2.5 hover:bg-[#F2F2EF] dark:hover:bg-white/5 transition-colors">
              <PhoneIcon size={16} />
              <span className="leading-tight">
                <span className="block text-[0.64rem] uppercase tracking-[0.12em] text-[#8A8E8A]">Call</span>
                <span className="block text-[0.84rem] font-semibold tabular-nums whitespace-nowrap">{CLINIC.phone}</span>
              </span>
            </a>
            <span className="w-px my-2.5 bg-[#E2E3E0] dark:bg-white/10" />
            <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 pl-4 pr-5 py-2.5 hover:bg-[#F2F2EF] dark:hover:bg-white/5 transition-colors">
              <ChatIcon size={17} />
              <span className="leading-tight">
                <span className="block text-[0.64rem] uppercase tracking-[0.12em] text-[#8A8E8A]">WhatsApp</span>
                <span className="block text-[0.84rem] font-semibold tabular-nums whitespace-nowrap">{CLINIC.whatsappDisplay}</span>
              </span>
            </a>
          </div>

          {/* Phones: two round buttons */}
          <div className="flex sm:hidden flex-col gap-2.5">
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${CLINIC.whatsappDisplay}`}
               className="grid place-items-center w-12 h-12 rounded-full bg-[#141614] text-white dark:bg-[#F2F2EF] dark:text-[#141614] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.55)]">
              <ChatIcon size={21} />
            </a>
            <a href={`tel:${CLINIC.phoneIntl}`} aria-label={`Call ${CLINIC.phone}`}
               className="grid place-items-center w-12 h-12 rounded-full bg-white text-[#141614] border border-[#E2E3E0] dark:bg-[#1a1d1b] dark:text-white dark:border-white/10 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)]">
              <PhoneIcon size={19} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
