-- =============================================================
-- OPTIONAL: Update existing seed posts to use the real Kays Dental photos
-- Run this in Supabase SQL Editor if you'd like the seed posts (welcome,
-- teeth-whitening-truth, etc.) to use Dr. Esther's real clinic photos
-- instead of the Unsplash placeholders.
-- =============================================================

-- Replace placeholder cover URLs on the seed posts
update public.posts set cover_url = '/photos/reception-hero.jpg'        where slug = 'welcome';
update public.posts set cover_url = '/photos/patient-mirror.jpg'        where slug = 'teeth-whitening-truth';
update public.posts set cover_url = '/photos/consultation-screen.jpg'   where slug = 'foods-damaging-teeth';
update public.posts set cover_url = '/photos/child-teddy.jpg'           where slug = 'first-dental-visit';
update public.posts set cover_url = '/photos/patient-pink-smile.jpg'    where slug = 'flossing-vs-interdental';
update public.posts set cover_url = '/photos/dr-esther-white.jpg'       where slug = 'what-is-holistic-dentistry';
update public.posts set cover_url = '/photos/brushing-correctly'        where slug = 'brushing-correctly';
update public.posts set cover_url = '/photos/patient-mirror.jpg'        where slug = 'bleeding-gums-podcast';
update public.posts set cover_url = '/photos/consultation-screen.jpg'   where slug = 'sugar-sodas-uganda-podcast';
update public.posts set cover_url = '/photos/child-learning.jpg'        where slug = 'childrens-teeth-podcast';
update public.posts set cover_url = '/photos/braces-girl.jpg'           where slug = 'brush-like-pro-video';
update public.posts set cover_url = '/photos/dr-esther-green.jpg'       where slug = 'tongue-health-video';
update public.posts set cover_url = '/photos/patient-mirror.jpg'        where slug = 'right-way-floss-video';

-- Add three NEW posts that showcase the real photos
insert into public.posts (slug, type, category, title, excerpt, content, cover_url, published, author_email, duration, episode) values

('orthodontics-for-teens', 'article', 'cosmetic',
 'Braces, Aligners, and Teen Confidence',
 'A young patient at Kays Dental shows what a confident smile looks like after a year in braces. Here is what we tell every teen and parent about orthodontic options.',
 E'Most orthodontic work happens between ages 11 and 16, but the truth is — there is no wrong time to start. We see patients from 9 to 60 in braces.\n\n## Traditional braces\n\nStill the gold standard for complex cases. Reliable, predictable, affordable. The downside: visibility and food restrictions.\n\n## Clear aligners (Invisalign-style)\n\nGreat for mild-to-moderate cases. Almost invisible, removable for meals, easier to clean teeth.\n\n## What we tell teens\n\nBraces are temporary. The confident smile that follows lasts decades. Most of our teenage patients say within 3 months they forget they are wearing them.',
 '/photos/braces-girl.jpg',
 true, 'eslukwago@gmail.com', '5 min read', null),

('a-childs-first-visit', 'podcast', 'children',
 'A Child''s First Dental Visit — Making it Magical',
 'How we turn a scary first appointment into a fun memory. Featuring Maria, age 4, and her favourite teddy bear.',
 E'At Kays Dental we treat every child''s first visit as a story they will remember.\n\n## What to expect\n\nThe child sits on a parent''s lap or beside them. We let them explore the tools — the chair, the suction, the little mirror. There are no needles, no drilling — just a friendly conversation, a count of the teeth, and a sticker.\n\n## Why early matters\n\nA child who has 2-3 positive visits before age 5 is statistically far less likely to develop dental anxiety as an adult.\n\n## Tips for parents\n\n- Never use the dentist as a threat ("if you don''t brush, the dentist will...")\n- Make it a celebration — promise a treat, a visit to the park, time on the swings\n- Bring their favourite toy if it helps them feel safe',
 '/photos/child-teddy.jpg',
 true, 'eslukwago@gmail.com', '24 mins', 'Episode 4'),

('teaching-kids-to-brush', 'video', 'children',
 'Teaching Your Child to Brush — A 90-Second Guide',
 'Watch how our hygienist makes brushing fun for kids. Tools, technique, and a few tricks for stubborn ones.',
 E'## What you''ll see in this video\n\n1. The right size brush for each age group\n2. How to demonstrate on a tooth model — kids LOVE this\n3. The "Brush Around the Tooth" song (yes, really)\n4. What to do when they refuse\n\n## The biggest mistake parents make\n\nLetting them brush alone too early. Kids do not have the dexterity to brush effectively until around age 8. Until then, you brush their teeth at least once a day yourself.',
 '/photos/child-learning.jpg',
 true, 'eslukwago@gmail.com', '1:32', null)

on conflict (slug) do nothing;
