// "Quick video tips" — Dr. Esther's short portrait videos, served from /public/videos/tips.
// To add one: drop <slug>.mp4 (720×1280) and <slug>.jpg (cover) in that folder and add a line here.
export type Tip = { slug: string; title: string; blurb: string; duration: string };

export const TIPS: Tip[] = [
  { slug: "problems-without-pain", title: "Dental problems don't always start with pain", blurb: "Why a pain-free mouth isn't always a healthy one.", duration: "1:10" },
  { slug: "waiting-for-pain", title: "Waiting for pain", blurb: "What waiting for a toothache really costs you.", duration: "0:53" },
  { slug: "only-hurts-sometimes", title: "“It only hurts sometimes”", blurb: "Pain that comes and goes is still a warning.", duration: "0:52" },
  { slug: "fillings", title: "Fillings", blurb: "Treating a cavity while it's still small.", duration: "1:10" },
  { slug: "child-tooth-hurt", title: "Don't wait for your child's tooth to hurt", blurb: "Catching problems in children's teeth early.", duration: "1:11" },
  { slug: "child-complains", title: "Don't wait until your child complains of pain", blurb: "Children don't always say when something's wrong.", duration: "0:56" },
  { slug: "bad-breath", title: "Bad breath", blurb: "Where it comes from and what helps.", duration: "0:54" },
  { slug: "bleeding-gums", title: "Bleeding gums", blurb: "Why gums bleed — and why it matters.", duration: "0:54" },
];

export const tipVideo = (slug: string) => `/videos/tips/${slug}.mp4`;
export const tipPoster = (slug: string) => `/videos/tips/${slug}.jpg`;
