import { createAdminSupabase } from "@/lib/supabase-server";
import { NewsletterComposer } from "@/components/NewsletterComposer";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function NewsletterAdmin() {
  const supabase = createAdminSupabase();
  const { count } = await supabase.from("subscribers").select("*", { count: "exact", head: true });
  const { data: latest } = await supabase
    .from("subscribers").select("email, created_at")
    .order("created_at", { ascending: false }).limit(50);

  return (
    <div className="grid lg:grid-cols-[1fr,360px] gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold mb-2 text-[#1E5C2E] dark:text-[#D4EDD9]">Send the newsletter</h2>
        <p className="text-[#7A9480] mb-6">Sends a real email to every confirmed subscriber via Resend.</p>
        <NewsletterComposer />
      </div>

      <aside className="bg-white dark:bg-white/5 border-2 border-[#C8DFCC] dark:border-white/10 rounded-2xl p-6 h-fit">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#7A9480]">Subscribers</p>
            <p className="font-display text-4xl font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] mt-1">{count ?? 0}</p>
          </div>
          {(count ?? 0) > 0 && (
            <a href="/api/subscribers/export" download
               className="btn btn-outline !py-2 !px-3 text-xs">↓ CSV</a>
          )}
        </div>
        <p className="text-xs text-[#7A9480] mb-2">Latest 50:</p>
        <ul className="text-sm space-y-1.5 max-h-[400px] overflow-y-auto pr-2">
          {(latest || []).map((s) => (
            <li key={s.email} className="text-[#3D5444] dark:text-[#C8DFCC] flex justify-between items-baseline gap-2">
              <span className="truncate" title={s.email}>{s.email}</span>
              <span className="text-[0.65rem] text-[#7A9480] whitespace-nowrap">{format(new Date(s.created_at), "MMM d")}</span>
            </li>
          ))}
          {(!latest || latest.length === 0) && <li className="text-[#7A9480]">No one yet.</li>}
        </ul>
      </aside>
    </div>
  );
}
