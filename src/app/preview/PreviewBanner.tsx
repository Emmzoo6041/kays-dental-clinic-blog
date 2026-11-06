import Link from "next/link";

/** TEMPORARY: marks preview pages so nobody mistakes them for the live site. */
export function PreviewBanner() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-[84px] z-[90] flex items-center gap-3 rounded-full bg-[#141614] text-white text-[0.78rem] pl-4 pr-1.5 py-1.5 shadow-lg">
      <span><strong>Preview</strong> · new articles, not live yet</span>
      <Link href="/preview/articles" className="rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 transition-colors">All 10 articles</Link>
    </div>
  );
}
