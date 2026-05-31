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
    const d = new Date(now); d.setDate(now.
