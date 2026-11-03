import type { Metadata } from "next";
import { VideoLibraryFull } from "@/components/VideoLibrary";

export const metadata: Metadata = {
  title: "Dental video library — Conversations with a Dentist",
  description:
    "Short animated videos explaining common dental conditions and treatments — tooth decay, gum disease, fillings, crowns, implants, braces and more. Chosen by Dr. Esther Lukwago.",
};

export default function LearnPage() {
  return (
    <div className="px-5 sm:px-[5vw] pt-14 pb-24 max-w-[1200px] mx-auto">
      <div className="max-w-2xl mb-14">
        <div className="s-tag">Dental library</div>
        <h1 className="display-italic text-[2.6rem] sm:text-[3.4rem] leading-[1.04] text-[#141614] dark:text-[#F2F2EF] mt-1">
          See how it works.
        </h1>
        <p className="text-[#555A56] dark:text-[#B6BAB6] text-[1.05rem] leading-[1.65] mt-4">
          Short animated videos that explain common dental problems and the treatments we use at Kay&rsquo;s Dental Clinic.
          Each one opens on ViewMedica in a new tab.
        </p>
      </div>
      <VideoLibraryFull />
      <p className="mt-16 text-[0.75rem] text-[#9A9E9A]">
        Videos by ViewMedica. Photos from{" "}
        <a href="https://unsplash.com/?utm_source=kays_dental&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Unsplash</a>.
      </p>
    </div>
  );
}
