import type { Metadata } from "next";
import { ComparisonRenderer } from "@/components/comparisons/ComparisonRenderer";
import { getComparison } from "@/lib/comparisons";
import { getPageMetadataConfig } from "@/lib/seo/metadata";
import type { Comparison } from "@/lib/comparisons";

const config = getPageMetadataConfig("/comparisons/manual-scripts");

export const metadata: Metadata = {
  title: config?.title || "DSO vs Manual Scripts | Why Automate Secret Rotation",
  description: config?.description || "Why Docker Secret Operator is better than manual secret rotation scripts.",
  keywords: config?.keywords,
  openGraph: {
    title: config?.ogTitle,
    description: config?.ogDescription,
  },
};

export default function ManualScriptsComparison() {
  const comparison = getComparison("manual-scripts") as Comparison | null;

  if (!comparison) {
    return <div className="max-w-4xl mx-auto py-8">Comparison not found</div>;
  }

  return <ComparisonRenderer comparison={comparison} />;
}
