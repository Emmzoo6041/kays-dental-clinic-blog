import { ContactForm } from "@/components/ContactForm";

export default function Contact() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <p className="font-display italic text-teal mb-3">Get in touch</p>
      <h1 className="font-display text-5xl font-semibold mb-3">Say hello</h1>
      <p className="text-ink/75 mb-10">
        Drop us a line — for appointments, second opinions, or just to say hi.
      </p>
      <ContactForm />
    </section>
  );
}
