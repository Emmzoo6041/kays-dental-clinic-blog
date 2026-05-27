# Kay's Dental Clinic Blog 🦷

A full-stack Next.js blog for Dr. Esther — admin dashboard, patient accounts with comments, and a real email newsletter.

**Stack:** Next.js 14 (App Router, TypeScript) · Tailwind · Supabase (Postgres + Auth) · Resend (newsletter) · Vercel.

---

## ✨ Features

- **Public blog** — homepage, blog index, post pages with sanitised markdown rendering, about, contact.
- **Patient accounts** — email/password signup via Supabase Auth; logged-in users can comment & delete their own comments.
- **Admin dashboard** at `/admin` (gated to one email):
  - Create, edit, delete posts with live markdown preview.
  - Draft / Published toggle.
  - Cover images via URL.
- **Newsletter** — anyone can subscribe via the footer form. Dr. Esther composes & sends real emails to all subscribers from `/admin/newsletter` using Resend.
- **Contact form** — sends an email to Dr. Esther's inbox.

---

## 🚀 Deploy in 6 steps (≈ 20 minutes, all free tier)

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New project. Pick a region close to you.
2. Once it's ready, open **SQL Editor** → **New query**, paste the entire contents of `supabase/schema.sql`, click **Run**. This creates the `posts`, `comments`, and `subscribers` tables with the right security policies and seeds one welcome post.
3. Open **Settings → API**. Copy three values you'll need shortly:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`) — **server-only, never expose**.
4. Open **Authentication → Providers → Email** and turn it on. For development you may want to **disable** "Confirm email" so signup works without an SMTP setup; turn it back on in production.

### 2. Create the admin (Dr. Esther's) account
1. In Supabase → **Authentication → Users → Add user → Create new user**.
2. Email: `esther@kaysdentalclinic.com` (or whichever email you want as admin). Set a password.
3. **This exact email** must match the `ADMIN_EMAIL` env var below — that's how the app decides who's admin.

### 3. Set up Resend (newsletter sender)
1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day, 3000/month).
2. Add and verify a domain you own (best), or use Resend's `onboarding@resend.dev` for testing.
3. Create an API key → copy `RESEND_API_KEY`.
4. Decide your "from" address, e.g. `Dr. Esther <newsletter@yourdomain.com>`.

### 4. Run it locally (optional but recommended)
```bash
git clone <your-repo>
cd kays-dental-clinic-blog
cp .env.example .env.local       # paste your real values
npm install
npm run dev
```
Visit `http://localhost:3000`. Log in at `/login` with the admin account → you'll see an **Admin** link in the header → `/admin` opens the dashboard.

### 5. Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
gh repo create kays-dental-clinic-blog --public --source=. --push
```
(or use the GitHub web UI.)

### 6. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
2. In the import screen, expand **Environment Variables** and paste every key from `.env.example` with real values:

   | Variable | Where it came from |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (secret) |
   | `RESEND_API_KEY` | Resend → API Keys |
   | `NEWSLETTER_FROM_EMAIL` | e.g. `Dr. Esther <newsletter@yourdomain.com>` |
   | `ADMIN_EMAIL` | The same email you created in Supabase step 2 |
   | `NEXT_PUBLIC_SITE_URL` | e.g. `https://kays-dental-clinic-blog.vercel.app` |

3. Hit **Deploy**. Done.

---

## 🗂 Project structure

```
src/
├── app/
│   ├── (public pages) page.tsx, blog/, about/, contact/
│   ├── login/, signup/         ← auth UI
│   ├── admin/                  ← dashboard (gated by isAdmin())
│   │   ├── page.tsx            ← posts list
│   │   ├── new/                ← create
│   │   ├── edit/[id]/          ← edit
│   │   └── newsletter/         ← compose & send
│   └── api/
│       ├── posts/              ← create / update / delete
│       ├── newsletter/         ← subscribe + send
│       └── contact/            ← contact form
├── components/                 ← Header, Footer, forms, editor…
├── lib/
│   ├── supabase-browser.ts     ← client-side Supabase
│   ├── supabase-server.ts      ← server-side + service-role + isAdmin()
│   └── markdown.ts             ← sanitised markdown rendering
└── middleware.ts               ← refreshes Supabase session
supabase/schema.sql             ← run once in Supabase SQL editor
```

---

## 🔐 Security notes
- **Admin check** is based on the logged-in user's email matching `ADMIN_EMAIL`. The check happens server-side before any write. Don't share the service-role key.
- All post writes go through `/api/posts/*` — `isAdmin()` is enforced on every route.
- Comment writes use the **anon key** with RLS: a user can only insert/delete comments where `user_id = auth.uid()`.
- Post markdown is sanitised with `isomorphic-dompurify` before render.
- Email validation is enforced server-side on subscribe.

---

## 🎨 Customising
- **Colours / fonts** → `tailwind.config.js` + `src/app/globals.css`. Default palette: cream `#f6f1e7`, deep teal `#0d6b6b`, accent `#d97648`. Fonts: Fraunces (display) + Manrope (body).
- **Site name / copy** → search for "Kay's Dental Clinic" and "Dr. Esther".
- **About / contact copy** → `src/app/about/page.tsx`, `src/app/contact/page.tsx`.

---

## 🐛 Common issues
- **"User clicks Admin and gets sent to /login"** → the logged-in user's email doesn't match `ADMIN_EMAIL`. Make sure they're identical (case-insensitive comparison is enforced).
- **"Signup says 'Check your email' but no email arrives"** → either disable email confirmation in Supabase (dev), or configure Supabase's SMTP under **Auth → SMTP settings**.
- **"Newsletter sends 0 emails"** → check `RESEND_API_KEY` is set in Vercel env vars, your sender domain is verified in Resend, and you have confirmed subscribers in the DB.

---

Built with care for Dr. Esther 🦷
