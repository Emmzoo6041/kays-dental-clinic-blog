import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { CLINIC, REVIEWS, waLink } from "@/lib/clinic";
import { ContactForm } from "@/components/ContactForm";
import { Marquee } from "@/components/Marquee";
import { ArticleCard, PodcastCard, VideoCard, ReviewCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { MagneticButton } from "@/components/MagneticButton";
import { NewsletterSection } from "@/components/NewsletterSection";
import { MicIcon } from "@/components/MicIcon";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createServerSupabase();
  const nowIso = new Date().toISOString();
  // Show post if published, OR scheduled in the past
  const { data: all } = await supabase
    .from("posts")
    .select("id, slug, type, category, title, excerpt, cover_url, media_url, duration, episode, featured, created_at, scheduled_for, published")
    .or(`published.eq.true,and(scheduled_for.lte.${nowIso})`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  // Filter again client-side just in case (defensive)
  const visible = (all || []).filter(p => p.published || (p.scheduled_for && new Date(p.scheduled_for) <= new Date()));
  const articles = visible.filter(p => p.type === "article");
  const podcasts = visible.filter(p => p.type === "podcast");
  const videos   = visible.filter(p => p.type === "video");

  return (
    <>
      {/* HERO */}
      <section className="relative grid lg:grid-cols-[1.1fr,1fr] min-h-[92vh] overflow-hidden -mt-[72px] pt-[72px]">
        <FloatingOrbs intensity="normal" />
        <div className="relative bg-[#EDF7EF]/85 dark:bg-[#0a1a0b]/40 backdrop-blur-sm px-[5vw] py-16 lg:py-20 flex flex-col justify-center z-10">
          <Reveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 glass text-[#B8860B] dark:text-[#FFD740] text-[0.74rem] font-bold px-4 py-[0.34rem] rounded-full mb-5 w-fit">
              🌿 {CLINIC.name} — {CLINIC.address1}
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h1 className="font-display font-bold text-[#1E5C2E] dark:text-[#D4EDD9] leading-[1.12] mb-4" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}>
              Conversations with <br />
              <em className="italic bg-gradient-to-r from-[#2E7D42] via-[#4CAF6B] to-[#E6B800] bg-clip-text text-transparent">a Dentist</em>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.12}>
            <p className="text-[1.02rem] text-[#3D5444] dark:text-[#A5B8AB] leading-[1.82] max-w-[460px] mb-6">
              Dr. Esther shares expert dental articles, audio podcasts, and short video tips every week — completely free for every Ugandan family.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.18}>
            <div className="flex flex-wrap gap-2 mb-7">
              <span className="inline-flex items-center gap-1 px-4 py-[0.38rem] rounded-full text-[0.78rem] font-bold border-2 bg-[#EDF7EF] border-[#4CAF6B] text-[#1E5C2E] dark:bg-transparent dark:text-[#4CAF6B]">📝 Articles</span>
              <span className="inline-flex items-center gap-1 px-4 py-[0.38rem] rounded-full text-[0.78rem] font-bold border-2 bg-[#EDE9FE] border-[#C4B5FD] text-[#6C3FC5] dark:bg-transparent dark:text-[#C4B5FD]">🎙️ Audio Podcasts</span>
              <span className="inline-flex items-center gap-1 px-4 py-[0.38rem] rounded-full text-[0.78rem] font-bold border-2 bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C] dark:bg-transparent dark:text-[#FCA5A5]">🎬 Video Shorts</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.24}>
            <div className="flex flex-wrap gap-3 mb-9">
              <MagneticButton href={waLink()} target="_blank" rel="noreferrer" className="btn btn-wa">💬 WhatsApp Dr. Esther</MagneticButton>
              <MagneticButton href="#articles" className="btn btn-outline">Explore Content</MagneticButton>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.32}>
            <div className="flex items-center gap-4 glass rounded-[18px] px-5 py-4 max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLINIC.doctorPhoto} alt={CLINIC.doctor} className="w-16 h-16 rounded-full object-cover object-top border-[3px] border-[#4CAF6B] flex-shrink-0" />
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
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLINIC.heroPhoto} alt="Kays Dental Clinic Kampala" className="w-full h-full object-cover object-top animate-float-slow" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EDF7EF] via-transparent to-black/10 dark:from-[#0a1a0b]" />
          <Reveal direction="left" delay={0.5}>
            <div className="absolute bottom-10 right-10 glass rounded-2xl py-4 px-5 flex flex-col items-center">
              <strong className="font-display text-[1.7rem] text-[#1E5C2E] dark:text-[#D4EDD9] leading-none">98%</strong>
              <span className="text-[0.66rem] text-[#7A9480] dark:text-[#A5B8AB] font-semibold text-center mt-1">Patient<br />Satisfaction</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item">🏅 Uganda Dental Association Certified</div>
        <div className="trust-item">🦷 Painless Procedures</div>
        <div className="trust-item">👶 Family &amp; Child Friendly</div>
        <div className="trust-item">🎙️ Weekly Podcast</div>
        <div className="trust-item hidden md:flex">🎬 Video Tips Weekly</div>
        <div className="trust-item hidden lg:flex">📍 {CLINIC.address1}</div>
      </div>

      {/* ARTICLES */}
      <section id="articles" className="relative bg-white dark:bg-[#0f2412] py-20 overflow-hidden">
        <div className="px-[5vw] mb-8">
          <Reveal direction="up">
            <div className="s-tag">📝 The Blog</div>
            <h2 className="s-title">Dental Tips from Dr. Esther</h2>
            <p className="s-sub mb-0">Expert articles published weekly — friendly, practical, and always evidence-based. <span className="text-[#7A9480] text-xs">(Hover to pause)</span></p>
          </Reveal>
        </div>
        {articles.length === 0 ? (
          <div className="mx-[5vw] text-center py-12 px-8 text-[#7A9480] bg-[#F6F9F3] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#C8DFCC] text-sm">
            No articles yet — Dr. Esther will publish one soon! 😊
          </div>
        ) : (
          <Reveal direction="fade" delay={0.1}>
            <Marquee speed={45} gap={28}>
              {articles.map(a => (
                <div key={a.id} className="marquee-card">
                  <ArticleCard a={a} />
                </div>
              ))}
            </Marquee>
          </Reveal>
        )}
      </section>

      {/* PODCASTS */}
      <section id="podcasts" className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #F6F9F3 0%, #f3f0ff 100%)" }}>
        <div className="px-[5vw] mb-8">
          <Reveal direction="up">
            <div className="s-tag s-tag-pod">🎙️ Audio Podcast</div>
            <h2 className="s-title">Dr. Esther&apos;s Dental Podcast</h2>
            <p className="s-sub mb-0">Listen while you commute, cook, or relax — dental wisdom in your ears every week. <span className="text-[#7A9480] text-xs">(Hover to pause)</span></p>
          </Reveal>
        </div>
        {podcasts.length === 0 ? (
          <div className="mx-[5vw] text-center py-12 px-8 text-[#7A9480] bg-white rounded-2xl border-2 border-dashed border-[#C8DFCC] text-sm">
            No episodes yet — Dr. Esther&apos;s first episode is coming soon! 🎙️
          </div>
        ) : (
          <Reveal direction="fade" delay={0.1}>
            <Marquee speed={40} gap={28} reverse>
              {podcasts.map(p => (
                <div key={p.id} className="marquee-card">
                  <PodcastCard p={p} />
                </div>
              ))}
            </Marquee>
          </Reveal>
        )}
      </section>

      {/* VIDEOS */}
      <section id="videos" className="relative bg-white dark:bg-[#0f2412] py-20 overflow-hidden">
        <div className="px-[5vw] mb-8">
          <Reveal direction="up">
            <div className="s-tag s-tag-vid">🎬 Video Shorts</div>
            <h2 className="s-title">Quick Dental Tips — Video Edition</h2>
            <p className="s-sub mb-0">Short, punchy videos you can watch and share in under 2 minutes. <span className="text-[#7A9480] text-xs">(Hover to pause)</span></p>
          </Reveal>
        </div>
        {videos.length === 0 ? (
          <div className="mx-[5vw] text-center py-12 px-8 text-[#7A9480] bg-[#F6F9F3] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#C8DFCC] text-sm">
            No videos yet — Dr. Esther&apos;s first video short is coming soon! 🎬
          </div>
        ) : (
          <Reveal direction="fade" delay={0.1}>
            <Marquee speed={50} gap={28}>
              {videos.map(v => (
                <div key={v.id} className="marquee-card">
                  <VideoCard v={v} />
                </div>
              ))}
            </Marquee>
          </Reveal>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="relative px-[5vw] py-20 bg-[#FFFBE6] overflow-hidden">
        <FloatingOrbs intensity="subtle" />
        <div className="relative grid lg:grid-cols-[1fr,1.65fr] gap-10 lg:gap-20 items-center">
          <Reveal direction="right">
            <div className="relative hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLINIC.doctorAboutPhoto} alt={CLINIC.doctor}
                   className="w-full max-w-[320px] h-[430px] object-cover object-top border-4 border-[#D4EDD9] shadow-[0_12px_48px_rgba(30,92,46,0.16)]"
                   style={{ borderRadius: "30px 30px 90px 30px" }} />
              <div className="absolute -bottom-3 right-2.5 bg-[#E6B800] rounded-full w-[86px] h-[86px] flex flex-col items-center justify-center font-display text-[1.36rem] font-bold text-[#1E5C2E] leading-tight shadow-[0_6px_22px_rgba(230,184,0,0.42)]">
                10+<small className="text-[0.43rem] font-sans uppercase tracking-[0.1em]">Years</small>
              </div>
              <div className="flex flex-col gap-2 mt-6 max-w-[320px]">
                {[
                  "🎓 BDS — Bachelor of Dental Surgery",
                  "🏅 Uganda Dental Association Member",
                  "🌿 Holistic Dentistry Specialist",
                  "💛 Paediatric Dentistry Expert",
                  "🎙️ Podcast Host & Educator",
                  "🎬 Video Creator & Health Educator",
                ].map((c, i) => (
                  <Reveal key={i} direction="right" delay={i * 0.06}>
                    <div className="bg-white border-l-4 border-[#4CAF6B] rounded-r-xl px-4 py-2 text-[0.79rem] text-[#3D5444] font-bold shadow-sm">{c}</div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal direction="left">
            <div className="s-tag">👩‍⚕️ About Dr. Esther</div>
            <h2 className="s-title">The Heart Behind Kays Dental</h2>
            <div className="border-l-4 border-[#E6B800] bg-[#FFF3B0] rounded-r-2xl py-4 px-5 my-6">
              <p className="font-display text-[1.08rem] italic text-[#1E5C2E] m-0">&ldquo;I want every Ugandan family to have access to expert dental knowledge they can trust — whether they visit us or not.&rdquo;</p>
            </div>
            <p className="text-[0.94rem] text-[#3D5444] leading-[1.88] mb-3">
              Dr. Esther Lukwago is the founder and lead dentist at Kays Dental Clinic, Plot 52 Kanjokya Street, Kampala. With over 10 years of experience, she combines modern dentistry with a holistic, patient-centred approach that puts whole-body wellness at the centre of everything.
            </p>
            <p className="text-[0.94rem] text-[#3D5444] leading-[1.88] mb-3">
              Beyond the clinic, Dr. Esther is deeply committed to education. She publishes weekly articles, hosts a growing audio podcast, and creates short video tips that make expert dental advice simple and accessible for every family in Uganda.
            </p>
            <p className="text-[0.94rem] text-[#3D5444] leading-[1.88] mb-3">
              When she&apos;s not at the clinic, she volunteers with community dental outreach programmes, taking free care and education to schools across Kampala.
            </p>
            <div className="flex gap-3 flex-wrap mt-6">
              <MagneticButton href={waLink()} target="_blank" rel="noreferrer" className="btn btn-wa">💬 WhatsApp Dr. Esther</MagneticButton>
              <MagneticButton href={`tel:${CLINIC.phoneIntl}`} className="btn btn-green">📞 {CLINIC.phone}</MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="relative py-20 bg-[#EDF7EF] overflow-hidden">
        <div className="px-[5vw] mb-8">
          <Reveal direction="up">
            <div className="s-tag">💬 Patient Reviews</div>
            <h2 className="s-title">What Our Patients Say</h2>
            <p className="s-sub">Real feedback from families and patients across Kampala who trust Dr. Esther every day. <span className="text-[#7A9480] text-xs">(Hover to pause)</span></p>
          </Reveal>
        </div>
        <Reveal direction="fade" delay={0.1}>
          <Marquee speed={35} gap={24} reverse>
            {REVIEWS.map((r, i) => (
              <div key={i} className="marquee-card-wide">
                <ReviewCard r={r} />
              </div>
            ))}
          </Marquee>
        </Reveal>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* CONTACT */}
      <section id="contact" className="text-center px-[5vw] py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1E5C2E 0%, #0f3d1a 100%)" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,215,64,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <Reveal direction="up">
            <div className="s-tag s-tag-w">📅 Get in Touch</div>
            <h2 className="font-display text-[clamp(1.85rem,3vw,2.65rem)] font-bold text-white leading-[1.15] mb-2 mt-2">Book an Appointment</h2>
            <p className="text-[0.96rem] text-white/60 max-w-[460px] mx-auto leading-[1.82] mb-9">Reach Dr. Esther directly — we respond within the hour during clinic hours.</p>
          </Reveal>

          <div className="grid gap-5 max-w-[800px] mx-auto mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            {[
              { icon: "💬", title: "WhatsApp", sub: "Fastest way — reply in minutes", btn: "Chat on WhatsApp", href: waLink(), cls: "btn-wa", ext: true },
              { icon: "📞", title: "Call Us", sub: "Speak directly with our team", btn: CLINIC.phone, href: `tel:${CLINIC.phoneIntl}`, cls: "btn-green", ext: false },
              { icon: "📍", title: "Visit Us", sub: `${CLINIC.address1}\nUganda`, btn: "Get Directions", href: CLINIC.mapsUrl, cls: "btn-outline-w", ext: true },
            ].map((c, i) => (
              <Reveal key={i} direction="up" delay={i * 0.1}>
                <div className="bg-white/[0.07] border-[1.5px] border-white/[0.13] rounded-[18px] p-7 text-center transition-all hover:bg-white/[0.12] hover:-translate-y-1 h-full">
                  <div className="text-[1.65rem] mb-2">{c.icon}</div>
                  <h4 className="text-[0.88rem] font-bold text-white mb-1">{c.title}</h4>
                  <p className="text-[0.77rem] text-white/50 mb-4 whitespace-pre-line">{c.sub}</p>
                  <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})} className={`btn ${c.cls} w-full`}>{c.btn}</a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={0.2}>
            <div className="max-w-[510px] mx-auto bg-white/[0.07] border-[1.5px] border-white/[0.13] rounded-[22px] p-8 text-left">
              <h3 className="font-display text-[1.18rem] text-white mb-5 text-center">Send Dr. Esther a Message</h3>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MAP */}
      <div className="h-[300px] overflow-hidden border-t-[3px] border-[#D4EDD9] relative">
        <iframe src={CLINIC.mapsEmbed} className="w-full h-full border-0" allowFullScreen loading="lazy" />
        <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer"
           className="absolute bottom-5 right-5 bg-white rounded-xl px-4 py-2.5 shadow-[0_12px_48px_rgba(30,92,46,0.16)] text-[0.78rem] font-bold text-[#1A2E1E] border-[1.5px] border-[#C8DFCC] hover:bg-[#EDF7EF] hover:border-[#4CAF6B] inline-flex items-center gap-2 transition">
          🗺 Get Directions to Kays Dental
        </a>
      </div>

      {/* WhatsApp floating */}
      <a href={waLink()} target="_blank" rel="noreferrer" className="wa-float">
        💬 Chat with Dr. Esther
      </a>
    </>
  );
}
