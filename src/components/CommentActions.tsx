"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(newStatus: string) {
    setBusy(true);
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }
  async function del() {
    if (!confirm("Delete this comment permanently?")) return;
    setBusy(true);
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {status !== "approved" && (
        <button onClick={() => set("approved")} disabled={busy}
                className="px-3 py-1.5 rounded-full bg-[#8FA396] text-white text-xs font-bold hover:bg-[#2B3D32] disabled:opacity-50">
          ✓ Approve
        </button>
      )}
      {status !== "rejected" && (
        <button onClick={() => set("rejected")} disabled={busy}
                className="px-3 py-1.5 rounded-full bg-[#8A8E8A] text-white text-xs font-bold hover:bg-[#555A56] disabled:opacity-50">
          ✗ Reject
        </button>
      )}
      <button onClick={del} disabled={busy}
              className="px-3 py-1.5 rounded-full bg-[#B91C1C] text-white text-xs font-bold hover:bg-red-800 disabled:opacity-50">
        🗑 Delete
      </button>
    </div>
  );
}
