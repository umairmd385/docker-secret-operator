"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const docsSections = [
  {
    title: "Getting Started",
    items: [
      { label: "Documentation Home", href: "/docs/index.html" },
    ],
  },
  {
    title: "CLI Reference",
    items: [
      { label: "CLI Overview", href: "/docs/cli" },
      { label: "CLI: Init", href: "/docs/cli/init" },
      { label: "CLI: Up", href: "/docs/cli/up" },
      { label: "CLI: Down", href: "/docs/cli/down" },
      { label: "CLI: Compose", href: "/docs/cli/compose" },
      { label: "CLI: Secrets", href: "/docs/cli/secret" },
      { label: "CLI: Management", href: "/docs/cli/management" },
      { label: "CLI: System", href: "/docs/cli/system" },
    ],
  },
];

interface DocsSidebarProps {
  onNavigate?: () => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-24 space-y-6">
      {docsSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-foreground px-3 mb-3">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    "block px-3 py-2 text-sm rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-accent/20 text-accent font-medium"
                      : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
