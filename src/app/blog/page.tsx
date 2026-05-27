import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { format } from "date-fns";

export const revalidate = 60;

export default async function BlogIndex() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_url, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="font-display italic text-teal mb-3">The blog</p>
      <h1 className="font-display text-5xl font-semibold mb-10">All posts</h1>

      {!posts || posts.length === 0 ? (
        <p className="text-ink/60">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/blog/${p.slug}`}
                className="grid md:grid-cols-[160px,1fr] gap-6 py-7 group"
              >
                <div className="aspect-[16/10] bg-teal-light/30 rounded-lg overflow-hidden">
                  {p.cover_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-3xl">🦷</div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/50">
                    {format(new Date(p.created_at), "MMM d, yyyy")}
                  </p>
                  <h2 className="font-display text-2xl mt-1 group-hover:text-teal">
                    {p.title}
                  </h2>
                  {p.excerpt && <p className="mt-2 text-ink/70">{p.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
