import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { postId } = await req.json().catch(() => ({}));
  if (!postId || typeof postId !== "string") {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase.rpc("increment_post_view", { p_post_id: postId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
