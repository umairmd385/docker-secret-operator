import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Docker Secret Operator documentation. Learn how to use DSO for zero-persistence secret management.",
  alternates: {
    canonical: "https://dso.skycloudops.in/docs",
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Docker Secret Operator (DSO) documentation. Inject secrets at runtime without storing them on disk.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/docs/guide/what-is-dso"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Introduction</h2>
            <p className="text-muted-foreground">Learn what DSO is and its core security pillars</p>
          </Link>

          <Link
            href="/docs/guide/getting-started"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
            <p className="text-muted-foreground">Quick start guide for DSO installation and setup</p>
          </Link>

          <Link
            href="/docs/guide/installation"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Installation</h2>
            <p className="text-muted-foreground">Complete installation instructions for all platforms</p>
          </Link>

          <Link
            href="/docs/guide/cli"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">CLI Reference</h2>
            <p className="text-muted-foreground">Comprehensive CLI command reference and examples</p>
          </Link>

          <Link
            href="/docs/guide/providers/aws"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Providers</h2>
            <p className="text-muted-foreground">AWS, Azure, Vault, Huawei, and Local mode documentation</p>
          </Link>

          <Link
            href="/docs/guide/security"
            className="p-6 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Security</h2>
            <p className="text-muted-foreground">Security architecture and best practices</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
