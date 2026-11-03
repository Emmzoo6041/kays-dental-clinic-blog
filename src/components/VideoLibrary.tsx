"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { VIEWMEDICA, photoUrl, type VMGroup, type VMTopic } from "@/lib/viewmedica";
import { TopicArt } from "./TopicArt";

const ease = [0.16, 1, 0.3, 1] as const;

export function TopicCard({ t, group, index }: { t: VMTopic; group: string; index: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`${t.title} — watch the animated video on ViewMedica (opens in a new tab)`}
    >
      <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden ring-1 ring-black/[0.04] dark:ring-white/10">
        {t.photo && !broken ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photoUrl(t.photo)}
            srcSet={`${photoUrl(t.photo, 480)} 480w, ${photoUrl(t.photo, 800)} 800w`}
            sizes="(min-width: 1024px) 280px, (min-width: 768px) 30vw, 46vw"
            alt={t.title}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 w-full h-full object-cover saturate-[.85] bg-[#E8E8E6] transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <TopicArt
            art={t.art}
            group={group}
            index={index}
            className="absolute inset-0 w-full h-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute right-3 bottom-3 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-[#141614] shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <svg width="11" height="11" viewBox="0 0 10 10" aria-hidden><path d="M2 1.2v7.6L8.6 5z" fill="currentColor" /></svg>
        </span>
      </div>
      <h3 className="mt-3 text-[0.98rem] font-semibold leading-snug text-[#141614] dark:text-[#F2F2EF] group-hover:text-[#555A56] dark:group-hover:text-white transition-colors duration-300">
        {t.title}
      </h3>
      <p className="text-[0.82rem] text-[#8A8E8A] mt-0.5 leading-snug">{t.blurb}</p>
    </a>
  );
}

function Grid({ group, topics }: { group: VMGroup; topics: VMTopic[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8">
      {topics.map((t, i) => (
        <motion.div
          key={t.slug}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: Math.min(i, 8) * 0.04, ease }}
        >
          <TopicCard t={t} group={group.id} index={i} />
        </motion.div>
      ))}
    </div>
  );
}

/** Homepage: tabs for the two groups, first `limit` topics each, link to the full library. */
export function VideoLibraryTabs({ limit = 8 }: { limit?: number }) {
  const [active, setActive] = useState(VIEWMEDICA[0].id);
  const group = VIEWMEDICA.find((g) => g.id === active)!;
  const shown = group.topics.slice(0, limit);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div role="tablist" aria-label="Video topics" className="inline-flex p-1 rounded-[12px] bg-[#EFEFEC] dark:bg-white/5">
          {VIEWMEDICA.map((g) => {
            const on = g.id === active;
            return (
              <button
                key={g.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(g.id)}
                className={`relative px-3.5 sm:px-5 h-10 rounded-[9px] text-[0.86rem] font-semibold transition-colors duration-300 ${
                  on ? "text-[#141614] dark:text-[#141614]" : "text-[#6B706C] dark:text-[#A6AAA6] hover:text-[#141614] dark:hover:text-white"
                }`}
              >
                {on && (
                  <motion.span layoutId="vm-tab" className="absolute inset-0 rounded-[9px] bg-white dark:bg-[#F2F2EF] shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative whitespace-nowrap">
                  {g.title} <span className="hidden sm:inline text-[#9A9E9A] font-medium">{g.topics.length}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[0.86rem] text-[#6B706C] dark:text-[#A6AAA6]">{group.subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={group.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <Grid group={group} topics={shown} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-center">
        <Link
          href={`/learn#${group.id}`}
          className="inline-flex items-center h-11 px-5 rounded-[10px] border border-[#D6D8D4] dark:border-white/15 hover:border-[#141614] dark:hover:border-white/40 text-[#141614] dark:text-[#F2F2EF] font-semibold text-[0.9rem] transition-colors duration-300"
        >
          See all {VIEWMEDICA.reduce((n, g) => n + g.topics.length, 0)} videos →
        </Link>
      </div>
    </div>
  );
}

/** /learn page: every group, each under its own heading. */
export function VideoLibraryFull() {
  return (
    <div className="space-y-20">
      {VIEWMEDICA.map((g) => (
        <section key={g.id} id={g.id} className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8 pb-4 border-b border-[#E7E8E5] dark:border-white/10">
            <div>
              <h2 className="display-italic text-[1.9rem] sm:text-[2.3rem] leading-[1.1] text-[#141614] dark:text-[#F2F2EF]">{g.title}</h2>
              <p className="text-[#6B706C] dark:text-[#A6AAA6] mt-1">{g.subtitle}</p>
            </div>
            <span className="text-[0.8rem] text-[#8A8E8A]">{g.topics.length} videos</span>
          </div>
          <Grid group={g} topics={g.topics} />
        </section>
      ))}
    </div>
  );
}
