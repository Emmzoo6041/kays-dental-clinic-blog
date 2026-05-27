import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminSupabase, isAdmin } from "@/lib/supabase-server";
import { renderMarkdown } from "@/lib/markdown";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subject, body } = await req.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body required" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const { data: subs, error } = await supabase
    .from("subscribers")
    .select("email")
    .eq("confirmed", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subs || subs.length === 0) {
    return NextResponse.json({ error: "No subscribers yet." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.NEWSLETTER_FROM_EMAIL || "newsletter@example.com";
  const html = `
    <div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;color:#0f1d2a;line-height:1.6;font-size:16px;">
      <h1 style="font-family:Georgia,serif;color:#0d6b6b;">${escapeHtml(subject)}</h1>
      ${renderMarkdown(body)}
      <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;"/>
      <p style="font-size:12px;color:#888;">
        You're receiving this because you subscribed to Kay's Dental Clinic.
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">Reply or contact us</a> to unsubscribe.
      </p>
    </div>
  `;

  // Send in chunks of 50 (Resend's batch limit is 100 per request)
  const emails = subs.map((s) => s.email);
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += 50) {
    const chunk = emails.slice(i, i + 50);
    try {
      const { data, error } = await resend.batch.send(
        chunk.map((to) => ({ from, to, subject, html }))
      );
      if (error) {
        failed += chunk.length;
      } else {
        sent += data?.data?.length ?? chunk.length;
      }
    } catch {
      failed += chunk.length;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
