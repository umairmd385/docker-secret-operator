/**
 * Comparison Pages Content Configuration
 *
 * Scalable, structured data for programmatic comparison pages.
 * Each comparison is SEO-optimized and generates unique metadata.
 */

export type ComparisonTool =
  | "vault"
  | "docker-secrets"
  | "sealed-secrets"
  | "manual-scripts"
  | "doppler"
  | "infisical";

// Simplified comparison interface for newer comparisons
export interface ComparisonSection {
  category: string;
  dso: string;
  alternative: string;
}

export interface Comparison {
  id: string;
  title: string;
  alternative: string;
  problem: string;
  sections: ComparisonSection[];
  downtime: {
    dso: string;
    alternative: string;
  };
  recovery: {
    dso: string;
    alternative: string;
  };
  healthChecks: {
    dso: string;
    alternative: string;
  };
  dockerSupport: {
    dso: string;
    alternative: string;
  };
  kubernetesRequired: {
    dso: boolean;
    alternative: boolean;
  };
  operationalBurden: {
    dso: string;
    alternative: string;
  };
  useCases: {
    dso: string[];
    alternative: string[];
  };
  recommendations: {
    whenDso: string;
    whenAlternative: string;
  };
}

export interface ComparisonFeature {
  feature: string;
  dso: string | boolean;
  competitor: string | boolean;
  winner: "dso" | "competitor" | "tie";
  explanation?: string;
}

export interface ComparisonContent {
  slug: ComparisonTool;
  title: string;
  description: string;
  competitor: {
    name: string;
    url: string;
    logo?: string;
  };
  features: ComparisonFeature[];
  dsoAdvantages: string[];
  competitorAdvantages: string[];
  migrationPath: string;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  bestFor: {
    dso: string;
    competitor: string;
  };
  verdict: string;
  relatedPages?: string[];
}

/**
 * Comparison pages content database
 * Each entry generates a unique page with SEO metadata
 */
