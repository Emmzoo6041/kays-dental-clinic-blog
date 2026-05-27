"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { TagsInput } from "./TagsInput";

type Category = { slug: string; name: string };

type Post = {
  id?: string;
  slug?: string;
  type?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  content_html?: string | null;
  cover_url?: string | null;
  media_url?: string | null;
  duration?: string | null;
  category?: string | null;
  episode?: string | null;
  published?: boolean;
  featured?: boolean;
  tags?: string[] | null;
  scheduled_for?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
};

const TYPES = [
  { key: "article", label: "📝 Article" },
  { key: "podcast", label: "🎙 Podcast" },
  { key: "video",   label: "🎬 Video" },
];

export function PostEditor({ initial, categories }: { initial?: Post; categories: Category[] }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [type, setType] = useState(initial?.type || "article");
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [contentHtml, setContentHtml] = useState(initial?.content_html || initial?.content || "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url || "");
  const [mediaUrl, setMediaUrl] = useState(initial?.media_url || "");
  const [duration, setDuration] = useState(initial?.duration || "");
  const [episode, setEpisode] = useState(initial?.episode || "");
  const [category, setCategory] = useState(initial?.category || categories[0]?.slug || "general");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [scheduledFor, setScheduledFor] = useState(initial?.scheduled_for ? toLocalInput(initial.scheduled_for) : "");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title || "");
  const [metaDesc, setMetaDesc] = useState(initial?.meta_description || "");
  const [ogImage, setOgImage] = useState(initial?.og_image || "");
  const [showSeo, setShowSeo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      type, title, excerpt,
      content: stripHtml(contentHtml),
      content_html: contentHtml,
      cover_url: coverUrl, media_url: mediaUrl,
      duration, episode, category, tags,
      published, featured,
      scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      meta_title: metaTitle || null,
      meta_description: metaDesc || null,
      og_image: ogImage || null,
    };
    const res = await fetch(isEdit ? `/api/posts/${initial!.id}` : "/api/posts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Save failed");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div>
      {!isEdit && (
        <div className="flex flex-wrap gap-2 mb-6">
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setType(t.key)}
                    className={`px-4 py-2 rounded-full font-bold text-sm border-2 transition ${
                      type === t.key
                        ? "bg-[#2E7D42] text-white border-[#2E7D42]"
                        : "bg-white dark:bg-white/5 border-[#C8DFCC] dark:border-white/15 hover:border-[#4CAF6B]"
                    }`}>{t.label}</button>
          ))}
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr,360px] gap-6">
        <div className="space-y-5">
          <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Title</label>
              <input className="input text-lg font-display" value={title} onChange={e => setTitle(e.target.value)}
                     placeholder={type === "podcast" ? "Episode title" : type === "video" ? "Video title" : "Article title"} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Excerpt (shown on cards)</label>
              <input className="input" value={excerpt || ""} onChange={e => setExcerpt(e.target.value)}
                     placeholder="One engaging sentence about this post" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-2">Content</label>
              <RichTextEditor value={contentHtml} onChange={setContentHtml}
                placeholder={"Write your post here. Use the toolbar to format text, add images, links, and lists."} />
            </div>
          </div>

          {(type === "podcast" || type === "video") && (
            <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">
                {type === "podcast" ? "🎙 Audio" : "🎬 Video"}
              </h3>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">
                  {type === "podcast" ? "Audio URL (MP3 / Anchor.fm)" : "Video URL (YouTube or .mp4)"}
                </label>
                <input className="input" value={mediaUrl || ""} onChange={e => setMediaUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Duration</label>
                  <input className="input" value={duration || ""} onChange={e => setDuration(e.target.value)}
                         placeholder={type === "podcast" ? "22 mins" : "1:02"} />
                </div>
                {type === "podcast" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Episode label</label>
                    <input className="input" value={episode || ""} onChange={e => setEpisode(e.target.value)} placeholder="Episode 4" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6">
            <button type="button" onClick={() => setShowSeo(s => !s)} className="flex items-center justify-between w-full text-left">
              <h3 className="font-display text-lg font-bold text-[#1E5C2E] dark:text-[#D4EDD9]">🔍 SEO &amp; Social Sharing</h3>
              <span className="text-2xl text-[#7A9480]">{showSeo ? "−" : "+"}</span>
            </button>
            <p className="text-xs text-[#7A9480] mt-1">Customise how this post appears in Google &amp; social shares.</p>
            {showSeo && (
              <div className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Meta title</label>
                  <input className="input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title} maxLength={70} />
                  <p className="text-[0.7rem] text-[#7A9480] mt-0.5">{metaTitle.length}/70</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Meta description</label>
                  <textarea className="textarea" value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder={excerpt || ""} maxLength={160} />
                  <p className="text-[0.7rem] text-[#7A9480] mt-0.5">{metaDesc.length}/160</p>
                </div>
                <ImageUpload value={ogImage} onChange={setOgImage} label="Social share image"
                             hint="Recommended 1200×630. Falls back to cover image if blank." />
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6 sticky top-24">
            <h3 className="font-display text-lg font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mb-4">Publish</h3>
            <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 accent-[#2E7D42]" />
              <span className="font-semibold text-sm">Published (live on site)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none mb-4">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-[#E6B800]" />
              <span className="font-semibold text-sm">⭐ Featured (pin to top)</span>
            </label>
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Schedule (optional)</label>
              <input type="datetime-local" className="input" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} />
              <p className="text-[0.7rem] text-[#7A9480] mt-0.5">Auto-publishes at this date.</p>
            </div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button onClick={save} disabled={saving || !title.trim() || !contentHtml.trim()}
                    className="btn btn-green w-full disabled:opacity-50">
              {saving ? "Saving…" : isEdit ? "💾 Save changes" : "🚀 Create post"}
            </button>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6">
            <h3 className="font-display text-lg font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mb-3">Taxonomy</h3>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Category</label>
            <select className="input mb-4" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">Tags</label>
            <TagsInput value={tags} onChange={setTags} placeholder="Enter to add" />
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-[#C8DFCC] dark:border-white/10 p-6">
            <ImageUpload value={coverUrl} onChange={setCoverUrl} label="Cover image"
                         hint="Shown on post cards and at the top of the post." />
          </div>
        </aside>
      </div>
    </div>
  );
}

function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent || "";
  }
  return html.replace(/<[^>]*>/g, "");
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
