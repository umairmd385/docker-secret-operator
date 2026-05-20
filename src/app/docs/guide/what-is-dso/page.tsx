import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

export const metadata = generatePageMetadata(
  {
    title: "What is Docker Secret Operator (DSO)? | Overview & Features",
    description: "Docker Secret Operator (DSO) is an open-source, CNCF Sandbox runtime secret injection daemon for Docker and Docker Compose. Zero-persistence secrets, automatic rotation, and crash recovery — no Kubernetes required.",
    keywords: ["what is docker secret operator", "dso overview", "docker secret injection", "runtime secret injection", "docker compose secret management", "cncf sandbox docker"],
    ogTitle: "What is Docker Secret Operator (DSO)?",
    ogDescription: "Runtime secret injection and automatic rotation for Docker. CNCF Sandbox project.",
    twitterCard: "summary",
  },
  "/docs/guide/what-is-dso"
);

const content = `# What is Docker Secret Operator?

Docker Secret Operator (DSO) is a runtime secret injection daemon for Docker and Docker Compose. It solves a concrete problem: how to safely rotate secrets in containerized applications without exposing them to the host filesystem.

---

## Key Features

- Inject secrets from Vault, AWS Secrets Manager, Azure Key Vault, or local encrypted storage
- Automatically rotate containers when secrets change
- Keep secrets out of logs, docker inspect, and host disk
- Zero downtime rotation with automatic rollback on failure
- Crash recovery with deterministic state management

---

## The Problem

Traditional secret management creates security risks:

- Secrets stored on disk expose everything if the host is compromised
- Docker environment variables visible to anyone with docker access
- Manual secret rotation requires careful coordination
- Failed rotations leave systems in inconsistent states

---

## The Solution

DSO implements zero-persistence secret injection with automatic recovery:

- Secrets held only in process memory and tmpfs, never written to disk
- Automatic rotation with atomic container swaps
- Automatic rollback if health checks fail
- Crash recovery on agent restart
- Event-driven or polling-based secret change detection

---

## Two Operating Modes

### Local Mode

Perfect for development and testing. Secrets stored in encrypted local vault with no external dependencies.

\`\`\`bash
# Initialize encrypted local vault
docker dso init

# Add a secret
docker dso secret set DB_PASSWORD my-super-secret

# Deploy with automatic secret injection
docker dso up -f docker-compose.yml
\`\`\`

### Agent Mode

Production-grade daemon with systemd integration, event-driven rotation, cloud provider support, and automatic crash recovery.

\`\`\`bash
# Bootstrap agent with cloud provider
sudo docker dso system bootstrap --provider aws

# Start the systemd agent
sudo systemctl start dso-agent

# Agent now watches for secret changes and rotates automatically
\`\`\`

---

## When to Use DSO

- You use Docker Compose for container orchestration
- You need automatic, zero-downtime secret rotation
- You want automatic recovery from failures
- You want to minimize operational overhead
- You need zero-persistence secrets (not on disk)

---

## When NOT to Use DSO

- Using Kubernetes (use native Secret objects instead)
- Only needing centralized secret storage (Vault is better)
- Not using Docker or Docker Compose

---

## Next Steps

- Read the [Quick Start](/docs/guide/quick-start) guide to get running in 5 minutes
- Learn about the [Architecture](/docs/guide/architecture) for technical details
- Check [Security](/docs/guide/security) for security guarantees
`;

export default function WhatIsDSOPage() {
  return <MarkdownRenderer content={content} />;
}
