/**
 * Core SEO Metadata Types and Constants
 *
 * This module defines the metadata architecture for the DSO site.
 * It provides type-safe metadata generation supporting:
 * - Dynamic title/description generation
 * - OpenGraph social cards
 * - Twitter card optimization
 * - Canonical URL generation
 * - Structured data support
 */

import type { Metadata } from "next";

export const SITE_CONFIG = {
  baseUrl: "https://dso.skycloudops.in",
  name: "Docker Secret Operator",
  shortName: "DSO",
  description: "Event-driven, zero-persistence secret injection for Docker containers",
  twitterHandle: "@skycloudops",
  twitterCreator: "@skycloudops",
  author: "Docker Secret Operator Community",
  ogImage: "/og-image.png",
  ogImageWidth: 1024,
  ogImageHeight: 1024,
} as const;

export const METADATA_LIMITS = {
  title: {
    min: 30,
    optimal: 60,
    max: 80,
  },
  description: {
    min: 120,
    optimal: 155,
    max: 160,
  },
} as const;

/**
 * Page metadata configuration
 * Used to generate metadata for each page
 */
export interface PageMetadataConfig {
  // Core metadata
  title: string;
  description: string;

  // Optional metadata
  keywords?: string[];
  canonical?: string;

  // Social metadata
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;

  // Twitter metadata
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";

  // Robots
  robots?: {
    index?: boolean;
    follow?: boolean;
  };

  // Structured data
  structured?: Record<string, unknown>[];
}

/**
 * SEO metadata for different page types
 * Organized by section for easy maintenance
 */
