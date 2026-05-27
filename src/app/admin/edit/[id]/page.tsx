import { notFound } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase-server";
import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: { id: string } }) {
  const supabase = createAdminSupabase();
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("slug, name").order("display_order"),
  ]);
  if (!post) notFound();
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-6 text-[#1E5C2E] dark:text-[#D4EDD9]">Edit post</h2>
      <PostEditor initial={post} categories={categories || []} />
    </div>
  );
}
