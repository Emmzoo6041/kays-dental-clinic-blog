import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase-server";
import { format } from "date-fns";
import { DeletePostButton } from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminAllPosts() {
  const supabase = createAdminSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, type, title, published, featured, views, scheduled_for, created_at")
    .order("created_at", { ascending: false });

  const now = new Date();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[#8A8E8A] font-bold">Content</p>
          <h1 className="font-display text-3xl font-bold text-[#1B1F1C] dark:text-[#E7E8E5] mt-1">All posts</h1>
          <p className="text-sm text-[#8A8E8A] mt-1">Articles, podcasts, and videos. {(posts?.length ?? 0)} total.</p>
        </div>
        <Link href="/admin/new" className="bg-[#1B1F1C] hover:bg-[#2B3D32] text-white text-sm font-semibold px-4 py-2 rounded-lg transition">+ New post</Link>
      </div>

      <div className="bg-white dark:bg-[#161917] border border-[#E8E8E6] dark:border-white/10 rounded-xl overflow-hidden">
        {(!posts || posts.length === 0) ? (
          <p className="text-sm text-[#8A8E8A] p-8 text-center">
            No posts yet. <Link href="/admin/new" className="text-[#2B3D32] underline font-semibold">Write your first post →</Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[0.66rem] uppercase tracking-wider text-[#8A8E8A] border-b border-[#F2F2F0] dark:border-white/5">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Title</th>
                  <th className="text-left font-semibold px-3 py-3 w-24">Type</th>
                  <th className="text-left font-semibold px-3 py-3 w-28">Status</th>
                  <th className="text-right font-semibold px-3 py-3 w-20">Views</th>
                  <th className="text-right font-semibold px-3 py-3 w-32">Date</th>
                  <th className="px-3 py-3 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F0] dark:divide-white/5">
                {posts.map((p) => {
                  const isScheduled = p.scheduled_for && new Date(p.scheduled_for) > now;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAFAF9] dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-[#1B1F1C] dark:text-[#E7E8E5]">
                        {p.featured && <span className="text-[#B5A67C] mr-1.5" title="Featured">★</span>}
                        <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
                      </td>
                      <td className="px-3 py-3 text-[#8A8E8A]">{p.type === "podcast" ? "🎙" : p.type === "video" ? "🎬" : "📝"} {p.type}</td>
                      <td className="px-3 py-3">
                        {p.published ? <Pill color="green">Live</Pill> : isScheduled ? <Pill color="yellow">Scheduled</Pill> : <Pill color="grey">Draft</Pill>}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-[#555A56] dark:text-[#E2E3E0]">{(p.views || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-[#8A8E8A] text-xs whitespace-nowrap">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                      <td className="px-3 py-3 text-right space-x-3 whitespace-nowrap">
                        <Link href={`/blog/${p.slug}`} className="text-xs text-[#8A8E8A] hover:text-[#2B3D32] hover:underline">View</Link>
                        <Link href={`/admin/edit/${p.id}`} className="text-xs font-semibold text-[#2B3D32] hover:underline">Edit</Link>
                        <DeletePostButton id={p.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ color, children }: { color: "green" | "yellow" | "grey"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    green:  "bg-[#E7E8E5] text-[#1B1F1C]",
    yellow: "bg-[#F3F0E8] text-[#7D6F4E]",
    grey:   "bg-[#F0F0F0] text-[#8A8E8A]",
  };
  return <span className={`px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider ${map[color]}`}>{children}</span>;
}
