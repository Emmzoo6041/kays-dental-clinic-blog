import { ContactForm } from "@/components/ContactForm";

export default function Contact() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <div className="s-tag">Get in touch</div>
      <h1 className="display-italic text-[2.6rem] sm:text-[3.2rem] leading-[1.05] text-[#141614] dark:text-[#F2F2EF] mt-1">Say hello</h1>
      <p className="text-[#555A56] dark:text-[#B6BAB6] mt-3 mb-8">
        Questions, second opinions, or a topic you&rsquo;d like Dr. Esther to cover — we&rsquo;d love to hear from you.
      </p>
      <ContactForm />
    </section>
  );
}
