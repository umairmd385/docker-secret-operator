import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Secret Provider Setup Guide

> Provider configuration is only required for **Cloud Mode**. If you are using Local Mode (\`docker dso init\`), you do not need this file.

---

## Overview

Cloud Mode fetches secrets from external backends via provider plugin binaries installed to \`/usr/local/lib/dso/plugins/\` by the [installer](../scripts/install.sh).

| Provider | Type | Status |
|---|---|---|
| HashiCorp Vault | \`vault\` | ✅ Fully implemented |
| AWS Secrets Manager | \`aws\` | ✅ Fully implemented |
| Azure Key Vault | \`azure\` | ✅ Fully implemented |
| Huawei Cloud CSMS | \`huawei\` | ✅ Fully implemented |
| Local Filesystem | \`file\` | ✅ Supported (dev/air-gapped only) |

---

## HashiCorp Vault

The fully supported cloud provider for v3.2. Uses Vault KV v2.

### \`dso.yaml\` Configuration

\`\`\`yaml
providers:
  vault-prod:
    type: vault
    address: "https://vault.example.com:8200"
    token: "\${VAULT_TOKEN}"   # from environment
    mount: "secret"           # KV v2 mount path (default: secret)
\`\`\`

### Docker Compose Usage (Cloud Mode)

In Cloud Mode, DSO injects secrets as environment variables based on the \`mappings\` in \`dso.yaml\`. The \`dso://\` and \`dsofile://\` URI patterns are **not used in Cloud Mode** — secret routing is defined entirely in the config file.

\`\`\`yaml
secrets:
  - name: prod/db_password
    provider: vault-prod
    mappings:
      DB_PASSWORD: DATABASE_PASSWORD
\`\`\`

---

## AWS Secrets Manager

✅ Fully implemented. Uses \`aws-sdk-go-v2\` with the standard AWS credential chain.

### Authentication

AWS credentials are resolved in this order (no manual config needed for EC2/ECS):
1. \`AWS_ACCESS_KEY_ID\` + \`AWS_SECRET_ACCESS_KEY\` env vars
2. \`~/.aws/credentials\` file
3. EC2/ECS Instance Metadata Service (IAM role — recommended for production)

### \`dso.yaml\` Configuration

\`\`\`yaml
providers:
  aws:
    type: aws
    region: us-east-1   # optional — falls back to AWS_REGION env var
\`\`\`

### Secret Format

AWS secrets can be:
- **JSON object** → individual fields are mapped directly (e.g. \`{"DB_PASSWORD": "secret123"}\`)
- **Plain string** → returned under the \`value\` key
- **Resource tags** → available as \`_TAG_<key>\` fields

### Example Secret Mapping

\`\`\`yaml
secrets:
  - name: prod/myapp-secrets
    provider: aws
    mappings:
      DB_PASSWORD: DATABASE_PASSWORD
      API_KEY: STRIPE_KEY
\`\`\`

---

## Azure Key Vault

✅ Fully implemented. Uses \`azure-sdk-for-go\` with \`DefaultAzureCredential\`.

### Authentication

Credentials are resolved automatically via \`DefaultAzureCredential\`:
1. \`az login\` (developer workstation)
2. \`AZURE_CLIENT_ID\` + \`AZURE_CLIENT_SECRET\` + \`AZURE_TENANT_ID\` env vars (service principal)
3. Managed Identity (Azure VMs, Container Instances, App Service — recommended for production)

No manual credential config needed for Managed Identity environments.

### \`dso.yaml\` Configuration

\`\`\`yaml
providers:
  azure:
    type: azure
    vault_url: "https://your-vault.vault.azure.net/"
\`\`\`

### Secret Name Translation

Azure Key Vault does not allow underscores in secret names. DSO automatically translates \`_\` → \`-\` when fetching, so your \`dso.yaml\` can use the standard naming convention.

### Secret Format

- **JSON object** → fields mapped directly
- **Plain string** → returned under the \`value\` key

### IAM Requirements

The identity running DSO needs the **Key Vault Secrets User** role on the vault.

---

## Huawei Cloud CSMS

✅ Fully implemented. Uses \`huaweicloud-sdk-go-v3\`.

### Authentication

Credential resolution order:
1. \`dso.yaml\` config keys: \`access_key\`, \`secret_key\`, \`security_token\`, \`project_id\`
2. Environment variables: \`HUAWEI_ACCESS_KEY\`, \`HUAWEI_SECRET_KEY\`, \`HUAWEI_SECURITY_TOKEN\`, \`HUAWEI_REGION\`
3. Default region: \`ap-southeast-3\`

For ECS IAM Agency (recommended for production), supply \`HUAWEI_SECURITY_TOKEN\` via \`/etc/dso/agent.env\`.

### \`dso.yaml\` Configuration

\`\`\`yaml
providers:
  huawei:
    type: huawei
    region: ap-southeast-2
    project_id: "your-project-id"          # optional
    access_key: "\${HUAWEI_ACCESS_KEY}"     # optional if using env vars
    secret_key: "\${HUAWEI_SECRET_KEY}"
    security_token: "\${HUAWEI_SECURITY_TOKEN}"  # only for temporary credentials
\`\`\`

### Secret Format

- **JSON object** → fields mapped directly
- **Plain string** → returned under the \`value\` key

CSMS secrets are always fetched at the \`latest\` version.

---

## Local File Provider

For development or air-gapped systems. Reads secrets from a file on the host filesystem.

> **Prefer Local Mode** (\`docker dso init\`) over the file provider for developer workflows — it is simpler and uses encrypted storage.

\`\`\`yaml
providers:
  local:
    type: file
    config:
      path: "/var/lib/dso/local-secrets"
\`\`\`

---

## Authentication Best Practices

1. **Use IAM roles** wherever possible (AWS, Azure, Huawei) — avoid long-lived access keys.
2. **Least privilege** — DSO credentials should only have read access to the specific secrets needed.
3. **Environment isolation** — use separate named providers for dev, staging, and production in your \`dso.yaml\`.
4. **Token rotation** — use \`\${VAULT_TOKEN}\` environment variable references rather than hardcoding tokens in \`dso.yaml\`.

---

## Related

- [Configuration Reference](configuration.md) — full \`dso.yaml\` schema
- [Cloud Setup](getting-started.md#cloud-mode-setup) — install plugins and systemd service
- [System Doctor](cli.md#docker-dso-system-doctor) — verify plugin installation
`;

export const metadata: Metadata = {
  title: "Secret Provider Setup Guide",
  description: "Documentation for Secret Provider Setup Guide",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
