"use client";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export function SignOutButton({ variant = "inline" }: { variant?: "inline" | "sidebar" }) {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={signOut}
        className="w-full flex items-center gap-2 text-xs text-[#7A9480] hover:text-[#B91C1C] px-3 py-2 rounded-lg hover:bg-[#F0F4F0] dark:hover:bg-white/5 transition text-left"
      >
        <span>↩</span> Sign out
      </button>
    );
  }

  return (
    <button
      onClick={signOut}
      className="text-[#7A9480] dark:text-[#8FA89A] hover:text-[#2E7D42] hover:underline underline-offset-4"
    >
      Sign out
    </button>
  );
}
