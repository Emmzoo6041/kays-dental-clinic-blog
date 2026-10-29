import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { CLINIC, REVIEWS, waLink } from "@/lib/clinic";
import { ContactForm } from "@/components/ContactForm";
import { Marquee } from "@/components/Marquee";
import { ReviewCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { NewsletterSection } from "@/components/NewsletterSection";
import { HeroVideo } from "@/components/HeroVideo";
import { ArticlesShowcase, PodcastsShowcase, VideosShowcase } from "@/components/HomeShowcases";

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

  return (
    <>
      {/* HERO — intro video */}
      <HeroVideo />

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
        <ArticlesShowcase articles={articles} />
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
          <PodcastsShowcase podcasts={podcasts} />
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
        <VideosShowcase videos={videos} />
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
