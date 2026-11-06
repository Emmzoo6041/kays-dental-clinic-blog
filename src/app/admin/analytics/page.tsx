import { createAdminSupabase } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Analytics() {
  const supabase = createAdminSupabase();

  // Top posts by total views
  const { data: topPosts } = await supabase
    .from("posts")
    .select("id, slug, title, type, views, created_at")
    .order("views", { ascending: false })
    .limit(10);

  // Total views across all posts
  const totalViews = (topPosts || []).reduce((s, p) => s + (p.views || 0), 0);
  // Note: this is just the top 10's sum; for true total we'd query separately, but the top 10 captures almost all activity.

  // Views in the last 7 days vs the previous 7 days
  const today = new Date();
  const last7Start = new Date(today); last7Start.setDate(today.getDate() - 6);
  const prev7Start = new Date(today); prev7Start.setDate(today.getDate() - 13);
  const prev7End = new Date(today);   prev7End.setDate(today.getDate() - 7);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [{ data: last7 }, { data: prev7 }] = await Promise.all([
    supabase.from("post_views").select("count").gte("day", fmt(last7Start)).lte("day", fmt(today)),
    supabase.from("post_views").select("count").gte("day", fmt(prev7Start)).lte("day", fmt(prev7End)),
  ]);

  const last7Views = (last7 || []).reduce((s, r: any) => s + (r.count || 0), 0);
  const prev7Views = (prev7 || []).reduce((s, r: any) => s + (r.count || 0), 0);
  const delta = prev7Views === 0 ? null : Math.round(((last7Views - prev7Views) / prev7Views) * 100);

  // Total posts & subscribers
  const [{ count: postCount }, { count: subCount }, { count: pendingComments }] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-6 text-[#1B1F1C] dark:text-[#E7E8E5]">Analytics</h2>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Views (last 7 days)" value={last7Views.toLocaleString()} delta={delta} accent="#2B3D32" />
        <StatCard label="Total published posts" value={(postCount ?? 0).toString()} accent="#3F4441" />
        <StatCard label="Newsletter subscribers" value={(subCount ?? 0).toString()} accent="#B5A67C" />
        <StatCard label="Comments awaiting review" value={(pendingComments ?? 0).toString()} accent="#B91C1C" />
      </div>

      {/* Top posts */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#E2E3E0] dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7E8E5] dark:border-white/10 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">Top 10 posts by views</h3>
          <span className="text-xs text-[#8A8E8A]">All-time</span>
        </div>
        {(!topPosts || topPosts.length === 0) ? (
          <p className="p-8 text-center text-[#8A8E8A]">No view data yet. Once visitors read your posts, they'll appear here.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F2F2EF] dark:bg-white/5 text-[#8A8E8A] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Post</th>
                <th className="px-6 py-3 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((p: any, i) => (
                <tr key={p.id} className="border-t border-[#E7E8E5] dark:border-white/10">
                  <td className="px-6 py-3 text-[#8A8E8A] font-bold">{i + 1}</td>
                  <td className="px-6 py-3">
                    <Link href={`/blog/${p.slug}`} className="text-[#1B1F1C] dark:text-[#E7E8E5] hover:text-[#2B3D32] font-semibold">
                      {p.title}
                    </Link>
                    <span className="text-xs text-[#8A8E8A] ml-2">
                      {p.type === "podcast" ? "🎙" : p.type === "video" ? "🎬" : "📝"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-[#2B3D32]">{(p.views || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-[#8A8E8A] mt-5">
        Note: views are counted once per browser session. No cookies, no third-party tracking — just a count in your database.
      </p>
    </div>
  );
}

function StatCard({ label, value, delta, accent }: { label: string; value: string; delta?: number | null; accent: string }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#E2E3E0] dark:border-white/10 p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
      <p className="text-xs uppercase tracking-wider text-[#8A8E8A] font-bold mb-1">{label}</p>
      <p className="font-display text-3xl font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">{value}</p>
      {typeof delta === "number" && (
        <p className={`text-xs font-bold mt-1 ${delta >= 0 ? "text-[#2B3D32]" : "text-[#B91C1C]"}`}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs previous 7 days
        </p>
      )}
    </div>
  );
}
