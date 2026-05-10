/**
 * Comparison Pages Content Configuration
 *
 * Scalable, structured data for programmatic comparison pages.
 * Each comparison is SEO-optimized and generates unique metadata.
 */

export type ComparisonTool =
  | "vault"
  | "docker-secrets"
  | "sealed-secrets";

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
export const COMPARISONS: Record<ComparisonTool, ComparisonContent> = {
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

/**
 * Get comparison by slug
 */
export function getComparison(slug: string): ComparisonContent | null {
  return COMPARISONS[slug as ComparisonTool] || null;
}

/**
 * Get all comparisons
 */
export function getAllComparisons(): ComparisonContent[] {
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
