import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Concepts & Architecture

Docker Secret Operator (DSO) relies on three core concepts: secret URI protocols, dual-mode execution, and the secret lifecycle.

---

## 1. Dual-Mode Execution

DSO operates in two distinct modes. The correct mode is auto-detected at runtime.

### Local Mode

- Secrets stored in \`~/.dso/vault.enc\` (AES-256-GCM encrypted)
- No systemd. No root. No cloud account required.
- The CLI resolves all \`dso://\` and \`dsofile://\` URIs in-process at deploy time.
- Activated by: running \`docker dso init\` which creates the vault file.

### Cloud Mode

- Secrets fetched from external providers (HashiCorp Vault, AWS, Azure, Huawei) via plugin binaries.
- A persistent \`dso-agent\` daemon runs as a systemd service.
- Activated by: the presence of \`/etc/dso/dso.yaml\` or \`./dso.yaml\`.
- Requires setup via \`sudo docker dso system setup\`.

**Mode priority order:**

1. \`--mode=<cloud|local>\` flag
2. \`DSO_MODE\` or \`DSO_FORCE_MODE\` env var
3. \`/etc/dso/dso.yaml\` present → Cloud
4. \`./dso.yaml\` present → Cloud
5. \`~/.dso/vault.enc\` present → Local
6. Neither → guided error with setup instructions

If both a vault and cloud config exist, **Cloud Mode wins** and a conflict warning is printed.

---

## 2. Secret Protocols (\`dso://\` vs \`dsofile://\`)

DSO introduces two URI protocols that you embed directly in your \`docker-compose.yaml\`:

### \`dsofile://\` (Recommended)

**Behavior:** Injects the secret as a file inside a \`tmpfs\` RAM disk (\`/run/secrets/dso/\`) inside the container.

**Why use it:** This is the most secure method. The secret never touches disk. It is completely invisible to \`docker inspect\`. Applications designed for production often read secrets from file paths (e.g., \`POSTGRES_PASSWORD_FILE\`).

> ⚠️ \`dsofile://\` is **only supported in Local Mode**. Cloud Mode uses native provider injection directly.

\`\`\`yaml
environment:
  POSTGRES_PASSWORD_FILE: dsofile://myapp/db_password
\`\`\`

### \`dso://\` (Environment Variable Injection)

**Behavior:** Injects the secret value directly as an environment variable.

**Why use it:** Use this only if the application cannot read from a file path.

**Warning:** Secrets injected via \`dso://\` are visible via \`docker inspect <container>\`.

\`\`\`yaml
environment:
  STRIPE_KEY: dso://myapp/stripe_key
\`\`\`

---

## 3. The Agent Runtime

### Local Mode Agent

In Local Mode, the agent runs inline — inside the same \`docker dso up\` process. It does not persist after the stack is launched (the process exits when \`docker compose up\` returns). The lifecycle is:

1. CLI reads \`~/.dso/vault.enc\` and parses the compose file AST.
2. It resolves all \`dso://\` and \`dsofile://\` URIs in memory.
3. A temporary in-process agent seeds the secret cache.
4. The mutated compose AST is written to a \`tmpfs\`-backed temp file.
5. Docker Compose receives the sanitized file — secrets are never in the working directory.

### Cloud Mode Agent (\`dso-agent\`)

In Cloud Mode, a persistent \`dso-agent\` systemd service runs on the host. The CLI connects to it via Unix socket (\`/var/run/dso.sock\`):

1. \`docker dso up\` detects Cloud Mode from \`/etc/dso/dso.yaml\`.
2. It connects to the running \`dso-agent\` daemon via socket.
3. The daemon fetches secrets from the configured provider plugin (e.g., \`dso-provider-vault\`).
4. Secrets are returned in-memory to the CLI for compose AST resolution.
5. No secrets are written to disk at any stage.

---

## 4. Secret Lifecycle

| Stage | Local Mode | Cloud Mode |
|---|---|---|
| **Storage** | \`~/.dso/vault.enc\` (AES-256-GCM) | External provider (Vault, AWS, etc.) |
| **At deploy** | Decrypted in RAM only | Fetched via plugin over IPC |
| **In container** | \`tmpfs\` RAM disk (\`dsofile://\`) or env var | Env var (native provider injection) |
| **After container stops** | \`tmpfs\` wiped automatically | Nothing persisted locally |
| **On container restart** | Agent re-injects from RAM cache | Agent re-fetches from provider |

---

## 5. Provider Plugins (Cloud Mode Only)

Cloud Mode uses binary plugins to fetch secrets from external backends. Plugins are installed by \`sudo docker dso system setup\` and live in \`/usr/local/lib/dso/plugins/\`.

| Plugin | Backend | Status |
|---|---|---|
| \`dso-provider-vault\` | HashiCorp Vault (KV v2) | ✅ Fully implemented |
| \`dso-provider-aws\` | AWS Secrets Manager | ✅ Fully implemented |
| \`dso-provider-azure\` | Azure Key Vault | ✅ Fully implemented |
| \`dso-provider-huawei\` | Huawei Cloud CSMS | ✅ Fully implemented |

The plugin binary path is logged at runtime: \`[DSO] Using VAULT provider plugin: /usr/local/lib/dso/plugins/dso-provider-vault\`.
`;

export const metadata: Metadata = {
  title: "Concepts & Architecture",
  description: "Documentation for Concepts & Architecture",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
