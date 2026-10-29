import Link from "next/link";

/**
 * Homepage showcase layouts — one distinct layout per content type:
 *  - Articles: editorial lead story + numbered "more reads" list
 *  - Podcasts: latest-episode player panel + episode tracklist
 *  - Videos:   cinematic feature banner + thumbnail grid
 */

type Post = {
  id: string; slug: string; type?: string | null; category?: string | null;
  title: string; excerpt?: string | null; cover_url?: string | null;
  media_url?: string | null; duration?: string | null; episode?: string | null;
  featured?: boolean | null;
  created_at: string;
};

function cap(s: string | null | undefined) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
function dateLabel(d: string) { return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }); }

function youtubeThumb(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

function Empty({ label }: { label: string }) {
  return <p className="text-[#7A9480] text-center py-12">No {label} published yet.</p>;
}

/* ------------------------------------------------------------------ */
/* ARTICLES                                                            */
/* ------------------------------------------------------------------ */

export function ArticlesShowcase({ articles }: { articles: Post[] }) {
  if (articles.length === 0) return <Empty label="articles" />;
  const [lead, ...rest] = articles;
  const more = rest.slice(0, 4);

  return (
    <div className={`grid grid-cols-1 gap-8 lg:gap-12 ${more.length ? "lg:grid-cols-[1.35fr,1fr]" : ""}`}>
      {/* Lead story */}
      <Link href={`/blog/${lead.slug}`} className="group block">
        <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden bg-[#EDF7EF] dark:bg-white/5">
          {lead.cover_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={lead.cover_url} alt={lead.title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          ) : (
            <div className="w-full h-full grid place-items-center text-7xl">📝</div>
          )}
          {lead.category && (
            <span className="absolute top-4 left-4 bg-white/95 text-[#1E5C2E] text-[0.66rem] font-extrabold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full">
              {cap(lead.category)}
            </span>
          )}
        </div>
        <div className="mt-5">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#2E7D42] dark:text-[#4CAF6B]">
            {lead.featured ? "⭐ Featured · " : "Latest · "}{dateLabel(lead.created_at)}
            {lead.duration && <> · {lead.duration}</>}
          </div>
          <h3 className="font-display text-2xl sm:text-[2rem] font-bold leading-[1.18] text-[#1E5C2E] dark:text-[#D4EDD9] mt-2 group-hover:text-[#2E7D42] transition-colors">
            {lead.title}
          </h3>
          {lead.excerpt && (
            <p className="text-[#3D5444] dark:text-[#A5B8AB] leading-[1.7] mt-3 line-clamp-3 max-w-2xl">{lead.excerpt}</p>
          )}
          <span className="inline-block mt-4 text-sm font-bold text-[#2E7D42] dark:text-[#4CAF6B] border-b-2 border-[#2E7D42]/30 group-hover:border-[#2E7D42] transition-colors">
            Read the article →
          </span>
        </div>
      </Link>

      {/* More reads */}
      {more.length > 0 && (
        <div>
          <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#7A9480] pb-3 border-b-2 border-[#1E5C2E] dark:border-[#4CAF6B]">
            More reads
          </div>
          <ol>
            {more.map((a, i) => (
              <li key={a.id} className="border-b border-[#D4EDD9] dark:border-white/10">
                <Link href={`/blog/${a.slug}`} className="group flex gap-4 py-5">
                  <span className="font-display text-2xl font-bold text-[#C8DFCC] dark:text-white/20 leading-none w-7 flex-shrink-0 pt-1">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    {a.category && (
                      <div className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#2E7D42] dark:text-[#4CAF6B] mb-1">
                        {cap(a.category)}
                      </div>
                    )}
                    <h4 className="font-display text-[1.05rem] font-semibold leading-[1.3] text-[#1A2E1E] dark:text-[#D4EDD9] line-clamp-2 group-hover:text-[#2E7D42] transition-colors">
                      {a.title}
                    </h4>
                    <div className="text-[0.72rem] text-[#7A9480] mt-1.5">
                      {dateLabel(a.created_at)}{a.duration && <> · {a.duration}</>}
                    </div>
                  </div>
                  <div className="w-24 h-20 sm:w-28 sm:h-[86px] rounded-xl overflow-hidden flex-shrink-0 bg-[#EDF7EF] dark:bg-white/5">
                    {a.cover_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={a.cover_url} alt="" loading="lazy"
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-2xl">📝</div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PODCASTS                                                            */
/* ------------------------------------------------------------------ */

function PodcastArt({ p, className = "" }: { p: Post; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#6C3FC5] to-[#3b1a80] ${className}`}>
      {p.cover_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={p.cover_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-[2.2em]">🎙️</div>
      )}
    </div>
  );
}

function PlayDot({ size = 40 }: { size?: number }) {
  return (
    <span
      className="rounded-full bg-[#FFD740] text-[#2a1260] grid place-items-center flex-shrink-0 transition-transform group-hover:scale-110"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.36} height={size * 0.36} viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
    </span>
  );
}

export function PodcastsShowcase({ podcasts }: { podcasts: Post[] }) {
  if (podcasts.length === 0) return <Empty label="podcasts" />;
  const [latest, ...older] = podcasts;
  const list = older.slice(0, 5);

  return (
    <div className="rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2a1260] via-[#3b1a80] to-[#4c1d95] text-white shadow-[0_30px_80px_-30px_rgba(76,29,149,0.6)]">
      <div className={`grid grid-cols-1 ${list.length ? "lg:grid-cols-[0.95fr,1.05fr]" : ""}`}>
        {/* Latest episode */}
        <Link href={`/blog/${latest.slug}`} className="group min-w-0 p-7 sm:p-10 flex flex-col sm:flex-row lg:flex-col gap-6 lg:border-r border-white/10">
          <PodcastArt p={latest} className="w-full sm:w-52 lg:w-full aspect-square sm:aspect-square lg:aspect-[16/10] rounded-2xl text-5xl shadow-2xl flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#FFD740]">
              New episode{latest.episode ? ` · ${latest.episode}` : ""}
            </span>
            <h3 className="font-display text-2xl sm:text-[1.75rem] font-bold leading-[1.2] mt-2">{latest.title}</h3>
            {latest.excerpt && <p className="text-white/75 leading-[1.65] mt-3 line-clamp-3">{latest.excerpt}</p>}
            <div className="flex items-center gap-4 mt-6">
              <PlayDot size={52} />
              <div className="text-sm">
                <div className="font-bold">Play episode</div>
                <div className="text-white/60 text-xs">
                  {latest.duration ? `${latest.duration} · ` : ""}{dateLabel(latest.created_at)}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Episode list */}
        {list.length > 0 && (
          <div className="min-w-0 p-4 sm:p-6 lg:p-8 bg-black/15">
            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/55 px-3 pb-3">
              All episodes
            </div>
            <ul className="space-y-1">
              {list.map((p, i) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`} className="group flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-white/10 transition-colors">
                    <span className="w-6 text-center text-sm font-bold text-white/40 group-hover:hidden">{i + 2}</span>
                    <span className="w-6 hidden group-hover:grid place-items-center text-[#FFD740]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
                    </span>
                    <PodcastArt p={p} className="w-12 h-12 rounded-lg text-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[0.95rem] leading-snug line-clamp-2">{p.title}</div>
                      <div className="text-xs text-white/55 mt-1 truncate">
                        {p.episode ? `${p.episode} · ` : ""}{dateLabel(p.created_at)}
                      </div>
                    </div>
                    {p.duration && <span className="text-xs text-white/60 font-semibold tabular-nums">{p.duration}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VIDEOS                                                              */
/* ------------------------------------------------------------------ */

function videoThumb(v: Post) {
  return v.cover_url || youtubeThumb(v.media_url);
}

function PlayButton({ big = false }: { big?: boolean }) {
  const s = big ? 76 : 50;
  return (
    <span
      className="rounded-full bg-white/90 text-[#B91C1C] grid place-items-center shadow-xl transition-all group-hover:scale-110 group-hover:bg-white"
      style={{ width: s, height: s }}
    >
      <svg width={s * 0.38} height={s * 0.38} viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: s * 0.05 }}>
        <path d="M7 4.5v15l13-7.5z" />
      </svg>
    </span>
  );
}

export function VideosShowcase({ videos }: { videos: Post[] }) {
  if (videos.length === 0) return <Empty label="videos" />;
  const [feature, ...rest] = videos;
  const grid = rest.slice(0, 6);
  const featureThumb = videoThumb(feature);

  return (
    <div>
      {/* Feature banner */}
      <Link href={`/blog/${feature.slug}`} className="group relative block aspect-video md:aspect-[21/9] rounded-[28px] overflow-hidden bg-[#1a0606]">
        {featureThumb && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={featureThumb} alt={feature.title}
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 grid place-items-center"><PlayButton big /></div>
        <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-8 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#B91C1C] text-white text-[0.62rem] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full">
              ▶ Latest video
            </span>
            <h3 className="font-display text-white text-xl sm:text-3xl font-bold leading-[1.2] mt-3 line-clamp-2">{feature.title}</h3>
            {feature.excerpt && <p className="hidden sm:block text-white/75 mt-2 line-clamp-1">{feature.excerpt}</p>}
          </div>
          {feature.duration && (
            <span className="bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-md tabular-nums flex-shrink-0">{feature.duration}</span>
          )}
        </div>
      </Link>

      {/* Thumbnail grid */}
      {grid.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-8">
          {grid.map((v) => {
            const thumb = videoThumb(v);
            return (
              <Link key={v.id} href={`/blog/${v.slug}`} className="group block">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1a0606]">
                  {thumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={thumb} alt={v.title} loading="lazy"
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-4xl">🎬</div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayButton />
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[0.68rem] font-bold px-2 py-0.5 rounded tabular-nums">
                      {v.duration}
                    </span>
                  )}
                </div>
                <h4 className="font-display text-[1.05rem] font-semibold leading-[1.3] text-[#1A2E1E] dark:text-[#D4EDD9] mt-3 line-clamp-2 group-hover:text-[#B91C1C] dark:group-hover:text-[#FCA5A5] transition-colors">
                  {v.title}
                </h4>
                <div className="text-[0.74rem] text-[#7A9480] mt-1">{dateLabel(v.created_at)}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
