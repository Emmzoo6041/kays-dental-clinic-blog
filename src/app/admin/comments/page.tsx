import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase-server";
import { format } from "date-fns";
import { CommentActions } from "@/components/CommentActions";

export const dynamic = "force-dynamic";

type FilterKey = "pending" | "approved" | "rejected" | "all";

export default async function CommentsModeration({
  searchParams,
}: {
  searchParams: { filter?: FilterKey };
}) {
  const filter = searchParams.filter || "pending";
  const supabase = createAdminSupabase();

  let query = supabase
    .from("comments")
    .select("id, author_name, body, status, created_at, posts!inner(title, slug)")
    .order("created_at", { ascending: false });
  if (filter !== "all") query = query.eq("status", filter);

  const { data: comments } = await query;

  const counts = await Promise.all(
    (["pending", "approved", "rejected"] as const).map(async (s) => {
      const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", s);
      return [s, count ?? 0] as const;
    })
  );
  const countMap = Object.fromEntries(counts);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-display text-2xl font-semibold text-[#1B1F1C] dark:text-[#E7E8E5]">Comments</h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "pending",  label: "Pending",  cls: "bg-[#B5A67C] text-[#1B1F1C]" },
            { key: "approved", label: "Approved", cls: "bg-[#8FA396] text-white" },
            { key: "rejected", label: "Rejected", cls: "bg-[#8A8E8A] text-white" },
            { key: "all",      label: "All",      cls: "bg-[#555A56] text-white" },
          ].map(f => (
            <Link key={f.key} href={`/admin/comments?filter=${f.key}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${filter === f.key ? f.cls : "bg-white dark:bg-white/5 text-[#8A8E8A] border border-[#E2E3E0] dark:border-white/15"}`}>
              {f.label} {f.key !== "all" && `(${countMap[f.key] || 0})`}
            </Link>
          ))}
        </div>
      </div>

      {!comments || comments.length === 0 ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#E2E3E0] dark:border-white/10 p-12 text-center text-[#8A8E8A]">
          {filter === "pending" ? "No pending comments. You're all caught up! 🎉" : `No ${filter} comments.`}
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c: any) => (
            <li key={c.id} className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#E2E3E0] dark:border-white/10 p-5">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <p className="font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">{c.author_name}</p>
                  <p className="text-xs text-[#8A8E8A] mt-0.5">
                    {format(new Date(c.created_at), "MMM d, yyyy 'at' h:mm a")} ·{" "}
                    on <Link href={`/blog/${c.posts.slug}`} className="text-[#2B3D32] hover:underline">{c.posts.title}</Link>
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-[#555A56] dark:text-[#E2E3E0] whitespace-pre-wrap mb-4">{c.body}</p>
              <CommentActions id={c.id} status={c.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:  "bg-[#F3F0E8] text-[#7D6F4E] border-[#B5A67C]",
    approved: "bg-[#E7E8E5] text-[#1B1F1C] border-[#8FA396]",
    rejected: "bg-[#8A8E8A]/20 text-[#555A56] border-[#8A8E8A]",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}
