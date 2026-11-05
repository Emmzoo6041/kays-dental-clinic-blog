"use client";
import { useState } from "react";
import { CLINIC, waLink } from "@/lib/clinic";
import { PhoneIcon, ChatIcon } from "./ContactIcons";

const IDEAS = [
  "Children's teeth",
  "Gum health",
  "Braces & aligners",
  "Teeth whitening",
  "Holistic dentistry",
  "Bad breath",
  "Dental anxiety",
  "Pregnancy & oral health",
];
const FORMATS = ["Article", "Podcast", "Video"];

const chip = (on: boolean) =>
  `h-9 px-3.5 rounded-full text-[0.84rem] font-medium border transition-colors duration-300 ${
    on
      ? "bg-[#141614] text-white border-[#141614] dark:bg-[#F2F2EF] dark:text-[#141614] dark:border-[#F2F2EF]"
      : "bg-white text-[#3F4441] border-[#DDDFDB] hover:border-[#141614] dark:bg-transparent dark:text-[#C9CCC8] dark:border-white/15 dark:hover:border-white/40"
  }`;

/** Homepage "Get in touch": readers suggest topics for Dr. Esther to talk about. */
export function TopicSuggestForm() {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [format, setFormat] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [note, setNote] = useState("");

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  function compose() {
    if (!picked.length && !details.trim()) {
      setNote("Pick a topic or type your own idea first.");
      return null;
    }
    const lines = [
      `Hello Dr. Esther!${name.trim() ? ` My name is ${name.trim()}.` : ""}`,
      "",
      "I'd love to hear you talk about:",
      ...picked.map((p) => `• ${p}`),
      ...(details.trim() ? (picked.length ? ["", details.trim()] : [details.trim()]) : []),
      ...(format ? ["", `Ideally as a ${format.toLowerCase()}.`] : []),
      "",
      "Thank you!",
    ];
    return lines.join("\n").replace(/\n{3,}/g, "\n\n");
  }

  function sendWA() {
    const txt = compose();
    if (!txt) return;
    setNote("Opening WhatsApp…");
    window.open(waLink(txt), "_blank");
  }
  function sendEmail() {
    const txt = compose();
    if (!txt) return;
    setNote("Opening your email app…");
    window.location.href = `mailto:${CLINIC.email}?subject=${encodeURIComponent("Topic suggestion – Conversations with a Dentist")}&body=${encodeURIComponent(txt)}`;
  }

  return (
    <div className="rounded-[22px] bg-white dark:bg-white/[0.03] border border-[#E7E8E5] dark:border-white/10 p-5 sm:p-8 shadow-[0_30px_60px_-45px_rgba(20,22,20,0.35)]">
      <div>
        <label className="block text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#6B706C] dark:text-[#A6AAA6] mb-3">Pick a topic</label>
        <div className="flex flex-wrap gap-2">
          {IDEAS.map((t) => (
            <button key={t} type="button" aria-pressed={picked.includes(t)} onClick={() => toggle(t)} className={chip(picked.includes(t))}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="topic-details" className="block text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#6B706C] dark:text-[#A6AAA6] mb-2">
          Or tell us in your own words
        </label>
        <textarea
          id="topic-details"
          className="cf-in cf-ta"
          placeholder="What topic or question would you like Dr. Esther to talk about?"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div className="mt-5 grid sm:grid-cols-[1fr,auto] gap-5 sm:items-end">
        <div>
          <label htmlFor="topic-name" className="block text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#6B706C] dark:text-[#A6AAA6] mb-2">
            Your name <span className="normal-case tracking-normal font-normal text-[#9A9E9A]">(optional)</span>
          </label>
          <input id="topic-name" className="cf-in" type="text" placeholder="e.g. Sarah" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span className="block text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#6B706C] dark:text-[#A6AAA6] mb-2">Best as a…</span>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button key={f} type="button" aria-pressed={format === f} onClick={() => setFormat(format === f ? null : f)} className={chip(format === f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-7">
        <button type="button" onClick={sendWA} className="btn btn-green flex-1 min-w-[160px] h-12">Send on WhatsApp</button>
        <button type="button" onClick={sendEmail} className="btn btn-wa flex-1 min-w-[160px] h-12">Send by email</button>
      </div>
      {note && <p className="text-[#555A56] dark:text-[#A6AAA6] text-sm mt-3 text-center">{note}</p>}

      <div className="mt-7 pt-5 border-t border-[#ECECEA] dark:border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.86rem] text-[#555A56] dark:text-[#B6BAB6]">
        <span className="text-[#8A8E8A]">Rather talk?</span>
        <a href={`tel:${CLINIC.phoneIntl}`} className="inline-flex items-center gap-2 font-semibold text-[#141614] dark:text-[#F2F2EF] hover:opacity-70 transition-opacity">
          <PhoneIcon size={15} /> {CLINIC.phone}
        </a>
        <a href={waLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#141614] dark:text-[#F2F2EF] hover:opacity-70 transition-opacity">
          <ChatIcon size={16} /> WhatsApp {CLINIC.whatsappDisplay}
        </a>
      </div>
    </div>
  );
}
