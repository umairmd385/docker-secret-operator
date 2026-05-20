"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export const TableOfContents = ({ className = "" }: TableOfContentsProps) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract h2 and h3 headers from the document
    const headings = Array.from(
      document.querySelectorAll("article h2, article h3")
    ) as HTMLElement[];

    const items: TOCItem[] = headings
      .filter((h) => {
        // Skip if no text content
        if (!h.textContent) return false;
        // Skip if it's hidden
        if (h.offsetParent === null) return false;
        return true;
      })
      .map((h) => ({
        id: h.id || h.textContent!.replace(/\s+/g, "-").toLowerCase(),
        title: h.textContent || "",
        level: parseInt(h.tagName[1]),
      }));

    setToc(items);

    // Set IDs on headers if they don't have them
    headings.forEach((h) => {
      if (!h.id) {
        h.id = h.textContent!.replace(/\s+/g, "-").toLowerCase();
      }
    });

    // Track active section
    const handleScroll = () => {
      let currentId = "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = item.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <nav className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          On this page
        </h4>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                className={`text-sm transition-colors block py-1 ${
                  activeId === item.id
                    ? "text-accent font-medium"
                    : "text-gray-400 hover:text-foreground"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
