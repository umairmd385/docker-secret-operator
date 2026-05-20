import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Best Practices

Recommendations for running DSO reliably and securely in production environments.

## Secret Configuration

### Always Set \`rotation: true\` for Rotating Secrets

Only secrets with \`rotation: true\` are monitored by the Watcher Engine. Without it, your stack won't react to secret changes:

\`\`\`yaml
secrets:
  - name: myapp/db
    inject: env
    rotation: true    # ← required for auto-rotation
    reload_strategy:
      type: signal
    mappings:
      DB_PASSWORD: DB_PASSWORD
\`\`\`

### Use ARNs for AWS Secrets

To prevent accidental cross-region or cross-account secret access, use the full ARN:

\`\`\`yaml
# ✅ Use ARN for precision
secrets:
  - name: arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/myapp/db-AbCdEf
\`\`\`

### Prefer \`signal\` Reload for Stateless Services

If your app handles \`SIGHUP\` for config reload (Go, Nginx, many web frameworks), use \`type: signal\` — it avoids any container restart, giving you true zero-downtime rotation.

## Health Checks Are Critical for Rolling Updates

The Strategy Engine uses health checks to validate that a new container is ready before removing the old one. Without a health check, the score is reduced by 10 points, potentially pushing you to a restart strategy.

\`\`\`yaml
# In docker-compose.yml — always define healthcheck for critical services
services:
  api:
    image: my-api:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
\`\`\`

## Avoid Fixed Ports for Auto-Scaling Services

A fixed port binding (\`80:80\`) prevents Blue/Green rolling rotation because two containers can't bind the same host port. Use a load balancer or dynamic port mapping for services that need rolling rotation:

\`\`\`yaml
# ❌ Prevents rolling rotation
ports:
  - "80:80"

# ✅ Use a reverse proxy (Nginx, Traefik) in front, dynamic bind internally
ports:
  - "80"   # Docker assigns a random host port
\`\`\`

## Use \`/etc/dso/dso.yaml\` for System Services

For production servers, place your config file at the system path and restrict permissions:

\`\`\`bash
sudo mkdir -p /etc/dso
sudo cp dso.yaml /etc/dso/dso.yaml
sudo chmod 600 /etc/dso/dso.yaml
sudo chown root:docker /etc/dso/dso.yaml
\`\`\`

## Separate Configs Per Environment

Never use the same \`dso.yaml\` across dev and production. Use environment-specific configs:

\`\`\`bash
# Development
docker dso up --config dso.dev.yaml -d

# Production
docker dso up --config /etc/dso/dso.prod.yaml -d
\`\`\`

## Monitor with Prometheus

DSO exposes Prometheus metrics. Integrate them into your monitoring stack:

| Metric | Alert When |
|--------|-----------|
| \`dso_backend_failures_total\` | Rate > 0 for 5 minutes |
| \`dso_secret_fetch_latency_seconds\` | P95 > 2 seconds |
| \`dso_secret_cache_misses_total\` | Rate spikes unexpectedly |

Example Prometheus alert:
\`\`\`yaml
- alert: DSOProviderFailure
  expr: rate(dso_backend_failures_total[5m]) > 0
  for: 5m
  annotations:
    summary: "DSO is failing to fetch secrets from the provider"
\`\`\`

## Use IAM Roles, Not Static Keys

Never configure \`AWS_ACCESS_KEY_ID\` or similar static credentials on a production server. Instead:

- **AWS**: Use EC2 Instance Profiles or ECS Task Roles
- **Azure**: Use VM Managed Identity
- **Vault**: Use AppRole with a short-lived \`secret_id\`, not a long-lived \`VAULT_TOKEN\`

## Set \`max_parallel: 1\` in Production

When rotating secrets that affect multiple containers, rotate one at a time to prevent a thundering herd of container restarts:

\`\`\`yaml
agent:
  rotation:
    max_parallel: 1    # safer in production
\`\`\`

## Validate Before Deploying

Use \`docker dso fetch\` to test connectivity before rolling out a new configuration:

\`\`\`bash
# Test that all secrets are reachable before deploy
docker dso fetch myapp/db
docker dso fetch myapp/api-key
\`\`\`
`;

export const metadata: Metadata = {
  title: "Best Practices | DSO Documentation",
  description: "Recommendations for running Docker Secret Operator reliably and securely in production environments.",
};

export default function BestPracticesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <MarkdownRenderer content={content} />
    </div>
  );
}
