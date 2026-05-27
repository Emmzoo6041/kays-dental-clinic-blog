"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Result = {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  duration: string | null;
};

export function SearchClient() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [q]);

  const typeEmoji = (t: string) => (t === "podcast" ? "🎙" : t === "video" ? "🎬" : "📝");

  return (
    <>
      <div className="relative mb-8">
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. flossing, kids, whitening, sugar..."
          className="input !text-lg !py-4 !pl-12 !pr-12"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#7A9480]">🔍</span>
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full hover:bg-[#EDF7EF] dark:hover:bg-white/10 text-[#7A9480]"
          >
            ✕
          </button>
        )}
      </div>

      {loading && <p className="text-[#7A9480] text-sm">Searching…</p>}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12 px-8 text-[#7A9480] bg-[#F6F9F3] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#C8DFCC] dark:border-white/10">
          No posts matched <strong>&ldquo;{q}&rdquo;</strong>. Try different keywords.
        </div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {results.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/blog/${r.slug}`}
                  className="flex gap-4 p-4 bg-white dark:bg-white/5 border-2 border-[#C8DFCC] dark:border-white/10 rounded-2xl hover:border-[#4CAF6B] hover:-translate-y-0.5 transition"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EDF7EF] flex-shrink-0 grid place-items-center">
                    {r.cover_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={r.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{typeEmoji(r.type)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#7A9480] uppercase tracking-wider font-bold mb-1">
                      <span>{typeEmoji(r.type)} {r.type}</span>
                      {r.duration && <><span>·</span><span>{r.duration}</span></>}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] line-clamp-1">
                      {r.title}
                    </h3>
                    {r.excerpt && <p className="text-sm text-[#3D5444] dark:text-[#C8DFCC] line-clamp-2 mt-1">{r.excerpt}</p>}
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
