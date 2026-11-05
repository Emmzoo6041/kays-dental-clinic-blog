import { ContactForm } from "@/components/ContactForm";
import { CLINIC, waLink } from "@/lib/clinic";

export default function Contact() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <div className="s-tag">Get in touch</div>
      <h1 className="display-italic text-[2.6rem] sm:text-[3.2rem] leading-[1.05] text-[#141614] dark:text-[#F2F2EF] mt-1">Say hello</h1>
      <p className="text-[#555A56] dark:text-[#B6BAB6] mt-3 mb-8">
        Questions, second opinions, or a topic you&rsquo;d like Dr. Esther to cover — we&rsquo;d love to hear from you.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a href={`tel:${CLINIC.phoneIntl}`} className="rounded-[14px] border border-[#E2E3E0] dark:border-white/10 bg-white dark:bg-white/[0.03] px-5 py-4 hover:border-[#141614] dark:hover:border-white/40 transition-colors">
          <span className="block text-[0.68rem] uppercase tracking-[0.14em] text-[#8A8E8A]">Call the clinic</span>
          <span className="block text-[1.1rem] font-semibold text-[#141614] dark:text-[#F2F2EF] tabular-nums mt-0.5">{CLINIC.phone}</span>
        </a>
        <a href={waLink()} target="_blank" rel="noreferrer" className="rounded-[14px] border border-[#E2E3E0] dark:border-white/10 bg-white dark:bg-white/[0.03] px-5 py-4 hover:border-[#141614] dark:hover:border-white/40 transition-colors">
          <span className="block text-[0.68rem] uppercase tracking-[0.14em] text-[#8A8E8A]">WhatsApp</span>
          <span className="block text-[1.1rem] font-semibold text-[#141614] dark:text-[#F2F2EF] tabular-nums mt-0.5">{CLINIC.whatsappDisplay}</span>
        </a>
      </div>
      <ContactForm />
    </section>
  );
}
