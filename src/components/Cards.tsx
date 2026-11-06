import Link from "next/link";

function cap(s: string | null | undefined) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
function dateLabel(d: string) { return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }

type Post = {
  id: string; slug: string; type?: string | null; category?: string | null;
  title: string; excerpt?: string | null; cover_url?: string | null;
  media_url?: string | null; duration?: string | null; episode?: string | null;
  featured?: boolean | null;
  created_at: string;
};

export function ArticleCard({ a }: { a: Post }) {
  return (
    <Link href={`/blog/${a.slug}`}
          className="bg-[#F8F8F6] border-2 border-[#E2E3E0] rounded-[22px] overflow-hidden card-hover hover:border-[#8FA396] block group">
      <div className="h-[200px] overflow-hidden relative">
        {a.cover_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={a.cover_url} alt={a.title} loading="lazy"
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        ) : (
          <div className="w-full h-full grid place-items-center bg-[#F2F2EF] text-6xl">📝</div>
        )}
        {a.category && (
          <span className="absolute top-3 left-3 bg-[#2B3D32] text-white text-[0.65rem] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full">
            {cap(a.category)}
          </span>
        )}
      </div>
      <div className="px-5 pt-5 pb-6">
        <h3 className="font-display text-lg font-semibold leading-[1.3] text-[#1B1F1C] mb-2 line-clamp-2">
          {a.featured && <span className="text-[#B5A67C] mr-1" title="Featured">⭐</span>}
          {a.title}
        </h3>
        {a.excerpt && <p className="text-[0.86rem] text-[#555A56] leading-[1.65] mb-3 line-clamp-3">{a.excerpt}</p>}
        <div className="flex items-center gap-1.5 text-[0.73rem] text-[#8A8E8A] font-semibold">
          {a.duration && <><span>{a.duration}</span><span className="w-[3px] h-[3px] rounded-full bg-[#8A8E8A]" /></>}
          <span>{dateLabel(a.created_at)}</span>
          <span className="ml-auto text-[#2B3D32] font-bold">Read →</span>
        </div>
      </div>
    </Link>
  );
}

export function PodcastCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`}
          className="bg-white border-2 border-[#D8DAD7] rounded-[22px] overflow-hidden card-hover hover:border-[#3F4441] block group">
      <div className="h-[170px] relative overflow-hidden flex items-center justify-center"
           style={{ background: "linear-gradient(135deg, #3F4441 0%, #1b1f1c 100%)" }}>
        {p.cover_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.cover_url} alt={p.title} loading="lazy"
               className="absolute inset-0 w-full h-full object-cover opacity-[0.32]" />
        )}
        <div className="relative z-10 w-[66px] h-[66px] rounded-full bg-white/15 border-[2.5px] border-white/35 grid place-items-center text-3xl">🎙️</div>
        {p.episode && <span className="absolute top-3 left-3 bg-[#3F4441] text-white text-[0.63rem] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full">{p.episode}</span>}
      </div>
      <div className="px-5 pt-5 pb-6">
        <div className="font-display text-[1.1rem] font-semibold text-[#1B1F1C] mb-1.5 leading-[1.3] line-clamp-2">
          {p.featured && <span className="text-[#B5A67C] mr-1" title="Featured">⭐</span>}
          {p.title}
        </div>
        {p.excerpt && <div className="text-[0.83rem] text-[#555A56] leading-[1.6] mb-3 line-clamp-2">{p.excerpt}</div>}
        <div className="flex items-center gap-1.5 text-[0.72rem] text-[#8A8E8A] font-semibold">
          {p.duration && <><span>🕐 {p.duration}</span><span className="w-[3px] h-[3px] rounded-full bg-[#8A8E8A]" /></>}
          <span>{dateLabel(p.created_at)}</span>
          <span className="ml-auto text-[#3F4441] font-bold">Listen →</span>
        </div>
      </div>
    </Link>
  );
}

export function VideoCard({ v }: { v: Post }) {
  return (
    <Link href={`/blog/${v.slug}`}
          className="bg-[#F8F8F6] border-2 border-[#FCA5A5] rounded-[22px] overflow-hidden cursor-pointer card-hover hover:border-[#B91C1C] block group">
      <div className="h-[190px] relative overflow-hidden bg-[#1a0000]">
        {v.cover_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={v.cover_url} alt={v.title} loading="lazy"
               className="w-full h-full object-cover opacity-[0.88] transition-all duration-500 group-hover:scale-105 group-hover:opacity-95" />
        )}
        <div className="absolute inset-0 grid place-items-center z-[2]">
          <div className="w-[62px] h-[62px] rounded-full bg-[rgba(239,68,68,0.9)] grid place-items-center shadow-[0_4px_20px_rgba(185,28,28,0.5)] transition-all group-hover:scale-110 group-hover:bg-[#B91C1C]">
            <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "17px solid white", marginLeft: "4px" }} />
          </div>
        </div>
        {v.duration && <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[0.67rem] font-bold px-2 py-1 rounded">{v.duration}</div>}
        <div className="absolute top-2 left-2 bg-[#B91C1C] text-white text-[0.61rem] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full">▶ Video</div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <div className="font-display text-[1.05rem] font-semibold text-[#1B1F1C] mb-1.5 leading-[1.3] line-clamp-2">
          {v.featured && <span className="text-[#B5A67C] mr-1" title="Featured">⭐</span>}
          {v.title}
        </div>
        {v.excerpt && <div className="text-[0.83rem] text-[#555A56] leading-[1.6] mb-2 line-clamp-2">{v.excerpt}</div>}
        <div className="flex items-center gap-1.5 text-[0.72rem] text-[#8A8E8A] font-semibold">
          <span>{dateLabel(v.created_at)}</span>
          <span className="ml-auto text-[#B91C1C] font-bold">Watch →</span>
        </div>
      </div>
    </Link>
  );
}

export function ReviewCard({ r }: { r: { name: string; stars: number; role: string; text: string } }) {
  return (
    <div className="bg-white border-2 border-[#E7E8E5] rounded-[20px] p-7 card-hover h-full flex flex-col">
      <div className="text-[2.7rem] text-[#E7E8E5] leading-[0.9] mb-1" style={{ fontFamily: "Georgia, serif" }}>&ldquo;</div>
      <div className="text-[#B5A67C] text-sm tracking-[0.12em] mb-3">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
      <p className="font-display italic text-[0.97rem] text-[#1B1F1C] leading-[1.7] mb-4 flex-1 line-clamp-6">{r.text}</p>
      <div className="flex items-center gap-3 pt-3 border-t border-[#E7E8E5]">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1B1F1C] to-[#2B3D32] grid place-items-center text-white font-bold text-lg border-[2.5px] border-[#E7E8E5] flex-shrink-0">
          {r.name[0]}
        </div>
        <div>
          <div className="text-[0.86rem] font-bold text-[#1B1F1C]">{r.name}</div>
          <div className="text-[0.71rem] text-[#8A8E8A]">{r.role} {"⭐".repeat(r.stars)}</div>
        </div>
      </div>
    </div>
  );
}
