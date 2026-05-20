import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Quick Reference

Essential commands for daily DSO operations. Full details in [CLI Reference](cli.md) and [Getting Started](getting-started.md).

---

## Installation & Setup

\`\`\`bash
# Install as Docker plugin
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash

# For global/production install (requires sudo)
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash

# Verify installation
docker dso version
\`\`\`

---

## Initialization

\`\`\`bash
# ── RECOMMENDED: Interactive setup wizard (handles everything) ────────────
docker dso setup                        # Prompts for mode + provider
docker dso setup --mode local           # Local mode, no prompts
docker dso setup --mode agent --provider aws    # Cloud/AWS, no prompts
docker dso setup --auto-detect          # Auto-detect cloud from instance metadata
docker dso setup --mode agent --provider aws --enable-nonroot  # Also add user to dso group

# ── Lower-level alternative (if you need more control) ───────────────────
docker dso bootstrap local              # Init local dirs (no root required)
sudo docker dso bootstrap agent         # Init systemd service (requires root)

# ── Local vault only (after local setup) ─────────────────────────────────
docker dso init                         # Initialize ~/.dso/vault.enc (run as your user, NOT sudo)
\`\`\`

---

## Health & Status

\`\`\`bash
# Quick health check
docker dso doctor

# Full diagnostics
docker dso doctor --level full

# Current status snapshot
docker dso status

# Live monitoring (refreshes every 2s)
docker dso status --watch

# JSON output for scripts
docker dso status --json
\`\`\`

---

## Configuration

\`\`\`bash
# View current configuration
docker dso config show

# Edit configuration (opens in \$EDITOR)
docker dso config edit

# Validate configuration syntax
docker dso config validate

# (Production) Restart service after config changes
sudo docker dso system restart
\`\`\`

---

## Secret Management

\`\`\`bash
# Store a secret
docker dso secret set app/db_password
# (interactive prompt for value)

# Store secret from file/pipe
echo "secret-value" | docker dso secret set app/api_key
cat ./key.pem | docker dso secret set app/tls_key

# Retrieve secret (local mode only)
docker dso secret get app/db_password

# List all secrets
docker dso secret list

# Delete secret
docker dso secret delete app/db_password
\`\`\`

---

## Deployment

\`\`\`bash
# Deploy (auto-detects local vs cloud mode)
docker dso up -d

# Deploy with specific compose file
docker dso up -f ./prod-compose.yaml -d

# Stop containers
docker dso down

# Deploy with vanilla docker compose (cloud mode only)
docker compose up -d
\`\`\`

---

## Service Management (Production Only)

\`\`\`bash
# Check service status
docker dso system status

# Enable and start service
sudo docker dso system enable

# Disable and stop service
sudo docker dso system disable

# Restart service
sudo docker dso system restart

# View service logs
docker dso system logs

# Follow logs in real-time
docker dso system logs -f

# View logs from last hour
docker dso system logs --since 1h

# View only errors
docker dso system logs -p err
\`\`\`

---

## Diagnostics & Troubleshooting

\`\`\`bash
# Full health check
docker dso doctor --level full

# Check system readiness
docker dso doctor --json

# View rotation status
docker dso status

# Check provider connectivity
docker dso doctor --level full

# Inspect containers
docker ps -a | grep postgres

# Check secret in container
docker exec <container> cat /run/secrets/app/db_password

# View configuration validation
docker dso config validate
\`\`\`

---

## Configuration Examples

### Local Mode (Development)

\`\`\`yaml
version: v1.0.0
mode: local

providers:
  local:
    type: file

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling

agent:
  cache: true
  watch:
    polling_interval: 1m
\`\`\`

### AWS Secrets Manager

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  aws:
    type: aws
    region: us-east-1

secrets:
  - name: myapp/db_password
    provider: aws
    mappings:
      value: DATABASE_PASSWORD

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling

agent:
  cache: true
  watch:
    polling_interval: 5m
\`\`\`

### Azure Key Vault

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  azure:
    type: azure
    vault_url: https://myvault.vault.azure.net

secrets:
  - name: myapp/db_password
    provider: azure
    mappings:
      value: DATABASE_PASSWORD

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling

agent:
  cache: true
  watch:
    polling_interval: 5m
\`\`\`

### HashiCorp Vault

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  vault:
    type: vault
    address: https://vault.example.com:8200
    auth:
      method: token
      token_env: VAULT_TOKEN
    mount_path: secret/data

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling

agent:
  cache: true
  watch:
    polling_interval: 5m
\`\`\`

---

## Docker Compose Integration

### Secret Injection Methods

**File injection (recommended):**
\`\`\`yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: dsofile://myapp/db_password
\`\`\`

**Environment injection:**
\`\`\`yaml
services:
  api:
    environment:
      DATABASE_PASSWORD: dso://myapp/db_password
\`\`\`

---

## Environment Variables

### Local Mode

No special environment variables required.

### Agent Mode (Production)

\`\`\`bash
# Required for token-based auth
export VAULT_TOKEN="s.xxxxxxxxxxxxx"

# For AWS (optional - uses IAM role by default)
export AWS_REGION="us-east-1"

# For Azure (optional - uses managed identity by default)
export AZURE_VAULT_URL="https://myvault.vault.azure.net"

# For Huawei (required)
export HUAWEI_REGION="cn-east-2"
export HUAWEI_PROJECT_ID="project-id"
\`\`\`

---

## File Locations

| Item | Local | Agent |
|---|---|---|
| Configuration | \`~/.dso/config.yaml\` | \`/etc/dso/dso.yaml\` |
| Vault | \`~/.dso/vault.enc\` | Cloud provider |
| State | \`~/.dso/state/\` | \`/var/lib/dso/state/\` |
| Cache | \`~/.dso/cache/\` | \`/var/lib/dso/cache/\` |
| Logs | Console | \`/var/log/dso/dso-agent.log\` |
| Service | N/A | \`/etc/systemd/system/dso-agent.service\` |

---

## Permissions (Production)

\`\`\`bash
# Directory permissions
/etc/dso/               → root:dso, 0755 (readable by all)
/var/lib/dso/          → root:dso, 0770 (read/write by group)
/var/log/dso/          → root:dso, 0770 (read/write by group)
/run/dso/              → root:dso, 0775 (sockets)

# Non-root access setup
sudo usermod -aG dso \$USER
sudo usermod -aG docker \$USER
newgrp dso  # Apply immediately, or logout/login
\`\`\`

---

## Rotation Commands

\`\`\`bash
# Monitor rotation in real-time
docker dso status --watch

# Check rotation history
docker dso status | grep "Rotations"

# View detailed logs
docker dso system logs -f

# Manual secret update (triggers rotation)
docker dso secret set app/db_password
\`\`\`

---

## Debugging Commands

\`\`\`bash
# Full diagnostics
docker dso doctor --level full

# View all system status
docker dso status

# Check provider health
docker dso doctor --level full | grep -i provider

# View service logs for errors
docker dso system logs -p err

# Check container states
docker ps -a

# Inspect specific container
docker inspect <container_id>

# View secret in container
docker exec <container> cat /run/secrets/app/db_password
\`\`\`

---

## Common Issues & Quick Fixes

**Docker socket not accessible:**
\`\`\`bash
sudo usermod -aG docker \$USER
newgrp docker
\`\`\`

**Service won't start:**
\`\`\`bash
docker dso config validate
sudo docker dso system restart
sudo journalctl -u dso-agent -n 50
\`\`\`

**Secret not resolving:**
\`\`\`bash
docker dso secret list
docker dso config show | grep -A5 secrets
docker logs <container_name>
\`\`\`

**Rotation stuck:**
\`\`\`bash
docker ps -a | grep -E "<service>|<service>-old|<service>-new"
docker dso system logs -p err
\`\`\`

---

## Useful Links

- **Getting Started:** [getting-started.md](getting-started.md)
- **CLI Reference:** [cli.md](cli.md)
- **Configuration:** [configuration.md](configuration.md)
- **Operational Guide:** [operational-guide.md](operational-guide.md)
- **GitHub:** [docker-secret-operator/dso](https://github.com/docker-secret-operator/dso)

---

## Version

This quick reference covers **DSO latest**. Always install with:
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash
\`\`\`
The installer picks the latest stable release automatically.
`;

export const metadata: Metadata = {
  title: "DSO Quick Reference",
  description: "Documentation for DSO Quick Reference",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
