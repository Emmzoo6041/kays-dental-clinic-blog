"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Failed to delete post.");
  }

  return (
    <button onClick={onDelete} disabled={loading} className="text-red-600 hover:underline disabled:opacity-50">
      {loading ? "…" : "Delete"}
    </button>
  );
}
