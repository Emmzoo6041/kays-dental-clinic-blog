"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ARTICLE_CATEGORIES } from "@/lib/clinic";

type Article = {
  id: string; slug: string; category: string | null;
  title: string; excerpt: string | null; cover_url: string | null;
  duration: string | null; created_at: string;
};

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export function ArticleFilter({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState("all");
  const list = useMemo(() => filter === "all" ? articles : articles.filter(a => a.category === filter), [filter, articles]);

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-9">
        {ARTICLE_CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
                  className={`tag-btn ${filter === c.key ? "active" : ""}`}>
            {c.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="text-center py-12 px-8 text-[#8A8E8A] bg-[#F8F8F6] rounded-2xl border-2 border-dashed border-[#E2E3E0] text-sm">
          No articles in this category yet — Dr. Esther will publish one soon! 😊
        </div>
      ) : (
        <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(305px, 1fr))" }}>
          {list.map(a => (
            <Link key={a.id} href={`/blog/${a.slug}`}
                  className="bg-[#F8F8F6] border-2 border-[#E2E3E0] rounded-[22px] overflow-hidden cursor-pointer card-hover hover:border-[#8FA396] block group">
              <div className="h-[210px] overflow-hidden relative">
                {a.cover_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.cover_url} alt={a.title} loading="lazy"
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                ) : (
                  <div className="w-full h-full grid place-items-center bg-[#F2F2EF] text-6xl">📝</div>
                )}
                {a.category && (
                  <span className="absolute top-3 left-3 bg-[#2B3D32] text-white text-[0.65rem] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full">
                    {cap(a.category)}
                  </span>
                )}
              </div>
              <div className="px-5 pt-5 pb-6">
                <h3 className="font-display text-lg font-semibold leading-[1.3] text-[#1B1F1C] mb-2">{a.title}</h3>
                {a.excerpt && <p className="text-[0.86rem] text-[#555A56] leading-[1.7] mb-3">{a.excerpt}</p>}
                <div className="flex items-center gap-1.5 text-[0.73rem] text-[#8A8E8A] font-semibold">
                  {a.duration && <><span>{a.duration}</span><span className="w-[3px] h-[3px] rounded-full bg-[#8A8E8A]" /></>}
                  <span>{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  <span className="ml-auto text-[#2B3D32] font-bold">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
