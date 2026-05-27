import { createServerSupabase } from "@/lib/supabase-server";
import { CLINIC } from "@/lib/clinic";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kays-dental-clinic-blog.vercel.app";
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  const staticUrls = [
    { url: "/", priority: 1.0 },
    { url: "/faq", priority: 0.7 },
    { url: "/search", priority: 0.5 },
  ];

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const s of staticUrls) {
    lines.push(`<url><loc>${base}${s.url}</loc><priority>${s.priority}</priority></url>`);
  }
  for (const p of posts || []) {
    lines.push(`<url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.updated_at}</lastmod><priority>0.8</priority></url>`);
  }
  lines.push('</urlset>');

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
