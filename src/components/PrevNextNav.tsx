import Link from "next/link";

type Neighbor = {
  slug: string;
  title: string;
  type: string;
} | null;

function typeIcon(t: string) {
  return t === "podcast" ? "🎙" : t === "video" ? "🎬" : "📝";
}

export function PrevNextNav({ prev, next }: { prev: Neighbor; next: Neighbor }) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-[#E7E8E5] dark:border-white/10 grid sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group block p-5 rounded-2xl border-2 border-[#E7E8E5] dark:border-white/10 hover:border-[#2B3D32] dark:hover:border-[#8FA396] hover:bg-[#F8F8F6] dark:hover:bg-white/[0.03] transition"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#8A8E8A] font-bold mb-1.5">
            ← Previous post
          </p>
          <p className="font-display text-base font-semibold text-[#1B1F1C] dark:text-[#E7E8E5] leading-snug line-clamp-2">
            {prev.title}
          </p>
          <p className="text-xs text-[#8A8E8A] mt-1.5">
            {typeIcon(prev.type)} {prev.type}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group block p-5 rounded-2xl border-2 border-[#E7E8E5] dark:border-white/10 hover:border-[#2B3D32] dark:hover:border-[#8FA396] hover:bg-[#F8F8F6] dark:hover:bg-white/[0.03] transition sm:text-right"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#8A8E8A] font-bold mb-1.5">
            Next post →
          </p>
          <p className="font-display text-base font-semibold text-[#1B1F1C] dark:text-[#E7E8E5] leading-snug line-clamp-2">
            {next.title}
          </p>
          <p className="text-xs text-[#8A8E8A] mt-1.5">
            {typeIcon(next.type)} {next.type}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
