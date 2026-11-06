import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ContactDock } from "@/components/ContactDock";
import { PageTransition } from "@/components/PageTransition";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

export const metadata: Metadata = {
  title: "Conversations with a Dentist — Dr. Esther's Blog, Podcast & Videos",
  description:
    "Expert dental advice, podcasts, and video tips from Dr. Esther Lukwago at Kays Dental Clinic, Plot 52 Kanjokya Street, Kampala. A premium dental wellness publication.",
  keywords: [
    "dentist Kampala", "dental clinic Uganda", "Dr Esther Lukwago",
    "dental podcast", "oral health Uganda", "Kays Dental Clinic",
    "holistic dentistry Kampala"
  ],
  openGraph: {
    title: "Conversations with a Dentist — Dr. Esther",
    description: "Honest, holistic dental advice from Dr. Esther Lukwago, Kampala.",
    type: "website",
    locale: "en_UG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversations with a Dentist",
    description: "Premium dental wellness publication by Dr. Esther Lukwago."
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#FAFAF9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ScrollProgress />
          <SmoothScroll />
          <PWAInstallBanner />
          <Header />
          <main className="pt-[72px]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ContactDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