export const PAGE_METADATA: Record<string, PageMetadataConfig> = {
  // HOMEPAGE
  "/": {
    title: "Docker Secret Operator | Zero-Persistence Secret Injection",
    description: "Event-driven secret management for Docker & Kubernetes. Inject secrets at runtime without disk writes. CNCF Sandbox project, Apache 2.0 licensed.",
    keywords: [
      "docker secret management",
      "secret injection docker",
      "zero persistence secrets",
      "CNCF sandbox project",
      "vault alternative",
    ],
    ogTitle: "Docker Secret Operator — Zero-Persistence Secret Injection",
    ogDescription: "Event-driven secret management for Docker. Inject secrets at runtime without disk writes.",
    ogImage: "/og-image.png",
    twitterCard: "summary_large_image",
    twitterTitle: "Docker Secret Operator | Secret Management for Docker",
    twitterDescription: "Zero-persistence secret injection for Docker containers. CNCF Sandbox project.",
  },

  // DOCUMENTATION PAGES
  "/docs": {
    title: "Documentation | DSO",
    description: "Complete Docker Secret Operator documentation including CLI reference, guides, and integration instructions for all supported providers.",
    keywords: [
      "docker dso documentation",
      "docker secret operator guide",
      "dso cli reference",
      "secret injection tutorial",
    ],
    ogTitle: "Docker Secret Operator Documentation",
    ogDescription: "CLI reference, guides, and provider integration documentation",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli": {
    title: "CLI Reference | DSO",
    description: "Complete Docker Secret Operator CLI command reference. Learn all DSO commands for managing secrets, deploying stacks, and managing plugins.",
    keywords: [
      "dso cli reference",
      "docker dso commands",
      "cli documentation",
      "docker secret operator commands",
    ],
    ogTitle: "Docker Secret Operator CLI Reference",
    ogDescription: "Complete command reference for all DSO CLI operations",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/init": {
    title: "docker dso init | Initialize Encrypted Vault | DSO",
    description: "Initialize an encrypted local vault with Docker Secret Operator. Step-by-step guide for setting up DSO Local Mode with AES-256 encryption.",
    keywords: [
      "dso init",
      "docker secret init",
      "encrypted vault setup",
      "local vault initialization",
      "how to initialize dso",
    ],
    ogTitle: "docker dso init — Initialize Encrypted Vault",
    ogDescription: "Setup an encrypted vault for Docker Secret Operator in 3 simple steps",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/up": {
    title: "docker dso up | Deploy with Secret Injection | DSO",
    description: "Deploy Docker Compose stacks with automatic secret injection using 'docker dso up'. Zero-persistence injection from AWS, Azure, Vault, or local vault.",
    keywords: [
      "dso up",
      "docker dso up",
      "docker compose secret injection",
      "deploy with secrets",
      "automatic secret injection",
    ],
    ogTitle: "docker dso up — Deploy with Secret Injection",
    ogDescription: "Deploy Docker containers with automatic zero-persistence secret injection",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/down": {
    title: "docker dso down | Stop Containers Safely | DSO",
    description: "Properly stop and remove Docker containers managed by DSO. Includes secure cleanup of secrets, sockets, and environment variables.",
    keywords: [
      "dso down",
      "docker dso down",
      "stop containers securely",
      "container cleanup",
      "secret rotation cleanup",
    ],
    ogTitle: "docker dso down — Stop Containers Safely",
    ogDescription: "Safely remove DSO-managed containers with secure secret cleanup",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/compose": {
    title: "docker dso compose | Secret-Injecting Compose Wrapper | DSO",
    description: "Use DSO as a drop-in replacement for docker-compose. Automatically injects secrets while running Docker Compose commands without code changes.",
    keywords: [
      "dso compose",
      "docker dso compose",
      "docker compose wrapper",
      "secret-injecting compose",
      "compose alternative",
    ],
    ogTitle: "docker dso compose — Secret-Injecting Wrapper",
    ogDescription: "Drop-in docker-compose replacement with automatic secret injection",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/secret": {
    title: "docker dso secret | Manage Vault Secrets | DSO",
    description: "Manage secrets in your Docker Secret Operator vault. Create, update, delete, and list secrets with AES-256 encryption and backup protection.",
    keywords: [
      "dso secret",
      "docker dso secret",
      "manage secrets docker",
      "vault secret management",
      "create secrets dso",
    ],
    ogTitle: "docker dso secret — Manage Vault Secrets",
    ogDescription: "Create, update, and manage encrypted secrets in your DSO vault",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/management": {
    title: "CLI: Management & Diagnostics | DSO",
    description: "Docker Secret Operator management and diagnostic commands. Inspect containers, view logs, monitor events, and troubleshoot issues.",
    keywords: [
      "dso management",
      "dso diagnostics",
      "docker dso logs",
      "container inspection",
      "troubleshooting dso",
    ],
    ogTitle: "DSO Management & Diagnostics",
    ogDescription: "Diagnostic tools for monitoring and troubleshooting DSO deployments",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/cli/system": {
    title: "CLI: System Setup & Management | DSO",
    description: "Docker Secret Operator system-level commands for managing plugins, configuration, and Cloud Mode agent. Setup and diagnostic tools.",
    keywords: [
      "dso system",
      "dso plugins",
      "system setup",
      "plugin management",
      "cloud mode setup",
    ],
    ogTitle: "DSO System Setup & Management",
    ogDescription: "System-level tools for DSO configuration and Cloud Mode agent management",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  // PLACEHOLDER FOR FUTURE PAGES
  // These will be generated programmatically when pages are created
  "[comparison]": {
    title: "DSO vs [TOOL] | Feature Comparison",
    description: "Detailed comparison between Docker Secret Operator and [TOOL]. See features, pricing, use cases, and when to choose each.",
    keywords: [
      "dso vs [tool]",
      "[tool] alternative",
      "secret management comparison",
    ],
    ogTitle: "Docker Secret Operator vs [TOOL]",
    ogDescription: "Complete feature and use-case comparison",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "[integration]": {
    title: "[PROVIDER] Integration Guide | DSO",
    description: "How to integrate Docker Secret Operator with [PROVIDER]. Complete setup guide with code examples and configuration.",
    keywords: [
      "dso [provider]",
      "[provider] integration",
      "how to integrate [provider]",
      "setup [provider]",
    ],
    ogTitle: "Docker Secret Operator + [PROVIDER]",
    ogDescription: "Complete integration guide for [PROVIDER] secrets",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "[usecase]": {
    title: "Docker Secret Operator for [VERTICAL] | Guide",
    description: "How to use Docker Secret Operator for [VERTICAL] applications. Best practices, configuration, and real-world examples.",
    keywords: [
      "dso [vertical]",
      "[vertical] secrets",
      "secret management [vertical]",
    ],
    ogTitle: "DSO for [VERTICAL]",
    ogDescription: "[VERTICAL]-specific secret management guide",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },
};

/**
 * Get metadata config for a specific page
 * Falls back to parent route if specific page not found
 */
export function getPageMetadataConfig(pathname: string): PageMetadataConfig | null {
  // Exact match first
  if (pathname in PAGE_METADATA) {
    return PAGE_METADATA[pathname as keyof typeof PAGE_METADATA];
  }

  // Parent route fallback (e.g., /docs/cli -> /docs)
  const parent = pathname.substring(0, pathname.lastIndexOf("/")) || "/";
  if (parent in PAGE_METADATA) {
    return PAGE_METADATA[parent as keyof typeof PAGE_METADATA];
  }

  return null;
}

/**
 * Get all pages with metadata
 */
export function getAllPageRoutes(): string[] {
  return Object.keys(PAGE_METADATA);
}
