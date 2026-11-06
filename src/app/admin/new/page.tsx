import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-6 text-[#1B1F1C] dark:text-[#E7E8E5]">Write a new post</h2>
      <PostEditor />
    </div>
  );
}
