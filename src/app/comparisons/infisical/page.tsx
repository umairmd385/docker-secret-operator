import type { Metadata } from "next";
import { ComparisonRenderer } from "@/components/comparisons/ComparisonRenderer";
import { getComparison } from "@/lib/comparisons";
import { getPageMetadataConfig } from "@/lib/seo/metadata";
import type { Comparison } from "@/lib/comparisons";

const config = getPageMetadataConfig("/comparisons/infisical");

export const metadata: Metadata = {
  title: config?.title || "DSO vs Infisical | Feature Comparison",
  description: config?.description || "Detailed comparison between Docker Secret Operator and Infisical.",
  keywords: config?.keywords,
  openGraph: {
    title: config?.ogTitle,
    description: config?.ogDescription,
  },
};

export default function InfisicalComparison() {
  const comparison = getComparison("infisical") as Comparison | null;

  if (!comparison) {
    return <div className="max-w-4xl mx-auto py-8">Comparison not found</div>;
  }

  return <ComparisonRenderer comparison={comparison} />;
}
