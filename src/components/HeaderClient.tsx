"use client";
import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { href: string; label: string; emoji?: string };

const NAV: NavItem[] = [
  { href: "/#articles", label: "Articles", emoji: "📝" },
  { href: "/#podcasts", label: "Podcasts", emoji: "🎙️" },
  { href: "/#videos", label: "Videos", emoji: "🎬" },
  { href: "/#about", label: "Dr. Esther" },
  { href: "/faq", label: "FAQ" },
];

export function HeaderClient({
  logoUrl,
  clinicName,
  address,
  isAdmin,
  userEmail,
  signOutSlot,
}: {
  logoUrl: string;
  clinicName: string;
  address: string;
  isAdmin: boolean;
  userEmail: string | null;
  signOutSlot: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] h-[72px] px-[5vw] flex items-center justify-between transition-all duration-300
          ${scrolled
            ? "bg-white/85 dark:bg-[#0a1a0b]/85 backdrop-blur-xl border-b border-[#D4EDD9] dark:border-white/10 shadow-[0_4px_20px_rgba(30,92,46,0.08)]"
            : "bg-transparent border-b-2 border-transparent"
          }`}
      >
        <Link href="/" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={clinicName}
               className="w-11 h-11 rounded-full object-cover border-[2.5px] border-[#4CAF6B] flex-shrink-0 transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <strong className="block text-base font-extrabold text-[#1E5C2E] dark:text-[#D4EDD9]">{clinicName}</strong>
            <span className="text-[0.68rem] text-[#7A9480] dark:text-[#8FA89A]">Dr. Esther · {address}</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
                  className="text-[0.82rem] font-semibold text-[#3D5444] dark:text-[#C8DFCC]/80 px-3 py-2 rounded-lg hover:text-[#2E7D42] hover:bg-[#EDF7EF] dark:hover:bg-white/10 transition-colors">
              {n.emoji ? `${n.emoji} ` : ""}{n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-[0.82rem] font-bold text-[#B91C1C] dark:text-[#FCA5A5] px-3 py-2 rounded-lg hover:bg-[#FEE2E2] dark:hover:bg-red-500/10">
              Admin
            </Link>
          )}
          <Link href="/search" aria-label="Search" className="w-10 h-10 grid place-items-center rounded-full bg-[#EDF7EF] dark:bg-white/10 hover:bg-[#D4EDD9] dark:hover:bg-white/20 transition-colors border border-[#D4EDD9] dark:border-white/20 text-[#1E5C2E] dark:text-[#D4EDD9]">
            🔍
          </Link>
          <ThemeToggle />
          <Link href="/#contact"
                className="ml-2 bg-[#E6B800] text-[#1E5C2E] rounded-full font-extrabold px-5 py-2 text-[0.82rem] shadow-md hover:bg-[#FFD740] hover:-translate-y-0.5 transition inline-block">
            Book Now
          </Link>
        </nav>

        {/* Mobile burger */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="w-10 h-10 grid place-items-center rounded-full bg-[#EDF7EF] dark:bg-white/10 border border-[#D4EDD9] dark:border-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#1E5C2E] dark:text-[#D4EDD9]">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* User row, desktop only */}
        <div className="hidden xl:flex items-center gap-3 text-xs absolute right-[5vw] top-full mt-1.5">
          {userEmail ? (
            <>
              <span className="text-[#7A9480] dark:text-[#8FA89A] truncate max-w-[160px]">{userEmail}</span>
              {signOutSlot}
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#7A9480] dark:text-[#8FA89A] hover:text-[#2E7D42]">Log in</Link>
              <Link href="/signup" className="text-[#7A9480] dark:text-[#8FA89A] hover:text-[#2E7D42]">Sign up</Link>
            </>
          )}
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 z-[111] w-[88vw] max-w-[360px] bg-white dark:bg-[#0a1a0b] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#D4EDD9] dark:border-white/10">
                <span className="font-display text-lg font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full bg-[#EDF7EF] dark:bg-white/10 grid place-items-center text-[#1E5C2E] dark:text-[#D4EDD9] text-xl"
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-5 flex-1">
                <Link href="/search" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-[#1E5C2E] dark:text-[#D4EDD9] font-semibold px-4 py-3 rounded-xl hover:bg-[#EDF7EF] dark:hover:bg-white/10">
                  🔍 Search
                </Link>
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 text-[#1E5C2E] dark:text-[#D4EDD9] font-semibold px-4 py-3 rounded-xl hover:bg-[#EDF7EF] dark:hover:bg-white/10">
                    {n.emoji && <span>{n.emoji}</span>}
                    {n.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 text-[#B91C1C] dark:text-[#FCA5A5] font-bold px-4 py-3 rounded-xl hover:bg-[#FEE2E2] dark:hover:bg-red-500/10">
                    🛠 Admin
                  </Link>
                )}
                <div className="mt-auto pt-4 border-t border-[#D4EDD9] dark:border-white/10">
                  {userEmail ? (
                    <div className="text-xs text-[#7A9480] dark:text-[#8FA89A] px-2 mb-3 truncate">{userEmail}</div>
                  ) : (
                    <div className="flex gap-2 mb-3">
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-[#D4EDD9] dark:border-white/20 text-[#1E5C2E] dark:text-[#D4EDD9] font-semibold text-sm">Log in</Link>
                      <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-[#2E7D42] text-white font-semibold text-sm">Sign up</Link>
                    </div>
                  )}
                  <Link href="/#contact" onClick={() => setMenuOpen(false)}
                        className="block text-center bg-[#E6B800] text-[#1E5C2E] rounded-full font-extrabold py-3 text-sm shadow-md">
                    📅 Book Now
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
