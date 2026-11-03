"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function SignOutButton({ variant = "inline" }: { variant?: "inline" | "sidebar" }) {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Even if Supabase call fails, force redirect to clear any cached UI
    }
    // Hard navigation so server re-renders the header without the user
    window.location.assign("/");
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={signOut}
        disabled={busy}
        className="w-full flex items-center gap-2 text-xs text-[#8A8E8A] hover:text-[#B91C1C] px-3 py-2 rounded-lg hover:bg-[#F2F2F0] dark:hover:bg-white/5 transition text-left disabled:opacity-50"
      >
        <span>↩</span> {busy ? "Signing out…" : "Sign out"}
      </button>
    );
  }

  // inline (default, used in main site header)
  return (
    <button
      onClick={signOut}
      disabled={busy}
      className="text-[#8A8E8A] dark:text-[#999D99] hover:text-[#2B3D32] hover:underline underline-offset-4 disabled:opacity-50"
    >
      {busy ? "…" : "Sign out"}
    </button>
  );
}
