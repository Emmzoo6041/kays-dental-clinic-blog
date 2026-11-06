import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";
import { CLINIC, waLink } from "@/lib/clinic";
import { renderPostContent } from "@/lib/markdown";
import { ReadingProgress } from "@/components/ReadingProgress";
import { PREVIEW_ARTICLES } from "../../articles-data";
import { PreviewBanner } from "../../PreviewBanner";

export const metadata: Metadata = { title: "Preview article", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return PREVIEW_ARTICLES.map((a) => ({ slug: a.slug }));
}

/** TEMPORARY: same layout as /blog/[slug], fed from the preview data instead of the database. */
export default function PreviewArticle({ params }: { params: { slug: string } }) {
  const i = PREVIEW_ARTICLES.findIndex((a) => a.slug === params.slug);
  if (i < 0) notFound();
  const post = PREVIEW_ARTICLES[i];
  const prev = PREVIEW_ARTICLES[i - 1];
  const next = PREVIEW_ARTICLES[i + 1];
  const html = renderPostContent({ content: post.content });

  return (
    <>
      <PreviewBanner />
      <ReadingProgress targetId="article-body" />
      <div className="max-w-[1280px] mx-auto px-5 py-12">
        <article id="article-body">
          <Link href="/preview/articles" className="text-sm text-[#8A8E8A] hover:text-[#141614]">← All new articles</Link>
          <header className="mt-6 mb-8 max-w-3xl">
            <span className="s-tag">Article · {post.category} · {post.duration}</span>
            <h1 className="display-italic text-[2.3rem] md:text-[3.2rem] leading-[1.06] mt-3 text-[#141614] dark:text-[#F2F2EF]">{post.title}</h1>
            <p className="mt-5 text-[1.15rem] leading-[1.6] text-[#555A56] dark:text-[#A6AAA6]">{post.excerpt}</p>
            <p className="text-sm text-[#8A8E8A] mt-4">{format(new Date(post.created_at), "MMMM d, yyyy")} · {CLINIC.doctor}</p>
          </header>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_url} alt={post.title} className="w-full max-w-3xl rounded-[20px] aspect-[16/9] object-cover mb-10 bg-[#E8E8E6]" />
          <div className="prose-blog max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 p-7 bg-[#F4F4F2] dark:bg-white/5 rounded-[20px] border border-[#E7E8E5] dark:border-white/10 text-center max-w-3xl">
            <p className="font-display text-lg text-[#1B1F1C] dark:text-[#E7E8E5] mb-3">Have a question for Dr. Esther?</p>
            <a href={waLink(`Hello Dr. Esther! I just read "${post.title}" and have a question.`)} target="_blank" rel="noreferrer" className="btn btn-green">Ask on WhatsApp</a>
          </div>
          <div className="max-w-3xl mt-10 grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link href={`/preview/articles/${prev.slug}`} className="rounded-[16px] border border-[#E7E8E5] dark:border-white/10 p-5 hover:border-[#141614] transition-colors">
                <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[#8A8E8A]">← Previous</span>
                <span className="block font-semibold text-[#141614] dark:text-[#F2F2EF] mt-1">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/preview/articles/${next.slug}`} className="rounded-[16px] border border-[#E7E8E5] dark:border-white/10 p-5 hover:border-[#141614] transition-colors text-right">
                <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[#8A8E8A]">Next →</span>
                <span className="block font-semibold text-[#141614] dark:text-[#F2F2EF] mt-1">{next.title}</span>
              </Link>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
