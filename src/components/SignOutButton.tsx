"use client";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }
  return (
    <button onClick={signOut} className="text-ink/70 hover:text-ink underline underline-offset-4">
      Sign out
    </button>
  );
}
