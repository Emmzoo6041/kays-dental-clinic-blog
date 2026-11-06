import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

export async function RelatedPosts({
  postId, category, type,
}: { postId: string; category: string | null; type: string }) {
  const supabase = createServerSupabase();
  // Same category first; if not enough, fill with same-type posts
  const { data: same } = await supabase
    .from("posts")
    .select("id, slug, title, type, cover_url, excerpt, duration")
    .eq("published", true)
    .neq("id", postId)
    .eq("category", category || "general")
    .order("created_at", { ascending: false })
    .limit(3);

  let related = same || [];
  if (related.length < 3) {
    const { data: more } = await supabase
      .from("posts")
      .select("id, slug, title, type, cover_url, excerpt, duration")
      .eq("published", true)
      .neq("id", postId)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .limit(3 - related.length);
    related = [...related, ...(more || []).filter(p => !related.some(r => r.id === p.id))];
  }

  if (related.length === 0) return null;

  const emoji = (t: string) => (t === "podcast" ? "🎙" : t === "video" ? "🎬" : "📝");

  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="font-display text-2xl font-bold text-[#1B1F1C] dark:text-[#E7E8E5] mb-5">Related posts</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {related.slice(0, 3).map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}
                className="group block bg-white dark:bg-white/5 border-2 border-[#E2E3E0] dark:border-white/10 rounded-2xl overflow-hidden hover:border-[#8FA396] hover:-translate-y-1 transition">
            <div className="aspect-[16/10] bg-[#F2F2EF] dark:bg-white/5 overflow-hidden">
              {p.cover_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
              ) : (
                <div className="w-full h-full grid place-items-center text-4xl">{emoji(p.type)}</div>
              )}
            </div>
            <div className="p-4">
              <p className="text-[0.65rem] uppercase tracking-wider text-[#8A8E8A] font-bold mb-1">{emoji(p.type)} {p.duration || p.type}</p>
              <h3 className="font-display text-sm font-semibold text-[#1B1F1C] dark:text-[#E7E8E5] line-clamp-2 group-hover:underline">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
