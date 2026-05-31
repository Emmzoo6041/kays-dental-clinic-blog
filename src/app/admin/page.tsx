import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase-server";
import { format, formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminSupabase();
  const now = new Date();
  const last7Start = new Date(now); last7Start.setDate(now.getDate() - 6);
  const prev7Start = new Date(now); prev7Start.setDate(now.getDate() - 13);
  const prev7End   = new Date(now); prev7End.setDate(now.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [
    { count: postCount },
    { count: subCount },
    { count: pendingComments },
    { count: draftCount },
    { count: scheduledCount },
    { data: last7Views },
    { data: prev7Views },
    { data: recentPosts },
    { data: recentComments },
    { data: topPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", false),
    supabase.from("posts").select("*", { count: "exact", head: true }).not("scheduled_for", "is", null).gt("scheduled_for", now.toISOString()),
    supabase.from("post_views").select("count, day").gte("day", fmt(last7Start)).lte("day", fmt(now)),
    supabase.from("post_views").select("count").gte("day", fmt(prev7Start)).lte("day", fmt(prev7End)),
    supabase.from("posts").select("id, slug, title, type, published, featured, views, scheduled_for, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("comments").select("id, author_name, body, status, created_at, posts!inner(title, slug)").order("created_at", { ascending: false }).limit(5),
    supabase.from("posts").select("id, slug, title, type, views").order("views", { ascending: false }).limit(5),
  ]);

  const last7Total = (last7Views || []).reduce((s: number, r: any) => s + (r.count || 0), 0);
  const prev7Total = (prev7Views || []).reduce((s: number, r: any) => s + (r.count || 0), 0);
  const trendPct = prev7Total === 0 ? null : Math.round(((last7Total - prev7Total) / prev7Total) * 100);

  const series: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const dStr = fmt(d);
    const total = (last7Views || []).filter((r: any) => r.day === dStr).reduce((s: number, r: any) => s + r.count, 0);
    series.push(total);
  }
  const maxSeries = Math.max(...series, 1);

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[#7A9480] font-bold">Overview</p>
          <h1 className="font-display text-3xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-1">Welcome back, Dr. Esther.</h1>
          <p className="text-sm text-[#7A9480] mt-1">Here is what is happening on your blog today, {format(now, "EEEE MMMM d")}.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/new" className="bg-[#1E5C2E] hover:bg-[#2E7D42] text-white text-sm font-semibold px-4 py-2 rounded-lg transition">+ New post</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Views this week"        value={last7Total.toLocaleString()} trend={trendPct} accent="#2E7D42" footer={<Sparkline series={series} max={maxSeries} />} />
        <StatCard label="Published posts"        value={(postCount ?? 0).toString()}       accent="#6C3FC5" footer={<MicroStat label={`${draftCount ?? 0} drafts · ${scheduledCount ?? 0} scheduled`} />} />
        <StatCard label="Comments pending"       value={(pendingComments ?? 0).toString()}  accent="#B91C1C" footer={(pendingComments ?? 0) > 0 ? <Link href="/admin/comments?filter=pending" className="text-[0.75rem] font-semibold text-[#B91C1C] hover:underline">Review now →</Link> : <MicroStat label="All caught up ✓" />} />
        <StatCard label="Newsletter subscribers" value={(subCount ?? 0).toString()}         accent="#E6B800" footer={<MicroStat label="Export available" />} />
      </div>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-5">
        <Card>
          <CardHeader title="Recent comments" link={{ href: "/admin/comments", label: "View all" }} />
          {(!recentComments || recentComments.length === 0) ? (
            <Empty>No comments yet.</Empty>
          ) : (
            <ul className="divide-y divide-[#F0F4F0] dark:divide-white/5">
              {recentComments.map((c: any) => (
                <li key={c.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold text-[#1E5C2E] dark:text-[#D4EDD9]">{c.author_name}</span>
                        <span className="text-[#7A9480]"> on </span>
                        <Link href={`/blog/${c.posts.slug}`} className="text-[#2E7D42] hover:underline">{c.posts.title}</Link>
                      </p>
                      <p className="text-[0.82rem] text-[#3D5444] dark:text-[#C8DFCC] line-clamp-1 mt-0.5">{c.body}</p>
                    </div>
                    <StatusPill status={c.status} />
                  </div>
                  <p className="text-[0.7rem] text-[#7A9480] mt-1">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Top posts" link={{ href: "/admin/analytics", label: "Full analytics" }} />
          {(!topPosts || topPosts.length === 0 || (topPosts || []).every((p: any) => !p.views)) ? (
            <Empty>No view data yet.</Empty>
          ) : (
            <ol className="space-y-3">
              {topPosts.map((p: any, i: number) => (
                <li key={p.id} className="flex items-baseline gap-3">
                  <span className="font-display text-lg font-bold text-[#E6B800] w-5 leading-none">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/blog/${p.slug}`} className="text-sm font-medium text-[#1E5C2E] dark:text-[#D4EDD9] hover:text-[#2E7D42] line-clamp-1">{p.title}</Link>
                    <p className="text-[0.7rem] text-[#7A9480] mt-0.5">{typeEmoji(p.type)} {p.type} · {(p.views || 0).toLocaleString()} views</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent posts" link={{ href: "/admin/posts", label: "View all posts" }} />
        {(!recentPosts || recentPosts.length === 0) ? (
          <Empty>No posts yet. <Link href="/admin/new" className="text-[#2E7D42] underline font-semibold">Write your first post →</Link></Empty>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead className="text-[0.66rem] uppercase tracking-wider text-[#7A9480] border-b border-[#F0F4F0] dark:border-white/5">
                <tr>
                  <th className="text-left font-semibold px-5 py-2">Title</th>
                  <th className="text-left font-semibold px-3 py-2 w-24">Type</th>
                  <th className="text-left font-semibold px-3 py-2 w-28">Status</th>
                  <th className="text-right font-semibold px-3 py-2 w-20">Views</th>
                  <th className="text-right font-semibold px-3 py-2 w-32">Date</th>
                  <th className="px-3 py-2 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F0] dark:divide-white/5">
                {recentPosts.map((p: any) => {
                  const isScheduled = p.scheduled_for && new Date(p.scheduled_for) > now;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAFBF9] dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-[#1E5C2E] dark:text-[#D4EDD9]">
                        {p.featured && <span className="text-[#E6B800] mr-1.5" title="Featured">★</span>}
                        <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
                      </td>
                      <td className="px-3 py-3 text-[#7A9480]">{typeEmoji(p.type)} {p.type}</td>
                      <td className="px-3 py-3">
                        {p.published ? <Pill color="green">Live</Pill> : isScheduled ? <Pill color="yellow">Scheduled</Pill> : <Pill color="grey">Draft</Pill>}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-[#3D5444] dark:text-[#C8DFCC]">{(p.views || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-[#7A9480] text-xs whitespace-nowrap">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                      <td className="px-3 py-3 text-right"><Link href={`/admin/edit/${p.id}`} className="text-xs font-semibold text-[#2E7D42] hover:underline">Edit</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, trend, accent, footer }: { label: string; value: string; trend?: number | null; accent: string; footer?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#0f2412] border border-[#E5EDE7] dark:border-white/10 rounded-xl p-4 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#7A9480] font-bold">{label}</p>
      <p className="font-display text-[1.85rem] font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-1 tabular-nums">{value}</p>
      {typeof trend === "number" && (
        <p className={`text-[0.72rem] font-semibold ${trend >= 0 ? "text-[#2E7D42]" : "text-[#B91C1C]"} mt-0.5`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last week
        </p>
      )}
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}

function Sparkline({ series, max }: { series: number[]; max: number }) {
  if (max === 0) return <MicroStat label="No data yet" />;
  const W = 100, H = 24;
  const step = W / Math.max(series.length - 1, 1);
  const pts = series.map((v, i) => `${i * step},${H - (v / max) * H}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-6">
      <polyline fill="none" stroke="#2E7D42" strokeWidth="1.5" points={pts} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MicroStat({ label }: { label: string }) {
  return <p className="text-[0.72rem] text-[#7A9480] truncate">{label}</p>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-[#0f2412] border border-[#E5EDE7] dark:border-white/10 rounded-xl p-5">{children}</div>;
}

function CardHeader({ title, link }: { title: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="font-display text-base font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">{title}</h2>
      {link && <Link href={link.href} className="text-xs font-semibold text-[#2E7D42] hover:underline">{link.label} →</Link>}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#7A9480] py-4 text-center">{children}</p>;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:  "bg-[#FFF3B0] text-[#B8860B]",
    approved: "bg-[#D4EDD9] text-[#1E5C2E]",
    rejected: "bg-[#F0F0F0] text-[#7A9480]",
  };
  return <span className={`px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider ${map[status] || map.pending}`}>{status}</span>;
}

function Pill({ color, children }: { color: "green" | "yellow" | "grey"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    green:  "bg-[#D4EDD9] text-[#1E5C2E]",
    yellow: "bg-[#FFF3B0] text-[#B8860B]",
    grey:   "bg-[#F0F0F0] text-[#7A9480]",
  };
  return <span className={`px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider ${map[color]}`}>{children}</span>;
}

function typeEmoji(t: string) { return t === "podcast" ? "🎙" : t === "video" ? "🎬" : "📝"; }
