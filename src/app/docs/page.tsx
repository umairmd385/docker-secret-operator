import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { DocsNavigation } from "@/components/sections/DocsNavigation";

export const metadata = generatePageMetadata(
  { ...PAGE_METADATA["/"], title: "Documentation | Docker Secret Operator" },
  "/docs"
);

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Documentation
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Comprehensive guides for setup, architecture, provider integration, operations, and security.
        </p>
      </div>

      {/* Documentation navigation cards */}
      <DocsNavigation />
    </div>
  );
}
