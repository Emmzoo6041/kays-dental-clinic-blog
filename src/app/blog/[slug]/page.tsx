import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";
import { renderPostContent } from "@/lib/markdown";
import { format } from "date-fns";
import { CommentsSection } from "@/components/CommentsSection";
import { CLINIC, waLink } from "@/lib/clinic";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { Reveal } from "@/components/Reveal";
import { ViewTracker } from "@/components/ViewTracker";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ContinueReading } from "@/components/ContinueReading";
import { TrendingWidget } from "@/components/TrendingWidget";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("title, excerpt, meta_title, meta_description, og_image, cover_url")
    .eq("slug", params.slug).single();
  if (!data) return { title: "Post not found" };
  const title = data.meta_title || `${data.title} — Conversations with a Dentist`;
  const desc = data.meta_description || data.excerpt || undefined;
  const og = data.og_image || data.cover_url || undefined;
  return {
    title, description: desc,
    openGraph: { title, description: desc, images: og ? [{ url: og }] : undefined, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc, images: og ? [og] : undefined },
  };
}

function extractYouTubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, type, category, title, excerpt, content, content_html, cover_url, media_url, duration, created_at, updated_at, published, scheduled_for, views")
    .eq("slug", params.slug)
    .single();
  if (!post) notFound();

  const now = new Date();
  const scheduled = post.scheduled_for ? new Date(post.scheduled_for) : null;
  const visible = post.published || (scheduled && scheduled <= now);
  if (!visible) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, author_name, body, created_at, user_id, status")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const user = await getCurrentUser();
  const ytId = post.type === "video" ? extractYouTubeId(post.media_url) : null;
  const typeMeta = {
    article: { tag: "s-tag", emoji: "📝", label: "Article", color: "text-[#1E5C2E]", back: "/#articles", backLabel: "All articles" },
    podcast: { tag: "s-tag s-tag-pod", emoji: "🎙️", label: "Podcast", color: "text-[#6C3FC5]", back: "/#podcasts", backLabel: "All podcasts" },
    video:   { tag: "s-tag s-tag-vid", emoji: "🎬", label: "Video",   color: "text-[#B91C1C]", back: "/#videos", backLabel: "All videos" }
  }[post.type as "article" | "podcast" | "video"] || { tag: "s-tag", emoji: "📝", label: "Post", color: "text-[#1E5C2E]", back: "/#articles", backLabel: "All posts" };

  const html = renderPostContent({ content: post.content, contentHtml: post.content_html });

  // JSON-LD structured data for SEO
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kays-dental-clinic-blog.vercel.app";
  const ldJson = {
    "@context": "https://schema.org",
    "@type": post.type === "podcast" ? "PodcastEpisode" : post.type === "video" ? "VideoObject" : "Article",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.cover_url ? [post.cover_url] : undefined,
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": { "@type": "Person", "name": CLINIC.doctor, "url": `${base}/#about` },
    "publisher": {
      "@type": "Organization",
      "name": CLINIC.name,
      "logo": { "@type": "ImageObject", "url": CLINIC.logoUrl }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${base}/blog/${post.slug}` }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <ViewTracker postId={post.id} />
      {post.type === "article" && <ReadingProgress targetId="article-body" />}

      <div className="max-w-[1280px] mx-auto px-5 py-12 grid xl:grid-cols-[1fr,minmax(220px,260px)] gap-12">
        <article id="article-body">
          <Reveal direction="up">
            <Link href={typeMeta.back} className="text-sm text-[#7A9480] hover:text-[#2E7D42]">← {typeMeta.backLabel}</Link>
          </Reveal>

          <header className="mt-6 mb-8 max-w-3xl">
            <Reveal direction="up" delay={0.05}>
              <span className={typeMeta.tag}>{typeMeta.emoji} {typeMeta.label}{post.duration ? ` · ${post.duration}` : ""}</span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h1 className={`font-display text-4xl md:text-5xl font-bold mt-4 leading-tight ${typeMeta.color} dark:!text-[#D4EDD9]`}>{post.title}</h1>
            </Reveal>
            {post.excerpt && (
              <Reveal direction="up" delay={0.15}>
                <p className="mt-5 text-lg text-[#3D5444] dark:text-[#A5B8AB] italic font-display">{post.excerpt}</p>
              </Reveal>
            )}
            <Reveal direction="up" delay={0.2}>
              <p className="text-sm text-[#7A9480] mt-4">
                {format(new Date(post.created_at), "MMMM d, yyyy")} · {CLINIC.doctor}
                {typeof post.views === "number" && post.views > 0 && <span> · {post.views.toLocaleString()} views</span>}
              </p>
            </Reveal>
          </header>

          {post.cover_url && !ytId && (
            <Reveal direction="up" delay={0.25}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt="" className="w-full max-w-3xl rounded-2xl aspect-[16/9] object-cover mb-8" />
            </Reveal>
          )}

          {post.type === "podcast" && post.media_url && (
            <Reveal direction="up" delay={0.3}>
              <div className="bg-[#EDE9FE] dark:bg-[#6C3FC5]/15 border-2 border-[#6C3FC5]/30 rounded-2xl p-5 mb-8 max-w-3xl">
                <p className="text-[#6C3FC5] dark:text-[#C4B5FD] font-bold mb-3">🎙️ Listen to this episode</p>
                <audio controls src={post.media_url} className="w-full">Your browser does not support audio.</audio>
              </div>
            </Reveal>
          )}

          {post.type === "video" && ytId && (
            <Reveal direction="up" delay={0.3}>
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg max-w-3xl">
                <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
              </div>
            </Reveal>
          )}
          {post.type === "video" && post.media_url && !ytId && (
            <Reveal direction="up" delay={0.3}>
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg bg-black max-w-3xl">
                <video controls src={post.media_url} className="w-full h-full" />
              </div>
            </Reveal>
          )}

          <div className="prose-blog max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />

          <Reveal direction="up">
            <div className="mt-10 p-6 bg-[#EDF7EF] dark:bg-white/5 rounded-2xl border-2 border-[#4CAF6B]/40 text-center max-w-3xl">
              <p className="font-display text-lg text-[#1E5C2E] dark:text-[#D4EDD9] mb-3">Have a question for Dr. Esther?</p>
              <a href={waLink(`Hello Dr. Esther! I just read "${post.title}" and have a question.`)} target="_blank" rel="noreferrer" className="btn btn-wa">💬 Ask on WhatsApp</a>
            </div>
          </Reveal>

          {/* Related posts */}
          <RelatedPosts postId={post.id} category={post.category} type={post.type} />

          {/* Continue reading */}
          <ContinueReading currentSlug={post.slug} currentCreatedAt={post.created_at} />

          <hr className="my-14 border-[#D4EDD9] dark:border-white/10 max-w-3xl" />

          <div className="max-w-3xl">
            <CommentsSection
              postId={post.id}
              initialComments={comments || []}
              currentUser={user ? { id: user.id, email: user.email || "" } : null}
            />
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-6 self-start">
            {post.type === "article" && <TableOfContents targetId="article-body" />}
            <TrendingWidget />
          </div>
        </aside>
      </div>
    </>
  );
}
