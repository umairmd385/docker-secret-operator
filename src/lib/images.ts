/**
 * Centralized image asset definitions with SEO-optimized alt text
 *
 * Benefits:
 * - Single source of truth for image metadata
 * - SEO-optimized alt text for accessibility and search
 * - Easy maintenance and updates
 * - Type-safe image usage
 */

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Core brand and logo images with SEO-optimized alt text
 */
export const BRAND_IMAGES = {
  LOGO: {
    src: "/dso-logo.png",
    alt: "Docker Secret Operator logo - zero-persistence secret injection tool",
    width: 1024,
    height: 1024,
  } as ImageAsset,

  LOGO_NAV: {
    src: "/logo-nav.png",
    alt: "Docker Secret Operator navigation logo",
    width: 160,
    height: 40,
  } as ImageAsset,

  FAVICON: {
    src: "/favicon.png",
    alt: "Docker Secret Operator favicon",
    width: 32,
    height: 32,
  } as ImageAsset,

  APPLE_ICON: {
    src: "/apple-icon.png",
    alt: "Docker Secret Operator iOS app icon",
    width: 180,
    height: 180,
  } as ImageAsset,

  ICON: {
    src: "/icon.png",
    alt: "Docker Secret Operator application icon",
    width: 512,
    height: 512,
  } as ImageAsset,

  OG_IMAGE: {
    src: "/og-image.png",
    alt: "Docker Secret Operator - event-driven secret injection for Docker containers",
    width: 1200,
    height: 630,
  } as ImageAsset,

  BRAND_3D_LOGO: {
    src: "/brand/dso-3d-logo.png",
    alt: "Docker Secret Operator 3D logo visualization",
    width: 1024,
    height: 1024,
  } as ImageAsset,
} as const;

/**
 * Provider integration logos
 * Used in comparisons and provider selection
 */
export const PROVIDER_LOGOS = {
  VAULT: {
    src: "/logos/vault.png",
    alt: "HashiCorp Vault logo - enterprise secrets management platform",
    width: 200,
    height: 200,
  } as ImageAsset,

  AZURE: {
    src: "/logos/azure.png",
    alt: "Azure Key Vault logo - Microsoft cloud key management service",
    width: 200,
    height: 200,
  } as ImageAsset,
} as const;

/**
 * Documentation images
 */
export const DOC_IMAGES = {
  DSO_LOGO: {
    src: "/docs/dso-logo.png",
    alt: "Docker Secret Operator documentation logo",
    width: 200,
    height: 200,
  } as ImageAsset,

  LOGO_TRANSPARENT: {
    src: "/docs/assets/images/logo-transparent.png",
    alt: "Docker Secret Operator logo with transparent background",
    width: 500,
    height: 500,
  } as ImageAsset,
} as const;

/**
 * External CDN provider logos
 * Used in trust strip and integrations marquee
 */
export const CDN_PROVIDER_LOGOS = {
  DOCKER: {
    src: "https://cdn.simpleicons.org/docker/ffffff",
    alt: "Docker Engine logo - container runtime platform",
    width: 40,
    height: 40,
  } as ImageAsset,

  AWS: {
    src: "https://img.icons8.com/?size=100&id=G0CnLqqcRBXl&format=png&color=ffffff",
    alt: "AWS Secrets Manager logo - Amazon Web Services secret management",
    width: 40,
    height: 40,
  } as ImageAsset,

  HASHICORP: {
    src: "https://cdn.simpleicons.org/hashicorp/ffffff",
    alt: "HashiCorp Vault logo - secrets management and encryption",
    width: 40,
    height: 40,
  } as ImageAsset,

  KUBERNETES: {
    src: "https://cdn.simpleicons.org/kubernetes/ffffff",
    alt: "Kubernetes logo - container orchestration platform",
    width: 40,
    height: 40,
  } as ImageAsset,

  AZURE_KEY_VAULT: {
    src: "https://img.icons8.com/?size=100&id=81727&format=png&color=ffffff",
    alt: "Azure Key Vault logo - Microsoft cloud key management",
    width: 40,
    height: 40,
  } as ImageAsset,

  HUAWEI: {
    src: "https://cdn.simpleicons.org/huawei/ffffff",
    alt: "Huawei Cloud logo - Chinese cloud computing platform",
    width: 40,
    height: 40,
  } as ImageAsset,
} as const;

/**
 * Utility type to extract all image keys
 */
export type AllImageKeys =
  | keyof typeof BRAND_IMAGES
  | keyof typeof PROVIDER_LOGOS
  | keyof typeof DOC_IMAGES
  | keyof typeof CDN_PROVIDER_LOGOS;

/**
 * Helper function to get image by key
 */
export function getImage(
  category: "brand" | "provider" | "doc" | "cdn",
  key: string
): ImageAsset | undefined {
  switch (category) {
    case "brand":
      return BRAND_IMAGES[key as keyof typeof BRAND_IMAGES];
    case "provider":
      return PROVIDER_LOGOS[key as keyof typeof PROVIDER_LOGOS];
    case "doc":
      return DOC_IMAGES[key as keyof typeof DOC_IMAGES];
    case "cdn":
      return CDN_PROVIDER_LOGOS[key as keyof typeof CDN_PROVIDER_LOGOS];
    default:
      return undefined;
  }
}

/**
 * Get alt text for an image source URL
 * Useful for dynamic images from props
 */
export function getAltTextForProvider(providerName: string): string {
  const providerAltTexts: Record<string, string> = {
    docker: "Docker Engine logo - container runtime platform",
    aws: "AWS Secrets Manager logo - Amazon cloud secrets",
    "aws secrets manager": "AWS Secrets Manager logo - Amazon cloud secrets",
    vault: "HashiCorp Vault logo - secrets management",
    hashicorp: "HashiCorp Vault logo - secrets management",
    kubernetes: "Kubernetes logo - container orchestration",
    azure: "Azure Key Vault logo - Microsoft cloud key management",
    "azure key vault": "Azure Key Vault logo - Microsoft cloud key management",
    huawei: "Huawei Cloud Secret Manager logo - Huawei cloud secrets",
    "huawei cloud": "Huawei Cloud Secret Manager logo - Huawei cloud secrets",
  };

  return providerAltTexts[providerName.toLowerCase()] || `${providerName} logo`;
}
