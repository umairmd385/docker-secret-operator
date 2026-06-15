import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";
import { DocsQuickStart } from "@/components/sections/DocsQuickStart";
import { DocsScenarios } from "@/components/sections/DocsScenarios";
import { DocsNavigation } from "@/components/sections/DocsNavigation";

export const metadata = generatePageMetadata(
  {
    ...PAGE_METADATA["/"],
    title: "Documentation | Docker Secret Operator",
    description:
      "Get DSO running in 5 minutes. Quick start, common scenarios, provider guides, operational playbooks, and troubleshooting.",
  },
  "/docs"
);

export default function DocsPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-background overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-accent/10 via-background to-transparent opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col w-full space-y-0">
        {/* Quick Start - Most important */}
        <DocsQuickStart />

        {/* Common Scenarios */}
        <DocsScenarios />

        {/* Full Navigation */}
        <section className="relative py-20 sm:py-32 bg-background border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="space-y-12">
              {/* Header */}
              <div className="max-w-3xl">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  All Documentation
                </h2>
                <p className="text-lg text-gray-400">
                  Complete guides for setup, architecture, provider integration, operations, and security.
                </p>
              </div>

              {/* Navigation Cards */}
              <DocsNavigation />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
