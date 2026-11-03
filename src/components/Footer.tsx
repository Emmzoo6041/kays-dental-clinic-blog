import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export function Footer() {
  return (
    <footer className="bg-[#0e100f] text-white/55 px-[5vw] pt-14 pb-6">
      <div className="grid lg:grid-cols-[2fr,1fr,1fr] gap-12 mb-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1B1F1C] to-[#2B3D32] grid place-items-center font-display text-xl font-bold text-white">K</div>
            <h3 className="font-display text-lg text-white">Conversations with a Dentist</h3>
          </div>
          <p className="text-[0.82rem] leading-7 max-w-xs">
            Your trusted dental home in Kampala. Expert articles, podcasts, video tips, and world-class dental care — all from Dr. Esther, all in one place.
          </p>
          <address className="not-italic text-[0.79rem] text-white/35 leading-loose">
            {CLINIC.addressFull}<br />
            <a href={`tel:${CLINIC.phoneIntl}`} className="text-white/45 hover:text-white transition-colors">{CLINIC.phone}</a><br />
            <a href={waLink()} target="_blank" rel="noreferrer" className="text-white/45 hover:text-white transition-colors">WhatsApp Dr. Esther</a><br />
            <a href={`mailto:${CLINIC.email}`} className="text-white/45 hover:text-white transition-colors">{CLINIC.email}</a>
          </address>
        </div>

        <div>
          <h4 className="text-[0.67rem] uppercase tracking-[0.18em] text-white/40 font-semibold mb-4">Content</h4>
          <ul className="flex flex-col gap-2 list-none">
            <li><Link href="/#articles" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Articles</Link></li>
            <li><Link href="/#podcasts" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Podcasts</Link></li>
            <li><Link href="/#videos" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Video Shorts</Link></li>
            <li><Link href="/#about" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">About Dr. Esther</Link></li>
            <li><Link href="/#reviews" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Patient Reviews</Link></li>
            <li><Link href="/faq" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/search" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Search</Link></li>
            <li><Link href="/#contact" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">Book Appointment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.67rem] uppercase tracking-[0.18em] text-white/40 font-semibold mb-4">Treatments</h4>
          <ul className="flex flex-col gap-2 list-none">
            {[
              "Check-ups & Cleaning",
              "Teeth Whitening",
              "Dental Implants",
              "Veneers & Bonding",
              "Children's Dentistry",
              "Holistic Dentistry"
            ].map(t => (
              <li key={t}><Link href="/#contact" className="text-[0.83rem] font-medium text-white/55 hover:text-white transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.07] pt-5 text-center text-[0.72rem] text-white/[0.22]">
        © {new Date().getFullYear()} {CLINIC.name} · {CLINIC.doctor} · {CLINIC.addressFull} · {CLINIC.phone} · All rights reserved
      </div>
    </footer>
  );
}
