import { notFound } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase-server";
import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createAdminSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!post) notFound();

  // Normalize fields the PostEditor expects so it can edit them
  const initial = {
    id: post.id,
    slug: post.slug,
    type: post.type ?? "article",
    category: post.category ?? "general",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    content_html: post.content_html ?? "",
    cover_url: post.cover_url ?? "",
    media_url: post.media_url ?? "",
    audio_url: post.audio_url ?? "",
    podcast_video_url: post.podcast_video_url ?? "",
    duration: post.duration ?? "",
    episode: post.episode ?? "",
    tags: post.tags ?? [],
    featured: !!post.featured,
    published: !!post.published,
    scheduled_for: post.scheduled_for
      ? new Date(post.scheduled_for).toISOString().slice(0, 16)
      : "",
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-6 text-[#1E5C2E] dark:text-[#D4EDD9]">Edit post</h2>
      <PostEditor initial={initial} />
    </div>
  );
}
