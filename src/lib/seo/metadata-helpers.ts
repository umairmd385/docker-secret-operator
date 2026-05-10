/**
 * SEO Metadata Generation Helpers
 *
 * Type-safe, reusable functions for generating Next.js metadata
 * from PageMetadataConfig objects. Eliminates duplication across layouts.
 */

import type { Metadata } from "next";
import { SITE_CONFIG, METADATA_LIMITS, type PageMetadataConfig } from "./metadata";

/**
 * Generate full Next.js Metadata object from PageMetadataConfig
 * Handles all metadata fields with proper fallbacks and validation
 */
export function generatePageMetadata(
  config: PageMetadataConfig,
  pathname: string = "/"
): Metadata {
  const canonical = generateCanonical(pathname);
  const ogMetadata = generateOpenGraph(config, pathname);
  const twitterMetadata = generateTwitterMetadata(config);

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical,
    },

    openGraph: ogMetadata,
    twitter: twitterMetadata,

    robots: config.robots || {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate canonical URL for a page
 * Always uses absolute URL based on SITE_CONFIG.baseUrl
 */
export function generateCanonical(pathname: string): string {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const baseUrl = SITE_CONFIG.baseUrl.endsWith("/")
    ? SITE_CONFIG.baseUrl.slice(0, -1)
    : SITE_CONFIG.baseUrl;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate OpenGraph metadata object
 * Provides social card optimization for Facebook, LinkedIn, etc.
 */
export function generateOpenGraph(
  config: PageMetadataConfig,
  pathname: string = "/"
): Metadata["openGraph"] {
  return {
    type: "website",
    url: generateCanonical(pathname),
    title: config.ogTitle || config.title,
    description: config.ogDescription || config.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: config.ogImage || SITE_CONFIG.ogImage,
        width: config.ogImageWidth || SITE_CONFIG.ogImageWidth,
        height: config.ogImageHeight || SITE_CONFIG.ogImageHeight,
        alt: config.ogImageAlt || SITE_CONFIG.description,
        type: "image/png",
      },
    ],
  };
}

/**
 * Generate Twitter Card metadata object
 * Optimized for Twitter/X social sharing
 */
export function generateTwitterMetadata(
  config: PageMetadataConfig
): Metadata["twitter"] {
  return {
    card: config.twitterCard || "summary_large_image",
    title: config.twitterTitle || config.ogTitle || config.title,
    description: config.twitterDescription || config.ogDescription || config.description,
    images: config.twitterImage
      ? [config.twitterImage]
      : [config.ogImage || SITE_CONFIG.ogImage],
    creator: SITE_CONFIG.twitterCreator,
    site: SITE_CONFIG.twitterHandle,
  };
}

/**
 * Validate metadata configuration against SEO guidelines
 * Returns array of validation issues (empty = valid)
 */
export function validatePageMetadata(config: PageMetadataConfig): string[] {
  const issues: string[] = [];

  // Title validation
  if (config.title.length < METADATA_LIMITS.title.min) {
    issues.push(
      `Title too short (${config.title.length} chars, min ${METADATA_LIMITS.title.min})`
    );
  }
  if (config.title.length > METADATA_LIMITS.title.max) {
    issues.push(
      `Title too long (${config.title.length} chars, max ${METADATA_LIMITS.title.max})`
    );
  }

  // Description validation
  if (config.description.length < METADATA_LIMITS.description.min) {
    issues.push(
      `Description too short (${config.description.length} chars, min ${METADATA_LIMITS.description.min})`
    );
  }
  if (config.description.length > METADATA_LIMITS.description.max) {
    issues.push(
      `Description too long (${config.description.length} chars, max ${METADATA_LIMITS.description.max})`
    );
  }

  // OG validation
  if (config.ogTitle && config.ogTitle.length > 95) {
    issues.push(
      `OG title too long (${config.ogTitle.length} chars, recommended max 95)`
    );
  }
  if (config.ogDescription && config.ogDescription.length > 200) {
    issues.push(
      `OG description too long (${config.ogDescription.length} chars, recommended max 200)`
    );
  }

  return issues;
}

/**
 * Check if metadata is within optimal ranges (not strict validation)
 * Returns advisory notes only
 */
export function getMetadataAdvisory(config: PageMetadataConfig): string[] {
  const advisories: string[] = [];

  // Title advisory
  if (config.title.length < METADATA_LIMITS.title.optimal) {
    advisories.push(`Title could be longer (${config.title.length}/${METADATA_LIMITS.title.optimal} optimal)`);
  }
  if (config.title.length > METADATA_LIMITS.title.optimal) {
    advisories.push(`Title might exceed SERP display (${config.title.length}/${METADATA_LIMITS.title.optimal} optimal)`);
  }

  // Description advisory
  if (config.description.length < METADATA_LIMITS.description.optimal) {
    advisories.push(
      `Description could be longer (${config.description.length}/${METADATA_LIMITS.description.optimal} optimal)`
    );
  }
  if (config.description.length > METADATA_LIMITS.description.optimal) {
    advisories.push(
      `Description might exceed SERP display (${config.description.length}/${METADATA_LIMITS.description.optimal} optimal)`
    );
  }

  return advisories;
}
