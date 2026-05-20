import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Observability

Docker Secret Operator (DSO) exposes deep operational metrics using Prometheus and Structured JSON Logging. This enables seamless integration into modern observability stacks like Grafana, Datadog, or ELK.

## Prometheus Metrics

By default, the DSO agent exposes a \`/metrics\` HTTP endpoint when \`-metrics-port\` is configured (default: \`9090\`).

Endpoint: \`http://localhost:9090/metrics\`

| Metric | Type | Description |
|--------|------|-------------|
| \`dso_secret_fetches_total\` | Counter | Total secret fetch operations across all providers |
| \`dso_rotation_events_total\` | Counter | Total number of container rotation events triggered |
| \`dso_provider_errors_total\` | Counter | Error count segregated by \`provider\` label |
| \`dso_active_secrets\` | Gauge | Number of unique secrets currently held in memory cache |
| \`dso_agent_uptime_seconds\` | Gauge | Agent total running time |

**Example PromQL Query (Failed Rotations by Provider):**
\`\`\`promql
rate(dso_provider_errors_total{provider="aws"}[5m])
\`\`\`

## Grafana Dashboard Example

You can import the following JSON snippet into Grafana to get a unified view of DSO operations:

\`\`\`json
{
  "annotations": { "list": [] },
  "editable": true,
  "panels": [
    {
      "title": "Total Secret Fetches",
      "type": "stat",
      "targets": [
        { "expr": "sum(dso_secret_fetches_total)" }
      ]
    },
    {
      "title": "Active Cached Secrets",
      "type": "gauge",
      "targets": [
        { "expr": "dso_active_secrets" }
      ]
    }
  ],
  "title": "DSO Operational Metrics"
}
\`\`\`

## Structured Audit Logging

For compliance and security auditing, DSO emits structured JSON logs describing every significant lifecycle event.

Fields included in every audit record:
- \`timestamp\`: ISO-8601 UTC timestamp
- \`level\`: Log severity (usually \`audit\` or \`info\`)
- \`event\`: Extracted lifecycle action (e.g., \`secret_fetch\`, \`secret_rotate\`)
- \`user\`: Identity context
- \`provider\`: Backend involved
- \`secret_name\`: Redacted logical name
- \`container_id\`: Target docker container UUID
- \`status\`: Final operation state (\`success\` or \`failed\`)

Example:
\`\`\`json
{
  "timestamp": "2026-04-01T10:30:00Z",
  "level": "audit",
  "event": "secret_inject",
  "user": "system",
  "provider": "vault",
  "secret_name": "prod/db-creds",
  "container_id": "abc123fed456",
  "status": "success"
}
\`\`\`
`;

export const metadata: Metadata = {
  title: "Observability | DSO Documentation",
  description: "Guide to monitoring and observing Docker Secret Operator with Prometheus metrics and structured logging.",
};

export default function ObservabilityPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <MarkdownRenderer content={content} />
    </div>
  );
}
