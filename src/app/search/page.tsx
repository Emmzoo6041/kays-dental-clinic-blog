import { SearchClient } from "@/components/SearchClient";

export const metadata = { title: "Search — Conversations with a Dentist" };

export default function SearchPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16 min-h-[70vh]">
      <h1 className="font-display text-5xl font-bold text-[#1E5C2E] dark:text-[#D4EDD9] mb-3">Search</h1>
      <p className="text-[#7A9480] mb-8">Find articles, podcasts, and videos by topic or keyword.</p>
      <SearchClient />
    </section>
  );
}
