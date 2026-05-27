-- =============================================================
-- Kays Dental Clinic Blog — Final schema (matches reference design)
-- Run in Supabase → SQL Editor → New Query → Run
-- =============================================================

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  type        text not null default 'article',  -- 'article' | 'podcast' | 'video'
  category    text default 'general',           -- hygiene/cosmetic/children/nutrition/holistic/general
  title       text not null,
  excerpt     text,
  content     text not null,
  cover_url   text,
  media_url   text,
  duration    text,
  episode     text,                              -- "Episode 1" etc for podcasts
  published   boolean not null default false,
  author_email text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.posts add column if not exists type text not null default 'article';
alter table public.posts add column if not exists category text default 'general';
alter table public.posts add column if not exists media_url text;
alter table public.posts add column if not exists duration text;
alter table public.posts add column if not exists episode text;
create index if not exists posts_type_idx on public.posts (type, published, created_at desc);
create index if not exists posts_category_idx on public.posts (category);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null, body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  confirmed boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (published = true);
drop policy if exists "public read comments" on public.comments;
create policy "public read comments" on public.comments for select using (true);
drop policy if exists "auth insert own comment" on public.comments;
create policy "auth insert own comment" on public.comments for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "auth delete own comment" on public.comments;
create policy "auth delete own comment" on public.comments for delete to authenticated using (auth.uid() = user_id);

-- Seed content matching the reference site exactly
insert into public.posts (slug, type, category, title, excerpt, content, cover_url, published, author_email, duration, episode) values
('brushing-correctly', 'article', 'hygiene',
 'Are You Really Brushing Correctly?',
 'Most of us learned brushing habits as kids and never updated them. Here''s the technique that actually works.',
 E'Most of us learned to brush as children and never changed since. Poor technique is one of the most common causes of gum recession, enamel wear, and persistent plaque I see every week at Kays Dental.\n\n## The Modified Bass Technique\n\nPlace your brush at a 45-degree angle to the gum line. Use small, gentle circular strokes — think massage, not scrubbing. Clean two to three teeth at a time before moving on.\n\n## How long should you brush?\n\nTwo full minutes, twice daily. Electric toothbrushes with built-in timers remove significantly more plaque than manual brushes. Try 30 seconds per quadrant.\n\n## Common mistakes to fix today\n\n- Brushing right after meals — wait 30 minutes after acidic food\n- Pressing too hard — erodes enamel and recedes gums over time\n- Forgetting the tongue — holds most odour-causing bacteria\n- Not replacing your brush — do it every 3 months',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-1.jpg',
 true, 'eslukwago@gmail.com', '5 min read', null),

('teeth-whitening-truth', 'article', 'cosmetic',
 'Teeth Whitening: What Really Works?',
 'From pharmacy strips to professional treatment — Dr. Esther gives her honest breakdown.',
 E'Whitening is one of the most requested treatments at Kays Dental. Let me cut through the confusion honestly.\n\n## How whitening works\n\nAll whitening products use hydrogen peroxide or carbamide peroxide to break apart stain molecules inside your enamel. Concentration determines speed and degree of whitening.\n\n## Professional vs. over-the-counter\n\nProfessional treatments use much higher concentrations than OTC products. The clinical difference in outcomes is substantial — and we screen you first to ensure whitening is safe for your specific teeth.\n\n## Who should not whiten?\n\n- Patients with untreated cavities or gum disease — treat these first\n- Anyone with crowns or veneers — bleach does not affect these materials\n- Pregnant and breastfeeding women\n- Patients with significant tooth sensitivity',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-2.jpg',
 true, 'eslukwago@gmail.com', '7 min read', null),

