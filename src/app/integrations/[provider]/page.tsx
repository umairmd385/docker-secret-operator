import { Metadata } from "next";
import { IntegrationPage } from "@/components/integrations/IntegrationPage";
import {
  getIntegration,
  getAllIntegrations,
  getIntegrationMetadata,
  getRelatedIntegrations,
} from "@/content/integrations";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { ROUTES } from "@/lib/links";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ provider: string }>;
}

/**
 * Generate metadata for integration page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provider } = await params;
  const integration = getIntegration(provider);

  if (!integration) {
    return {
      title: "Integration Not Found",
      description: "The integration page you're looking for doesn't exist.",
    };
  }

  const meta = getIntegrationMetadata(integration);

  return generatePageMetadata(
    {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      ogTitle: meta.title,
      ogDescription: meta.description,
      ogImage: "/og-image.png",
      twitterCard: "summary",
      twitterTitle: meta.title,
      twitterDescription: meta.description,
    },
    `/integrations/${provider}`
  );
}

/**
 * Generate static paths for all integrations
 */
export async function generateStaticParams() {
  const integrations = getAllIntegrations();
  return integrations.map((integration) => ({
    provider: integration.slug,
  }));
}

export default async function IntegrationPageRoute({ params }: Props) {
  const { provider } = await params;
  const integration = getIntegration(provider);

  if (!integration) {
    notFound();
  }

  // Get related integrations for internal linking
  const related = getRelatedIntegrations(provider, 3).map((i) => ({
    label: `${i.provider.name} Integration`,
    href: `/integrations/${i.slug}`,
    description: i.description,
  }));

  return <IntegrationPage integration={integration} />;
}
