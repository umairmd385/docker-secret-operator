"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BookOpen, Terminal, Archive, Cloud, FileText, Shield } from "lucide-react";

interface DocSection {
  title: string;
  icon: React.ReactNode;
  href: string;
  isExternal?: boolean;
}

const docsSections: DocSection[] = [
  {
    title: "Getting Started",
    icon: <BookOpen className="w-4 h-4" />,
    href: "https://github.com/docker-secret-operator/dso#quick-start",
    isExternal: true,
  },
  {
    title: "CLI Reference",
    icon: <Terminal className="w-4 h-4" />,
    href: "/docs/cli",
  },
  {
    title: "Architecture",
    icon: <Archive className="w-4 h-4" />,
    href: "https://github.com/docker-secret-operator/dso/blob/main/docs/architecture.md",
    isExternal: true,
  },
  {
    title: "Providers",
    icon: <Cloud className="w-4 h-4" />,
    href: "https://github.com/docker-secret-operator/dso/blob/main/docs/providers.md",
    isExternal: true,
  },
  {
    title: "Operations",
    icon: <FileText className="w-4 h-4" />,
    href: "https://github.com/docker-secret-operator/dso/blob/main/docs/operations.md",
    isExternal: true,
  },
  {
    title: "Security",
    icon: <Shield className="w-4 h-4" />,
    href: "https://github.com/docker-secret-operator/dso/blob/main/docs/threat-model.md",
    isExternal: true,
  },
];

interface DocsSidebarProps {
  onNavigate?: () => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-24 space-y-2">
      <div className="mb-4 pb-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-foreground px-3">Documentation</h2>
      </div>
      <ul className="space-y-1">
        {docsSections.map((section) => (
          <li key={section.title}>
            <Link
              href={section.href}
              onClick={onNavigate}
              {...(section.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                pathname === section.href
                  ? "bg-accent/20 text-accent font-medium"
                  : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              <span className="text-gray-500">{section.icon}</span>
              <span>{section.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