('foods-damaging-teeth', 'article', 'nutrition',
 '10 Foods Quietly Damaging Your Teeth',
 'It''s not just sweets. Many everyday healthy foods are top causes of enamel erosion.',
 E'The real culprits are often foods patients think are perfectly healthy. Here are the top ones to watch.\n\n## The surprising offenders\n\n- **Citrus fruits** — highly acidic, softens enamel with repeated exposure\n- **Sparkling water** — carbonic acid makes it more erosive than still water\n- **Dried fruits** — concentrated sugars stick to teeth for hours\n- **Sports drinks** — acidic, sugary, and consumed frequently\n- **Coffee** — staining, acidic, and reduces protective saliva\n\n## What you can do\n\nRinse with water after eating, use a straw for acidic drinks, wait 30 minutes before brushing. Chew sugar-free gum after meals. Eat acidic foods as part of a meal, not as standalone snacks.',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/05/Kays-dental-for-patients.jpg',
 true, 'eslukwago@gmail.com', '6 min read', null),

('first-dental-visit', 'article', 'children',
 'When Should My Child First See a Dentist?',
 'The answer surprises most parents. Early visits build a lifetime of dental confidence.',
 E'Your child''s first dental visit should happen when their first tooth appears — or by their first birthday, whichever comes first.\n\n## Why so early?\n\nEarly visits build a positive relationship with the dentist before any problem arises. Children who start early are far less likely to develop dental anxiety — confidence that lasts a lifetime.\n\n## What to expect at Kays Dental\n\nThe first appointment is gentle, short, and fun. Very young children sit on a parent''s lap. We check gums and teeth, discuss feeding habits, and answer all your questions warmly.\n\n## Great habits to start at home\n\n- Brush as soon as the first tooth appears — tiny smear of fluoride toothpaste\n- Avoid putting children to bed with a bottle of milk or juice\n- Make brushing fun — let them pick their own toothbrush!\n- Avoid sharing utensils — cavity bacteria can pass from parent to child',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-congact.jpg',
 true, 'eslukwago@gmail.com', '4 min read', null),

('flossing-vs-interdental', 'article', 'hygiene',
 'Flossing vs. Interdental Brushes',
 'Both clean between your teeth — but one may suit you far better. Here''s the evidence.',
 E'A growing body of evidence suggests interdental brushes may be more effective for the majority of patients. Here is my honest breakdown.\n\n## What the research shows\n\nMultiple clinical trials found that interdental brushes remove more plaque than floss when used correctly. They are also easier to use consistently — and consistency is the most important factor in interproximal hygiene.\n\n## The right tool for the situation\n\nFloss is better for tight contact points between teeth. Interdental brushes work better for people with gaps, gum recession, braces, or implants.\n\n## Sizing matters\n\nThe brush should slide in with gentle resistance — not forced, not loose. At your next appointment I can recommend the perfect size for every gap you have.',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-1.jpg',
 true, 'eslukwago@gmail.com', '4 min read', null),

('what-is-holistic-dentistry', 'article', 'holistic',
 'What Is Holistic Dentistry and Why Does It Matter?',
 'Your mouth is connected to your whole body. Holistic dentistry treats both.',
 E'Holistic dentistry treats the mouth as an integral part of the whole human body. At Kays Dental, it is the philosophy behind everything we do.\n\n## What makes it different?\n\nConventional dentistry focuses on treating symptoms. Holistic dentistry asks why those symptoms are occurring and addresses the root cause. We consider nutrition, stress, sleep, and systemic health in your treatment plan.\n\n## What you will notice at Kays Dental\n\n- Mercury-free and biocompatible materials wherever possible\n- Diet and lifestyle discussed as part of treatment\n- Minimally invasive techniques to preserve natural tooth structure\n- Your bite, jaw, neck, and posture assessed together\n\nHolistic dentistry is not alternative — it is a more complete, more personalised form of care. Book a consultation to experience the difference.',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/06/Holistic-Dentistry.jpg',
 true, 'eslukwago@gmail.com', '6 min read', null),

