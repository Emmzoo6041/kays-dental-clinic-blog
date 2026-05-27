# Real Kays Dental photos added

You uploaded 9 real photos of the clinic, Dr Esther, and patients. They're now wired into the site and replace the stock/Unsplash placeholders.

## What changed

### Brand renamed
- All instances of "Conversations With A Dentist" → **"Conversations with a Dentist"** (lowercase "with a")
- Hero headline updated
- Footer brand, meta tags, page titles, loading screen — all updated

### Photos placed in `/public/photos/`

| File | Where it shows |
|---|---|
| `dr-esther-white.jpg` | **Main portrait** — big About section + scaled across the site |
| `dr-esther-green.jpg` | Small doctor card in the hero |
| `dr-esther-avatar.jpg` | Tiny avatar in the top-left header (logo) |
| `reception-hero.jpg` | Hero right-side big photo (reception desk scene) |
| `patient-mirror.jpg` | Cover photo on whitening / flossing posts |
| `patient-pink-smile.jpg` | Cover photo on additional posts |
| `consultation-screen.jpg` | Cover on "What I'd tell my own family" types |
| `braces-girl.jpg` | Cover on the new orthodontics article |
| `child-teddy.jpg` | Cover on "A child's first visit" podcast |
| `child-learning.jpg` | Cover on "Teaching kids to brush" video |

All photos were resized and optimized (the original ~2.4MB total compressed to ~860KB total for the web).

## Optional: rewire the seed posts to use real photos

If you want your existing seed posts to use real photos instead of Unsplash placeholders:

1. Open Supabase → SQL Editor → New query
2. Open `supabase/seed-real-photos.sql` from this project
3. Paste and Run

This will:
- Update cover photos on all 12 existing seed posts
- Add 3 NEW posts that showcase the new photos (Braces article, Child first visit podcast, Teaching kids video)

After running, refresh your browser and you'll see real Kays Dental photos throughout.

## To update your local copy

Same as before:
1. Stop dev server (`Ctrl+C` → `Y`)
2. Delete old `dental-blog` folder
3. Extract new zip
4. Copy `.env.local` back
5. `npm install`
6. `npm run dev`

Then optionally run the `seed-real-photos.sql` in Supabase to refresh seed post covers.
