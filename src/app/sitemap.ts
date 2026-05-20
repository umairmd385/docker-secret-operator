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

/**
 * Discover auto-generated markdown doc routes from the docs directory
 */
function discoverMarkdownDocRoutes(): string[] {
  const docsDir = path.join(process.cwd(), "src/app/docs/guide");
  const routes: string[] = [];

  try {
    const entries = fs.readdirSync(docsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        routes.push(`/docs/guide/${entry.name}`);
      }
    }
  } catch {
    // docs/guide may not exist in all environments
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const appDir = path.join(process.cwd(), "src/app");

  // Discover all pages from static routes
  const discoveredPages = discoverPages(appDir);

  // Also discover auto-generated markdown doc routes
  const markdownRoutes = discoverMarkdownDocRoutes();

  // Combine and deduplicate
  const allUrls = new Map<string, string>();
  for (const page of discoveredPages) {
    allUrls.set(page.url, page.url);
  }
  for (const route of markdownRoutes) {
    allUrls.set(route, route);
  }

  const uniqueUrls = Array.from(allUrls.values()).sort();

  // Build sitemap entries — homepage first
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
  ];

  for (const url of uniqueUrls) {
    // Skip homepage (already added above)
    if (url === "/") continue;

    // Determine priority and changeFrequency based on route type
    let priority = 0.5;
    let changeFrequency: "weekly" | "monthly" | "yearly" = "monthly";

    if (url === "/docs") {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (url === "/docs/guide/getting-started" || url === "/docs/guide/quick-start" || url === "/docs/guide/what-is-dso") {
      priority = 0.85;
      changeFrequency = "monthly";
    } else if (url.startsWith("/docs/cli")) {
      priority = 0.8;
      changeFrequency = "monthly";
    } else if (url.startsWith("/docs/guide")) {
      priority = 0.75;
      changeFrequency = "monthly";
    } else if (url.startsWith("/comparisons") || url.startsWith("/integrations")) {
      priority = 0.7;
      changeFrequency = "monthly";
    } else if (url === "/examples" || url === "/faq") {
      priority = 0.65;
      changeFrequency = "monthly";
    }

    entries.push({
      url: `${BASE_URL}${url}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  }

  return entries;
}
