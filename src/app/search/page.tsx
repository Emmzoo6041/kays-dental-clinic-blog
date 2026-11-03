import { SearchClient } from "@/components/SearchClient";

export const metadata = { title: "Search — Conversations with a Dentist" };

export default function SearchPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16 min-h-[70vh]">
      <h1 className="font-display text-5xl font-bold text-[#1B1F1C] dark:text-[#E7E8E5] mb-3">Search</h1>
      <p className="text-[#8A8E8A] mb-8">Find articles, podcasts, and videos by topic or keyword.</p>
      <SearchClient />
    </section>
  );
}