('bleeding-gums-podcast', 'podcast', 'hygiene',
 'Why Your Gums Bleed — And What To Do About It',
 'Bleeding gums are extremely common but almost always preventable. A simple 5-step plan to fix it within 2 weeks.',
 E'Bleeding gums when you brush or floss is **never normal**, but it''s extremely common and almost always reversible at home.\n\n## What causes it\n\nThe most common cause is gingivitis — the earliest stage of gum disease.\n\n## The 5-step fix\n\n1. **Brush twice a day** with a soft-bristled brush for two full minutes\n2. **Floss every day**\n3. **Use a fluoride toothpaste**\n4. **Rinse with warm salt water** for one week\n5. **See a dentist** if not better in two weeks',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-2.jpg',
 true, 'eslukwago@gmail.com', '22 mins', 'Episode 1'),

('sugar-sodas-uganda-podcast', 'podcast', 'nutrition',
 'Sugar, Sodas and Your Smile: The Ugandan Diet Deep Dive',
 'Uganda''s love for sugary drinks is taking a real toll on our teeth. Practical advice for protecting your family''s smiles.',
 E'A single 500ml bottle of soda contains around 13 teaspoons of sugar.\n\n## What you can actually do\n\n- Drink soda with meals, not between them\n- Use a straw\n- Rinse with plain water after\n- **Wait 30 minutes** before brushing — enamel is soft right after\n- Swap one soda a day for water — your teeth will thank you',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/05/Kays-dental-for-patients.jpg',
 true, 'eslukwago@gmail.com', '28 mins', 'Episode 2'),

('childrens-teeth-podcast', 'podcast', 'children',
 'Children''s Teeth: A Complete Guide for Ugandan Parents',
 'From the first tooth to the teenage years — everything a Ugandan parent needs to know.',
 E'## Birth to age 1\n\nClean baby gums with a soft damp cloth after feeds, even before teeth come in.\n\n## Ages 1–3\n\nFirst dental visit by their first birthday. Use a tiny smear of fluoride toothpaste.\n\n## Ages 4–6\n\nKids can start brushing with supervision. Watch for thumb-sucking past age 4.\n\n## Ages 7–12\n\nThis is the mixed dentition phase. Sealants on the back teeth can prevent the majority of cavities.',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-congact.jpg',
 true, 'eslukwago@gmail.com', '31 mins', 'Episode 3'),

('brush-like-pro-video', 'video', 'hygiene',
 'Brush Like a Pro in 60 Seconds',
 'Dr. Esther demonstrates the correct brushing technique in real time. Watch this once and you will never brush the same way again.',
 E'## The technique in 4 points\n\n1. **45-degree angle** to the gumline\n2. **Small circular motions** — not back-and-forth scrubbing\n3. **Two minutes minimum** — 30 seconds per quadrant\n4. **Don''t forget your tongue**',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/09/Dr-Esther-N-J-Lukwago-welcome.png',
 true, 'eslukwago@gmail.com', '1:02', null),

('tongue-health-video', 'video', 'holistic',
 'What Your Tongue Tells You About Your Health',
 'A quick health check you can do in 10 seconds every morning. Dr. Esther explains what different tongue appearances mean.',
 E'Your tongue is one of the most diagnostic surfaces in your body.\n\n- **Pink and slightly moist** — good shape\n- **Pale** — possible iron deficiency\n- **Very red** — possible vitamin B12 deficiency\n- **White coating** — usually bacteria\n- **Cracks** — often genetics',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/06/Holistic-Dentistry.jpg',
 true, 'eslukwago@gmail.com', '0:58', null),

('right-way-floss-video', 'video', 'hygiene',
 'The Right Way to Floss — Faster Than You Think',
 'Most people either skip flossing or do it wrong. This video shows the correct technique.',
 E'Most people use floss like a saw — straight up and down. That misses the spots where cavities actually form.\n\n## The C-shape technique\n\n1. Wrap the floss around the side of the tooth in a C shape\n2. Slide gently below the gumline\n3. Up and down 2–3 times, then repeat on the next tooth\n4. Fresh section of floss between every two teeth',
 'https://kaysdentalclinic.com/wp-content/uploads/2025/02/kays-dental-bg-1.jpg',
 true, 'eslukwago@gmail.com', '1:05', null)

on conflict (slug) do nothing;
