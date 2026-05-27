import { createAdminSupabase, isAdmin } from "@/lib/supabase-server";

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("subscribers").select("email, confirmed, created_at").order("created_at", { ascending: false });
  const rows = [["email", "confirmed", "created_at"], ...(data || []).map(s => [s.email, String(s.confirmed), s.created_at])];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
