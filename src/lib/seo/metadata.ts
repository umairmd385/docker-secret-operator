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
  ogImageWidth: 1200,
  ogImageHeight: 630,
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

  // TOP-LEVEL PAGES
  "/comparisons": {
    title: "DSO vs Secret Management Tools | Comparisons",
    description: "Compare Docker Secret Operator with Vault, Doppler, Infisical, Docker Secrets, Sealed Secrets, and manual scripts. Feature-by-feature comparison for choosing the right secret management tool.",
    keywords: [
      "docker secret operator comparison",
      "dso vs vault",
      "secret management comparison",
      "doppler alternative",
      "infisical alternative",
    ],
    ogTitle: "Docker Secret Operator vs Other Tools",
    ogDescription: "Side-by-side comparison of DSO vs Vault, Doppler, Infisical, and more.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/integrations": {
    title: "Provider Integrations | Docker Secret Operator",
    description: "Docker Secret Operator integration guides for AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Huawei Cloud KMS, and Local Mode. Complete setup instructions for all supported secret providers.",
    keywords: [
      "dso integrations",
      "docker secret operator providers",
      "aws secrets manager integration",
      "azure key vault docker",
      "hashicorp vault docker",
    ],
    ogTitle: "DSO Provider Integrations",
    ogDescription: "Complete integration guides for AWS, Azure, Vault, Huawei, and Local Mode.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/examples": {
    title: "Examples & Use Cases | Docker Secret Operator",
    description: "Real-world Docker Secret Operator examples and use cases. Sample configurations for web applications, databases, microservices, and multi-environment deployments with automatic secret rotation.",
    keywords: [
      "dso examples",
      "docker secret operator use cases",
      "secret injection example",
      "docker compose secret example",
      "zero downtime rotation example",
    ],
    ogTitle: "DSO Examples & Use Cases",
    ogDescription: "Real-world configurations and patterns for Docker Secret Operator deployments.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/faq": {
    title: "FAQ | Docker Secret Operator",
    description: "Frequently asked questions about Docker Secret Operator. Learn what DSO is, how it compares to Vault, which providers are supported, how to install it, and how zero-persistence secret management works.",
    keywords: [
      "docker secret operator faq",
      "dso questions",
      "how does dso work",
      "secret operator install",
      "zero persistence secrets faq",
    ],
    ogTitle: "Docker Secret Operator — Frequently Asked Questions",
    ogDescription: "Answers to common questions about DSO installation, features, and providers.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  // GUIDE PAGES (static)
  "/docs/guide/what-is-dso": {
    title: "What is Docker Secret Operator (DSO)? | Overview & Features",
    description: "Docker Secret Operator (DSO) is an open-source, CNCF Sandbox runtime secret injection daemon for Docker and Docker Compose. Zero-persistence secrets, automatic rotation, and crash recovery — no Kubernetes required.",
    keywords: ["what is docker secret operator", "dso overview", "docker secret injection", "runtime secret injection"],
    ogTitle: "What is Docker Secret Operator (DSO)?",
    ogDescription: "Runtime secret injection and automatic rotation for Docker. CNCF Sandbox project.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/quick-start": {
    title: "Quick Start Guide — Docker Secret Operator in 5 Minutes",
    description: "Get Docker Secret Operator running in 5 minutes. Step-by-step guide for Local Mode (development) and Agent Mode (production). Automatic secret injection with zero downtime.",
    keywords: ["dso quick start", "docker secret operator setup", "secret injection quick guide", "docker dso 5 minutes"],
    ogTitle: "DSO Quick Start — 5 Minute Setup",
    ogDescription: "Get Docker Secret Operator running in 5 minutes with Local or Agent Mode.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/security": {
    title: "Security Model & Threat Analysis | Docker Secret Operator",
    description: "Docker Secret Operator security guarantees, threat model, and best practices. Zero-persistence secrets, AES-256 encryption, TLS 1.2+, audit logging, and compliance with PCI-DSS, HIPAA, SOC 2.",
    keywords: ["dso security", "docker secret operator security", "zero persistence secrets", "secret encryption docker", "pci-dss hipaa soc2 secrets"],
    ogTitle: "DSO Security Model & Threat Analysis",
    ogDescription: "Zero-persistence secrets, AES-256 encryption, TLS 1.2+, full audit trail.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/troubleshooting": {
    title: "Troubleshooting Guide | Docker Secret Operator",
    description: "Diagnose and fix common Docker Secret Operator issues. Solutions for agent startup failures, rotation timeouts, health check errors, permission denied errors, and provider connection failures.",
    keywords: ["dso troubleshooting", "docker secret operator debug", "rotation not working", "dso agent won't start"],
    ogTitle: "DSO Troubleshooting Guide",
    ogDescription: "Step-by-step solutions for DSO agent startup, rotation failures, and health checks.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/production-readiness": {
    title: "Production Readiness Checklist | Docker Secret Operator",
    description: "Complete production readiness checklist for Docker Secret Operator. Infrastructure requirements, security configuration, monitoring setup, compliance (PCI-DSS, HIPAA, SOC 2), and performance considerations.",
    keywords: ["dso production readiness", "docker secret operator production", "production deployment checklist", "pci-dss compliance docker"],
    ogTitle: "DSO Production Readiness Guide",
    ogDescription: "Complete production checklist: infrastructure, security, monitoring, compliance.",
    ogImage: "/og-image.png",
    twitterCard: "summary",
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

  // GUIDE PAGES
  "/docs/guide/best-practices": {
    title: "Best Practices | DSO Documentation",
    description: "Production best practices for Docker Secret Operator. Configuration recommendations, monitoring setup, IAM role usage, and operational safety guidelines.",
    keywords: [
      "dso best practices",
      "secret rotation best practices",
      "production setup",
      "dso monitoring",
      "iam roles docker",
    ],
    ogTitle: "Docker Secret Operator Best Practices",
    ogDescription: "Production best practices for reliable and secure DSO deployments",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/compliance": {
    title: "Compliance & Security Controls | DSO Documentation",
    description: "Docker Secret Operator compliance mappings for SOC 2, ISO 27001, and PCI-DSS. Understand how DSO satisfies regulatory requirements.",
    keywords: [
      "dso compliance",
      "soc 2 secrets",
      "iso 27001 compliance",
      "pci-dss secrets",
      "regulatory requirements",
    ],
    ogTitle: "DSO Compliance & Security Controls",
    ogDescription: "SOC 2, ISO 27001, and PCI-DSS compliance mappings for Docker Secret Operator",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/observability": {
    title: "Observability | DSO Documentation",
    description: "Monitor and observe Docker Secret Operator with Prometheus metrics and structured JSON logging. Integration guide for Grafana, Datadog, and ELK.",
    keywords: [
      "dso monitoring",
      "prometheus metrics",
      "observability docker",
      "audit logging",
      "structured logging",
    ],
    ogTitle: "Docker Secret Operator Observability",
    ogDescription: "Prometheus metrics and structured logging for DSO operational visibility",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  // PROVIDER PAGES
  "/docs/guide/providers/aws": {
    title: "AWS Secrets Manager Integration | DSO",
    description: "Integrate Docker Secret Operator with AWS Secrets Manager. Complete setup guide using IAM roles, Instance Profiles, and CloudTrail auditing.",
    keywords: [
      "dso aws",
      "aws secrets manager docker",
      "ec2 instance profile",
      "iam role secrets",
      "aws integration",
    ],
    ogTitle: "DSO + AWS Secrets Manager",
    ogDescription: "Complete AWS Secrets Manager integration guide for Docker Secret Operator",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/providers/azure": {
    title: "Azure Key Vault Integration | DSO",
    description: "Integrate Docker Secret Operator with Azure Key Vault. Setup guide with Managed Identity, RBAC, and compliance configuration.",
    keywords: [
      "dso azure",
      "azure key vault docker",
      "managed identity",
      "rbac secrets",
      "azure integration",
    ],
    ogTitle: "DSO + Azure Key Vault",
    ogDescription: "Complete Azure Key Vault integration guide for Docker Secret Operator",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/providers/vault": {
    title: "HashiCorp Vault Integration | DSO",
    description: "Integrate Docker Secret Operator with HashiCorp Vault. Setup guide for AppRole authentication, dynamic secrets, and self-hosted deployments.",
    keywords: [
      "dso vault",
      "hashicorp vault docker",
      "approle authentication",
      "dynamic secrets",
      "self-hosted vault",
    ],
    ogTitle: "DSO + HashiCorp Vault",
    ogDescription: "Complete HashiCorp Vault integration guide for Docker Secret Operator",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/providers/huawei": {
    title: "Huawei Cloud KMS Integration | DSO",
    description: "Integrate Docker Secret Operator with Huawei Cloud KMS. Setup guide with service accounts and encryption key management.",
    keywords: [
      "dso huawei",
      "huawei kms docker",
      "huawei secrets",
      "cloud kms",
      "huawei integration",
    ],
    ogTitle: "DSO + Huawei Cloud KMS",
    ogDescription: "Complete Huawei Cloud KMS integration guide for Docker Secret Operator",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/docs/guide/providers/local": {
    title: "Local Mode & Encrypted Vault | DSO",
    description: "Docker Secret Operator Local Mode with AES-256-GCM encrypted vault. Perfect for development, testing, and non-root deployments.",
    keywords: [
      "dso local mode",
      "encrypted vault",
      "aes-256 encryption",
      "dev environment",
      "non-root secrets",
    ],
    ogTitle: "DSO Local Mode",
    ogDescription: "AES-256-GCM encrypted vault for development and isolated deployments",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  // COMPARISON PAGES
  "/comparisons/doppler": {
    title: "DSO vs Doppler | Feature Comparison",
    description: "Detailed comparison between Docker Secret Operator and Doppler. See architecture, deployment, pricing, and when to choose each platform.",
    keywords: [
      "dso vs doppler",
      "doppler alternative",
      "secret management comparison",
      "docker secrets",
    ],
    ogTitle: "Docker Secret Operator vs Doppler",
    ogDescription: "Complete feature comparison: Docker Secret Operator vs Doppler",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/comparisons/infisical": {
    title: "DSO vs Infisical | Feature Comparison",
    description: "Detailed comparison between Docker Secret Operator and Infisical. See architecture, deployment, pricing, and when to choose each platform.",
    keywords: [
      "dso vs infisical",
      "infisical alternative",
      "secret management comparison",
      "docker secrets",
    ],
    ogTitle: "Docker Secret Operator vs Infisical",
    ogDescription: "Complete feature comparison: Docker Secret Operator vs Infisical",
    ogImage: "/og-image.png",
    twitterCard: "summary",
  },

  "/comparisons/manual-scripts": {
    title: "DSO vs Manual Scripts | Why Automate Secret Rotation",
    description: "Why Docker Secret Operator is better than manual secret rotation scripts. Risks of manual automation, compliance gaps, and operational burden.",
    keywords: [
      "secret rotation automation",
      "manual rotation risks",
      "automated secret rotation",
      "why automate secrets",
    ],
    ogTitle: "DSO vs Manual Scripts",
    ogDescription: "Why automated secret rotation is critical vs manual scripts",
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