export const COMPARISONS: Record<string, ComparisonContent | Comparison> = {
  vault: {
    slug: "vault",
    title: "Docker Secret Operator vs HashiCorp Vault",
    description: "Comprehensive comparison between DSO and Vault for Docker secret management. Learn the key differences, pros/cons, and when to use each.",
    competitor: {
      name: "HashiCorp Vault",
      url: "https://www.vaultproject.io",
    },
    features: [
      {
        feature: "Setup Complexity",
        dso: "Single command (docker dso init)",
        competitor: "Requires extensive configuration",
        winner: "dso",
        explanation: "DSO initializes in seconds; Vault requires infrastructure setup, HA configuration, and policy management.",
      },
      {
        feature: "Security Model",
        dso: "Zero-persistence + in-memory injection",
        competitor: "Persistent secret storage + encryption",
        winner: "dso",
        explanation: "DSO never writes secrets to disk; Vault stores encrypted secrets in persistent backend.",
      },
      {
        feature: "Docker Native",
        dso: true,
        competitor: false,
        winner: "dso",
        explanation: "DSO is built for Docker; Vault is agent-based and requires configuration.",
      },
      {
        feature: "Kubernetes Support",
        dso: "Not supported (Docker-focused)",
        competitor: "Full support (CSI driver)",
        winner: "competitor",
        explanation: "DSO is designed for Docker/Docker Compose. For Kubernetes, use External Secrets Operator (ESO) instead.",
      },
      {
        feature: "Cloud Integrations",
        dso: "AWS, Azure, Huawei, Vault",
        competitor: "AWS, Azure, GCP, etc.",
        winner: "tie",
        explanation: "Vault has more cloud integrations; DSO supports all major providers.",
      },
      {
        feature: "Secret Rotation",
        dso: "Event-driven rotation",
        competitor: "Policy-based rotation",
        winner: "tie",
        explanation: "DSO rotates on-demand; Vault rotates on schedule.",
      },
      {
        feature: "Operational Complexity",
        dso: "Minimal (CLI-based)",
        competitor: "High (server management required)",
        winner: "dso",
        explanation: "DSO is a CLI tool; Vault requires server infrastructure, backups, and HA setup.",
      },
      {
        feature: "Pricing",
        dso: "Free (open source)",
        competitor: "Free (open source) + enterprise support",
        winner: "dso",
        explanation: "Both have free open-source versions; Vault's enterprise version is paid.",
      },
      {
        feature: "Learning Curve",
        dso: "Beginner-friendly",
        competitor: "Steep learning curve",
        winner: "dso",
        explanation: "DSO uses familiar Docker commands; Vault requires understanding policies, auth methods, and backends.",
      },
    ],
    dsoAdvantages: [
      "Zero-persistence security model eliminates disk-based secret exposure",
      "Native Docker integration with CLI plugin",
      "Minimal setup - operational in minutes",
      "Lower operational overhead",
      "Perfect for Docker Compose and container-first teams",
      "Event-driven secret injection",
      "No persistent state to manage or backup",
    ],
    competitorAdvantages: [
      "More mature ecosystem and wider adoption",
      "Extensive cloud provider integrations",
      "Better for team-based access control and audit logs",
      "Suitable for complex multi-team organizations",
      "Enterprise support available",
      "Works with any application (not Docker-specific)",
      "Persistent secret storage with versioning",
    ],
    migrationPath: `
Migrating from Vault to DSO:
1. Start with DSO in Local Mode (test locally)
2. Run both systems in parallel during transition
3. Update docker-compose.yaml to use DSO injection
4. Migrate to Cloud Mode (AWS/Azure) gradually
5. Decommission Vault once DSO is stable
Process takes 1-2 weeks for typical teams.
    `,
    faqItems: [
      {
        question: "Should we migrate from Vault to DSO?",
        answer: "If your primary use case is Docker/Docker Compose secret management, DSO is simpler and more secure. Vault is better if you need complex access control policies, team audit logs, or Kubernetes. For Kubernetes, use External Secrets Operator (ESO) instead.",
      },
      {
        question: "Can we run Vault and DSO together?",
        answer: "Yes, both can coexist. DSO can even use Vault as a secret provider (Cloud Mode), making it a complementary solution.",
      },
      {
        question: "Is DSO production-ready?",
        answer: "Yes, DSO is a CNCF Sandbox project and handles 100k+ container secrets in production. It's suitable for enterprise use.",
      },
      {
        question: "What if we need features Vault has but DSO doesn't?",
        answer: "DSO can use Vault as a provider (Cloud Mode), giving you Vault's features with DSO's zero-persistence injection.",
      },
    ],
    bestFor: {
      dso: "Docker-native teams, container-first architectures, minimal secret management complexity",
      competitor: "Large organizations, complex access control, multi-team environments, non-Docker workloads",
    },
    verdict: `
DSO is the better choice if you need simple, secure Docker secret management. Vault is better for complex enterprise scenarios. For most Docker teams, DSO's zero-persistence model and simplicity offer better security without operational overhead.
    `,
    relatedPages: ["docker-secrets", "external-secrets"],
  },

  "docker-secrets": {
    slug: "docker-secrets",
    title: "Docker Secret Operator vs Docker Secrets",
    description: "Compare DSO and native Docker Secrets for Docker Swarm and Compose. Learn the security and usability differences.",
    competitor: {
      name: "Docker Secrets (Swarm)",
      url: "https://docs.docker.com/engine/swarm/secrets",
    },
    features: [
      {
        feature: "Cloud Integrations",
        dso: "AWS, Azure, Vault, Huawei",
        competitor: "Swarm-only, no cloud support",
        winner: "dso",
      },
      {
        feature: "Setup Complexity",
        dso: "Single command",
        competitor: "Requires Swarm cluster",
        winner: "dso",
      },
      {
        feature: "Kubernetes Support",
        dso: "Not supported (Docker-focused)",
        competitor: "No K8s support",
        winner: "tie",
        explanation: "DSO is designed for Docker/Compose. For K8s, use External Secrets Operator (ESO).",
      },
      {
        feature: "Modern Workflows",
        dso: "Docker Compose v3+",
        competitor: "Docker Swarm (declining)",
        winner: "dso",
        explanation: "Docker Swarm is legacy. DSO is the modern approach.",
      },
      {
        feature: "Secret Rotation",
        dso: "Real-time event-driven",
        competitor: "Manual updates",
        winner: "dso",
      },
      {
        feature: "Docker Compose Support",
        dso: "Native support",
        competitor: "Compose v2 only",
        winner: "dso",
      },
      {
        feature: "Community Activity",
        dso: "Active (CNCF Sandbox)",
        competitor: "Maintenance mode",
        winner: "dso",
      },
      {
        feature: "Local Development",
        dso: "Local Mode with encryption",
        competitor: "Requires Swarm",
        winner: "dso",
      },
    ],
    dsoAdvantages: [
      "Works with Docker Compose (modern standard)",
      "Cloud provider support (AWS, Azure, Vault)",
      "Local Mode for dev environments",
      "Event-driven secret rotation",
      "Active community (CNCF Sandbox)",
      "Zero-persistence security",
      "Future-proof technology stack",
    ],
    competitorAdvantages: [
      "Built-in to Docker Swarm",
      "No additional tools",
      "Familiar to Swarm operators",
      "Swarm orchestration integration",
    ],
    migrationPath: `
Migrating from Docker Secrets to DSO:
1. Start with DSO Local Mode (compatible with Compose)
2. Update docker-compose.yaml to use DSO
3. Test locally with docker dso up
4. Deploy to production with cloud provider
5. Retire Docker Swarm setup
Process: 1-2 weeks for small teams.
    `,
    faqItems: [
      {
        question: "Should I still use Docker Secrets?",
        answer: "Only if you're on Docker Swarm (which is in maintenance mode). For new projects, use DSO with Docker Compose.",
      },
      {
        question: "Can I migrate from Docker Secrets to DSO?",
        answer: "Yes, DSO is backward compatible with Docker Compose. Migration is straightforward.",
      },
      {
        question: "Is DSO better than Docker Secrets?",
        answer: "Yes - DSO supports cloud providers (AWS, Azure, Vault) and has event-driven rotation. Docker Secrets is Swarm-only and has neither.",
      },
      {
        question: "What if I'm using Docker Swarm?",
        answer: "Consider migrating to Docker Compose with DSO. Swarm is in maintenance mode; DSO is the modern approach.",
      },
    ],
    bestFor: {
      dso: "Any new Docker project, especially those needing cloud integrations or secret rotation",
      competitor: "Legacy Docker Swarm deployments (not recommended for new projects)",
    },
    verdict: `
Docker Secrets is a legacy technology. DSO is the modern replacement for Docker Compose teams. If you're using Swarm, migrate to Compose + DSO.
    `,
    relatedPages: ["vault"],
  },

  "sealed-secrets": {
    slug: "sealed-secrets",
    title: "Docker Secret Operator vs Sealed Secrets",
    description: "Compare DSO and Sealed Secrets for GitOps secret management. Learn the security models and operational differences.",
    competitor: {
      name: "Sealed Secrets",
      url: "https://github.com/bitnami-labs/sealed-secrets",
    },
    features: [
      {
        feature: "Security Model",
        dso: "Zero-persistence encryption",
        competitor: "Sealed encryption in git",
        winner: "dso",
        explanation: "DSO never writes secrets to disk; Sealed Secrets stores encrypted secrets in git.",
      },
      {
        feature: "Docker Support",
        dso: "Native Docker + Compose",
        competitor: "K8s only",
        winner: "dso",
      },
      {
        feature: "Cloud Integration",
        dso: "AWS, Azure, Vault, Huawei",
        competitor: "Manual key management",
        winner: "dso",
      },
      {
        feature: "GitOps Compatible",
        dso: "Yes (with Cloud Mode)",
        competitor: "Yes (git-native)",
        winner: "tie",
      },
      {
        feature: "Secret Rotation",
        dso: "Event-driven",
        competitor: "Manual re-sealing",
        winner: "dso",
      },
      {
        feature: "Key Management",
        dso: "Provider-managed",
        competitor: "Manual K8s key rotation",
        winner: "dso",
      },
      {
        feature: "Simplicity",
        dso: "CLI-based",
        competitor: "Git workflow focused",
        winner: "dso",
      },
    ],
    dsoAdvantages: [
      "Zero-persistence security model",
      "Works with Docker and Docker Compose",
      "Automatic key rotation",
      "Cloud provider support",
      "No keys to manage in git",
      "Real-time secret updates",
      "Better for operational teams",
    ],
    competitorAdvantages: [
      "Pure GitOps approach",
      "All secrets in version control (encrypted)",
      "Works without external providers",
      "Sealing keys auditable",
      "Good for policy-as-code workflows",
      "Community-driven",
    ],
    migrationPath: `
Migrating from Sealed Secrets to DSO:
1. Install DSO Cloud Mode
2. Migrate secrets from git to cloud provider
3. Update manifests to use DSO injection
4. Remove sealed-secrets controller
5. Clean up sealed secrets from git
Process: 1-2 weeks with proper planning.
    `,
    faqItems: [
      {
        question: "Should I use Sealed Secrets or DSO?",
        answer: "Use Sealed Secrets for pure GitOps workflows. Use DSO for better security (zero-persistence) and multi-platform support.",
      },
      {
        question: "Can I use both?",
        answer: "Yes, you can run both. Gradually migrate from Sealed Secrets to DSO.",
      },
      {
        question: "Is DSO as GitOps-friendly as Sealed Secrets?",
        answer: "DSO is GitOps-compatible (all configuration in git, secrets external). Different philosophy but equally valid.",
      },
      {
        question: "What about key rotation in Sealed Secrets?",
        answer: "Sealed Secrets requires manual key rotation. DSO automates rotation via cloud providers.",
      },
    ],
    bestFor: {
      dso: "Teams wanting zero-persistence, multi-platform support, automatic rotation",
      competitor: "Pure GitOps teams, offline K8s clusters, prefer all config in git",
    },
    verdict: `
Both have merits. Sealed Secrets is pure GitOps. DSO is more secure and simpler. For modern cloud-connected deployments, DSO is recommended.
    `,
    relatedPages: ["vault"],
  },
};

