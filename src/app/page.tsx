import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { CLINIC, REVIEWS, waLink } from "@/lib/clinic";
import { ContactForm } from "@/components/ContactForm";
import { Marquee } from "@/components/Marquee";
import { ArticleCard, PodcastCard, VideoCard, ReviewCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { MagneticButton } from "@/components/MagneticButton";
import { MicIcon } from "@/components/MicIcon";
import { NewsletterSection } from "@/components/NewsletterSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const articles = (posts || []).filter((p) => p.type === "article");
  const podcasts = (posts || []).filter((p) => p.type === "podcast");
  const videos = (posts || []).filter((p) => p.type === "video");

  const wavBars = [12, 24, 36, 28, 18, 32, 24, 14, 28, 20, 36, 16];

  return (
    <>
      {/* HERO */}
      <section className="relative px-[5vw] pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        <FloatingOrbs />
        <div className="relative grid lg:grid-cols-[1.05fr,1fr] gap-10 lg:gap-14 items-center max-w-[1280px] mx-auto">
          <div className="relative z-10 flex flex-col">
            <Reveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 glass text-[#B8860B] dark:text-[#FFD740] text-[0.7rem] sm:text-[0.74rem] font-bold px-3 sm:px-4 py-[0.34rem] rounded-full mb-5 w-fit max-w-full">
                <span className="hidden sm:inline">🌿 {CLINIC.name} — {CLINIC.address1}</span>
                <span className="sm:hidden">🌿 {CLINIC.name} · Kampala</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.05}>
              <h1 className="font-display font-bold text-[#1E5C2E] dark:text-[#D4EDD9] leading-[1.1] mb-4" style={{ fontSize: "clamp(1.85rem, 4.6vw, 3.6rem)" }}>
                Conversations with{" "}
                <em className="italic bg-gradient-to-r from-[#2E7D42] via-[#4CAF6B] to-[#E6B800] bg-clip-text text-transparent">a Dentist</em>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <p className="text-[1.04rem] sm:text-[1.08rem] text-[#3D5444] dark:text-[#A5B8AB] max-w-xl mb-6 leading-[1.65]">
                Dr. Esther shares expert dental articles, audio podcasts, and short video tips every week — completely free for every Ugandan family.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <div className="flex items-center gap-5 sm:gap-7 mb-7 border-b border-[#D4EDD9] dark:border-white/10 -mx-1 px-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <a href="#articles" className="group inline-flex items-center gap-1.5 pb-3 text-[0.86rem] font-semibold text-[#1E5C2E] dark:text-[#D4EDD9] border-b-2 border-transparent hover:border-[#2E7D42] transition-colors">
                  <span className="text-[#2E7D42]">📝</span> Articles
                </a>
                <a href="#podcasts" className="group inline-flex items-center gap-1.5 pb-3 text-[0.86rem] font-semibold text-[#3D5444] dark:text-[#C8DFCC] border-b-2 border-transparent hover:border-[#6C3FC5] hover:text-[#6C3FC5] dark:hover:text-[#C4B5FD] transition-colors">
                  <span className="text-[#6C3FC5]">🎙</span> Podcasts
                </a>
                <a href="#videos" className="group inline-flex items-center gap-1.5 pb-3 text-[0.86rem] font-semibold text-[#3D5444] dark:text-[#C8DFCC] border-b-2 border-transparent hover:border-[#B91C1C] hover:text-[#B91C1C] dark:hover:text-[#FCA5A5] transition-colors">
                  <span className="text-[#B91C1C]">🎬</span> Videos
                </a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.24}>
              <div className="flex gap-3 flex-wrap mb-6">
                <MagneticButton>
                  <a href={waLink()} target="_blank" rel="noreferrer" className="btn-cta inline-flex items-center gap-2">
                    💬 WhatsApp Dr. Esther
                  </a>
                </MagneticButton>
                <a href="#articles" className="btn-outline-green">Explore Content</a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.32}>
              <div className="flex items-center gap-4 glass rounded-[18px] px-5 py-4 max-w-md">
                <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] grid place-items-center rounded-2xl bg-gradient-to-br from-[#EDF7EF] to-[#D4EDD9] dark:from-white/5 dark:to-white/10 border border-[#D4EDD9] dark:border-white/10 flex-shrink-0">
                  <MicIcon size={68} />
                </div>
                <div>
                  <strong className="block text-[0.93rem] font-extrabold text-[#1E5C2E] dark:text-[#D4EDD9]">{CLINIC.doctor}</strong>
                  <span className="text-[0.74rem] text-[#7A9480] dark:text-[#A5B8AB]">Lead Dentist · {CLINIC.name}</span>
                  <div className="flex gap-5 mt-2">
                    <div><strong className="block font-display text-lg text-[#1E5C2E] dark:text-[#D4EDD9] leading-none">10+</strong><span className="text-[0.63rem] text-[#7A9480] dark:text-[#A5B8AB]">Yrs Exp.</span></div>
                    <div><strong className="block font-display text-lg text-[#1E5C2E] dark:text-[#D4EDD9] leading-none">2,500+</strong><span className="text-[0.63rem] text-[#7A9480] dark:text-[#A5B8AB]">Patients</span></div>
                    <div><strong className="block font-display text-lg text-[#1E5C2E] dark:text-[#D4EDD9] leading-none">⭐ 5.0</strong><span className="text-[0.63rem] text-[#7A9480] dark:text-[#A5B8AB]">Rating</span></div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* HERO RIGHT IMAGE */}
          <Reveal direction="up" delay={0.2}>
            <div className="relative h-[420px] lg:h-[540px] rounded-[28px] overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLINIC.heroPhoto} alt="Kays Dental Clinic Kampala" className="w-full h-full object-cover object-top animate-float-slow" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E5C2E]/40 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WELCOME — ANIMATED HERO BLOCK */}
      <section className="px-[5vw] py-12 lg:py-16 bg-gradient-to-b from-white to-[#F6F9F3] dark:from-[#0a1a0b] dark:to-[#0a1a0b]/60">
        <div className="max-w-[1100px] mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-7">
              <span className="inline-block text-[0.7rem] tracking-[0.2em] uppercase text-[#7A9480] font-bold mb-2">Watch the welcome</span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] leading-tight">
                A 60-second conversation with Dr. Esther
              </h2>
              <p className="text-sm sm:text-base text-[#3D5444] dark:text-[#A5B8AB] mt-2 max-w-xl mx-auto">
                What you can expect from this blog, in her own voice.
              </p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#D4EDD9] dark:border-white/10 shadow-[0_20px_60px_-20px_rgba(30,92,46,0.45)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E5C2E] via-[#2E7D42] to-[#4CAF6B]" />
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#E6B800]/30 blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-[#4CAF6B]/40 blur-3xl animate-pulse"
                style={{ animationDelay: "1.5s", animationDuration: "4s" }}
              />

              <div className="absolute inset-0 grid place-items-center px-6">
                <div className="flex flex-col items-center text-center gap-5 max-w-md">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                    <span className="absolute inset-0 rounded-full bg-white/15 animate-ping" style={{ animationDuration: "2.4s" }} />
                    <span className="absolute inset-3 rounded-full bg-white/20 animate-ping" style={{ animationDuration: "2.4s", animationDelay: "0.6s" }} />
                    <div className="absolute inset-5 rounded-full bg-white shadow-2xl grid place-items-center">
                      <svg viewBox="0 0 64 64" className="w-14 h-14 sm:w-16 sm:h-16" xmlns="http://www.w3.org/2000/svg">
                        <rect x="22" y="10" width="20" height="30" rx="10" fill="#1E5C2E" />
                        <rect x="25.5" y="13.5" width="3" height="23" rx="1.5" fill="#FFFFFF" opacity="0.25" />
                        <path d="M16 30 a16 16 0 0 0 32 0" fill="none" stroke="#1E5C2E" strokeWidth="3" strokeLinecap="round" />
                        <rect x="30.5" y="46" width="3" height="8" rx="1.5" fill="#1E5C2E" />
                        <rect x="22" y="53" width="20" height="3.5" rx="1.75" fill="#1E5C2E" />
                        <circle cx="32" cy="22" r="2.4" fill="#E6B800" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-end gap-1.5 h-10">
                    {wavBars.map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 sm:w-2 rounded-full bg-white/80"
                        style={{
                          height: `${h}px`,
                          animation: "soundwave 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="text-white font-display text-xl sm:text-2xl font-bold drop-shadow">A conversation, every week</p>
                    <p className="text-white/85 text-sm sm:text-base mt-1">Dr. Esther shares honest dental advice for every Ugandan family.</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-between text-white text-xs">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD740] animate-pulse" />
                  Welcome · 60-second intro video coming soon
                </span>
                <span className="hidden sm:inline opacity-80">Conversations with a Dentist</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-[#1E5C2E] dark:bg-[#0d2a14] text-[#FFD740] py-3 overflow-hidden">
        <Marquee gap={48} speed={28}>
          <span className="inline-flex items-center gap-2 font-bold text-sm">✨ Trusted by 2,500+ families across Kampala</span>
          <span className="inline-flex items-center gap-2 font-bold text-sm">🏆 5.0 ★ on Google Reviews</span>
          <span className="inline-flex items-center gap-2 font-bold text-sm">📚 Featured in The Daily Monitor</span>
          <span className="inline-flex items-center gap-2 font-bold text-sm">🦷 10+ years of compassionate dentistry</span>
          <span className="inline-flex items-center gap-2 font-bold text-sm">💬 Read, listen, and watch — every week</span>
        </Marquee>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="px-[5vw] py-16 lg:py-20 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
            <div>
              <div className="s-tag">📝 Article</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3">Latest articles</h2>
              <p className="text-[#3D5444] dark:text-[#A5B8AB] mt-2">In-depth reads on oral health, cosmetic dentistry, and family care.</p>
            </div>
            <Link href="/search?type=article" className="text-[#2E7D42] hover:text-[#1E5C2E] font-semibold text-sm">View all articles →</Link>
          </div>
        </Reveal>
        {articles.length === 0 ? (
          <p className="text-[#7A9480] text-center py-12">No articles published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((p) => (
              <Reveal key={p.id}><ArticleCard a={p} /></Reveal>
            ))}
          </div>
        )}
      </section>

      {/* PODCASTS */}
      <section id="podcasts" className="px-[5vw] py-16 lg:py-20 bg-gradient-to-b from-[#F6F9F3] to-white dark:from-[#0a1a0b]/60 dark:to-[#0a1a0b]">
        <div className="max-w-[1280px] mx-auto">
          <Reveal direction="up">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
              <div>
                <div className="s-tag s-tag-pod">🎙️ Audio Podcast</div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3">Conversations to listen to</h2>
                <p className="text-[#3D5444] dark:text-[#A5B8AB] mt-2">Dr. Esther unpacks the questions she hears most often in the clinic.</p>
              </div>
              <Link href="/search?type=podcast" className="text-[#2E7D42] hover:text-[#1E5C2E] font-semibold text-sm">All episodes →</Link>
            </div>
          </Reveal>
          {podcasts.length === 0 ? (
            <p className="text-[#7A9480] text-center py-12">No podcasts published yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.slice(0, 6).map((post) => (
                <Reveal key={post.id}><PodcastCard p={post} /></Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="px-[5vw] py-16 lg:py-20 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
            <div>
              <div className="s-tag s-tag-vid">🎬 Video Shorts</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3">Quick video tips</h2>
              <p className="text-[#3D5444] dark:text-[#A5B8AB] mt-2">Two-minute videos that save you a trip to the clinic.</p>
            </div>
            <Link href="/search?type=video" className="text-[#2E7D42] hover:text-[#1E5C2E] font-semibold text-sm">More videos →</Link>
          </div>
        </Reveal>
        {videos.length === 0 ? (
          <p className="text-[#7A9480] text-center py-12">No videos published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((post) => (
              <Reveal key={post.id}><VideoCard v={post} /></Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT DR ESTHER */}
      <section className="px-[5vw] py-16 lg:py-24 bg-gradient-to-br from-[#1E5C2E] to-[#2E7D42] text-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr,1.2fr] gap-10 lg:gap-14 items-center">
          <Reveal direction="left">
            <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-2xl max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLINIC.doctorAboutPhoto} alt={CLINIC.doctor} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="s-tag bg-[#FFD740] text-[#1E5C2E] border-[#FFD740]">About the host</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight">Meet {CLINIC.doctor}</h2>
            <p className="text-white/85 mt-5 leading-[1.7] text-[1.04rem]">
              Lead dentist at {CLINIC.name}, Dr. Esther has spent over a decade helping families in Kampala build healthy smiles.
              Her approach blends modern dentistry with honest, jargon-free conversations — the kind of advice you would hope a friend who happens to be a dentist would give you.
            </p>
            <p className="text-white/85 mt-4 leading-[1.7] text-[1.04rem]">
              On this blog, she shares what she wishes more patients knew — from the foods quietly damaging your teeth, to whether whitening is really worth it, to how to make a child&apos;s first dental visit a magical memory.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={waLink()} target="_blank" rel="noreferrer" className="bg-[#FFD740] hover:bg-[#E6B800] text-[#1E5C2E] font-bold px-6 py-3 rounded-full transition">
                💬 Chat on WhatsApp
              </a>
              <Link href="/contact" className="border-2 border-white/60 hover:border-white text-white font-bold px-6 py-3 rounded-full transition">
                Visit the clinic
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="px-[5vw] py-16 lg:py-20 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="text-center mb-10">
            <div className="s-tag inline-block">⭐ Google Reviews</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3">What our patients say</h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <Reveal key={i}><ReviewCard r={review} /></Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* CONTACT */}
      <section id="contact" className="px-[5vw] py-16 lg:py-24 bg-[#F6F9F3] dark:bg-[#0a1a0b]/60">
        <div className="max-w-[920px] mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-9">
              <div className="s-tag inline-block">📍 Visit Us</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3">Get in touch</h2>
              <p className="text-[#3D5444] dark:text-[#A5B8AB] mt-2">Send a message, book an appointment, or just say hi.</p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
