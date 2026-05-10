/**
 * Integration Pages System
 *
 * Centralized export and management of all integration guides.
 */

import { awsSecretsManagerIntegration } from "./aws-secrets-manager";
import { azureKeyVaultIntegration } from "./azure-key-vault";
import { hashicorpVaultIntegration } from "./hashicorp-vault";
import { dockerComposeIntegration } from "./docker-compose";
import { localModeIntegration } from "./local-mode";
import { huaweiCloudIntegration } from "./huawei-cloud";

export type IntegrationSlug =
  | "aws-secrets-manager"
  | "azure-key-vault"
  | "hashicorp-vault"
  | "docker-compose"
  | "local-mode"
  | "huawei-cloud";

export const INTEGRATIONS: Record<IntegrationSlug, any> = {
  "aws-secrets-manager": awsSecretsManagerIntegration,
  "azure-key-vault": azureKeyVaultIntegration,
  "hashicorp-vault": hashicorpVaultIntegration,
  "docker-compose": dockerComposeIntegration,
  "local-mode": localModeIntegration,
  "huawei-cloud": huaweiCloudIntegration,
};

/**
 * Get integration by slug
 */
export function getIntegration(slug: string): (typeof INTEGRATIONS)[IntegrationSlug] | null {
  return INTEGRATIONS[slug as IntegrationSlug] || null;
}

/**
 * Get all integrations
 */
export function getAllIntegrations() {
  return Object.values(INTEGRATIONS);
}

/**
 * Get integration metadata for SEO
 */
export function getIntegrationMetadata(integration: (typeof INTEGRATIONS)[IntegrationSlug]) {
  return {
    title: integration.title,
    description: integration.description,
    keywords: integration.keywords,
    canonical: `/integrations/${integration.slug}`,
    provider: integration.provider,
  };
}

/**
 * Get integrations grouped by category
 */
export function getIntegrationsByCategory(category: string) {
  const categoryMap: Record<string, IntegrationSlug[]> = {
    cloud: ["aws-secrets-manager", "azure-key-vault"],
    "self-hosted": ["hashicorp-vault"],
    local: ["docker-compose"],
  };
  return (categoryMap[category] || []).map((slug) => INTEGRATIONS[slug]);
}

/**
 * Get recommended next integrations based on current
 */
export function getRelatedIntegrations(currentSlug: string, limit = 3) {
  const integration = getIntegration(currentSlug);
  if (!integration) return [];

  const all = getAllIntegrations().filter((i) => i.slug !== currentSlug);

  // Simple relevance scoring based on keywords
  const scored = all.map((other) => {
    const keywordMatches = (integration.keywords || []).filter((k: string) =>
      (other.keywords || []).includes(k)
    ).length;
    return { integration: other, score: keywordMatches };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.integration);
}
