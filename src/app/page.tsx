import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { CLINIC, REVIEWS, waLink } from "@/lib/clinic";
import { TopicSuggestForm } from "@/components/TopicSuggestForm";
import { Marquee } from "@/components/Marquee";
import { ReviewDeck } from "@/components/ReviewDeck";
import { Reveal } from "@/components/Reveal";
import { NewsletterSection } from "@/components/NewsletterSection";
import { HeroIntro } from "@/components/HeroIntro";
import { ArticlesShowcase, PodcastsShowcase, VideosShowcase } from "@/components/HomeShowcases";
import { VideoLibraryTabs } from "@/components/VideoLibrary";

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
      {/* HERO — headline + Dr. Esther's intro video */}
      <HeroIntro />

      {/* TRUST BAR */}
      <section className="bg-[#FAFAF9] dark:bg-[#0e100f] border-y border-[#ECECEA] dark:border-white/5 py-5 overflow-hidden">
        <Marquee gap={56} speed={40}>
          {["Trusted by 2,500+ families across Kampala", "5.0 ★ on Google Reviews", "Featured in The Daily Monitor", "10+ years of gentle dentistry", "Read, listen and watch — every week"].map((s) => (
            <span key={s} className="inline-flex items-center gap-3 text-[0.86rem] font-medium text-[#6B706C] dark:text-[#A6AAA6] whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#B6BAB6]" />{s}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="px-[5vw] py-20 lg:py-28 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
            <div>
              <div className="s-tag">Articles</div>
              <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">Latest articles</h2>
              <p className="text-[#555A56] dark:text-[#A6AAA6] mt-2">In-depth reads on oral health, cosmetic dentistry, and family care.</p>
            </div>
            <Link href="/search?type=article" className="text-[#141614] dark:text-[#E7E8E5] font-semibold text-sm border-b border-[#141614]/30 dark:border-white/30 hover:opacity-70 transition-opacity">View all articles →</Link>
          </div>
        </Reveal>
        <ArticlesShowcase articles={articles} />
      </section>

      {/* PODCASTS */}
      <section id="podcasts" className="px-[5vw] py-20 lg:py-28 bg-[#F4F4F2] dark:bg-white/[0.02]">
        <div className="max-w-[1280px] mx-auto">
          <Reveal direction="up">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
              <div>
                <div className="s-tag s-tag-pod">Podcast</div>
                <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">Conversations to listen to</h2>
                <p className="text-[#555A56] dark:text-[#A6AAA6] mt-2">Dr. Esther unpacks the questions she hears most often in the clinic.</p>
              </div>
              <Link href="/search?type=podcast" className="text-[#141614] dark:text-[#E7E8E5] font-semibold text-sm border-b border-[#141614]/30 dark:border-white/30 hover:opacity-70 transition-opacity">All episodes →</Link>
            </div>
          </Reveal>
          <PodcastsShowcase podcasts={podcasts} />
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="px-[5vw] py-20 lg:py-28 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
            <div>
              <div className="s-tag s-tag-vid">Video shorts</div>
              <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">Quick video tips</h2>
              <p className="text-[#555A56] dark:text-[#A6AAA6] mt-2">Two-minute videos that save you a trip to the clinic.</p>
            </div>
            <Link href="/search?type=video" className="text-[#141614] dark:text-[#E7E8E5] font-semibold text-sm border-b border-[#141614]/30 dark:border-white/30 hover:opacity-70 transition-opacity">More videos →</Link>
          </div>
        </Reveal>
        <VideosShowcase videos={videos} />
      </section>

      {/* VIEWMEDICA LIBRARY */}
      <section id="library" className="px-[5vw] py-20 lg:py-28 bg-[#F4F4F2] dark:bg-white/[0.02] scroll-mt-20">
        <div className="max-w-[1200px] mx-auto">
          <Reveal direction="up">
            <div className="mb-9 max-w-2xl">
              <div className="s-tag">Dental library</div>
              <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">See how it works</h2>
              <p className="text-[#555A56] dark:text-[#A6AAA6] mt-2">Short animated videos on common conditions and the treatments we use in the clinic.</p>
            </div>
          </Reveal>
          <VideoLibraryTabs />
        </div>
      </section>

      {/* ABOUT DR ESTHER */}
      <section id="about" className="scroll-mt-20 px-[5vw] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-20 items-center">
          <Reveal direction="fade">
            <div className="relative aspect-[4/5] rounded-[22px] overflow-hidden max-w-md mx-auto lg:mx-0 bg-[#E8E8E6] shadow-[0_40px_80px_-45px_rgba(20,22,20,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLINIC.doctorAboutPhoto} alt={`${CLINIC.doctor}, paediatric dental surgeon and founder of ${CLINIC.name}`} loading="lazy" className="w-full h-full object-cover object-[50%_20%]" />
            </div>
          </Reveal>
          <Reveal direction="up">
            <div className="s-tag">About the host</div>
            <h2 className="display-italic text-[2.2rem] sm:text-[2.7rem] lg:text-[3.2rem] leading-[1.06] text-[#141614] dark:text-[#F2F2EF] mt-1">Meet {CLINIC.doctor}</h2>
            <p className="text-[#6B706C] dark:text-[#A6AAA6] font-medium text-[0.95rem] mt-3">
              Paediatric dental surgeon · Founder &amp; lead dentist, Kay&rsquo;s Dental Clinic
            </p>
            <div className="space-y-4 mt-7 text-[#3F4441] dark:text-[#C9CCC8] leading-[1.75] text-[1.02rem]">
              <p>
                Dr. Esther Lukwago is a paediatric dental surgeon, founder and lead dentist at Kay&rsquo;s Dental Clinic in Kampala, Uganda.
                With a deep passion for children&rsquo;s oral health, she is dedicated to making dental care a positive experience for young
                patients and helping families build healthy habits that last a lifetime.
              </p>
              <p>
                Her growing interest in <em>holistic dentistry</em> reflects her belief that oral health is closely connected to overall
                health and wellbeing. She is passionate about looking beyond the teeth to understand the wider factors that influence
                oral health, with an emphasis on prevention, education and patient-centred care.
              </p>
              <p>
                Beyond the dental chair, Dr. Esther believes that knowledge empowers people to take better care of their health.
                Through <em>Conversations with a Dentist</em>, she brings her clinical experience, curiosity and passion for education
                into everyday conversations, breaking down dental topics, answering common questions and making reliable oral health
                information accessible to everyone.
              </p>
            </div>
            <p className="mt-7 pl-5 border-l border-[#141614] dark:border-white/40 font-display italic text-[1.2rem] leading-[1.5] text-[#141614] dark:text-[#F2F2EF]">
              Her goal is simple: to help people understand their oral health, make informed choices and feel more confident about their dental care.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <a href={waLink()} target="_blank" rel="noreferrer" className="inline-flex items-center h-12 px-6 rounded-[10px] bg-[#141614] hover:bg-[#2B3D32] text-white dark:bg-[#F2F2EF] dark:text-[#141614] dark:hover:bg-white font-semibold text-[0.92rem] transition-colors duration-300">
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center h-12 px-6 rounded-[10px] border border-[#D6D8D4] dark:border-white/15 hover:border-[#141614] dark:hover:border-white/40 text-[#141614] dark:text-[#F2F2EF] font-semibold text-[0.92rem] transition-colors duration-300">
                Visit the clinic
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="px-[5vw] py-20 lg:py-28 max-w-[1280px] mx-auto">
        <Reveal direction="up">
          <div className="text-center mb-10">
            <div className="s-tag">Google reviews</div>
            <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">What our patients say</h2>
          </div>
        </Reveal>
        <ReviewDeck reviews={REVIEWS} />
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* GET IN TOUCH — suggest a topic */}
      <section id="contact" className="px-[5vw] py-20 lg:py-28 bg-[#F4F4F2] dark:bg-white/[0.02] scroll-mt-20">
        <div className="max-w-[860px] mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-10">
              <div className="s-tag">Get in touch</div>
              <h2 className="display-italic text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1">What should we talk about next?</h2>
              <p className="text-[#555A56] dark:text-[#A6AAA6] mt-3 max-w-xl mx-auto">
                Tell Dr. Esther which dental topic you&rsquo;d like covered in an upcoming article, podcast or video.
              </p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <TopicSuggestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
