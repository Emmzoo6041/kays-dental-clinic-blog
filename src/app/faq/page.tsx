import Link from "next/link";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CLINIC, waLink } from "@/lib/clinic";

export const metadata = {
  title: "FAQ — Conversations with a Dentist",
  description: "Common questions about visiting Kays Dental Clinic, treatments, costs, and dental care, answered by Dr. Esther Lukwago.",
};

const FAQ = [
  {
    q: "How often should I visit the dentist?",
    a: "Every 6 months for a check-up and professional cleaning is the standard recommendation. If you have gum disease, are pregnant, smoke, or have a history of cavities, Dr. Esther may recommend more frequent visits (every 3–4 months)."
  },
  {
    q: "Are dental check-ups painful?",
    a: "No. A routine check-up is completely painless — it's just an examination, x-rays if needed, and a professional cleaning. Cleanings may cause slight sensitivity in the gums for a few hours, especially the first time, but this fades quickly."
  },
  {
    q: "How much does a dental visit at Kays Dental cost?",
    a: "Costs vary by treatment, but consultations start around UGX 50,000 and routine check-up + cleaning around UGX 150,000–200,000. Please WhatsApp Dr. Esther directly for an exact quote — she'll never proceed with any treatment without explaining the cost first."
  },
  {
    q: "Do you accept walk-in appointments?",
    a: "Yes, but booking ahead via WhatsApp or phone is strongly recommended so you don't wait. Emergency appointments are usually accommodated same-day."
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash, Mobile Money (MTN and Airtel), bank transfer, and most major debit/credit cards. We also work with several insurance providers — call ahead to confirm yours is accepted."
  },
  {
    q: "Is teeth whitening safe?",
    a: "Yes, when done professionally. Over-the-counter products can cause sensitivity or uneven results. Dr. Esther uses clinical-grade products and screens you first to ensure whitening is right for your teeth. Avoid charcoal-based products — they're abrasive and damage enamel over time."
  },
  {
    q: "When should I bring my child for their first dental visit?",
    a: "When their first tooth appears, or by their first birthday — whichever comes first. Early visits build a positive relationship with the dentist and catch issues like bottle decay early."
  },
  {
    q: "What if I'm scared of the dentist?",
    a: "You're not alone — dental anxiety is very common. Tell us before your visit and Dr. Esther will explain everything step-by-step, work at your pace, and use gentle techniques. Many of our most nervous patients become regulars after their first comfortable visit."
  },
  {
    q: "Do you offer dental implants?",
    a: "Yes. Dental implants are the gold standard for replacing missing teeth. Dr. Esther will assess your bone density and overall oral health to determine if you're a candidate, and walk you through the timeline and cost."
  },
  {
    q: "How can I prevent cavities at home?",
    a: "Brush twice daily with fluoride toothpaste for two minutes (45-degree angle, gentle circles). Floss or use interdental brushes daily. Limit sugary drinks and acidic foods. Rinse with water after meals. Visit Dr. Esther every 6 months."
  },
  {
    q: "What's the difference between regular and holistic dentistry?",
    a: "Holistic dentistry considers your whole-body health (nutrition, sleep, stress, posture) when planning treatment, uses biocompatible materials when possible, and aims to preserve as much natural tooth as possible. It's not 'alternative' — it's a more complete approach."
  },
  {
    q: "How do I subscribe to Dr. Esther's podcast or videos?",
    a: "Everything is available right here on this site — click 'Podcasts' or 'Videos' in the menu. To get notified when new content drops, subscribe to the newsletter at the bottom of the homepage."
  },
];

export default function FAQPage() {
  // Build FAQPage JSON-LD for Google rich snippets
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <section className="max-w-3xl mx-auto px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <div className="text-center mb-10">
        <span className="s-tag">❓ Frequently asked questions</span>
        <h1 className="font-display text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3 mb-3">FAQ</h1>
        <p className="text-[#3D5444] dark:text-[#A5B8AB]">
          The questions Dr. Esther hears most often, answered honestly.
        </p>
      </div>
      <FAQAccordion items={FAQ} />

      <div className="mt-12 bg-[#EDF7EF] dark:bg-white/5 rounded-2xl border-2 border-[#4CAF6B]/40 p-7 text-center">
        <p className="font-display text-lg text-[#1E5C2E] dark:text-[#D4EDD9] mb-3">Have a question not covered here?</p>
        <p className="text-sm text-[#3D5444] dark:text-[#C8DFCC] mb-5">
          Dr. Esther personally answers every message. The fastest way is WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-wa">💬 WhatsApp Dr. Esther</a>
          <Link href="/#contact" className="btn btn-outline">📅 Book appointment</Link>
        </div>
      </div>
    </section>
  );
}
