import Link from "next/link";
import type { Metadata } from "next";
import { PREVIEW_ARTICLES } from "../articles-data";
import { PreviewBanner } from "../PreviewBanner";

export const metadata: Metadata = { title: "Preview: new articles", robots: { index: false, follow: false } };

export default function PreviewArticles() {
  return (
    <div className="px-5 sm:px-[5vw] pt-14 pb-24 max-w-[1200px] mx-auto">
      <PreviewBanner />
      <div className="max-w-2xl mb-12 mt-8">
        <div className="s-tag">Preview · 10 new articles</div>
        <h1 className="display-italic text-[2.6rem] sm:text-[3.2rem] leading-[1.05] text-[#141614] dark:text-[#F2F2EF] mt-1">New articles</h1>
        <p className="text-[#555A56] dark:text-[#B6BAB6] mt-3">
          How the articles will look once they&rsquo;re added. Open any one to read it in full. <Link href="/preview" className="underline underline-offset-2">See them on the homepage →</Link>
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {PREVIEW_ARTICLES.map((a) => (
          <Link key={a.slug} href={`/preview/articles/${a.slug}`} className="group block">
            <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-[#E8E8E6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.cover_url.replace("w=1600&h=900", "w=800&h=500")} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" />
            </div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8A8E8A] mt-4">{a.category} · {a.duration}</div>
            <h2 className="font-display text-[1.25rem] leading-snug text-[#141614] dark:text-[#F2F2EF] mt-1 group-hover:text-[#555A56] transition-colors">{a.title}</h2>
            <p className="text-[0.9rem] text-[#6B706C] dark:text-[#A6AAA6] mt-2 line-clamp-2">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
