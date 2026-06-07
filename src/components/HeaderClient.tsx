"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { MicIcon } from "./MicIcon";

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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#articles", label: "Articles" },
    { href: "/#podcasts", label: "Podcasts" },
    { href: "/#videos", label: "Videos" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] h-[72px] px-4 sm:px-[5vw] flex items-center justify-between gap-2 transition-all duration-300
          ${scrolled
            ? "bg-white/98 dark:bg-[#0a1a0b]/98 backdrop-blur-xl border-b border-[#D4EDD9] dark:border-white/10 shadow-[0_4px_20px_rgba(30,92,46,0.08)]"
            : "bg-white/90 dark:bg-[#0a1a0b]/90 backdrop-blur-md border-b border-[#D4EDD9]/40 dark:border-white/5"
          }`}
      >
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-1">
          <MicIcon size={48} className="flex-shrink-0 transition-transform group-hover:scale-105" />
          <div className="leading-tight min-w-0">
            <strong className="block text-[0.92rem] sm:text-base font-extrabold text-[#1E5C2E] dark:text-[#D4EDD9] truncate">{clinicName}</strong>
            <span className="block text-[0.62rem] sm:text-[0.68rem] text-[#7A9480] dark:text-[#8FA89A] truncate">
              <span className="sm:hidden">Dr. Esther · Kampala</span>
              <span className="hidden sm:inline">Dr. Esther · {address}</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-[0.92rem] font-medium text-[#3D5444] dark:text-[#C8DFCC]">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
                  className="relative hover:text-[#2E7D42] transition-colors py-1
                             after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#2E7D42]
                             after:w-0 hover:after:w-full after:transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link href="/search" aria-label="Search" className="hidden sm:grid w-10 h-10 place-items-center rounded-full hover:bg-[#EDF7EF] dark:hover:bg-white/5 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#1E5C2E] dark:text-[#D4EDD9]">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <ThemeToggle />

          {/* Desktop auth/admin row */}
          <div className="hidden lg:flex items-center gap-3 text-sm">
            {isAdmin && <Link href="/admin" className="text-[#B91C1C] font-bold hover:text-[#8B1414]">Admin</Link>}
            {userEmail ? (
              signOutSlot
            ) : (
              <>
                <Link href="/login" className="text-[#7A9480] dark:text-[#8FA89A] hover:text-[#2E7D42]">Log in</Link>
                <Link href="/signup" className="text-[#7A9480] dark:text-[#8FA89A] hover:text-[#2E7D42]">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-[#EDF7EF] dark:hover:bg-white/5 transition"
          >
            <span className="relative w-5 h-[14px] block">
              <span className={`absolute left-0 top-0 w-full h-[2px] rounded bg-[#1E5C2E] dark:bg-[#D4EDD9] transition-all ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[6px] w-full h-[2px] rounded bg-[#1E5C2E] dark:bg-[#D4EDD9] transition-all ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 top-[12px] w-full h-[2px] rounded bg-[#1E5C2E] dark:bg-[#D4EDD9] transition-all ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-white dark:bg-[#0a1a0b] shadow-2xl pt-[88px] px-5 pb-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-3 rounded-lg text-base font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] hover:bg-[#EDF7EF] dark:hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/search"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-base font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] hover:bg-[#EDF7EF] dark:hover:bg-white/5"
                >
                  Search
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-3 rounded-lg text-base font-bold text-[#B91C1C] hover:bg-[#FEE2E2]"
                  >
                    Admin
                  </Link>
                )}
              </nav>

              <div className="mt-6 pt-5 border-t border-[#E5EDE7] dark:border-white/10 flex items-center gap-3 text-sm">
                {userEmail ? (
                  <>
                    <span className="text-[#7A9480] truncate flex-1">{userEmail}</span>
                    {signOutSlot}
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-[#2E7D42] text-[#2E7D42] font-semibold text-sm">Log in</Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-[#2E7D42] text-white font-semibold text-sm">Sign up</Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[72px]" />
    </>
  );
}
