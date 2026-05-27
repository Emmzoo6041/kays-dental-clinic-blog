"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      router.refresh();
      router.push("/");
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-ink/5 rounded-2xl p-7 space-y-4">
      <div>
        <label className="block text-sm mb-1.5 text-ink/70">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5 text-ink/70">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {info && <p className="text-teal-dark text-sm">{info}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
        {loading ? "…" : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <p className="text-sm text-ink/60 text-center">
        {mode === "login" ? (
          <>No account? <Link href="/signup" className="text-teal underline underline-offset-4">Sign up</Link></>
        ) : (
          <>Already a member? <Link href="/login" className="text-teal underline underline-offset-4">Log in</Link></>
        )}
      </p>
    </form>
  );
}
