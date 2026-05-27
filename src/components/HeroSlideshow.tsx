"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/clinic-1.jpg", alt: "Kays Dental Clinic" },
  { src: "/clinic-2.jpg", alt: "Modern dental treatment room" },
  { src: "/clinic-3.jpg", alt: "Reception area" },
];

export function HeroSlideshow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-full overflow-hidden">
      {SLIDES.map((s, idx) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          priority={idx === 0}
          className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ))}
      {/* Yellow accent corner shape */}
      <div className="absolute top-6 left-6 z-10 bg-yellow-mid text-green-dark px-4 py-2 rounded-full font-extrabold text-sm shadow-lg">
        ⭐ Patient Award 2024
      </div>
      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Photo ${idx + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === i ? "bg-white w-8" : "bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
