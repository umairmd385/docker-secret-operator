import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://dso.skycloudops.in";

/**
 * Recursively discover all pages in a directory
 * Only includes routes with page.tsx files
 */
function discoverPages(
  dir: string,
  baseUrl: string = ""
): { path: string; url: string }[] {
  const pages: { path: string; url: string }[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files and special directories
      if (
        entry.name.startsWith(".") ||
        entry.name.startsWith("[") ||
        ["layout.tsx", "error.tsx", "not-found.tsx", "loading.tsx"].includes(
          entry.name
        )
      ) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subPages = discoverPages(
          fullPath,
          baseUrl ? `${baseUrl}/${entry.name}` : `/${entry.name}`
        );
        pages.push(...subPages);
      } else if (entry.name === "page.tsx") {
        // Found a route with a page component
        const routePath = baseUrl || "/";
        pages.push({ path: fullPath, url: routePath });
      }
    }
  } catch (error) {
    console.error(`Error discovering pages in ${dir}:`, error);
  }

  return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const appDir = path.join(process.cwd(), "src/app");

  // Discover all pages from docs and other routes
  const discoveredPages = discoverPages(appDir);

  // Remove duplicates and sort
  const uniquePages = Array.from(
    new Map(discoveredPages.map((p) => [p.url, p])).values()
  ).sort((a, b) => a.url.localeCompare(b.url));

  // Build sitemap entries
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
  ];

  // Add discovered pages with intelligent priority
  for (const page of uniquePages) {
    // Skip homepage (already added above)
    if (page.url === "/") continue;

    // Determine priority based on path depth and type
    let priority = 0.5;
    let changeFrequency: "weekly" | "monthly" | "yearly" = "monthly";

    if (page.url === "/docs") {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (page.url.startsWith("/docs/cli")) {
      priority = 0.8;
      changeFrequency = "monthly";
    } else if (page.url.startsWith("/docs")) {
      priority = 0.7;
      changeFrequency = "monthly";
    } else if (
      page.url.startsWith("/comparisons") ||
      page.url.startsWith("/integrations") ||
      page.url.startsWith("/use-cases")
    ) {
      priority = 0.7;
      changeFrequency = "monthly";
    } else if (page.url.startsWith("/guides") || page.url.startsWith("/faqs")) {
      priority = 0.6;
      changeFrequency = "monthly";
    }

    entries.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  }

  return entries;
}