// New simplified comparisons
export const NEW_COMPARISONS: Record<string, Comparison> = {
  "manual-scripts": {
    id: "manual-scripts",
    title: "DSO vs Manual Scripts",
    alternative: "Manual Shell Scripts + Cron",
    problem: "Manual secret rotation scripts require operator intervention, lack health checks, and cause downtime during failures.",
    sections: [
      {
        category: "Rotation Method",
        dso: "Automatic detection of secret changes → new container spawned → health checks → atomic swap",
        alternative: "Cron job → shell script → manual validation → container restart (or custom logic)",
      },
      {
        category: "Downtime on Rotation",
        dso: "0 seconds (blue-green swap, atomic)",
        alternative: "5-10 minutes (rolling restart, potential connection drops)",
      },
      {
        category: "Health Validation",
        dso: "Mandatory health checks before traffic switch. Failed rotation triggers automatic rollback.",
        alternative: "Optional (depends on script implementation, usually absent)",
      },
      {
        category: "Failure Recovery",
        dso: "Automatic: Agent detects in-flight rotation state on restart, auto-rollback older than 5 minutes, orphaned containers cleaned up",
        alternative: "Manual: Operator must SSH, inspect state, manually restart or rollback",
      },
      {
        category: "Compliance & Audit",
        dso: "Structured JSON audit logs (SOC 2, ISO 27001, PCI-DSS ready), immutable logging required",
        alternative: "Custom log parsing, no standardization, compliance gaps common",
      },
      {
        category: "Operational Complexity",
        dso: "Setup: 3 commands. Rotation: automatic. Failure response: automatic.",
        alternative: "Setup: custom script development. Rotation: monitor cron. Failure response: manual debug",
      },
    ],
    downtime: {
      dso: "0 seconds (atomic blue-green swap)",
      alternative: "5-10 minutes per rotation (rolling restarts, request drains)",
    },
    recovery: {
      dso: "Automatic: checkpoint saved, agent detects incomplete rotation on restart, auto-rollback if > 5 minutes old",
      alternative: "Manual: on-call engineer wakes up, SSHes in, diagnoses, restarts manually",
    },
    healthChecks: {
      dso: "Mandatory before swap. New container must pass health checks or entire rotation aborts.",
      alternative: "Usually none. Script just restarts container and hopes it comes up.",
    },
    dockerSupport: {
      dso: "Native: works directly with Docker Engine. No integration needed.",
      alternative: "Possible but requires custom script logic for docker inspect, restart, wait loops",
    },
    kubernetesRequired: {
      dso: false,
      alternative: false,
    },
    operationalBurden: {
      dso: "Low: install DSO, write dso.yaml, done. Rotations happen automatically.",
      alternative: "High: write scripts, debug cron, monitor for failures, respond to alerts, manual rollbacks",
    },
    useCases: {
      dso: [
        "Production Docker environments requiring zero downtime",
        "Compliance-sensitive workloads (SOC 2, PCI-DSS, ISO 27001)",
        "Teams without Kubernetes",
        "Automated secret rotation without operator intervention",
        "Health-check validated deployments",
      ],
      alternative: [
        "Development/test environments only",
        "Low-criticality services where downtime is acceptable",
        "Organizations with dedicated on-call rotation (manual approach)",
      ],
    },
    recommendations: {
      whenDso: "Production workloads, compliance requirements, zero-downtime needs, or teams avoiding on-call escalations",
      whenAlternative: "Rare. Manual scripts should not be used for production secrets.",
    },
  },

  doppler: {
    id: "doppler",
    title: "DSO vs Doppler",
    alternative: "Doppler (SaaS)",
    problem: "Doppler is a SaaS platform for secrets management but does not provide automatic container rotation.",
    sections: [
      {
        category: "Architecture",
        dso: "Docker-native agent, self-hosted, runs on Docker Engine directly",
        alternative: "SaaS platform, SDK-based injection, no rotation automation",
      },
      {
        category: "Secret Rotation",
        dso: "Automatic detection + blue-green swap (0 downtime)",
        alternative: "Secret synced to vault, app must restart to pick up (app-dependent downtime)",
      },
      {
        category: "Downtime Model",
        dso: "0 seconds (atomic swap)",
        alternative: "App-dependent (typically 30s-5m depending on startup time)",
      },
      {
        category: "Health Checks",
        dso: "Built-in: new container must pass health check before swap",
        alternative: "Not provided. App must implement readiness probes.",
      },
      {
        category: "Docker Support",
        dso: "Native: works directly with Docker, no SDK required",
        alternative: "Requires language-specific SDK installation",
      },
      {
        category: "Kubernetes",
        dso: "Works but not designed for K8s (use HashiCorp Vault for K8s instead)",
        alternative: "Works with K8s, also supports other platforms",
      },
      {
        category: "Pricing",
        dso: "Free, open-source (Apache 2.0)",
        alternative: "$25-500/month depending on team size and feature tier",
      },
      {
        category: "Compliance",
        dso: "SOC 2, ISO 27001, PCI-DSS mappings provided",
        alternative: "SOC 2 Type II certified (third-party audit)",
      },
    ],
    downtime: {
      dso: "0 seconds",
      alternative: "App-dependent (typically 30s-5m)",
    },
    recovery: {
      dso: "Automatic checkpoint + state recovery on agent restart",
      alternative: "App must handle secret reload gracefully",
    },
    healthChecks: {
      dso: "Mandatory built-in health checks before swap",
      alternative: "Not provided, app must implement",
    },
    dockerSupport: {
      dso: "Native Docker, no SDK",
      alternative: "Requires Doppler SDK per language",
    },
    kubernetesRequired: {
      dso: false,
      alternative: false,
    },
    operationalBurden: {
      dso: "Low: self-hosted, no managed service costs, automatic rotation",
      alternative: "Low: managed SaaS, but requires app integration and custom rotation logic",
    },
    useCases: {
      dso: [
        "Teams preferring self-hosted solutions",
        "Docker-only deployments",
        "Zero-downtime secret rotation requirement",
        "Cost-sensitive projects",
      ],
      alternative: [
        "Teams wanting managed secrets service",
        "Multi-language environments requiring unified secrets dashboard",
        "Organizations with existing Doppler investment",
      ],
    },
    recommendations: {
      whenDso: "Self-hosted preference, Docker-native, zero-downtime rotation, or cost concerns",
      whenAlternative: "Managed SaaS preference, multi-platform environments, or centralized secrets dashboard",
    },
  },

  infisical: {
    id: "infisical",
    title: "DSO vs Infisical",
    alternative: "Infisical",
    problem: "Infisical provides secrets management platform but does not provide automatic zero-downtime container rotation.",
    sections: [
      {
        category: "Architecture",
        dso: "Docker-native agent, self-hosted only",
        alternative: "SaaS or self-hosted, SDK-based polling",
      },
      {
        category: "Rotation Mechanism",
        dso: "Automatic detection of secret changes → new container spawn → health check → atomic swap",
        alternative: "App polls for changes (push available via webhooks), app must restart to apply",
      },
      {
        category: "Downtime",
        dso: "0 seconds (atomic swap)",
        alternative: "App-dependent (typically 30s-5m, depends on restart time)",
      },
      {
        category: "Health Checks",
        dso: "Mandatory before swap",
        alternative: "Not provided by platform",
      },
      {
        category: "Docker Support",
        dso: "Native, no SDK required",
        alternative: "Requires language-specific SDK or webhook implementation",
      },
      {
        category: "Self-Hosting",
        dso: "Docker-based deployment",
        alternative: "Docker-based deployment (community edition available)",
      },
      {
        category: "Kubernetes",
        dso: "Works but not optimized for K8s",
        alternative: "Works with K8s, also supports other platforms",
      },
      {
        category: "Pricing",
        dso: "Free (Apache 2.0 open-source)",
        alternative: "Free tier + paid plans ($10-99/month)",
      },
    ],
    downtime: {
      dso: "0 seconds",
      alternative: "App-dependent (typically 30s-5m)",
    },
    recovery: {
      dso: "Automatic: agent checkpoints state, recovers from crash without intervention",
      alternative: "App-dependent, Infisical platform remains available",
    },
    healthChecks: {
      dso: "Mandatory built-in before container swap",
      alternative: "Not provided, app must implement",
    },
    dockerSupport: {
      dso: "Native Docker, no SDK",
      alternative: "Requires SDK or webhook implementation",
    },
    kubernetesRequired: {
      dso: false,
      alternative: false,
    },
    operationalBurden: {
      dso: "Low: automatic rotation, DSO handles orchestration",
      alternative: "Medium: platform provided, but app must handle reload logic",
    },
    useCases: {
      dso: [
        "Zero-downtime secret rotation critical",
        "Docker-only deployments",
        "Teams wanting fully automated rotation",
        "Cost-sensitive projects",
      ],
      alternative: [
        "Multi-platform secrets management needed",
        "Centralized secrets dashboard important",
        "Organizations wanting managed platform",
      ],
    },
    recommendations: {
      whenDso: "Zero-downtime rotation, Docker-native, automatic orchestration, or cost concerns",
      whenAlternative: "Multi-platform support needed, centralized dashboard, or managed platform preference",
    },
  },
};

/**
 * Get comparison by slug
 */
export function getComparison(slug: string): ComparisonContent | Comparison | null {
  return (COMPARISONS[slug as ComparisonTool] || NEW_COMPARISONS[slug]) || null;
}

/**
 * Get all comparisons
 */
export function getAllComparisons(): (ComparisonContent | Comparison)[] {
  return Object.values(COMPARISONS);
}

/**
 * Get comparison metadata for SEO
 */
export function getComparisonMetadata(comparison: ComparisonContent) {
  return {
    title: comparison.title,
    description: comparison.description,
    keywords: [
      `DSO vs ${comparison.competitor.name}`,
      `${comparison.competitor.name} vs DSO`,
      `comparing DSO and ${comparison.competitor.name}`,
      `DSO alternative to ${comparison.competitor.name}`,
      comparison.competitor.name,
    ],
    canonical: `/comparisons/${comparison.slug}`,
  };
}
