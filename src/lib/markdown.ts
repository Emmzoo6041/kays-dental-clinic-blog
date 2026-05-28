import { marked } from "marked";

/**
 * Lightweight HTML sanitizer — strips genuinely dangerous content.
 * Since only the admin (Dr. Esther) can author posts, the input is trusted;
 * we mainly guard against accidental <script>/<iframe>/event-handler injection.
 * This avoids the ESM-only `isomorphic-dompurify` package that crashes on Vercel's
 * server runtime (ERR_REQUIRE_ESM).
 */
function sanitize(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe(?![^>]*(youtube|vimeo))[^>]*>.*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// Renders either rich HTML (from Tiptap) or markdown (legacy/seed content).
export function renderPostContent(opts: { content: string; contentHtml?: string | null }): string {
  const { content, contentHtml } = opts;
  if (contentHtml && contentHtml.trim()) {
    return sanitize(contentHtml);
  }
  const raw = marked.parse(content || "", { async: false }) as string;
  return sanitize(raw);
}

// Legacy export for backward compatibility
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md || "", { async: false }) as string;
  return sanitize(raw);
}
