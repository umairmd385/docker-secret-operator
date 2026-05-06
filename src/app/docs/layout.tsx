import { DocsLayout } from "@/components/layout/DocsLayout";

export const metadata = {
  title: "DSO Documentation",
  description: "Docker Secret Operator CLI reference and guides",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
