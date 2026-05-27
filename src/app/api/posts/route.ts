import { NextResponse } from "next/server";
import { createAdminSupabase, isAdmin, getCurrentUser } from "@/lib/supabase-server";
import slugify from "slugify";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getCurrentUser();
  const body = await req.json();
  if (!body.title || (!body.content && !body.content_html)) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  }

  const baseSlug = slugify(body.title, { lower: true, strict: true }).slice(0, 80) || "post";
  const supabase = createAdminSupabase();
  let slug = baseSlug, n = 1;
  while (true) {
    const { data } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const { data, error } = await supabase.from("posts").insert({
    slug,
    type: body.type || "article",
    category: body.category || "general",
    title: body.title,
    excerpt: body.excerpt || null,
    content: body.content || "",
    content_html: body.content_html || null,
    cover_url: body.cover_url || null,
    media_url: body.media_url || null,
    duration: body.duration || null,
    episode: body.episode || null,
    tags: body.tags || [],
    published: !!body.published,
    featured: !!body.featured,
    scheduled_for: body.scheduled_for || null,
    meta_title: body.meta_title || null,
    meta_description: body.meta_description || null,
    og_image: body.og_image || null,
    author_email: user!.email!,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
