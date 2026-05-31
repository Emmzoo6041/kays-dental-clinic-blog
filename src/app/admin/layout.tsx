import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminSupabase, isAdmin, getCurrentUser } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/login");

  const supabase = createAdminSupabase();
  const user = await getCurrentUser();
  const { count: pendingCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="min-h-screen bg-[#FAFBF9] dark:bg-[#0a1a0b] -mt-[72px] pt-[72px]">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-[240px] border-r border-[#E5EDE7] dark:border-white/10 bg-white dark:bg-[#0f2412] min-h-[calc(100vh-72px)] sticky top-[72px]">
          <div className="px-5 pt-6 pb-3">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#7A9480] font-bold">Admin</p>
            <p className="text-[0.95rem] font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-0.5 truncate">{user?.email}</p>
          </div>
          <nav className="flex flex-col gap-0.5 px-3 pb-3">
            <SidebarLink href="/admin"             icon="◐" label="Dashboard" />
            <SidebarLink href="/admin/posts"       icon="≡" label="Posts" />
            <SidebarLink href="/admin/comments"    icon="◯" label="Comments" badge={pendingCount || 0} />
            <SidebarLink href="/admin/newsletter"  icon="✉" label="Newsletter" />
            <SidebarLink href="/admin/analytics"   icon="◢" label="Analytics" />
            <SidebarLink href="/admin/featured"    icon="★" label="Featured" />
          </nav>
          <div className="mt-auto px-3 pb-5 space-y-1.5">
            <Link href="/admin/new" className="flex items-center justify-center gap-2 w-full bg-[#1E5C2E] hover:bg-[#2E7D42] text-white text-sm font-semibold px-3 py-2.5 rounded-lg transition">
              <span className="text-base">+</span> New post
            </Link>
            <Link href="/" className="flex items-center gap-2 text-xs text-[#7A9480] hover:text-[#1E5C2E] px-3 py-2 rounded-lg hover:bg-[#F0F4F0] dark:hover:bg-white/5">← Back to site</Link>
            <SignOutButton variant="sidebar" />
          </div>
        </aside>

        <div className="lg:hidden w-full sticky top-[72px] z-30 bg-white dark:bg-[#0f2412] border-b border-[#E5EDE7] dark:border-white/10 px-3 py-2 overflow-x-auto">
          <nav className="flex gap-1 whitespace-nowrap">
            <MobileTab href="/admin" label="Dashboard" />
            <MobileTab href="/admin/posts" label="Posts" />
            <MobileTab href="/admin/comments" label="Comments" badge={pendingCount || 0} />
            <MobileTab href="/admin/newsletter" label="Newsletter" />
            <MobileTab href="/admin/analytics" label="Analytics" />
            <MobileTab href="/admin/featured" label="Featured" />
          </nav>
        </div>

        <main className="flex-1 min-w-0 px-5 lg:px-10 py-8 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: number }) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#3D5444] dark:text-[#C8DFCC] hover:bg-[#F0F4F0] dark:hover:bg-white/5 hover:text-[#1E5C2E] dark:hover:text-white transition">
      <span className="w-5 text-center text-[#7A9480] group-hover:text-[#2E7D42] text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      {!!badge && badge > 0 && (
        <span className="bg-[#B91C1C] text-white text-[0.62rem] font-bold rounded-full min-w-[18px] h-[18px] grid place-items-center px-1">{badge}</span>
      )}
    </Link>
  );
}

function MobileTab({ href, label, badge }: { href: string; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#3D5444] dark:text-[#C8DFCC] hover:bg-[#EDF7EF] dark:hover:bg-white/10">
      {label}
      {!!badge && badge > 0 && (
        <span className="bg-[#B91C1C] text-white text-[0.6rem] font-bold rounded-full min-w-[16px] h-[16px] grid place-items-center px-1">{badge}</span>
      )}
    </Link>
  );
}
