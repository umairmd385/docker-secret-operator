/**
 * OpenGraph Image Strategy
 *
 * Centralized mapping for OpenGraph images across the site.
 * Supports section-specific images and fallback logic for programmatic pages.
 */

import { SITE_CONFIG } from "./metadata";

export interface OGImageConfig {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

/**
 * Image assets by category for easy reuse
 * Each category can have multiple images for different contexts
 */
export const OG_IMAGES = {
  default: {
    url: "/og-image.png",
    width: 1024,
    height: 1024,
    alt: "Docker Secret Operator - Zero-Persistence Secret Injection",
    type: "image/png",
  } as OGImageConfig,

  logo: {
    url: "/dso-logo.png",
    width: 1024,
    height: 1024,
    alt: "Docker Secret Operator Logo",
    type: "image/png",
  } as OGImageConfig,

  // Section-specific images (for future implementation)
  docs: {
    url: "/og-image.png", // Can be replaced with docs-specific image
    width: 1024,
    height: 1024,
    alt: "Docker Secret Operator Documentation",
    type: "image/png",
  } as OGImageConfig,

  cli: {
    url: "/og-image.png", // Can be replaced with CLI-specific image
    width: 1024,
    height: 1024,
    alt: "Docker Secret Operator CLI Reference",
    type: "image/png",
  } as OGImageConfig,

  // Provider logos (for integration pages)
  providers: {
    aws: {
      url: "https://img.icons8.com/?size=100&id=G0CnLqqcRBXl&format=png&color=ffffff",
      width: 512,
      height: 512,
      alt: "AWS Secrets Manager Logo",
      type: "image/png",
    } as OGImageConfig,
    azure: {
      url: "https://img.icons8.com/?size=100&id=81727&format=png&color=ffffff",
      width: 512,
      height: 512,
      alt: "Azure Key Vault Logo",
      type: "image/png",
    } as OGImageConfig,
    vault: {
      url: "/og-image.png",
      width: 512,
      height: 512,
      alt: "HashiCorp Vault Logo",
      type: "image/png",
    } as OGImageConfig,
    kubernetes: {
      url: "https://cdn.simpleicons.org/kubernetes/ffffff",
      width: 512,
      height: 512,
      alt: "Kubernetes Logo",
      type: "image/png",
    } as OGImageConfig,
  },
} as const;

/**
 * Get OG image for a specific pathname
 * Implements fallback logic: specific page → section → default
 */
export function getOGImageForPage(pathname: string): OGImageConfig {
  // Exact match for specific pages
  if (pathname === "/") {
    return OG_IMAGES.logo;
  }

  // Section-based fallback
  if (pathname.startsWith("/docs/cli")) {
    return OG_IMAGES.cli;
  }
  if (pathname.startsWith("/docs")) {
    return OG_IMAGES.docs;
  }

  // Default fallback
  return OG_IMAGES.default;
}

/**
 * Get OG image for provider (integration pages)
 * Returns provider-specific image or default
 */
export function getProviderOGImage(
  providerName: string
): OGImageConfig {
  const normalizedName = providerName.toLowerCase().replace(/\s+/g, "_") as keyof typeof OG_IMAGES.providers;

  return (
    OG_IMAGES.providers[normalizedName] || OG_IMAGES.default
  );
}

/**
 * Generate OG image URL for programmatically generated pages
 * Placeholder for future dynamic image generation service
 *
 * Example: /api/og?title=My+Page&section=docs
 */
export function generateDynamicOGImageUrl(params: {
  title: string;
  section?: string;
  keywords?: string[];
}): string {
  const query = new URLSearchParams();
  query.set("title", params.title);
  if (params.section) query.set("section", params.section);
  if (params.keywords?.length) {
    query.set("keywords", params.keywords.join(","));
  }

  return `${SITE_CONFIG.baseUrl}/api/og?${query.toString()}`;
}

/**
 * Get all available OG images
 * Useful for validation and testing
 */
export function getAllOGImages(): OGImageConfig[] {
  return [
    OG_IMAGES.default,
    OG_IMAGES.logo,
    OG_IMAGES.docs,
    OG_IMAGES.cli,
    ...Object.values(OG_IMAGES.providers),
  ];
}
