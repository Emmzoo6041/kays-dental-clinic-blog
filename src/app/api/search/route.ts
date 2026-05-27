import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const supabase = createServerSupabase();
  const pattern = `%${q.replace(/[%_]/g, "")}%`;

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, type, title, excerpt, cover_url, duration, created_at, tags")
    .eq("published", true)
    .or(`title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`)
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Light client-side ranking: title matches first, then excerpt, then content
  const lower = q.toLowerCase();
  const ranked = (data || [])
    .map((p) => {
      let score = 0;
      const t = (p.title || "").toLowerCase();
      const e = (p.excerpt || "").toLowerCase();
      if (t.includes(lower)) score += 10;
      if (t.startsWith(lower)) score += 5;
      if (e.includes(lower)) score += 3;
      if ((p.tags || []).some((tag: string) => tag.toLowerCase().includes(lower))) score += 4;
      return { ...p, _score: score };
    })
    .sort((a, b) => b._score - a._score);

  return NextResponse.json({ results: ranked });
}
