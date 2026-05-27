"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { format } from "date-fns";

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
  user_id: string;
  status?: string;
};

export function CommentsSection({
  postId,
  initialComments,
  currentUser
}: {
  postId: string;
  initialComments: Comment[];
  currentUser: { id: string; email: string } | null;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [name, setName] = useState(currentUser?.email.split("@")[0] || "");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [pendingNotice, setPendingNotice] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    setPosting(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        author_name: name.trim() || "Anonymous",
        body: body.trim(),
        status: "pending",
      })
      .select("id, author_name, body, created_at, user_id, status")
      .single();
    setPosting(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Show their own comment immediately so it's not jarring
    setComments((c) => [...c, data as Comment]);
    setBody("");
    setPendingNotice(true);
    setTimeout(() => setPendingNotice(false), 6000);
  }

  async function deleteComment(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) setComments((c) => c.filter((x) => x.id !== id));
  }

  const visibleComments = comments.filter(c => !c.status || c.status === "approved" || (currentUser && c.user_id === currentUser.id));

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold mb-6 text-[#1E5C2E] dark:text-[#D4EDD9]">
        Comments {visibleComments.length > 0 && <span className="text-[#7A9480]">({visibleComments.length})</span>}
      </h2>

      {pendingNotice && (
        <div className="bg-[#FFF3B0] border-2 border-[#E6B800] text-[#B8860B] rounded-xl p-4 mb-6 text-sm">
          ✓ Comment submitted — it will appear publicly once Dr. Esther approves it. You can still see your own comment below.
        </div>
      )}

      {visibleComments.length === 0 && <p className="text-[#7A9480] mb-8">Be the first to leave a thought.</p>}

      <ul className="space-y-5 mb-10">
        {visibleComments.map((c) => {
          const isOwnPending = currentUser && c.user_id === currentUser.id && c.status === "pending";
          return (
            <li key={c.id} className={`bg-white dark:bg-white/5 rounded-xl border-2 ${isOwnPending ? "border-[#E6B800]" : "border-[#D4EDD9] dark:border-white/10"} p-5`}>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <p className="font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">{c.author_name}</p>
                <span className="text-xs text-[#7A9480]">
                  {format(new Date(c.created_at), "MMM d, yyyy 'at' h:mm a")}
                  {isOwnPending && <span className="ml-2 px-2 py-0.5 bg-[#FFF3B0] text-[#B8860B] rounded-full font-bold text-[0.65rem]">PENDING APPROVAL</span>}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[#3D5444] dark:text-[#C8DFCC]">{c.body}</p>
              {currentUser && currentUser.id === c.user_id && (
                <button onClick={() => deleteComment(c.id)} className="mt-2 text-xs text-red-600 hover:underline">Delete</button>
              )}
            </li>
          );
        })}
      </ul>

      {currentUser ? (
        <form onSubmit={submit} className="bg-white dark:bg-white/5 rounded-xl border-2 border-[#D4EDD9] dark:border-white/10 p-5">
          <h3 className="font-display text-lg mb-3 text-[#1E5C2E] dark:text-[#D4EDD9]">Leave a comment</h3>
          <p className="text-xs text-[#7A9480] mb-3">All comments are reviewed by Dr. Esther before being published.</p>
          <label className="block text-sm mb-1 text-[#7A9480]">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input mb-3" placeholder="How should we call you?" />
          <label className="block text-sm mb-1 text-[#7A9480]">Comment</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required minLength={2} className="textarea"
                    placeholder="Share a thought, question, or story…" />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button type="submit" disabled={posting || !body.trim()} className="btn btn-green mt-4 disabled:opacity-50">
            {posting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-white/5 rounded-xl border-2 border-[#D4EDD9] dark:border-white/10 p-5 text-center">
          <p className="text-[#7A9480] mb-3">
            <Link href="/login" className="text-[#2E7D42] underline">Log in</Link>{" or "}
            <Link href="/signup" className="text-[#2E7D42] underline">sign up</Link>{" to leave a comment."}
          </p>
        </div>
      )}
    </section>
  );
}
