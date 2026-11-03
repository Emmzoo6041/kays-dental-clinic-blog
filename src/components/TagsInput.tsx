"use client";
import { useState } from "react";

export function TagsInput({
  value,
  onChange,
  placeholder = "Add tag and press Enter",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add(s: string) {
    const t = s.trim().toLowerCase().replace(/[^a-z0-9-\s]/g, "").replace(/\s+/g, "-");
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-wrap gap-1.5 input items-center min-h-[44px] !py-1.5">
      {value.map((t, i) => (
        <span key={t} className="inline-flex items-center gap-1 bg-[#F2F2EF] text-[#1B1F1C] text-xs font-bold rounded-full px-3 py-1">
          {t}
          <button type="button" onClick={() => remove(i)} className="text-[#1B1F1C]/70 hover:text-red-600 text-base leading-none">×</button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            remove(value.length - 1);
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
      />
    </div>
  );
}
