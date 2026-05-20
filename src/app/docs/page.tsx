import React from "react";
import { Metadata } from "next";
import { DocsPageContent } from "@/components/docs/DocsPageContent";

export const metadata: Metadata = {
  title: "Documentation | Docker Secret Operator",
  description:
    "Comprehensive documentation for Docker Secret Operator. Learn how to use DSO for zero-persistence secret management.",
  alternates: {
    canonical: "https://dso.skycloudops.in/docs",
  },
};

export default function DocsPage() {
  return <DocsPageContent />;
}
