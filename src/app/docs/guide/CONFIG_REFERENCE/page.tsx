import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Configuration Reference

Complete guide to configuring Docker Secret Operator via \`dso.yaml\`.

**Table of Contents**
- [Quick Start](#quick-start)
- [File Locations](#file-locations)
- [Configuration Structure](#configuration-structure)
- [Providers](#providers)
- [Agent Configuration](#agent-configuration)
- [Defaults](#defaults)
- [Logging](#logging)
- [Secrets](#secrets)
- [Examples](#examples)

---

## Quick Start

The minimal configuration requires:
1. At least one **provider** (where secrets are stored)
2. At least one **secret** (what to sync and where to inject)

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  aws:
    type: aws
    region: us-east-1

secrets:
  - name: my_password
    provider: aws
    inject:
      type: env
    targets:
      containers:
        - my-app
    mappings:
      DB_PASSWORD: prod/database/password
\`\`\`

---

## File Locations

- **Agent Mode (Production)**: \`/etc/dso/dso.yaml\` (requires root)
- **Local Mode (Development)**: \`./dso.yaml\` (in current directory)

---

## Configuration Structure

\`\`\`yaml
version: v1.0.0          # Config version (required)
mode: agent              # Deployment mode: local or agent (required)

providers: {...}         # Secret providers (required)
agent: {...}             # Agent runtime settings (optional)
defaults: {...}          # Default behavior for all secrets (optional)
logging: {...}           # Logging configuration (optional)
secrets: [...]           # Secrets to sync (required, can be empty)
\`\`\`

---

## Providers

Define where secrets are stored. At least one provider is required.

### AWS Secrets Manager

\`\`\`yaml
providers:
  aws:
    type: aws
    region: us-east-1                    # AWS region
    auth:
      method: iam_role                   # Authentication method
      # params:
      #   access_key_id: YOUR_KEY
      #   secret_access_key: YOUR_SECRET
    retry:
      attempts: 3                        # Retry attempts on failure
      backoff: "1s"                      # Backoff between retries
\`\`\`

**Authentication Methods:**
- \`iam_role\` - Use EC2 instance IAM role (recommended)
- \`access_key\` - Use access key ID and secret
- \`env\` - Use environment variables (\`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\`)
- \`token\` - Use temporary security token

**Required IAM Permissions:**
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:prod/*"
    }
  ]
}
\`\`\`

### Azure Key Vault

\`\`\`yaml
providers:
  azure:
    type: azure
    region: eastus                       # Azure region
    auth:
      method: managed_identity           # or service_principal
      params:
        vault_name: my-keyvault          # Key Vault name
        # tenant_id: YOUR_TENANT_ID      # For service principal
    retry:
      attempts: 3
      backoff: "1s"
\`\`\`

**Authentication Methods:**
- \`managed_identity\` - Use Azure Managed Identity (recommended)
- \`service_principal\` - Use Azure Service Principal
- \`env\` - Use environment variables

### HashiCorp Vault

\`\`\`yaml
providers:
  vault:
    type: vault
    auth:
      method: token                      # token, kubernetes, jwt, appRole
      params:
        address: https://vault.example.com:8200
        token: YOUR_VAULT_TOKEN
    retry:
      attempts: 3
      backoff: "1s"
    config:
      namespace: admin                   # Vault namespace (optional)
\`\`\`

**Secret Path Format**: \`secret/data/myapp/credentials\`

### Huawei Cloud

\`\`\`yaml
providers:
  huawei:
    type: huawei
    region: cn-north-4
    auth:
      method: access_key                 # or iam_role
      params:
        access_key: YOUR_ACCESS_KEY
        secret_key: YOUR_SECRET_KEY
    retry:
      attempts: 3
      backoff: "1s"
\`\`\`

---

## Agent Configuration

Configure DSO agent runtime behavior.

### Basic Settings

\`\`\`yaml
agent:
  # Cache secrets in memory (improves performance)
  cache: true

  # Refresh cached secrets at this interval
  refresh_interval: "5m"

  # Automatically sync secrets without manual trigger
  auto_sync: false
\`\`\`

### Container Restart Strategy

\`\`\`yaml
agent:
  restart_strategy:
    type: rolling               # rolling, all-at-once, none
    grace_period: "30s"         # Wait before restarting
\`\`\`

- \`rolling\` - Restart containers one at a time
- \`all-at-once\` - Restart all containers simultaneously
- \`none\` - Don't restart containers on secret change

### Watch Configuration

Monitor provider for secret changes:

\`\`\`yaml
agent:
  watch:
    mode: polling               # polling, event, hybrid
    polling_interval: "5m"      # How often to check

    # Optional: webhook for instant notifications
    webhook:
      enabled: true
      endpoint: https://your-webhook-endpoint
      auth_token: YOUR_AUTH_TOKEN
\`\`\`

**Watch Modes:**
- \`polling\` - Periodically check provider for changes
- \`event\` - Listen to provider events (AWS SNS, Azure Event Grid, etc.)
- \`hybrid\` - Use events with polling fallback

### Rotation Configuration

\`\`\`yaml
agent:
  rotation:
    enabled: true
    strategy: rolling           # restart, signal, none
    health_check_timeout: "30s"
    # signal: "SIGHUP"          # For strategy: signal
\`\`\`

**Strategies:**
- \`restart\` - Restart containers to pick up new secrets
- \`signal\` - Send signal to running containers
- \`none\` - Update secret without restarting

---

## Defaults

Set default behavior for all secrets (can be overridden per secret).

\`\`\`yaml
defaults:
  inject:
    type: env                   # env or file
    # path: /run/secrets        # For type: file
    # uid: 1000
    # gid: 1000

  rotation:
    enabled: true
    strategy: rolling
    health_check_timeout: "30s"
\`\`\`

If not specified, defaults are:
- \`inject.type\`: \`env\`
- \`rotation.enabled\`: \`true\`
- \`rotation.strategy\`: \`rolling\`

---

## Logging

Configure log output (optional).

\`\`\`yaml
logging:
  level: info                   # debug, info, warn, error
  format: json                  # json or text
\`\`\`

---

## Secrets

Define which secrets to sync from providers and how to inject them into containers.

### Minimal Secret

\`\`\`yaml
secrets:
  - name: my_password           # Unique identifier
    provider: aws               # Which provider to fetch from
    inject:
      type: env                 # Injection method
    mappings:
      DB_PASSWORD: prod/my-password  # ENV_VAR: secret_path
\`\`\`

### Complete Secret Configuration

\`\`\`yaml
secrets:
  - name: database_credentials
    provider: aws               # Required: provider name

    # How to inject the secret
    inject:
      type: env                 # env or file
      # path: /etc/secrets      # For type: file
      # uid: 1000
      # gid: 1000

    # Which containers to update
    targets:
      # Method 1: List specific containers
      containers:
        - app
        - worker
      # OR Method 2: Use Docker labels
      # labels:
      #   app: myapp
      #   tier: backend

    # Secret rotation behavior (overrides defaults)
    rotation:
      enabled: true
      strategy: rolling
      health_check_timeout: "30s"

    # Map environment variables to secret paths
    mappings:
      DB_USER: prod/database/username
      DB_PASSWORD: prod/database/password
      DB_HOST: prod/database/host
\`\`\`

### Injection Methods

#### Environment Variables (type: env)
Injects secret as container environment variables.

\`\`\`yaml
secrets:
  - name: api_credentials
    provider: aws
    inject:
      type: env
    targets:
      containers:
        - myapp
    mappings:
      API_KEY: prod/api/key
      API_SECRET: prod/api/secret
\`\`\`

Result: Container receives \`API_KEY\` and \`API_SECRET\` as env vars.

#### File Injection (type: file)
Writes secrets to files inside container.

\`\`\`yaml
secrets:
  - name: ssl_certificates
    provider: aws
    inject:
      type: file
      path: /etc/ssl/certs          # Mount point in container
      uid: 0                        # File owner user ID
      gid: 0                        # File owner group ID
    mappings:
      certificate.pem: prod/ssl/cert
      private.key: prod/ssl/key
\`\`\`

Result: Files created at:
- \`/etc/ssl/certs/certificate.pem\`
- \`/etc/ssl/certs/private.key\`

### Target Containers

#### By Container Name

\`\`\`yaml
targets:
  containers:
    - web-server
    - api-service
    - worker
\`\`\`

#### By Docker Labels

\`\`\`yaml
targets:
  labels:
    app: myapp              # container with label app=myapp
    tier: backend           # AND label tier=backend
\`\`\`

All containers with both labels will receive the secret.

### Rotation Strategy

Override default rotation behavior for specific secrets:

\`\`\`yaml
secrets:
  - name: jwt_key
    provider: aws
    rotation:
      enabled: true
      strategy: signal                # Send signal instead of restart
      signal: "SIGHUP"
      health_check_timeout: "60s"
    mappings:
      JWT_SECRET: prod/jwt/key
\`\`\`

---

## Examples

### Simple AWS Setup

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  aws:
    type: aws
    region: us-east-1
    auth:
      method: iam_role

secrets:
  - name: database_password
    provider: aws
    inject:
      type: env
    targets:
      containers:
        - app
    mappings:
      DB_PASSWORD: prod/database/password
\`\`\`

### Multi-Provider Setup

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  aws:
    type: aws
    region: us-east-1
    auth:
      method: iam_role

  vault:
    type: vault
    auth:
      method: token
      params:
        address: https://vault.example.com:8200
        token: s.1234567890abcdef

secrets:
  - name: db_credentials
    provider: aws
    inject:
      type: env
    targets:
      containers:
        - app
    mappings:
      DB_USER: prod/database/username
      DB_PASSWORD: prod/database/password

  - name: api_keys
    provider: vault
    inject:
      type: env
    targets:
      containers:
        - app
    mappings:
      API_KEY: secret/data/api/key
      API_SECRET: secret/data/api/secret
\`\`\`

### Advanced: Multiple Environments

\`\`\`yaml
version: v1.0.0
mode: agent

agent:
  cache: true
  refresh_interval: "5m"
  watch:
    mode: polling
    polling_interval: "5m"
  rotation:
    enabled: true
    strategy: rolling

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling
    health_check_timeout: "30s"

providers:
  aws:
    type: aws
    region: us-east-1

logging:
  level: info
  format: json

secrets:
  - name: production_db
    provider: aws
    inject:
      type: env
    targets:
      labels:
        env: production
    mappings:
      DB_HOST: prod/database/host
      DB_USER: prod/database/user
      DB_PASSWORD: prod/database/password

  - name: staging_db
    provider: aws
    inject:
      type: env
    targets:
      labels:
        env: staging
    mappings:
      DB_HOST: staging/database/host
      DB_USER: staging/database/user
      DB_PASSWORD: staging/database/password

  - name: certificates
    provider: aws
    inject:
      type: file
      path: /etc/ssl/private
      uid: 0
      gid: 0
    targets:
      labels:
        app: web
    mappings:
      tls.crt: prod/certificates/tls.crt
      tls.key: prod/certificates/tls.key
\`\`\`

---

## Common Patterns

### Development (Local Mode)

\`\`\`yaml
version: v1.0.0
mode: local

providers:
  local:
    type: local

secrets:
  - name: dev_password
    provider: local
    inject:
      type: env
    targets:
      containers:
        - app
    mappings:
      DB_PASSWORD: dev/database/password
\`\`\`

### Production (Cloud Mode)

\`\`\`yaml
version: v1.0.0
mode: agent

providers:
  aws:
    type: aws
    region: us-east-1

agent:
  cache: true
  refresh_interval: "5m"
  watch:
    mode: polling
    polling_interval: "5m"

secrets:
  - name: prod_secrets
    provider: aws
    inject:
      type: env
    targets:
      labels:
        env: production
    mappings:
      DB_PASSWORD: prod/database/password
      API_KEY: prod/api/key
\`\`\`

---

## Validation

Validate your configuration:

\`\`\`bash
docker dso config validate
docker dso config show           # Display parsed configuration
\`\`\`

---

## Troubleshooting

**Secret not injected?**
- Check container is running
- Verify secret exists in provider
- Check target container name/labels match
- Review logs: \`sudo docker dso system logs\`

**Authentication failing?**
- Verify provider credentials
- Check IAM role has required permissions
- For AWS: Ensure EC2 instance has proper IAM role attached

**Rotation not working?**
- Verify rotation is enabled
- Check health_check_timeout is appropriate
- Review rotation strategy (restart vs signal vs none)

See [troubleshooting guide](troubleshooting.md) for more help.
`;

export const metadata: Metadata = {
  title: "DSO Configuration Reference",
  description: "Documentation for DSO Configuration Reference",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
