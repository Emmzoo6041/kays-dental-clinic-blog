"use client";
import { useRef, useState } from "react";

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-bold text-[#7A9480] mb-1">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="url"
            className="input flex-1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL..."
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn btn-outline !py-2 !px-4 text-sm whitespace-nowrap disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "📤 Upload"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
        {hint && <p className="text-[0.7rem] text-[#7A9480] mt-0.5">{hint}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {value && (
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
               className="relative border-2 border-dashed border-[#C8DFCC] dark:border-white/15 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full max-h-48 object-cover" />
            <button type="button" onClick={() => onChange("")}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full px-3 py-1 shadow">
              Remove
            </button>
          </div>
        )}
        {!value && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#C8DFCC] dark:border-white/15 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-[#4CAF6B] hover:bg-[#EDF7EF]/40 transition"
          >
            <p className="text-sm text-[#7A9480]">📷 Click to upload or drag an image here</p>
            <p className="text-[0.7rem] text-[#7A9480]/70 mt-1">JPG, PNG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
