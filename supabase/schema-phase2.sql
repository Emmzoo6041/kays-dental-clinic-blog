-- =============================================================
-- Phase 2 schema migration — run AFTER your existing schema
-- Paste into Supabase → SQL Editor → New Query → Run
-- =============================================================

-- 1) POSTS: add scheduling, views, SEO, featured, tags
alter table public.posts add column if not exists scheduled_for timestamptz;
alter table public.posts add column if not exists views integer not null default 0;
alter table public.posts add column if not exists meta_title text;
alter table public.posts add column if not exists meta_description text;
alter table public.posts add column if not exists og_image text;
alter table public.posts add column if not exists featured boolean not null default false;
alter table public.posts add column if not exists tags text[] default '{}';
alter table public.posts add column if not exists content_html text;  -- new: rich html from Tiptap

create index if not exists posts_scheduled_idx on public.posts (scheduled_for) where scheduled_for is not null;
create index if not exists posts_featured_idx on public.posts (featured, created_at desc) where featured = true;
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- 2) Categories table (editable from admin)
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  color       text default '#2E7D42',
  display_order int default 0,
  created_at  timestamptz not null default now()
);

-- Seed common categories
insert into public.categories (slug, name, color, display_order) values
  ('hygiene',   'Hygiene',   '#2E7D42', 1),
  ('cosmetic',  'Cosmetic',  '#6C3FC5', 2),
  ('children',  'Children',  '#E6B800', 3),
  ('nutrition', 'Nutrition', '#4CAF6B', 4),
  ('holistic',  'Holistic',  '#1E5C2E', 5),
  ('general',   'General',   '#7A9480', 6)
on conflict (slug) do nothing;

alter table public.categories enable row level security;
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

-- 3) COMMENTS: add approval workflow
alter table public.comments add column if not exists status text not null default 'pending';
-- status: 'pending' | 'approved' | 'rejected'
create index if not exists comments_status_idx on public.comments (status, created_at desc);

-- Existing comments get auto-approved (don't surprise anyone with disappearing comments)
update public.comments set status = 'approved' where status = 'pending';

-- Re-do policies: public sees only approved
drop policy if exists "public read comments" on public.comments;
create policy "public read approved comments"
  on public.comments for select
  using (status = 'approved');

-- Authenticated users can read their own pending comments (so they can see what they wrote)
drop policy if exists "auth read own comments" on public.comments;
create policy "auth read own comments"
  on public.comments for select
  to authenticated
  using (user_id = auth.uid());

-- 4) POST-VIEWS table for analytics (per-day counts so we can show "+12 this week")
create table if not exists public.post_views (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  day        date not null default current_date,
  count      integer not null default 1,
  unique (post_id, day)
);
create index if not exists post_views_post_idx on public.post_views (post_id, day desc);

-- 5) Storage bucket setup happens in the Supabase UI, but RLS policy here:
-- Allow public read of post-images bucket
do $$
begin
  if exists (select 1 from storage.buckets where id = 'post-images') then
    -- Bucket exists; ensure read policy
    drop policy if exists "Public read post-images" on storage.objects;
    create policy "Public read post-images"
      on storage.objects for select
      using (bucket_id = 'post-images');
  end if;
end $$;

-- =============================================================
-- Function to increment post views (atomic, race-safe)
-- =============================================================
create or replace function public.increment_post_view(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Increment total views on the post
  update public.posts set views = views + 1 where id = p_post_id;

  -- Bump daily counter
  insert into public.post_views (post_id, day, count)
  values (p_post_id, current_date, 1)
  on conflict (post_id, day) do update set count = post_views.count + 1;
end;
$$;
grant execute on function public.increment_post_view(uuid) to anon, authenticated;
