import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

export async function TrendingWidget() {
  const supabase = createServerSupabase();
  // Sum views in the last 7 days per post
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 6);
  const sinceStr = sinceDate.toISOString().slice(0, 10);

  const { data: views } = await supabase
    .from("post_views")
    .select("post_id, count")
    .gte("day", sinceStr);

  const byPost: Record<string, number> = {};
  for (const v of views || []) {
    byPost[v.post_id] = (byPost[v.post_id] || 0) + (v.count || 0);
  }
  const topIds = Object.entries(byPost).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);

  if (topIds.length === 0) {
    // Fallback: top by all-time views
    const { data: fallback } = await supabase
      .from("posts").select("id, slug, title, type, views")
      .eq("published", true).order("views", { ascending: false }).limit(3);
    if (!fallback || fallback.length === 0) return null;
    return <TrendingList posts={fallback.map(p => ({ ...p, weekly: p.views || 0 }))} label="Most read" />;
  }

  const { data: posts } = await supabase
    .from("posts").select("id, slug, title, type")
    .in("id", topIds);

  const ordered = topIds
    .map(id => posts?.find(p => p.id === id))
    .filter(Boolean)
    .map((p: any) => ({ ...p, weekly: byPost[p.id] }));

  return <TrendingList posts={ordered} label="Trending this week" />;
}

function TrendingList({ posts, label }: { posts: { id: string; slug: string; title: string; type: string; weekly: number }[]; label: string }) {
  return (
    <aside className="bg-white dark:bg-white/5 border-2 border-[#E2E3E0] dark:border-white/10 rounded-2xl p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#8A8E8A] font-bold mb-3">🔥 {label}</p>
      <ol className="space-y-3">
        {posts.map((p, i) => (
          <li key={p.id}>
            <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
              <span className="font-display text-2xl font-bold text-[#B5A67C] leading-none flex-shrink-0">{i + 1}</span>
              <span>
                <span className="text-[0.65rem] uppercase tracking-wider text-[#8A8E8A] font-bold">
                  {p.type === "podcast" ? "🎙 Podcast" : p.type === "video" ? "🎬 Video" : "📝 Article"}
                </span>
                <p className="font-display text-sm font-semibold text-[#1B1F1C] dark:text-[#E7E8E5] group-hover:text-[#2B3D32] line-clamp-2">
                  {p.title}
                </p>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
