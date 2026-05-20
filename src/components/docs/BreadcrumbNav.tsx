"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  title: string;
  href: string;
}

interface BreadcrumbNavProps {
  breadcrumbs: Breadcrumb[];
}

export const BreadcrumbNav = ({ breadcrumbs }: BreadcrumbNavProps) => {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 mb-6 text-sm">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={crumb.href}>
          {idx > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
          {idx === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.title}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-accent transition-colors"
            >
              {crumb.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
