import { NextResponse } from "next/server";
import { createAdminSupabase, isAdmin } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const supabase = createAdminSupabase();
  const { data, error } = await supabase.from("posts").update({
    type: body.type,
    category: body.category,
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
    updated_at: new Date().toISOString(),
  }).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("posts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
