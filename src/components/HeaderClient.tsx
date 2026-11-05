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

  // Over the homepage hero the header has no background until you scroll.
  const overHero = isHome && !scrolled && !menuOpen;

  const links = [
    { href: "/", label: "Home", active: isHome && !activeSection },
    { href: "/#articles", label: "Articles", active: activeSection === "articles" || pathname.startsWith("/blog") },
    { href: "/#podcasts", label: "Podcasts", active: activeSection === "podcasts" },
    { href: "/#videos", label: "Videos", active: activeSection === "videos" },
    { href: "/learn", label: "Library", active: pathname === "/learn" },
    { href: "/faq", label: "FAQ", active: pathname === "/faq" },
    { href: "/contact", label: "Contact", active: pathname === "/contact" },
  ];

  const iconBtn = "text-[#1B1F1C] dark:text-[#E7E8E5] hover:bg-[#F2F2EF] dark:hover:bg-white/5";
  const barColor = "bg-[#1B1F1C] dark:bg-[#E7E8E5]";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] h-[72px] transition-[background-color,border-color] duration-500 ${
          overHero
            ? "bg-transparent"
            : scrolled
              ? "bg-[#FAFAF9]/85 dark:bg-[#0e100f]/85 backdrop-blur-xl border-b border-[#ECECEA] dark:border-white/5"
              : "bg-[#FAFAF9]/90 dark:bg-[#0e100f]/90 backdrop-blur-md border-b border-[#ECECEA] dark:border-white/5"
        }`}
      >
        <div className="h-full max-w-[1280px] mx-auto px-4 sm:px-[5vw] xl:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <span className="grid place-items-center w-10 h-10 rounded-[12px] flex-shrink-0 bg-[#141614] text-white dark:bg-[#F2F2EF] dark:text-[#141614] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-6">
              <MicIcon size={26} />
            </span>
            <span className="leading-tight min-w-0">
              <strong className={`block font-display text-[1rem] sm:text-[1.12rem] font-bold tracking-[-0.01em] sm:truncate transition-colors text-[#1B1F1C] dark:text-[#E7E8E5]`}>
                {/* Phones: title on two lines, no subtitle, so nothing gets cut off */}
                <span className="sm:hidden">Conversations<br />with a Dentist</span>
                <span className="hidden sm:inline">{clinicName}</span>
              </strong>
              <span className={`hidden sm:block text-[0.7rem] font-semibold truncate transition-colors text-[#8A8E8A] dark:text-[#999D99]`}>
                with Dr. Esther Lukwago
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-[0.9rem] font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={l.active ? "page" : undefined}
                className={`relative px-3.5 py-2 transition-colors duration-300 ${
                  l.active
                    ? "text-[#141614] dark:text-white"
                    : "text-[#6B706C] dark:text-[#A6AAA6] hover:text-[#141614] dark:hover:text-white"
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
            <ThemeToggle />

            <span className={`hidden lg:block w-2`} />

            <div className="hidden lg:flex items-center gap-3 text-sm font-semibold">
              {isAdmin && (
                <Link href="/admin" className="text-[#B91C1C] hover:text-[#8B1414]">
                  Admin
                </Link>
              )}
              {userEmail ? (
                signOutSlot
              ) : (
                <Link href="/login" className="inline-flex items-center h-10 px-4 rounded-[10px] border border-[#D6D8D4] dark:border-white/15 text-[#141614] dark:text-[#F2F2EF] hover:border-[#141614] dark:hover:border-white/40 transition-colors duration-300">
                  Log in
                </Link>
              )}
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center h-10 px-5 rounded-[10px] font-semibold transition-colors duration-300 bg-[#141614] text-white hover:bg-[#2B3D32] dark:bg-[#F2F2EF] dark:text-[#141614] dark:hover:bg-white"
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
              className="absolute right-0 top-0 h-full w-[80%] max-w-[330px] bg-white dark:bg-[#0e100f] shadow-2xl pt-[88px] px-5 pb-6 overflow-y-auto flex flex-col"
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
                        ? "bg-[#F2F2EF] text-[#1B1F1C] dark:bg-white/10 dark:text-[#E7E8E5]"
                        : "text-[#1B1F1C] dark:text-[#E7E8E5] hover:bg-[#F8F8F6] dark:hover:bg-white/5"
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
                  className="block text-center py-3 rounded-[10px] bg-[#141614] hover:bg-[#2B3D32] text-white dark:bg-[#F2F2EF] dark:text-[#141614] font-semibold transition-colors"
                >
                  Book a visit on WhatsApp
                </a>
                <div className="mt-4 pt-4 border-t border-[#E8E8E6] dark:border-white/10 flex items-center gap-3 text-sm">
                  {userEmail ? (
                    <>
                      <span className="text-[#8A8E8A] truncate flex-1">{userEmail}</span>
                      {signOutSlot}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-full border-2 border-[#2B3D32] text-[#2B3D32] dark:text-[#8FA396] font-semibold"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-full bg-[#F2F2EF] dark:bg-white/10 text-[#1B1F1C] dark:text-[#E7E8E5] font-semibold"
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
