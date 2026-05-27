"use client";
import { useState } from "react";
import { marked } from "marked";

export function NewsletterComposer() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; sent?: number; failed?: number; error?: string } | null>(null);

  async function send() {
    if (!confirm(`Send "${subject}" to all subscribers now?`)) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setResult({ ok: true, sent: data.sent, failed: data.failed });
      setSubject("");
      setBody("");
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setSending(false);
    }
  }

  const preview = marked.parse(body || "*Preview shows here.*", { async: false }) as string;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border border-ink/5 p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1 text-ink/70">Subject line</label>
          <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="A quick note from the clinic" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">Body (markdown)</label>
          <textarea
            className="textarea min-h-[280px] font-mono text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={"Hi everyone,\n\nQuick update from the clinic this month…"}
          />
        </div>
        <button
          onClick={send}
          disabled={sending || !subject.trim() || !body.trim()}
          className="btn btn-primary disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send to all subscribers"}
        </button>
        {result?.ok && (
          <p className="text-teal-dark text-sm">
            ✓ Sent to {result.sent}. {result.failed ? `${result.failed} failed.` : ""}
          </p>
        )}
        {result?.error && <p className="text-red-600 text-sm">{result.error}</p>}
      </div>

      <div className="bg-cream rounded-2xl border border-ink/5 p-6">
        <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">Preview</p>
        <h3 className="font-display text-xl font-semibold mb-3">{subject || "(subject)"}</h3>
        <div className="prose-blog text-base" dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
    </div>
  );
}
