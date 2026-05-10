import { DocsLayout } from "@/components/layout/DocsLayout";
import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { PAGE_METADATA } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata(PAGE_METADATA["/docs"], "/docs");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
