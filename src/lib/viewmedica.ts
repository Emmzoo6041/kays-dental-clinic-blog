// ViewMedica animated patient-education videos (from "VIEWMEDICA VIDEO LINKS — FOR THE BLOG").
// `art` picks the illustration drawn by <TopicArt />. Links open on ViewMedica in a new tab.
//
// NOTE: a few links in the source document are shared by more than one topic — probably copy/paste slips.
// Fix them here when the correct links are known:
//   A_39016662 → Sensitive teeth, Tartar, Teeth whitening
//   A_e9f49171 → Bad breath, Thumb sucking
//   A_17c450c0 → Mouth sores, Bleeding gums

export type VMTopic = { slug: string; title: string; blurb: string; url: string; art: string; photo?: string };
export type VMGroup = { id: string; title: string; subtitle: string; topics: VMTopic[] };

const vm = (code: string) => `https://my.viewmedica.com/share/10787/en/${code}`;

// Free photos from Unsplash (Unsplash License — free to use, no permission needed).
// Each value is the Unsplash photo id; swap one to change a card's picture.
const PHOTOS: Record<string, string> = {
  "tooth-decay": "1777793389944-f7165259a05c",
  "gingivitis": "1694345162188-2e5c06fe75e7",
  "gum-disease": "1664529845848-00f5fa16df86",
  "bad-breath": "1758600588830-1bbcc78d3500",
  "baby-bottle-tooth-decay": "1626736985932-c0df2ae07a2e",
  "sensitive-teeth": "1656623944690-9366fb1aba9b",
  "tartar": "1766338390573-ec092d69cdcb",
  "thumb-sucking": "1520682549746-f3a171f5a2ef",
  "mouth-sores": "1584457361626-06effef61a7c",
  "bleeding-gums": "1658847075814-bf9a341c91e5",
  "brushing": "1646388478486-0996b6dcc2ac",
  "flossing": "1559818469-fdf7a1ae929c",
  "taking-care": "1611690061822-b707a67bfebb",
  "fluoride": "1676897288522-e8a081e71430",
  "dental-implant": "1787303856266-8c4f0b61ecf1",
  "dental-filling": "1657470179447-0f5aa16daa91",
  "dental-crown": "1771442873035-474765b40ac6",
  "veneers": "1677026010083-78ec7f1b84ed",
  "dental-sealants": "1758205307836-0829c799890b",
  "scaling": "1606811971618-4486d14f3f99",
  "dental-prostheses": "1530213709681-b7e537c923cc",
  "root-canal": "1588776814546-1ffcf47267a5",
  "wisdom-tooth-removal": "1777445374290-eedda5be8e5b",
  "metal-braces": "1598256989809-394fa4f6cd26",
  "invisible-braces": "1609840114035-3c981b782dfe",
  "teeth-whitening": "1784460469850-80838868f4d2",
  "dental-anxiety": "1777331903190-341a3dd0441b",
};
export const photoUrl = (id: string, w = 640) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 0.75)}&q=70`;

const RAW: VMGroup[] = [
  {
    id: "conditions",
    title: "Disease conditions",
    subtitle: "What goes wrong in the mouth — and how to spot it early.",
    topics: [
      { slug: "tooth-decay", art: "decay", title: "Tooth decay", blurb: "How cavities start and spread.", url: vm("A_3ff2e69c") },
      { slug: "gingivitis", art: "gingivitis", title: "Gingivitis", blurb: "The early, reversible stage of gum disease.", url: vm("A_54af1997") },
      { slug: "gum-disease", art: "gumDisease", title: "Gum disease", blurb: "When gums pull away and bone is lost.", url: vm("A_a26841cb") },
      { slug: "bad-breath", art: "breath", title: "Bad breath", blurb: "Common causes and simple fixes.", url: vm("A_e9f49171") },
      { slug: "baby-bottle-tooth-decay", art: "bottle", title: "Baby bottle tooth decay", blurb: "Protecting your baby's first teeth.", url: vm("A_244b8eaa") },
      { slug: "sensitive-teeth", art: "sensitive", title: "Sensitive teeth", blurb: "Why hot and cold can hurt.", url: vm("A_39016662") },
      { slug: "tartar", art: "tartar", title: "Tartar", blurb: "Hardened plaque and why it matters.", url: vm("A_39016662") },
      { slug: "thumb-sucking", art: "thumb", title: "Thumb sucking", blurb: "How it affects growing teeth.", url: vm("A_e9f49171") },
      { slug: "mouth-sores", art: "sores", title: "Mouth sores", blurb: "Ulcers, cold sores and when to worry.", url: vm("A_17c450c0") },
      { slug: "bleeding-gums", art: "bleeding", title: "Bleeding gums", blurb: "What bleeding when you brush means.", url: vm("A_17c450c0") },
    ],
  },
  {
    id: "care",
    title: "Care & management",
    subtitle: "Everyday habits and the treatments we use in the clinic.",
    topics: [
      { slug: "brushing", art: "brush", title: "Brushing the right way", blurb: "Angle, pressure and timing.", url: vm("A_ffedb814") },
      { slug: "flossing", art: "floss", title: "Flossing the right way", blurb: "Cleaning between the teeth.", url: vm("A_0cfdcfc9") },
      { slug: "taking-care", art: "care", title: "Taking care of your teeth", blurb: "A simple daily routine.", url: vm("A_9c113023") },
      { slug: "fluoride", art: "fluoride", title: "Fluoride", blurb: "How it strengthens enamel.", url: vm("A_10bb51e7") },
      { slug: "dental-implant", art: "implant", title: "Dental implant", blurb: "Replacing a missing tooth for good.", url: vm("A_189ea74e") },
      { slug: "dental-filling", art: "filling", title: "Dental filling", blurb: "Repairing a cavity step by step.", url: vm("A_20f4432b") },
      { slug: "dental-crown", art: "crown", title: "Dental crown", blurb: "A cap that protects a weak tooth.", url: vm("A_e62354de") },
      { slug: "veneers", art: "veneer", title: "Veneers", blurb: "Thin shells for a brighter smile.", url: vm("A_395e6ab3") },
      { slug: "dental-sealants", art: "sealant", title: "Dental sealants", blurb: "A shield for back-tooth grooves.", url: vm("A_6f8bf009") },
      { slug: "scaling", art: "scaling", title: "Scaling (dental cleaning)", blurb: "Removing tartar above and below the gums.", url: vm("A_8aa0084b") },
      { slug: "dental-prostheses", art: "dentures", title: "Dental prostheses (artificial teeth)", blurb: "Dentures and partials explained.", url: vm("A_4c8233fc") },
      { slug: "root-canal", art: "rootCanal", title: "Root canal", blurb: "Saving an infected tooth.", url: vm("A_a342f98f") },
      { slug: "wisdom-tooth-removal", art: "wisdom", title: "Wisdom tooth removal", blurb: "Why and how they come out.", url: vm("A_a7ddee20") },
      { slug: "metal-braces", art: "braces", title: "Metal braces", blurb: "How brackets and wires move teeth.", url: vm("A_a55d7c0b") },
      { slug: "invisible-braces", art: "aligner", title: "Invisible braces", blurb: "Clear aligners, tray by tray.", url: vm("A_94e270a8") },
      { slug: "teeth-whitening", art: "whitening", title: "Teeth whitening", blurb: "Safe ways to brighten your smile.", url: vm("A_39016662") },
      { slug: "dental-anxiety", art: "anxiety", title: "Coping with dental anxiety", blurb: "Feeling calm in the chair.", url: vm("A_0b035adc") },
    ],
  },
];

export const VIEWMEDICA: VMGroup[] = RAW.map((g) => ({
  ...g,
  topics: g.topics.map((t) => ({ ...t, photo: PHOTOS[t.slug] })),
}));
