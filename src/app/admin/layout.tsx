import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminSupabase, isAdmin } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/login");

  // Pending comments badge
  const supabase = createAdminSupabase();
  const { count: pendingCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="font-display italic text-[#2E7D42] dark:text-[#4CAF6B]">Admin</p>
          <h1 className="font-display text-4xl font-semibold text-[#1E5C2E] dark:text-[#D4EDD9]">Dashboard</h1>
        </div>
        <Link href="/admin/new" className="btn btn-green !py-2 text-sm">+ New post</Link>
      </div>

      <nav className="flex flex-wrap gap-1 mb-8 bg-white dark:bg-white/5 border-2 border-[#C8DFCC] dark:border-white/10 rounded-2xl p-1.5">
        <AdminTab href="/admin" label="Posts" icon="📚" />
        <AdminTab href="/admin/comments" label="Comments" icon="💬" badge={pendingCount || 0} />
        <AdminTab href="/admin/newsletter" label="Newsletter" icon="✉" />
        <AdminTab href="/admin/analytics" label="Analytics" icon="📊" />
        <AdminTab href="/admin/featured" label="Featured" icon="⭐" />
      </nav>

      {children}
    </div>
  );
}

function AdminTab({ href, label, icon, badge }: { href: string; label: string; icon: string; badge?: number }) {
  return (
    <Link href={href}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3D5444] dark:text-[#C8DFCC] hover:bg-[#EDF7EF] dark:hover:bg-white/10 transition relative">
      <span>{icon}</span>
      <span>{label}</span>
      {!!badge && badge > 0 && (
        <span className="bg-[#B91C1C] text-white text-[0.65rem] font-bold rounded-full min-w-[18px] h-[18px] grid place-items-center px-1">
          {badge}
        </span>
      )}
    </Link>
  );
}
