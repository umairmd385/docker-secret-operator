import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

export const metadata = generatePageMetadata(
  {
    title: "Quick Start Guide — Docker Secret Operator in 5 Minutes",
    description: "Get Docker Secret Operator running in 5 minutes. Step-by-step guide for Local Mode (development) and Agent Mode (production). Automatic secret injection with zero downtime.",
    keywords: ["dso quick start", "docker secret operator setup", "secret injection quick guide", "docker dso 5 minutes", "local vault setup"],
    ogTitle: "DSO Quick Start — 5 Minute Setup",
    ogDescription: "Get Docker Secret Operator running in 5 minutes with Local or Agent Mode.",
    twitterCard: "summary",
  },
  "/docs/guide/quick-start"
);

const content = `# Quick Start (5 Minutes)

Get Docker Secret Operator up and running in under 5 minutes. Choose your path below.

---

## Local Mode (Development)

Get started with the local encrypted vault — no cloud account required.

### Step 1 — Install DSO

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash
\`\`\`

### Step 2 — Initialize the Vault

\`\`\`bash
docker dso init
\`\`\`

Enter a strong passphrase when prompted. Your vault is created at \`~/.dso/vault.enc\`.

### Step 3 — Add Secrets

\`\`\`bash
docker dso secret set DB_PASSWORD "my-super-secret"
docker dso secret set API_KEY "sk-prod-1234"
\`\`\`

### Step 4 — Create Your Compose File

\`\`\`yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    image: myapp:latest
    environment:
      - DB_PASSWORD=\${DB_PASSWORD}
      - API_KEY=\${API_KEY}
\`\`\`

### Step 5 — Deploy with Secret Injection

\`\`\`bash
docker dso up -f docker-compose.yml
\`\`\`

Secrets are injected at runtime — never written to disk or visible in \`docker inspect\`.

---

## Agent Mode (Production)

Production-grade setup with systemd daemon and cloud provider integration.

### Step 1 — Install DSO (system-wide)

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash
\`\`\`

### Step 2 — Bootstrap the Agent

\`\`\`bash
# For AWS (uses IAM Instance Profile)
sudo docker dso system bootstrap --provider aws --region us-east-1

# For Azure (uses Managed Identity)
sudo docker dso system bootstrap --provider azure --vault-url https://my-vault.vault.azure.net

# For HashiCorp Vault
sudo docker dso system bootstrap --provider vault --address http://vault:8200
\`\`\`

### Step 3 — Start the Agent

\`\`\`bash
sudo systemctl enable dso-agent
sudo systemctl start dso-agent
\`\`\`

### Step 4 — Verify Health

\`\`\`bash
curl http://localhost:8081/health
# → {"status":"ok","provider":"aws"}
\`\`\`

The agent now watches for secret changes and rotates containers automatically.

---

## What Happens During Rotation

| Step | Action | Duration |
|------|--------|----------|
| 1 | Agent detects secret change in provider | ~1s |
| 2 | Creates new container with updated secret | ~2s |
| 3 | Validates health check passes | ~2s |
| 4 | Atomically swaps old and new containers | ~0.2s |
| 5 | Removes old container after grace period | ~1s |

> **Total: ~5 seconds of zero-downtime rotation**

---

## Key Points

- ✅ Secrets never written to disk as plaintext
- ✅ Secrets not visible in \`docker inspect\`
- ✅ Automatic rollback if health check fails
- ✅ Automatic recovery from agent crashes
- ✅ Works with standard Docker Compose files

---

## Next Steps

- Read the full [Installation Guide](/docs/guide/installation)
- Learn about the [Architecture](/docs/guide/architecture)
- Review the [Security Model](/docs/guide/security)
- Check [Troubleshooting](/docs/guide/troubleshooting) if issues arise
`;

export default function QuickStartPage() {
  return <MarkdownRenderer content={content} />;
}
