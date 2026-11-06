import { createAdminSupabase } from "@/lib/supabase-server";
import { FeaturedToggleList } from "@/components/FeaturedToggleList";

export const dynamic = "force-dynamic";

export default async function Featured() {
  const supabase = createAdminSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, type, featured, cover_url, created_at")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2 text-[#1B1F1C] dark:text-[#E7E8E5]">Featured content</h2>
      <p className="text-[#8A8E8A] mb-6">
        Pin posts here to highlight them. Featured posts show first on the homepage carousels with a yellow star.
      </p>
      <FeaturedToggleList posts={posts || []} />
    </div>
  );
}
