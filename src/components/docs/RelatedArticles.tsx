"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedPages } from "@/content/docs";

interface RelatedArticlesProps {
  currentHref: string;
}

export const RelatedArticles = ({ currentHref }: RelatedArticlesProps) => {
  const relatedPages = getRelatedPages(currentHref);

  if (relatedPages.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-12 border-t border-gray-700">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Related Articles
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {relatedPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group p-4 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 hover:border-accent/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {page.title}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{page.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-accent flex-shrink-0 mt-1 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
