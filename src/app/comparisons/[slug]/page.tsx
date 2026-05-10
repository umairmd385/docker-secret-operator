import { Metadata } from "next";
import { ComparisonPage } from "@/components/ComparisonPage";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { getComparison, getAllComparisons, getComparisonMetadata } from "@/lib/comparisons";
import { ROUTES } from "@/lib/links";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for comparison page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found",
      description: "The comparison page you're looking for doesn't exist.",
    };
  }

  const meta = getComparisonMetadata(comparison);

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
    `/comparisons/${slug}`
  );
}

/**
 * Generate static paths for all comparisons
 */
export async function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((comp) => ({
    slug: comp.slug,
  }));
}

export default async function ComparisonPageRoute({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  // Get related comparisons (exclude current)
  const relatedComparisons = comparison.relatedPages
    ? getAllComparisons()
        .filter((c) => comparison.relatedPages?.includes(c.slug))
        .map((c) => ({
          label: c.title,
          href: `/comparisons/${c.slug}`,
          description: `Compare ${c.competitor.name} with DSO`,
        }))
    : [];

  return <ComparisonPage comparison={comparison} related={relatedComparisons} />;
}
