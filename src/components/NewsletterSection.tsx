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
    <section className="relative px-[5vw] py-20 overflow-hidden bg-[#FFFBE6] dark:bg-[#1a1810]">
      {/* Floating decorative shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[10%] text-5xl opacity-30"
      >✉️</motion.div>
      <motion.div
        animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-[12%] text-4xl opacity-30"
      >🦷</motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-16 left-[20%] text-3xl opacity-30"
      >💛</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <span className="s-tag">✉ Newsletter</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mt-3 mb-4">
          Get the latest in your inbox
        </h2>
        <p className="text-[#3D5444] dark:text-[#A5B8AB] mb-8 leading-relaxed">
          One short email a week from Dr. Esther — new articles, podcast episodes, and the occasional dental tip you can actually use. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-full bg-white dark:bg-white/10 text-[#1A2E1E] dark:text-[#D4EDD9] placeholder:text-[#7A9480] outline-none border-2 border-[#D4EDD9] dark:border-white/15 focus:border-[#2E7D42]"
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
            className={`text-sm mt-4 font-semibold ${status === "error" ? "text-red-600" : "text-[#2E7D42]"}`}
          >
            {message}
          </motion.p>
        )}
        <p className="text-xs text-[#7A9480] mt-4">Used by 500+ Ugandan families. We&apos;ll never share your email.</p>
      </motion.div>
    </section>
  );
}
