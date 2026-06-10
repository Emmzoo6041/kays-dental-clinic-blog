import { NextResponse } from "next/server";
import { isAdmin, createAdminSupabase } from "@/lib/supabase-server";

// Accept common audio + small video formats. Video upload is allowed but
// we recommend YouTube links in the UI — this endpoint exists so it doesn't
// hard-error if someone drops a small clip.
const ALLOWED = new Set([
  // audio
  "audio/mpeg",        // .mp3
  "audio/mp4",         // .m4a
  "audio/x-m4a",       // .m4a (alt MIME)
  "audio/wav",         // .wav
  "audio/x-wav",       // .wav (alt MIME)
  "audio/ogg",         // .ogg
  "audio/webm",        // .webm
  "audio/aac",         // .aac
  // small video (we still encourage YouTube for big files)
  "video/mp4",
  "video/webm",
  "video/quicktime",   // .mov
]);

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max is ${Math.round(MAX_BYTES / 1024 / 1024)}MB. For larger videos, paste a YouTube URL instead.` },
      { status: 413 }
    );
  }

  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `File type "${file.type}" not allowed. Use .mp3, .m4a, .wav, .mp4, .mov, or paste a URL.` },
      { status: 415 }
    );
  }

  // Sanitize filename
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseSlug = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 60) || "media";

  const stamp = Date.now();
  const path = `media/${stamp}-${baseSlug}.${ext}`;

  const supabase = createAdminSupabase();
  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("public-images")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("public-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
