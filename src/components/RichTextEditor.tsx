"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your post here...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#2E7D42] underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl my-4 max-w-full" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-blog min-h-[300px] focus:outline-none px-4 py-3",
      },
    },
  });

  // Sync external value changes (e.g. when editing an existing post loads its content)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        editor?.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  if (!editor) return <div className="h-[300px] bg-white/50 rounded-xl animate-pulse" />;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-md text-sm font-bold transition ${
      active
        ? "bg-[#2E7D42] text-white"
        : "text-[#3D5444] dark:text-[#C8DFCC] hover:bg-[#EDF7EF] dark:hover:bg-white/10"
    }`;

  return (
    <div className="border-2 border-[#C8DFCC] dark:border-white/15 rounded-xl bg-white dark:bg-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#C8DFCC] dark:border-white/10 bg-[#F6F9F3] dark:bg-white/5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                className={btn(editor.isActive("bold"))} title="Bold (Ctrl+B)">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btn(editor.isActive("italic"))} title="Italic (Ctrl+I)"><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btn(editor.isActive("strike"))} title="Strikethrough"><s>S</s></button>
        <span className="w-px bg-[#C8DFCC] dark:bg-white/15 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btn(editor.isActive("heading", { level: 2 }))} title="Heading 2">H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btn(editor.isActive("heading", { level: 3 }))} title="Heading 3">H3</button>
        <span className="w-px bg-[#C8DFCC] dark:bg-white/15 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btn(editor.isActive("bulletList"))} title="Bullet list">• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btn(editor.isActive("orderedList"))} title="Numbered list">1. List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btn(editor.isActive("blockquote"))} title="Quote">❝ Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}
                className={btn(editor.isActive("code"))} title="Inline code">{"</>"}</button>
        <span className="w-px bg-[#C8DFCC] dark:bg-white/15 mx-1" />
        <button type="button"
                onClick={() => {
                  const prev = editor.getAttributes("link").href ?? "";
                  const url = window.prompt("Link URL", prev);
                  if (url === null) return;
                  if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}
                className={btn(editor.isActive("link"))} title="Insert link">🔗 Link</button>
        <button type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className={btn(false)} title="Insert image">
          {uploading ? "Uploading…" : "🖼 Image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
               onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
        <span className="w-px bg-[#C8DFCC] dark:bg-white/15 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
                className={btn(false)} title="Undo (Ctrl+Z)">↶</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
                className={btn(false)} title="Redo (Ctrl+Shift+Z)">↷</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
