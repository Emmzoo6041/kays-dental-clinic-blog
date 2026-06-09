"use client";
import React from "react";
import { useRef, useState, useCallback } from "react";

type MediaUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  /** "audio" hides video MIME types in the file picker, "any" allows audio + video. */
  accept?: "audio" | "any";
};

/**
 * MediaUpload — drag and drop OR paste a URL.
 *
 * - If the user drops/picks a FILE, we POST it to /api/upload-media
 *   which stores it in Supabase Storage and returns a public URL.
 * - If the user pastes a URL (YouTube, Vimeo, SoundCloud, direct mp3, etc.)
 *   we accept it as-is.
 *
 * The form ends up with a single text value: the URL.
 */
export function MediaUpload({
  value,
  onChange,
  label = "Media URL or upload",
  hint = "Drag an audio file here, click to choose, or paste a URL (YouTube, SoundCloud, etc.)",
  accept = "any",
}: MediaUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const acceptAttr =
    accept === "audio"
      ? "audio/*"
      : "audio/*,video/mp4,video/webm,video/quicktime";

  const uploadFile = useCallback(
    async (file: File) => {
      setBusy(true);
      setError("");
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload-media", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
        onChange(data.url);
      } catch (e: any) {
        setError(e.message || "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [onChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-[#3D5444] dark:text-[#C8DFCC]">{label}</label>}

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition
          ${dragOver
            ? "border-[#2E7D42] bg-[#EDF7EF] dark:bg-white/5"
            : "border-[#C8DFCC] dark:border-white/15 bg-white dark:bg-white/[0.03] hover:border-[#4CAF6B]"
          }`}
      >
        {busy ? (
          <p className="text-sm text-[#2E7D42] font-medium">Uploading…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-[#3D5444] dark:text-[#C8DFCC]">
              {dragOver ? "Drop it here" : "📥 Drop a file or click to upload"}
            </p>
            <p className="text-xs text-[#7A9480] dark:text-[#8FA89A] mt-1">{hint}</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* URL input — text fallback / external links */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-[#7A9480] dark:text-[#8FA89A] whitespace-nowrap">or paste URL:</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… (YouTube, SoundCloud, or any link)"
          className="flex-1 px-3 py-2 border-2 border-[#C8DFCC] dark:border-white/15 rounded-lg bg-white dark:bg-white/5 text-sm focus:border-[#2E7D42] focus:outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-[#B91C1C] font-medium">⚠ {error}</p>
      )}

      {/* Preview of current value */}
      {value && (
        <p className="text-xs text-[#7A9480] dark:text-[#8FA89A] truncate">
          ✓ Current: <a href={value} target="_blank" rel="noreferrer" className="text-[#2E7D42] underline">{value}</a>
        </p>
      )}
    </div>
  );
}
