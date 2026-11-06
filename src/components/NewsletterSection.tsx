"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("ok");
      setMessage("You're in. Welcome to the family! 🎉");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <section className="relative px-[5vw] py-20 overflow-hidden bg-[#FAFAF9] dark:bg-[#0e100f] border-t border-[#ECECEA] dark:border-white/5">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <span className="s-tag">Newsletter</span>
        <h2 className="display-italic text-[2.2rem] md:text-[3rem] leading-[1.08] text-[#141614] dark:text-[#F2F2EF] mt-1 mb-4">
          Get the latest in your inbox
        </h2>
        <p className="text-[#555A56] dark:text-[#A6AAA6] mb-8 leading-relaxed">
          One short email a week from Dr. Esther — new articles, podcast episodes, and the occasional dental tip you can actually use. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-[10px] bg-white dark:bg-white/10 text-[#1B1F1C] dark:text-[#E7E8E5] placeholder:text-[#8A8E8A] outline-none border border-[#DDDFDB] dark:border-white/15 focus:border-[#2B3D32]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-green disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe →"}
          </button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm mt-4 font-semibold ${status === "error" ? "text-red-600" : "text-[#2B3D32]"}`}
          >
            {message}
          </motion.p>
        )}
        <p className="text-xs text-[#8A8E8A] mt-4">Used by 500+ Ugandan families. We&apos;ll never share your email.</p>
      </motion.div>
    </section>
  );
}
