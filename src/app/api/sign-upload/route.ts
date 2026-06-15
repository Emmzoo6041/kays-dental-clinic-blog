import { NextResponse } from "next/server";
import { isAdmin, createAdminSupabase } from "@/lib/supabase-server";

/**
 * Creates a one-time signed upload URL for the public-images bucket.
 *
 * The browser then uploads the file directly to Supabase using this URL,
 * bypassing Vercel's 4.5MB function body limit. The signed URL is valid
 * for ~2 hours and can only be used once.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const filename = body.filename || "upload.bin";
  // Sanitize: lowercase, alnum + dot + hyphen only
  const cleanExt = (filename.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
  const cleanBase = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 60) || "media";

  const path = `media/${Date.now()}-${cleanBase}.${cleanExt}`;

  const supabase = createAdminSupabase();
  const { data, error } = await supabase.storage
    .from("public-images")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("public-images")
    .getPublicUrl(path);

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: publicUrlData.publicUrl,
  });
}
