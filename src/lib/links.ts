/**
 * Internal Link Routes & Navigation
 *
 * Centralized routing for internal links across the site.
 * Ensures consistency and makes refactoring easy.
 */

export const ROUTES = {
  // Root
  home: "/",

  // Landing Pages
  landingPages: {
    architecture: "/architecture",
    deployments: "/deployments",
    capabilities: "/capabilities",
    faq: "/faq",
  },

  // Comparisons
  comparisons: {
    root: "/comparisons",
    vault: "/comparisons/vault",
    kubernetesSecrets: "/comparisons/kubernetes-secrets",
    dockerSecrets: "/comparisons/docker-secrets",
    externalSecrets: "/comparisons/external-secrets",
    sealedSecrets: "/comparisons/sealed-secrets",
    doppler: "/comparisons/doppler",
    infisical: "/comparisons/infisical",
    manualScripts: "/comparisons/manual-scripts",
  },

  // Docs
  docs: {
    root: "/docs",
    cli: "/docs/cli",
    guide: {
      root: "/docs/guide",
      security: "/docs/guide/security",
      privacy: "/docs/guide/privacy",
      installation: "/docs/guide/installation",
      bestPractices: "/docs/guide/best-practices",
      compliance: "/docs/guide/compliance",
      observability: "/docs/guide/observability",
      providers: {
        root: "/docs/guide/providers",
        aws: "/docs/guide/providers/aws",
        azure: "/docs/guide/providers/azure",
        vault: "/docs/guide/providers/vault",
      },
    },
  },

  // CLI Commands
  cli: {
    init: "/docs/cli/init",
    up: "/docs/cli/up",
    down: "/docs/cli/down",
    compose: "/docs/cli/compose",
    secret: "/docs/cli/secret",
    management: "/docs/cli/management",
    system: "/docs/cli/system",
  },

  // Page anchors (scrollable sections)
  anchors: {
    features: "#features",
    architecture: "#architecture",
    quickStart: "#quick-start",
    integrations: "#integrations",
  },

  // External links
  external: {
    github: "https://github.com/docker-secret-operator/dso",
    githubExamples: "https://github.com/docker-secret-operator/dso/tree/main/examples",
    githubDiscussions: "https://github.com/docker-secret-operator/dso/discussions",
    githubIssues: "https://github.com/docker-secret-operator/dso/issues",
    githubReleases: "https://github.com/docker-secret-operator/dso/releases",
    twitter: "https://x.com/skycloudops",
    linkedin: "https://www.linkedin.com/in/mdumair250801/",
    discord: "https://discord.gg/skycloudops",
  },
} as const;

/**
 * Get CLI command documentation link
 */
export function getCliCommandLink(command: "init" | "up" | "down" | "compose" | "secret" | "management" | "system"): string {
  return ROUTES.cli[command];
}

/**
 * Get docs guide link
 */
export function getDocsLink(section: keyof typeof ROUTES.docs.guide): string {
  if (section === "root") return ROUTES.docs.guide.root;
  return ROUTES.docs.guide[section as never] as any;
}

/**
 * Build breadcrumb trail for a route
 */
export function getBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: ROUTES.home },
  ];

  switch (pathname) {
    case ROUTES.docs.root:
      breadcrumbs.push({ label: "Docs", href: ROUTES.docs.root });
      break;
    case ROUTES.docs.cli:
      breadcrumbs.push(
        { label: "Docs", href: ROUTES.docs.root },
        { label: "CLI Reference", href: ROUTES.docs.cli }
      );
      break;
    case ROUTES.cli.init:
    case ROUTES.cli.up:
    case ROUTES.cli.down:
    case ROUTES.cli.compose:
    case ROUTES.cli.secret:
    case ROUTES.cli.management:
    case ROUTES.cli.system:
      const commandName = pathname.split("/").pop() || "cli";
      breadcrumbs.push(
        { label: "Docs", href: ROUTES.docs.root },
        { label: "CLI", href: ROUTES.docs.cli },
        { label: commandName.charAt(0).toUpperCase() + commandName.slice(1), href: pathname }
      );
      break;
  }

  return breadcrumbs;
}

/**
 * Get related links for a CLI command page
 * Used for "Related Commands" sections
 */
export function getRelatedCliCommands(
  currentCommand: keyof typeof ROUTES.cli
): Array<{ label: string; href: string; description: string }> {
  const all = {
    init: { label: "CLI: Init", href: ROUTES.cli.init, description: "Initialize encrypted vault" },
    up: { label: "CLI: Up", href: ROUTES.cli.up, description: "Deploy with secret injection" },
    down: { label: "CLI: Down", href: ROUTES.cli.down, description: "Stop containers safely" },
    compose: { label: "CLI: Compose", href: ROUTES.cli.compose, description: "Docker Compose wrapper" },
    secret: { label: "CLI: Secret", href: ROUTES.cli.secret, description: "Manage vault secrets" },
    management: { label: "CLI: Management", href: ROUTES.cli.management, description: "Monitoring & diagnostics" },
    system: { label: "CLI: System", href: ROUTES.cli.system, description: "System setup & plugins" },
  };

  // Filter out current command and return related ones
  return Object.entries(all)
    .filter(([key]) => key !== currentCommand)
    .map(([, value]) => value)
    .slice(0, 3);
}

/**
 * Get provider documentation links
 */
export function getProviderLinks(): Array<{ name: string; href: string }> {
  return [
    { name: "AWS Secrets Manager", href: ROUTES.docs.guide.providers.aws },
    { name: "Azure Key Vault", href: ROUTES.docs.guide.providers.azure },
    { name: "HashiCorp Vault", href: ROUTES.docs.guide.providers.vault },
  ];
}
