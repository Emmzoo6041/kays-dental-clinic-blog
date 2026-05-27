export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-display italic text-teal mb-3">About</p>
      <h1 className="font-display text-5xl font-semibold mb-8">Dr. Esther &amp; the clinic</h1>
      <div className="prose-blog">
        <p>
          Kay&apos;s Dental Clinic is a small family practice run by Dr. Esther, with a simple
          promise: we&apos;ll tell you what we&apos;d tell our own mum. No upselling, no
          mystery jargon, no judging your flossing record.
        </p>
        <h2>Why this blog exists</h2>
        <p>
          Most dental websites are either terrifying or boring. We wanted somewhere that
          answers the questions patients actually ask — about pain, cost, cosmetics, kids,
          and everything in between — in plain English.
        </p>
        <h2>Want to come in?</h2>
        <p>
          Use the <a href="/contact">contact page</a> to book an appointment or ask a
          question. We answer within one working day.
        </p>
      </div>
    </section>
  );
}
