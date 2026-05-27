import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// Renders either rich HTML (from Tiptap) or markdown (legacy/seed content).
// If contentHtml exists, use that (already sanitized below).
// Otherwise treat content as markdown and convert.
export function renderPostContent(opts: { content: string; contentHtml?: string | null }): string {
  const { content, contentHtml } = opts;
  if (contentHtml && contentHtml.trim()) {
    return DOMPurify.sanitize(contentHtml);
  }
  const raw = marked.parse(content || "", { async: false }) as string;
  return DOMPurify.sanitize(raw);
}

// Legacy export for backward compatibility
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md || "", { async: false }) as string;
  return DOMPurify.sanitize(raw);
}
