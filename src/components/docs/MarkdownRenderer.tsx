"use client";

import React, { useMemo } from "react";
import { marked } from "marked";

interface MarkdownRendererProps {
  content: string;
}

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const htmlContent = useMemo(() => {
    try {
      return marked.parse(content) as string;
    } catch (e) {
      console.error("Markdown parsing failed:", e);
      return content;
    }
  }, [content]);

  return (
    <article className="max-w-4xl space-y-6 text-foreground markdown-content">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
};
