"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/login` }
      });
      setLoading(false);
      if (error) return setError(error.message);
      setInfo("Account created. Check your email to confirm, then log in.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return setError(error.message);
      }

      // Decide where to send them BEFORE redirecting — admins go straight to dashboard.
      // We call the server to check admin status (which reads the ADMIN_EMAIL env var server-side).
      let destination = "/";
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (res.ok) {
          const me = await res.json();
          if (me?.isAdmin) destination = "/admin";
        }
      } catch {
        // If the check fails, fall back to homepage — login still succeeded
      }

      // Hard navigation so the new auth cookie is included in the next request
      // and the Header is re-rendered server-side with the admin status applied.
      window.location.assign(destination);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white dark:bg-white/5 border border-[#D4EDD9] dark:border-white/10 rounded-2xl p-7 space-y-4">
      <div>
        <label className="block text-sm mb-1.5 text-[#7A9480]">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5 text-[#7A9480]">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="input pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9480] hover:text-[#1E5C2E] text-lg leading-none p-1"
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {info && <p className="text-[#2E7D42] text-sm">{info}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#2E7D42] hover:bg-[#1E5C2E] text-white rounded-full font-bold py-2.5 px-6 w-full disabled:opacity-50 transition"
      >
        {loading ? "…" : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <p className="text-sm text-[#7A9480] text-center">
        {mode === "login" ? (
          <>No account? <Link href="/signup" className="text-[#2E7D42] underline underline-offset-4">Sign up</Link></>
        ) : (
          <>Already a member? <Link href="/login" className="text-[#2E7D42] underline underline-offset-4">Log in</Link></>
        )}
      </p>
    </form>
  );
}
