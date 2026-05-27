import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

export async function ContinueReading({ currentSlug, currentCreatedAt }: { currentSlug: string; currentCreatedAt: string }) {
  const supabase = createServerSupabase();
  // Get the post created just before this one
  const { data: prev } = await supabase
    .from("posts")
    .select("slug, title, type, excerpt, cover_url")
    .eq("published", true)
    .neq("slug", currentSlug)
    .lt("created_at", currentCreatedAt)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!prev) return null;
  const emoji = prev.type === "podcast" ? "🎙" : prev.type === "video" ? "🎬" : "📝";

  return (
    <Link href={`/blog/${prev.slug}`}
          className="mt-12 block max-w-3xl group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E5C2E] to-[#0f3d1a] text-white p-7 hover:shadow-2xl transition">
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#E6B800]/15 blur-2xl" />
      <div className="relative flex items-center gap-5 flex-wrap sm:flex-nowrap">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
          {prev.cover_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={prev.cover_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-3xl">{emoji}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FFD740] font-bold mb-1">Continue reading →</p>
          <h3 className="font-display text-xl font-bold line-clamp-1 group-hover:text-[#FFD740] transition">
            {prev.title}
          </h3>
          {prev.excerpt && <p className="text-sm text-white/65 line-clamp-1 mt-1">{prev.excerpt}</p>}
        </div>
      </div>
    </Link>
  );
}
