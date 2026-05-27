import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase-server";
import { format } from "date-fns";
import { DeletePostButton } from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";

const TYPE_BADGES: Record<string, { emoji: string; label: string; cls: string }> = {
  article: { emoji: "📝", label: "Article", cls: "s-tag" },
  podcast: { emoji: "🎙", label: "Podcast", cls: "s-tag s-tag-pod" },
  video:   { emoji: "🎬", label: "Video",   cls: "s-tag s-tag-vid" }
};

export default async function AdminPosts() {
  const supabase = createAdminSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, type, title, published, featured, views, scheduled_for, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#EDF7EF] dark:bg-white/5 text-[#1E5C2E] dark:text-[#D4EDD9] uppercase tracking-wider text-xs">
          <tr>
            <th className="p-4">Type</th>
            <th className="p-4">Title</th>
            <th className="p-4">Status</th>
            <th className="p-4">Views</th>
            <th className="p-4">Created</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(posts || []).map(p => {
            const t = TYPE_BADGES[p.type] || TYPE_BADGES.article;
            const isScheduled = p.scheduled_for && new Date(p.scheduled_for) > new Date();
            return (
              <tr key={p.id} className="border-t border-[#D4EDD9] dark:border-white/10">
                <td className="p-4"><span className={`${t.cls} !text-[0.65rem] !mb-0`}>{t.emoji} {t.label}</span></td>
                <td className="p-4 font-semibold">
                  {p.featured && <span className="text-[#E6B800] mr-1" title="Featured">⭐</span>}
                  {p.title}
                </td>
                <td className="p-4">
                  {p.published ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#4CAF6B] text-white text-xs font-bold">Published</span>
                  ) : isScheduled ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#E6B800] text-[#1E5C2E] text-xs font-bold">Scheduled</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#7A9480]/30 text-[#7A9480] text-xs font-bold">Draft</span>
                  )}
                </td>
                <td className="p-4 text-[#7A9480]">{(p.views || 0).toLocaleString()}</td>
                <td className="p-4 text-[#7A9480]">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                <td className="p-4 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/blog/${p.slug}`} className="text-[#7A9480] hover:underline">View</Link>
                  <Link href={`/admin/edit/${p.id}`} className="text-[#2E7D42] dark:text-[#4CAF6B] hover:underline font-semibold">Edit</Link>
                  <DeletePostButton id={p.id} />
                </td>
              </tr>
            );
          })}
          {(!posts || posts.length === 0) && (
            <tr><td colSpan={6} className="p-8 text-center text-[#7A9480]">
              No posts yet. <Link href="/admin/new" className="text-[#2E7D42] underline font-semibold">Write your first post →</Link>
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
