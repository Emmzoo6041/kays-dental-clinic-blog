"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { MicIcon } from "./MicIcon";
import { waLink } from "@/lib/clinic";

const SECTION_IDS = ["articles", "podcasts", "videos"] as const;

export function HeaderClient({
  clinicName,
  isAdmin,
  userEmail,
  signOutSlot,
}: {
  logoUrl?: string;
  clinicName: string;
  address?: string;
  isAdmin: boolean;
  userEmail: string | null;
  signOutSlot: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // On the homepage, highlight Articles / Podcasts / Videos as you scroll past them.
  useEffect(() => {
    if (!isHome) { setActiveSection(null); return; }
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        setActiveSection(SECTION_IDS.find((id) => seen.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  // Over the homepage video the header is transparent with white text, until you scroll.
  const overHero = isHome && !scrolled && !menuOpen;

  const links = [
    { href: "/", label: "Home", active: isHome && !activeSection },
    { href: "/#articles", label: "Articles", active: activeSection === "articles" || pathname.startsWith("/blog") },
    { href: "/#podcasts", label: "Podcasts", active: activeSection === "podcasts" },
    { href: "/#videos", label: "Videos", active: activeSection === "videos" },
    { href: "/faq", label: "FAQ", active: pathname === "/faq" },
    { href: "/contact", label: "Contact", active: pathname === "/contact" },
  ];

  const iconBtn = overHero
    ? "text-white hover:bg-white/15"
    : "text-[#1E5C2E] dark:text-[#D4EDD9] hover:bg-[#EDF7EF] dark:hover:bg-white/5";
  const barColor = overHero ? "bg-white" : "bg-[#1E5C2E] dark:bg-[#D4EDD9]";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] h-[72px] transition-all duration-300 ${
          overHero
            ? "bg-gradient-to-b from-black/45 to-transparent"
            : scrolled
              ? "bg-white/95 dark:bg-[#0a1a0b]/95 backdrop-blur-xl border-b border-[#D4EDD9] dark:border-white/10 shadow-[0_6px_24px_-12px_rgba(30,92,46,0.25)]"
              : "bg-white/95 dark:bg-[#0a1a0b]/95 backdrop-blur-md border-b border-[#D4EDD9]/60 dark:border-white/5"
        }`}
      >
        <div className="h-full max-w-[1280px] mx-auto px-4 sm:px-[5vw] xl:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <span className={`grid place-items-center w-11 h-11 rounded-2xl flex-shrink-0 transition ${overHero ? "bg-white/90" : "bg-[#EDF7EF] dark:bg-white/10"}`}>
              <MicIcon size={34} className="transition-transform group-hover:scale-110" />
            </span>
            <span className="leading-tight min-w-0">
              <strong className={`block font-display text-[1rem] sm:text-[1.12rem] font-bold tracking-[-0.01em] sm:truncate transition-colors ${overHero ? "text-white" : "text-[#1E5C2E] dark:text-[#D4EDD9]"}`}>
                {/* Phones: title on two lines, no subtitle, so nothing gets cut off */}
                <span className="sm:hidden">Conversations<br />with a Dentist</span>
                <span className="hidden sm:inline">{clinicName}</span>
              </strong>
              <span className={`hidden sm:block text-[0.7rem] font-semibold truncate transition-colors ${overHero ? "text-white/75" : "text-[#7A9480] dark:text-[#8FA89A]"}`}>
                with Dr. Esther Lukwago
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-[0.9rem] font-semibold">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={l.active ? "page" : undefined}
                className={`relative px-3.5 py-2 rounded-full transition-colors ${
                  overHero
                    ? l.active ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10"
                    : l.active
                      ? "text-[#1E5C2E] bg-[#EDF7EF] dark:text-[#D4EDD9] dark:bg-white/10"
                      : "text-[#3D5444] dark:text-[#C8DFCC] hover:text-[#1E5C2E] hover:bg-[#F6F9F3] dark:hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Link href="/search" aria-label="Search" className={`hidden sm:grid w-10 h-10 place-items-center rounded-full transition ${iconBtn}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7.5" />
                <path d="M20.5 20.5 16.4 16.4" />
              </svg>
            </Link>
            <div className={overHero ? "[&_button]:bg-white/15 [&_button]:border-white/30 [&_button:hover]:bg-white/25" : ""}>
              <ThemeToggle />
            </div>

            <span className={`hidden lg:block w-px h-6 mx-2 ${overHero ? "bg-white/30" : "bg-[#D4EDD9] dark:bg-white/10"}`} />

            <div className="hidden lg:flex items-center gap-3 text-sm font-semibold">
              {isAdmin && (
                <Link href="/admin" className={overHero ? "text-[#FFD740] hover:text-white" : "text-[#B91C1C] hover:text-[#8B1414]"}>
                  Admin
                </Link>
              )}
              {userEmail ? (
                signOutSlot
              ) : (
                <Link href="/login" className={overHero ? "text-white/85 hover:text-white" : "text-[#3D5444] dark:text-[#C8DFCC] hover:text-[#1E5C2E]"}>
                  Log in
                </Link>
              )}
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition shadow-sm ${
                  overHero
                    ? "bg-white text-[#1E5C2E] hover:bg-[#FFD740]"
                    : "bg-[#2E7D42] text-white hover:bg-[#1E5C2E]"
                }`}
              >
                Book a visit
              </a>
            </div>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={`lg:hidden w-10 h-10 grid place-items-center rounded-full transition ${iconBtn}`}
            >
              <span className="relative w-5 h-[14px] block">
                <span className={`absolute left-0 top-0 w-full h-[2px] rounded ${barColor} transition-all ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] w-full h-[2px] rounded ${barColor} transition-all ${menuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-[12px] w-full h-[2px] rounded ${barColor} transition-all ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

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
              className="absolute right-0 top-0 h-full w-[80%] max-w-[330px] bg-white dark:bg-[#0a1a0b] shadow-2xl pt-[88px] px-5 pb-6 overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1">
                {[...links, { href: "/search", label: "Search", active: pathname === "/search" }].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      l.active
                        ? "bg-[#EDF7EF] text-[#1E5C2E] dark:bg-white/10 dark:text-[#D4EDD9]"
                        : "text-[#1E5C2E] dark:text-[#D4EDD9] hover:bg-[#F6F9F3] dark:hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-bold text-[#B91C1C] hover:bg-[#FEE2E2]"
                  >
                    Admin
                  </Link>
                )}
              </nav>

              <div className="mt-auto pt-6">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-3 rounded-full bg-[#2E7D42] hover:bg-[#1E5C2E] text-white font-bold transition"
                >
                  💬 Book a visit on WhatsApp
                </a>
                <div className="mt-4 pt-4 border-t border-[#E5EDE7] dark:border-white/10 flex items-center gap-3 text-sm">
                  {userEmail ? (
                    <>
                      <span className="text-[#7A9480] truncate flex-1">{userEmail}</span>
                      {signOutSlot}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-full border-2 border-[#2E7D42] text-[#2E7D42] dark:text-[#4CAF6B] font-semibold"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-full bg-[#EDF7EF] dark:bg-white/10 text-[#1E5C2E] dark:text-[#D4EDD9] font-semibold"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer under the fixed header. Skipped on the homepage so the video runs up behind the header. */}
      {!isHome && <div className="h-[72px]" />}
    </>
  );
}
