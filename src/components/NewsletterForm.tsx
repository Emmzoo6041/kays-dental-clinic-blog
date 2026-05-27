"use client";
import { useState } from "react";

export function NewsletterForm() {
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
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("ok");
      setMessage("You're in. Welcome!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 flex-col sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-full bg-cream text-ink placeholder:text-ink/40 outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn !py-2.5 bg-accent text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {message && (
        <p className={`text-xs mt-1 ${status === "error" ? "text-red-300" : "text-cream/80"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
