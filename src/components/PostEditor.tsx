"use client";
import React from "react";

import { useRouter } from "next/navigation";
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
  content: string;        // markdown (legacy / fallback)
  content_html: string;   // rich HTML from editor
  cover_url: string;
  media_url: string;          // primary media (video URL for video posts, podcast audio URL for podcasts)
  audio_url: string;          // article narration audio (optional)
  podcast_video_url: string;  // optional video version of a podcast (for "Watch" button)
  duration: string;
  episode: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  scheduled_for: string;       // ISO local datetime string or ""
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
  const router = useRouter();
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
      router.push("/admin/posts");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const isArticle = form.type === "article";
  const isPodcast = form.type === "podcast";
  const isVideo = form.type === "video";

  return (
    <div className="max-w-3xl space-y-7">
      <header>
        <h1 className="font-display text-3xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">
          {form.id ? "Edit post" : "New post"}
        </h1>
        <p className="text-sm text-[#7A9480] mt-1">
          Articles can include a short excerpt for the cards, the full content, and an optional audio narration.
          Podcasts get an audio file (drag and drop) plus an optional video version.
          Videos only need a YouTube/Vimeo URL.
        </p>
      </header>

      {/* TYPE */}
      <Section title="What are you publishing?">
        <div className="grid grid-cols-3 gap-2">
          {(["article", "podcast", "video"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("type", t)}
              className={`px-3 py-3 rounded-lg text-sm font-bold capitalize border-2 transition
                ${form.type === t
                  ? "bg-[#1E5C2E] text-white border-[#1E5C2E]"
                  : "bg-white dark:bg-white/5 text-[#3D5444] dark:text-[#C8DFCC] border-[#C8DFCC] dark:border-white/15 hover:border-[#4CAF6B]"
                }`}
            >
              {t === "article" ? "📝 Article" : t === "podcast" ? "🎙 Podcast" : "🎬 Video"}
            </button>
          ))}
        </div>
      </Section>

      {/* TITLE + EXCERPT */}
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
          <p className="text-xs text-[#7A9480] mt-1">
            {form.excerpt.length} chars · aim for ~140–200 for best display
          </p>
        </Field>
      </Section>

      {/* COVER */}
      <Section title="Cover image">
        <ImageUpload value={form.cover_url} onChange={(u) => update("cover_url", u)} />
      </Section>

      {/* MAIN CONTENT */}
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

      {/* MEDIA — per type */}
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
          <Section title="Podcast audio (Listen)">
            <MediaUpload
              value={form.media_url}
              onChange={(u) => update("media_url", u)}
              label=""
              hint="Drop an .mp3 or .m4a file (up to 50MB), or paste a SoundCloud / external link."
              accept="audio"
            />
          </Section>

          <Section title="Optional: Video version (Watch)">
            <MediaUpload
              value={form.podcast_video_url}
              onChange={(u) => update("podcast_video_url", u)}
              label=""
              hint="If you also recorded a video of this episode, paste its YouTube URL here. A 'Watch' button will appear next to 'Listen'."
              accept="any"
            />
          </Section>
        </>
      )}

      {isArticle && (
        <Section title="Optional: Audio narration (for the Listen button)">
          <MediaUpload
            value={form.audio_url}
            onChange={(u) => update("audio_url", u)}
            label=""
            hint="If you record yourself reading this article, drop the .mp3 here. A 'Listen' button will appear on the article."
            accept="audio"
          />
        </Section>
      )}

      {/* CATEGORIZATION */}
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

      {/* PUBLISH OPTIONS */}
      <Section title="Publishing">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 accent-[#2E7D42]"
          />
          <span className="text-sm text-[#3D5444] dark:text-[#C8DFCC]">⭐ Featured (highlight on homepage)</span>
        </label>

        <Field label="Schedule for (optional)">
          <input
            type="datetime-local"
            value={form.scheduled_for}
            onChange={(e) => update("scheduled_for", e.target.value)}
            className="input-full"
          />
          <p className="text-xs text-[#7A9480] mt-1">
            Leave blank to publish immediately when you click Publish.
          </p>
        </Field>
      </Section>

      {/* SEO (collapsible feel) */}
      <details className="bg-[#F6F9F3] dark:bg-white/[0.03] rounded-lg p-4 border border-[#E5EDE7] dark:border-white/10">
        <summary className="cursor-pointer text-sm font-semibold text-[#3D5444] dark:text-[#C8DFCC]">
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

      {/* ACTIONS */}
      <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-white/95 dark:bg-[#0a1a0b]/95 backdrop-blur border-t border-[#E5EDE7] dark:border-white/10 flex gap-3 justify-end">
        <button
          type="button"
          disabled={busy}
          onClick={() => save(false)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 border-[#C8DFCC] text-[#3D5444] hover:bg-[#F0F4F0] disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="button"
          disabled={busy || !form.title.trim()}
          onClick={() => save(true)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1E5C2E] hover:bg-[#2E7D42] text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : form.id ? "Update" : "Publish"}
        </button>
      </div>
    </div>
  );
}

/* --- Small layout helpers --- */

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-base font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1.5 text-[#7A9480]">{label}</label>}
      {children}
    </div>
  );
}
