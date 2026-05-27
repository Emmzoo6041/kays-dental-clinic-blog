# Phase 3 — Setup notes

Phase 3 added: search, FAQ page, related posts, continue reading, trending widget, animated newsletter section, PWA install banner, sitemap.xml, robots.txt, and JSON-LD schema for SEO.

## Good news

**No database migration needed** — Phase 3 uses the same schema as Phase 2.

**No new packages to install** — everything Phase 3 needs (framer-motion) was already added in Phase 1.

So you can just:

1. Replace the project folder with the new zip
2. Copy `.env.local` over
3. `npm install` (just in case, to be safe)
4. `npm run dev`

That's it.

## What's new

### For visitors
- **🔍 Search** — magnifying-glass icon in the header. Real-time results across title, excerpt, content, and tags. Try searching "flossing" or "kids".
- **❓ FAQ page** at `/faq` — 12 hand-written questions answered by Dr. Esther. Smooth accordion. Also returns rich Google snippets via JSON-LD.
- **📱 PWA install banner** — On Chrome / Edge / Samsung Internet, after 4 seconds visitors see a small floating card: "Add this app to your home screen". Lets them install the site like an app.
- **Related posts** — At the bottom of every article, 3 related posts from the same category.
- **Continue reading strip** — Dark green gradient block at the very bottom of articles linking to the previous post.
- **Trending widget** — In the article sidebar, shows top 3 posts by views this week.
- **Animated newsletter section** — Between Reviews and Contact on the homepage. Floating envelope/tooth/heart icons. Big email signup.

### For Google
- **Sitemap** at `/sitemap.xml` — auto-generated, includes every published post
- **robots.txt** at `/robots.txt` — points crawlers at the sitemap, blocks `/admin` and `/api`
- **JSON-LD structured data** on every article, podcast, video, and the FAQ page — Google can show rich snippets for your content
- **Per-post Open Graph metadata** — proper preview cards when sharing on WhatsApp, Twitter, Facebook

### For Dr Esther
- Trending widget gives visitors a feel of "what's hot right now"
- FAQ gives her one more page to send patients to ("read the FAQ first" deflects common questions)
- Search means visitors find her older content even months after publishing

## Test these after npm run dev

- Click the 🔍 in the header → type "kids" → see live results animate in
- Click the FAQ link → expand a question → notice the smooth accordion
- On Chrome desktop or Android Chrome, wait 4 seconds → see the install banner pop up
- Open any article → scroll past the comments → see Related Posts and the Continue Reading card
- Open `localhost:3000/sitemap.xml` in browser → see the XML
- Open `localhost:3000/robots.txt` → see the robots rules
- View page source on an article → search for "@context" → find the JSON-LD

## SEO note

After deploying to Vercel, submit your sitemap to Google:

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (`kays-dental-clinic-blog.vercel.app`)
3. Sidebar → **Sitemaps** → paste `https://kays-dental-clinic-blog.vercel.app/sitemap.xml` → Submit

Google will start indexing pages within a few days.
