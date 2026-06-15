"use client";
import React, { useRef, useState, useCallback } from "react";

type MediaUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  /** "audio" hints the file picker, "any" allows audio + video. */
  accept?: "audio" | "any";
};

const MAX_BYTES = 50 * 1024 * 1024; // 50MB — matches Supabase bucket limit

/**
 * Parse an HTTP response that's *supposed* to be JSON but might be plain text
 * (e.g. when Vercel returns "Request Entity Too Large" before our code runs).
 * Returns a clean error message — never crashes.
 */
async function readErrorText(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return `Server responded ${res.status}`;
  // Try to parse as JSON; fall back to raw text trimmed
  try {
    const j = JSON.parse(text);
    if (j && typeof j.error === "string") return j.error;
    return text.slice(0, 200);
  } catch {
    return text.slice(0, 200);
  }
}

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const acceptAttr = "audio/*,video/mp4,video/webm,video/quicktime";

  const uploadFile = useCallback(
    async (file: File) => {
      setBusy(true);
      setError("");
      setProgress(0);
      try {
        if (file.size > MAX_BYTES) {
          throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 50MB.`);
        }

        // Step 1: ask our server for a signed upload URL (tiny JSON request)
        const signRes = await fetch("/api/sign-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        if (!signRes.ok) {
          throw new Error(await readErrorText(signRes));
        }
        const sign = (await signRes.json()) as {
          uploadUrl: string;
          token: string;
          path: string;
          publicUrl: string;
        };

        // Step 2: upload the file directly to Supabase using XHR (so we get progress events)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", sign.uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.setRequestHeader("x-upsert", "false");

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed (${xhr.status}). ${xhr.responseText?.slice(0, 200) || ""}`));
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(file);
        });

        onChange(sign.publicUrl);
        setProgress(100);
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

      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !busy && fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition
          ${dragOver
            ? "border-[#2E7D42] bg-[#EDF7EF] dark:bg-white/5"
            : "border-[#C8DFCC] dark:border-white/15 bg-white dark:bg-white/[0.03] hover:border-[#4CAF6B]"
          }
          ${busy ? "cursor-wait" : ""}`}
      >
        {busy ? (
          <div className="space-y-2">
            <p className="text-sm text-[#2E7D42] font-medium">Uploading… {progress}%</p>
            <div className="w-full h-1.5 rounded-full bg-[#D4EDD9] dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#2E7D42] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
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

      {value && !busy && !error && (
        <p className="text-xs text-[#7A9480] dark:text-[#8FA89A] truncate">
          ✓ Current: <a href={value} target="_blank" rel="noreferrer" className="text-[#2E7D42] underline">{value}</a>
        </p>
      )}
    </div>
  );
}

