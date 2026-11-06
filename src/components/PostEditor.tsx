"use client";
import React from "react";

import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { MediaUpload } from "./MediaUpload";
import { TagsInput } from "./TagsInput";

type PostType = "article" | "podcast" | "video";

export type PostFormData = {
  id?: string;
  slug?: string;
  type: PostType;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  content_html: string;
  cover_url: string;
  media_url: string;
  audio_url: string;
  podcast_video_url: string;
  duration: string;
  episode: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  scheduled_for: string;
  meta_title: string;
  meta_description: string;
};

const CATEGORIES = [
  "hygiene",
  "cosmetic",
  "children",
  "nutrition",
  "holistic",
  "podcast",
  "general",
];

export function PostEditor({ initial }: { initial?: Partial<PostFormData> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<PostFormData>({
    type: "article",
    category: "general",
    title: "",
    excerpt: "",
    content: "",
    content_html: "",
    cover_url: "",
    media_url: "",
    audio_url: "",
    podcast_video_url: "",
    duration: "",
    episode: "",
    tags: [],
    featured: false,
    published: false,
    scheduled_for: "",
    meta_title: "",
    meta_description: "",
    ...initial,
  });

  function update<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(publish: boolean) {
    setBusy(true);
    setError("");
    try {
      const payload = { ...form, published: publish || form.published };
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/posts/${form.id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }
      // HARD navigate so the form state is fully torn down
      // (was: router.push + router.refresh — that kept stale state across "New Post" clicks)
      window.location.assign("/admin/posts");
    } catch (e: any) {
      setError(e.message || "Save failed");
      setBusy(false);
    }
  }

  const isArticle = form.type === "article";
  const isPodcast = form.type === "podcast";
  const isVideo = form.type === "video";

  return (
    <div className="max-w-3xl space-y-7">
      <header>
        <h1 className="font-display text-3xl font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">
          {form.id ? "Edit post" : "New post"}
        </h1>
        <p className="text-sm text-[#8A8E8A] mt-1">
          Articles can include a short excerpt for the cards, the full content, and an optional audio narration.
          Podcasts get an audio file (drag and drop) plus an optional video version.
          Videos only need a YouTube/Vimeo URL.
        </p>
      </header>

      <Section title="What are you publishing?">
        <div className="grid grid-cols-3 gap-2">
          {(["article", "podcast", "video"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("type", t)}
              className={`px-3 py-3 rounded-lg text-sm font-bold capitalize border-2 transition
                ${form.type === t
                  ? "bg-[#1B1F1C] text-white border-[#1B1F1C]"
                  : "bg-white dark:bg-white/5 text-[#555A56] dark:text-[#E2E3E0] border-[#E2E3E0] dark:border-white/15 hover:border-[#8FA396]"
                }`}
            >
              {t === "article" ? "📝 Article" : t === "podcast" ? "🎙 Podcast" : "🎬 Video"}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Headline">
        <Field label="Title">
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. 10 Foods Quietly Damaging Your Teeth"
            className="input-full"
          />
        </Field>

        <Field label="Short excerpt (shown on cards & previews)">
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            placeholder="One or two sentences. This is what readers see before clicking 'Read more'."
            className="input-full resize-y"
          />
          <p className="text-xs text-[#8A8E8A] mt-1">
            {form.excerpt.length} chars · aim for ~140–200 for best display
          </p>
        </Field>
      </Section>

      <Section title="Cover image">
        <ImageUpload value={form.cover_url} onChange={(u) => update("cover_url", u)} />
      </Section>

      <Section title={isVideo ? "Video description" : "Full content"}>
        <RichTextEditor
          value={form.content_html || form.content}
          onChange={(html) => update("content_html", html)}
          placeholder={
            isArticle
              ? "Paste the full article here. The excerpt above will be shown as the teaser; this is what people read after clicking Read more."
              : isPodcast
              ? "Episode show notes, links, references mentioned…"
              : "Brief description, what the viewer will learn…"
          }
        />
      </Section>

      {isVideo && (
        <Section title="Video URL">
          <MediaUpload
            value={form.media_url}
            onChange={(u) => update("media_url", u)}
            label=""
            hint="Paste the YouTube or Vimeo URL of the video (recommended). Or drop a small .mp4 file."
            accept="any"
          />
        </Section>
      )}

      {isPodcast && (
        <>
          <Section title="Podcast media (Listen / Watch)">
            <MediaUpload
              value={form.media_url}
              onChange={(u) => update("media_url", u)}
              label=""
              hint="Full video episodes: upload to YouTube and paste the YouTube link here (best for long episodes). Short audio: drop an .mp3 or .m4a (up to 50MB)."
              accept="any"
            />
          </Section>

          <Section title="Optional: Separate video version (extra Watch button)">
            <MediaUpload
              value={form.podcast_video_url}
              onChange={(u) => update("podcast_video_url", u)}
              label=""
              hint="If you also recorded a separate video of this episode (e.g. on YouTube), paste its URL here. It will add a second 'Watch' button beside Listen."
              accept="any"
            />
          </Section>
        </>
      )}

      <Section title="Category and tags">
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="input-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </Field>

        <Field label="Tags (press Enter after each)">
          <TagsInput value={form.tags} onChange={(t) => update("tags", t)} />
        </Field>

        {isPodcast && (
          <>
            <Field label="Duration (e.g. 24 mins)">
              <input
                type="text"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="24 mins"
                className="input-full"
              />
            </Field>
            <Field label="Episode label (e.g. Episode 4)">
              <input
                type="text"
                value={form.episode}
                onChange={(e) => update("episode", e.target.value)}
                placeholder="Episode 4"
                className="input-full"
              />
            </Field>
          </>
        )}

        {isVideo && (
          <Field label="Duration (e.g. 1:32)">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              placeholder="1:32"
              className="input-full"
            />
          </Field>
        )}
      </Section>

      <Section title="Publishing">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 accent-[#2B3D32]"
          />
          <span className="text-sm text-[#555A56] dark:text-[#E2E3E0]">⭐ Featured (highlight on homepage)</span>
        </label>

        <Field label="Schedule for (optional)">
          <input
            type="datetime-local"
            value={form.scheduled_for}
            onChange={(e) => update("scheduled_for", e.target.value)}
            className="input-full"
          />
          <p className="text-xs text-[#8A8E8A] mt-1">
            Leave blank to publish immediately when you click Publish.
          </p>
        </Field>
      </Section>

      <details className="bg-[#F8F8F6] dark:bg-white/[0.03] rounded-lg p-4 border border-[#E8E8E6] dark:border-white/10">
        <summary className="cursor-pointer text-sm font-semibold text-[#555A56] dark:text-[#E2E3E0]">
          ▸ SEO meta (optional)
        </summary>
        <div className="mt-4 space-y-3">
          <Field label="Meta title">
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => update("meta_title", e.target.value)}
              placeholder="Defaults to the post title"
              className="input-full"
            />
          </Field>
          <Field label="Meta description">
            <textarea
              value={form.meta_description}
              onChange={(e) => update("meta_description", e.target.value)}
              rows={2}
              placeholder="Defaults to the excerpt"
              className="input-full resize-y"
            />
          </Field>
        </div>
      </details>

      {error && (
        <p className="text-sm text-[#B91C1C] font-semibold">⚠ {error}</p>
      )}

      <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-white/95 dark:bg-[#0e100f]/95 backdrop-blur border-t border-[#E8E8E6] dark:border-white/10 flex gap-3 justify-end">
        <button
          type="button"
          disabled={busy}
          onClick={() => save(false)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 border-[#E2E3E0] text-[#555A56] hover:bg-[#F2F2F0] disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="button"
          disabled={busy || !form.title.trim()}
          onClick={() => save(true)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1B1F1C] hover:bg-[#2B3D32] text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : form.id ? "Update" : "Publish"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-base font-bold text-[#1B1F1C] dark:text-[#E7E8E5]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1.5 text-[#8A8E8A]">{label}</label>}
      {children}
    </div>
  );
}
