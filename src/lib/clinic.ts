// Clinic constants — using real Kays Dental photos
export const CLINIC = {
  name: "Kays Dental Clinic",
  blogName: "Conversations with a Dentist",
  doctor: "Dr. Esther Lukwago",
  address1: "Plot 52, Kanjokya Street, Kampala",
  addressFull: "Plot 52, Kanjokya Street, Kampala, Uganda",
  phone: "0772 465 051",
  phoneIntl: "+256772465051",
  whatsapp: "256772465051",
  email: "info@kaysdentalclinic.com",
  mapsUrl: "https://maps.google.com/?q=Plot+52+Kanjokya+Street+Kampala+Uganda",
  mapsEmbed: "https://maps.google.com/maps?q=Kanjokya+Street,+Kampala,+Uganda&z=15&output=embed",

  // Real Kays Dental photos (local files under /public/photos)
  logoUrl: "/photos/dr-esther-avatar.jpg",          // tiny avatar for nav
  doctorPhoto: "/photos/dr-esther-green.jpg",        // doctor card (small)
  doctorAboutPhoto: "/photos/dr-esther-white.jpg",   // MAIN portrait (about + hero card)
  heroPhoto: "/photos/reception-hero.jpg",           // hero right-side photo

  // Homepage intro video. Drop the file at public/videos/intro.mp4
  // (or paste a full Supabase Storage URL here). Until it exists, the poster photo shows.
  introVideo: "/videos/intro.mp4",
  introPoster: "/photos/reception-hero.jpg",
};

export const waLink = (msg = "Hello Dr. Esther! I would like to book an appointment at Kays Dental Clinic.") =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(msg)}`;

// Real Google Reviews from your original site
export const REVIEWS = [
  { name: "Norman Niwagaba", stars: 5, role: "Google Review", text: "My experience at Kays Dental Clinic was nothing short of outstanding. The reception desk ladies greeted me warmly. Dr. Esther Lukwago was very professional, eloquent, and courteous. My thankfulness is not only for the clean teeth but for the comforting and highly skilled touch. God bless you all." },
  { name: "Lucky Kyomuhangi", stars: 5, role: "Google Review", text: "I recently took my 7-year-old son to Kays Dental for a check-up and the experience was exceptional. The doctor engaged my son to ease any fears. After the extraction they followed up with a call the next day to check on his progress. It is rare for a clinic to follow up on a patient — Kays Dental did just that." },
  { name: "Winnie Nanjala", stars: 5, role: "Google Review", text: "Their customer care is literally the best. The front desk officers are so polite and sweet, the dentists are really professional and polite as well. Their system is so fast and convenient. Great service in general." },
  { name: "Namata Maureen", stars: 5, role: "Google Review", text: "I had a great experience at Kays Dental! Dr. Katende did an excellent job with my teeth cleaning and repairing a broken tooth. The service was professional, gentle, and efficient. The clinic was clean and the staff were friendly. Highly recommend!" },
  { name: "Bakers Baks", stars: 5, role: "Google Review", text: "This facility is honestly amazing with immense customer care. Cooperative staff right from receptionist to the wonderful Dr. Katende. The whole process was professionally executed and my dental kit is back to normal. Thanks guys!" },
  { name: "Jovannah Edea", stars: 4, role: "Google Review", text: "It was a great dental clinic, from the friendly and welcoming receptionist to the professional doctors. My experience was great and I would highly recommend it." },
  { name: "Sandy Liz", stars: 5, role: "Google Review", text: "I really appreciate the reminder calls for my appointments as well as follow-up calls. The service is really good. Thank you Kays!" }
];

// Categories for article filter
export const ARTICLE_CATEGORIES = [
  { key: "all",       label: "All Posts" },
  { key: "hygiene",   label: "Hygiene" },
  { key: "cosmetic",  label: "Cosmetic" },
  { key: "children",  label: "Children" },
  { key: "nutrition", label: "Nutrition" },
  { key: "holistic",  label: "Holistic" }
];
