"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ targetId = "article-body" }: { targetId?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
    const list: Heading[] = nodes.map((h) => {
      if (!h.id) {
        h.id = h.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || `h-${Math.random().toString(36).slice(2, 7)}`;
      }
      return { id: h.id, text: h.textContent ?? "", level: h.tagName === "H2" ? 2 : 3 };
    });
    setHeadings(list);

    if (list.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0.1 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [targetId]);

  if (headings.length < 2) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden xl:block max-w-[220px]"
    >
      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#8A8E8A] dark:text-[#999D99] font-bold mb-3">On this page</p>
      <ul className="space-y-2 border-l-2 border-[#E7E8E5] dark:border-white/15 pl-4">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block text-[0.82rem] leading-snug transition-colors ${
                active === h.id
                  ? "text-[#2B3D32] dark:text-[#8FA396] font-semibold"
                  : "text-[#8A8E8A] dark:text-[#999D99] hover:text-[#1B1F1C] dark:hover:text-[#E7E8E5]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
