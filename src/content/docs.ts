export interface DocPage {
  title: string;
  href: string;
  description: string;
  keywords: string[];
  icon?: string;
}

export interface DocCategory {
  title: string;
  description?: string;
  pages: DocPage[];
}

export const docsStructure: Record<string, DocCategory> = {
  gettingStarted: {
    title: "Getting Started",
    description: "Start here to learn the basics",
    pages: [
      {
        title: "What is DSO?",
        href: "/docs/guide/what-is-dso",
        description: "Learn what Docker Secret Operator is and why it matters",
        keywords: ["dso", "docker", "secrets", "introduction"],
        icon: "BookOpen",
      },
      {
        title: "Getting Started",
        href: "/docs/guide/quick-start",
        description: "Quick start guide for DSO installation and setup",
        keywords: ["quick", "start", "install", "setup"],
        icon: "Zap",
      },
      {
        title: "Installation",
        href: "/docs/guide/installation",
        description: "Complete installation instructions for all platforms",
        keywords: ["install", "setup", "docker"],
        icon: "Download",
      },
    ],
  },
  guides: {
    title: "Core Guides",
    description: "Deep dive into DSO features and concepts",
    pages: [
      {
        title: "Configuration",
        href: "/docs/guide/configuration",
        description: "How to configure DSO for your environment",
        keywords: ["config", "setup", "environment"],
        icon: "Settings",
      },
      {
        title: "Security",
        href: "/docs/guide/security",
        description: "Security architecture and best practices",
        keywords: ["security", "encryption", "trust"],
        icon: "Shield",
      },
      {
        title: "Architecture",
        href: "/docs/guide/architecture",
        description: "Under the hood: how DSO works",
        keywords: ["architecture", "design", "how it works"],
        icon: "GitBranch",
      },
      {
        title: "Production Readiness",
        href: "/docs/guide/production-readiness",
        description: "Prepare DSO for production deployment",
        keywords: ["production", "deploy", "readiness"],
        icon: "CheckCircle",
      },
      {
        title: "Troubleshooting",
        href: "/docs/guide/troubleshooting",
        description: "Common issues and how to solve them",
        keywords: ["troubleshoot", "debug", "help"],
        icon: "AlertCircle",
      },
    ],
  },
  cli: {
    title: "CLI Reference",
    description: "Command-line interface documentation",
    pages: [
      {
        title: "CLI Overview",
        href: "/docs/cli",
        description: "Complete CLI command reference and examples",
        keywords: ["cli", "command", "reference"],
        icon: "Terminal",
      },
      {
        title: "dso init",
        href: "/docs/cli/init",
        description: "Initialize DSO configuration",
        keywords: ["init", "initialize", "setup"],
        icon: "Play",
      },
      {
        title: "dso up / down",
        href: "/docs/cli/up",
        description: "Deploy and manage your Docker stack",
        keywords: ["up", "down", "deploy"],
        icon: "ArrowUpCircle",
      },
      {
        title: "dso compose",
        href: "/docs/cli/compose",
        description: "Docker Compose integration",
        keywords: ["compose", "docker"],
        icon: "Layers",
      },
      {
        title: "dso secret",
        href: "/docs/cli/management",
        description: "Manage secrets with DSO",
        keywords: ["secret", "manage"],
        icon: "Key",
      },
      {
        title: "dso system",
        href: "/docs/cli/system",
        description: "System-level commands",
        keywords: ["system", "admin"],
        icon: "Cpu",
      },
    ],
  },
  providers: {
    title: "Providers",
    description: "Integration guides for secret storage backends",
    pages: [
      {
        title: "AWS Secrets Manager",
        href: "/docs/guide/providers/aws",
        description: "Configure DSO with AWS Secrets Manager",
        keywords: ["aws", "amazon", "provider"],
        icon: "Cloud",
      },
      {
        title: "Azure Key Vault",
        href: "/docs/guide/providers/azure",
        description: "Configure DSO with Azure Key Vault",
        keywords: ["azure", "microsoft", "provider"],
        icon: "Cloud",
      },
      {
        title: "HashiCorp Vault",
        href: "/docs/guide/providers/vault",
        description: "Configure DSO with HashiCorp Vault",
        keywords: ["vault", "hashicorp", "provider"],
        icon: "Lock",
      },
      {
        title: "Local Mode",
        href: "/docs/guide/providers/local",
        description: "Development-friendly local secret storage",
        keywords: ["local", "dev", "development"],
        icon: "HardDrive",
      },
    ],
  },
};

// Flatten all pages for search
export function getAllDocPages(): Array<DocPage & { category: string }> {
  return Object.entries(docsStructure).flatMap(([categoryKey, category]) =>
    category.pages.map((page) => ({
      ...page,
      category: category.title,
    }))
  );
}

// Search docs
export function searchDocs(query: string): Array<DocPage & { category: string }> {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();
  return getAllDocPages().filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery) ||
      page.description.toLowerCase().includes(searchQuery) ||
      page.keywords.some((kw) => kw.toLowerCase().includes(searchQuery))
  );
}

// Get related pages
export function getRelatedPages(href: string): DocPage[] {
  const allPages = getAllDocPages();
  const currentPage = allPages.find((p) => p.href === href);
  if (!currentPage) return [];

  // Find pages with overlapping keywords
  return allPages
    .filter((p) => p.href !== href)
    .filter((p) =>
      p.keywords.some((kw) => currentPage.keywords.includes(kw))
    )
    .slice(0, 3);
}

// Get breadcrumbs for a page
export function getBreadcrumbs(href: string): Array<{ title: string; href: string }> {
  const allPages = getAllDocPages();
  const page = allPages.find((p) => p.href === href);
  if (!page) return [{ title: "Docs", href: "/docs" }];

  const breadcrumbs: Array<{ title: string; href: string }> = [
    { title: "Docs", href: "/docs" },
  ];

  // Add category
  const categoryKey = Object.entries(docsStructure).find(([_, cat]) =>
    cat.pages.some((p) => p.href === href)
  );
  if (categoryKey) {
    breadcrumbs.push({
      title: docsStructure[categoryKey[0]].title,
      href: `/docs/guide`,
    });
  }

  // Add current page
  breadcrumbs.push({ title: page.title, href });

  return breadcrumbs;
}
