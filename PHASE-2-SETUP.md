# Phase 2 setup — required steps before running

Phase 2 added rich text editing, image uploads, scheduling, categories, comment moderation, analytics, and featured posts. Before `npm run dev` works on the new code, you need to:

1. **Run the SQL migration** (adds new columns and tables)
2. **Create the image storage bucket** in Supabase
3. **Install new packages** (`npm install`)

This takes ~5 minutes total.

---

## Step 1 — Run the SQL migration

1. Open your Supabase project in the browser.
2. Left sidebar → **SQL Editor** → **New query**.
3. Open `supabase/schema-phase2.sql` from this project (in your code editor or Notepad).
4. Copy the **entire file** and paste it into the SQL Editor.
5. Click **Run**.

You should see "Success. No rows returned." and rows in the affected count.

What this adds:
- New columns on `posts`: `scheduled_for`, `views`, `meta_title`, `meta_description`, `og_image`, `featured`, `tags`, `content_html`
- A new `categories` table seeded with Hygiene/Cosmetic/Children/Nutrition/Holistic/General
- A new `post_views` table for daily view tracking
- An `increment_post_view` function for atomic view counts
- New comment moderation: existing comments are auto-approved; new comments default to **pending**

---

## Step 2 — Create the `post-images` storage bucket

This is what holds Dr Esther's uploaded images.

1. In Supabase, left sidebar → **Storage**.
2. Click **New bucket** (top-right).
3. **Name:** `post-images` (exact spelling, lowercase, no spaces)
4. **Public bucket:** ✅ **TURN THIS ON** (so the images are visible to all visitors)
5. **File size limit:** `5 MB` (optional but recommended)
6. **Allowed MIME types:** leave blank, or paste `image/jpeg,image/png,image/webp,image/gif`
7. Click **Save**.

That's it — the bucket is now ready. The SQL migration already added the read policy for it.

### Verify (optional)
- Go back to **Storage** → click your `post-images` bucket → it should show "Public" in green.
- Try uploading a test image directly from the Supabase UI (Upload file button). You should get a URL like `https://YOUR-PROJECT.supabase.co/storage/v1/object/public/post-images/test.jpg` — click it; you should see the image in a new tab.

If you can see it in a public tab, the bucket is correctly set up.

---

## Step 3 — Install new packages

In Command Prompt, inside the project folder:

```
npm install
```

Adds: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`. You'll see "added N packages" — ignore the vulnerability warnings.

---

## Step 4 — Run it

```
npm run dev
```

Open `http://localhost:3000`, log in as admin, click **Admin** in the header.

You should now see five tabs at the top of the admin dashboard:
- **📚 Posts** — your existing posts list, now with view counts and Featured stars
- **💬 Comments** — moderation queue (with a red badge if there are pending ones)
- **✉ Newsletter** — send & subscriber list (with CSV export)
- **📊 Analytics** — top posts by views, weekly trend
- **⭐ Featured** — pin posts to highlight them on the homepage

---

## What's new for Dr Esther's workflow

### Writing a post
1. Click **+ New post**, pick Article / Podcast / Video.
2. Type the title and excerpt.
3. **Use the rich text editor** — bold, italic, headings, lists, quotes, links, even **insert images directly into the post body** via the 🖼 button in the toolbar.
4. **Upload a cover image** from her phone/computer using the upload box (5MB max). Or paste any URL.
5. **(Optional) Schedule** — set a future date/time and the post auto-publishes then.
6. **(Optional) Featured** — pin to top of homepage carousels.
7. **(Optional) SEO panel** — custom title, description, social share image.
8. **(Optional) Tags** — type comma-separated keywords.

### Approving comments
- New comments arrive in `/admin/comments` filtered to "Pending".
- Click **✓ Approve** or **✗ Reject** on each.
- The user who wrote the comment can still see their own pending comment (with a yellow "Pending Approval" badge) — they're not confused, but the public doesn't see it until approved.

### Watching views
- `/admin/analytics` shows top 10 posts by views, and the week-over-week trend.
- Each post in the posts list shows its view count.
- Single post pages display "247 views" under the title.

### CSV export of subscribers
- On `/admin/newsletter`, a "↓ CSV" button next to the subscriber count downloads the full list.

---

## Troubleshooting

**"Upload failed" when adding an image** → bucket not created or not public. Re-check Step 2.

**Comments not appearing publicly** → they need approval. Go to `/admin/comments`, approve them.

**Posts with `scheduled_for` not auto-publishing** → they appear publicly as soon as the date passes AND someone reloads. Vercel revalidates every 60 seconds. To force immediate appearance, also tick "Published".

**Analytics shows 0 views** → no one has visited yet, or you're viewing your own posts in admin mode (admin views don't count if you flagged that, but currently they do; this is fine for a small site).
