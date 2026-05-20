import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Configuration Reference

> **Important:** \`dso.yaml\` is only required for **Cloud Mode**. Local Mode users do not need this file — secrets are stored in \`~/.dso/vault.enc\` instead.

---

## When Do You Need \`dso.yaml\`?

| Mode | Config File Needed? |
|---|---|
| **Local Mode** | ❌ No — use \`docker dso init\` and \`docker dso secret set\` |
| **Cloud Mode** | ✅ Yes — \`/etc/dso/dso.yaml\` or \`./dso.yaml\` |

DSO auto-detects Cloud Mode when it finds \`/etc/dso/dso.yaml\` or \`./dso.yaml\`. No flag required.

---

## Config File Location

DSO resolves the config file in this priority order:

1. \`--config <path>\` / \`-c <path>\` flag
2. \`/etc/dso/dso.yaml\` (global system config — Cloud Mode)
3. \`./dso.yaml\` (project-level config — Cloud Mode)

---

## Root Structure

| Field | Required | Description |
|---|---|---|
| \`providers\` | ✅ Yes (Cloud) | Map of secret backend configurations |
| \`secrets\` | ✅ Yes (Cloud) | List of secret mappings |
| \`defaults\` | Optional | Shared defaults for injection and rotation |
| \`logging\` | Optional | Global logging settings |
| \`agent\` | Optional | Agent-specific lifecycle settings |

---

## Providers (\`providers\`)

A map of named provider configurations. Each entry declares a backend type and its auth config.

\`\`\`yaml
providers:
  vault-prod:
    type: vault
    address: https://vault.example.com:8200
    token: \${VAULT_TOKEN}
    mount: secret

  aws-east:
    type: aws
    region: us-east-1
    auth:
      method: iam_role
\`\`\`

### Supported Provider Types

| Type | Backend | Status |
|---|---|---|
| \`vault\` | HashiCorp Vault | ✅ Fully implemented |
| \`aws\` | AWS Secrets Manager | ✅ Fully implemented |
| \`azure\` | Azure Key Vault | ✅ Fully implemented |
| \`huawei\` | Huawei Cloud CSMS | ✅ Fully implemented |
| \`file\` | Local filesystem (dev only) | ✅ Supported |

---

## Secret Mappings (\`secrets\`)

Defines which secrets to fetch and how to map them into containers.

| Field | Required | Description |
|---|---|---|
| \`name\` | ✅ Yes | The exact path/name of the secret in the provider |
| \`provider\` | ✅ Yes | Name of the provider from the \`providers\` map |
| \`inject\` | Optional | Injection configuration (\`type\`, \`path\`, \`uid\`, \`gid\`) |
| \`rotation\` | Optional | Rotation config (\`enabled\`, \`strategy\`, \`signal\`) |
| \`targets\` | Optional | Filter which containers receive this secret |
| \`mappings\` | Optional | Key-value mapping from provider fields to env var names |

### Injection (\`inject\`)

\`\`\`yaml
inject:
  type: env       # 'env' (default) or 'file'
  path: /run/secrets/db_pass   # required if type: file
  uid: 1000                    # optional, file owner
  gid: 1000
\`\`\`

### Rotation (\`rotation\`)

\`\`\`yaml
rotation:
  enabled: true
  strategy: rolling   # restart | signal | rolling | none
  signal: SIGHUP      # required for signal strategy
\`\`\`

### Targeting (\`targets\`)

\`\`\`yaml
targets:
  containers:
    - api
    - worker
  labels:
    app.tier: backend
\`\`\`

---

## Full Example

\`\`\`yaml
providers:
  vault-prod:
    type: vault
    address: https://vault.example.com:8200
    token: \${VAULT_TOKEN}
    mount: secret

secrets:
  - name: prod/db_password
    provider: vault-prod
    inject:
      type: env
    mappings:
      DB_PASSWORD: DATABASE_PASSWORD

  - name: prod/tls_cert
    provider: vault-prod
    inject:
      type: file
      path: /run/secrets/tls.crt
    targets:
      containers:
        - nginx

defaults:
  rotation:
    enabled: true
    strategy: restart

logging:
  level: info
  format: json

agent:
  cache: true
  watch:
    polling_interval: 5m
\`\`\`

---

## Validate Your Config

Before deploying, always validate:

\`\`\`bash
docker dso config validate
# or with explicit path:
docker dso config validate --config /etc/dso/dso.yaml
\`\`\`

Exits \`0\` on success. Exits \`1\` with a descriptive error on parse or schema failure.

---

## Monitoring & Observability (Cloud Mode)

### Health & Status

Check agent status:
\`\`\`bash
sudo systemctl status dso-agent

# View live logs
journalctl -u dso-agent -f

# Trigger a manual health check
curl http://localhost:8471/health
\`\`\`

### Prometheus Metrics

DSO exports 30+ Prometheus metrics on \`:9090/metrics\`. Key metrics for operations:

| Metric | Type | Purpose |
|--------|------|---------|
| \`dso_provider_health_check_status\` | Gauge | Provider health (1=healthy, 0=unhealthy) per provider |
| \`dso_provider_heartbeat_latency_seconds\` | Histogram | Provider health check latency |
| \`dso_provider_restarts_total\` | Counter | Provider crash/restart events |
| \`dso_reconnect_duration_seconds\` | Histogram | Time to reconnect to Docker daemon |
| \`dso_reconnect_attempts_total\` | Counter | Docker daemon reconnection attempts |
| \`dso_injection_attempts_total\` | Counter | Secret injection attempts by result |
| \`dso_injection_latency_seconds\` | Histogram | Time to inject a secret |
| \`dso_queue_processing_latency_seconds\` | Histogram | Event processing time |
| \`dso_queue_reject_rate\` | Gauge | Fraction of rejected events (0-1) |
| \`dso_worker_pool_utilization\` | Gauge | Worker thread utilization percent |
| \`dso_events_deduped_total\` | Counter | Duplicate events suppressed |
| \`dso_dedup_cache_miss_rate\` | Gauge | Dedup cache effectiveness (0-1) |
| \`dso_runtime_memory_bytes\` | Gauge | Agent process memory usage |
| \`dso_runtime_goroutine_count\` | Gauge | Active goroutines |

Scrape with your monitoring system:
\`\`\`yaml
# prometheus.yml
scrape_configs:
  - job_name: 'dso'
    static_configs:
      - targets: ['localhost:9090']
\`\`\`

### Runtime Recovery Behavior

**Provider Failure:**
- Agent detects provider fetch failure
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s (capped)
- Keeps retrying with jitter to prevent thundering herd
- Logs error with provider-specific details for alerting

**Docker Daemon Restart:**
- Agent monitors Docker socket
- On disconnect, enters reconnect loop (same backoff strategy)
- Deduplicates events (TTL: 30s) to avoid cascade processing
- Continues with cached secrets while reconnecting

**Container Churn:**
- Bounded event queue (2000 events max) prevents memory exhaustion
- 32 worker threads process events in parallel
- Excess events dropped with warning log
- Alert if \`dso_events_dropped_total\` > 0

**No Data Loss:**
- Secrets never deleted during failures
- Rotation only happens if fetch succeeds AND secret changed
- If provider is unavailable, containers keep running with last-known-good secrets

---

## Troubleshooting

### Agent Won't Start

\`\`\`bash
# Check if config is valid
docker dso validate --config /etc/dso/dso.yaml

# View startup logs
journalctl -u dso-agent -n 50

# Common issues:
# - Provider plugin missing: ls -la /usr/local/lib/dso/plugins/
# - Invalid YAML: docker dso validate
# - Socket permission denied: ls -la /var/run/dso.sock
\`\`\`

### Secrets Not Injecting

\`\`\`bash
# Check agent health
curl http://localhost:8471/health

# Check cached secrets
curl http://localhost:8471/secrets

# View agent logs for this container
journalctl -u dso-agent | grep <container_id>

# Verify provider auth
# AWS: aws sts get-caller-identity
# Azure: az account show
# Vault: curl -H "X-Vault-Token: \$VAULT_TOKEN" http://vault:8200/v1/sys/health
\`\`\`

### High Event Queue Depth

If \`dso_event_queue_depth\` is near max:
\`\`\`bash
# Check Docker daemon stability
docker ps -q | wc -l  # Count running containers
docker events &       # Monitor events for churn

# If containers are constantly restarting, fix the root cause first
# Then tune queue size in agent config (increase maxEvents)
\`\`\`
`;

export const metadata: Metadata = {
  title: "DSO Configuration Reference",
  description: "Documentation for DSO Configuration Reference",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
