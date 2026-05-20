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

  if (!comparison || !('slug' in comparison)) {
    return {
      title: "Comparison Not Found",
      description: "The comparison page you're looking for doesn't exist.",
    };
  }

  const meta = getComparisonMetadata(comparison as any);

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
  return comparisons
    .filter((comp) => 'slug' in comp)
    .map((comp) => ({
      slug: (comp as any).slug,
    }));
}

export default async function ComparisonPageRoute({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison || !('slug' in comparison)) {
    notFound();
  }

  const typedComparison = comparison as any;

  // Get related comparisons (exclude current)
  const relatedComparisons = typedComparison.relatedPages
    ? getAllComparisons()
        .filter((c) => 'slug' in c && typedComparison.relatedPages?.includes((c as any).slug))
        .map((c) => ({
          label: (c as any).title,
          href: `/comparisons/${(c as any).slug}`,
          description: `Compare ${(c as any).competitor.name} with DSO`,
        }))
    : [];

  return <ComparisonPage comparison={typedComparison} related={relatedComparisons} />;
}
