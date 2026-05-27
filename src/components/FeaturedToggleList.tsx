"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string; title: string; type: string;
  featured: boolean; cover_url: string | null; created_at: string;
};

export function FeaturedToggleList({ posts: initial }: { posts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(p: Post) {
    setBusy(p.id);
    const res = await fetch(`/api/posts/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, featured: !p.featured }),
    });
    setBusy(null);
    if (res.ok) {
      setPosts((arr) => arr.map((x) => (x.id === p.id ? { ...x, featured: !p.featured } : x)));
      router.refresh();
    }
  }

  if (posts.length === 0) {
    return <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#C8DFCC] dark:border-white/10 p-12 text-center text-[#7A9480]">No published posts yet.</div>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li key={p.id}
            className={`bg-white dark:bg-white/5 rounded-2xl border-2 p-4 flex items-center gap-4 ${p.featured ? "border-[#E6B800]" : "border-[#C8DFCC] dark:border-white/10"}`}>
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EDF7EF] flex-shrink-0 grid place-items-center">
            {p.cover_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{p.type === "podcast" ? "🎙" : p.type === "video" ? "🎬" : "📝"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] truncate">
              {p.featured && <span className="text-[#E6B800] mr-1">⭐</span>}
              {p.title}
            </p>
            <p className="text-xs text-[#7A9480] mt-0.5">{p.type}</p>
          </div>
          <button onClick={() => toggle(p)} disabled={busy === p.id}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap disabled:opacity-50 ${
                    p.featured ? "bg-[#E6B800] text-[#1E5C2E] hover:bg-[#FFD740]" : "bg-[#EDF7EF] text-[#1E5C2E] hover:bg-[#D4EDD9] dark:bg-white/10 dark:text-[#D4EDD9]"
                  }`}>
            {busy === p.id ? "…" : p.featured ? "★ Unfeature" : "☆ Feature"}
          </button>
        </li>
      ))}
    </ul>
  );
}
