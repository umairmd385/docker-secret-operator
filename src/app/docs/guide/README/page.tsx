import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Documentation

## Getting Started
- [Quick Start](getting-started/index.md)
- [Concepts](getting-started/concepts.md)
- [Docker Compose Setup](getting-started/docker-compose.md)
- [Web UI](getting-started/web-ui.md)

## Configuration
- [Configuration Reference](reference/config-reference.md)
- [CLI Reference](reference/cli.md)

## Providers
- [Provider Overview](providers/index.md)
- [Docker Plugin](providers/docker-plugin.md)

## Examples
- [Node.js](examples/node.md)
- [Django](examples/django.md)
- [PostgreSQL](examples/postgres.md)
- [Redis](examples/redis.md)
- [Full Stack](examples/fullstack.md)

## Operations
- [Operator Guide](operations/operator-guide.md)
- [Deployment](operations/deployment.md)
- [Incident Workflow](operations/incident-workflow.md)
- [Bulk Operations](operations/bulk-operations.md)
- [Recovery Procedures](operations/recovery-procedures.md)
- [Local Mode](operations/local-mode.md)
- [Limitations](operations/limitations.md)
- [Audit Retention](operations/audit-retention.md)

## Architecture
- [Overview](architecture/overview.md)
- [Storage](architecture/storage.md)
- [Drift Engine](architecture/drift-engine.md)
- [Compliance Engine](architecture/compliance-engine.md)
- [Recommendation Engine](architecture/recommendation-engine.md)
- [Forecast Engine](architecture/forecast-engine.md)
- [Secret History](architecture/secret-history.md)
- [Security Model](architecture/security-model.md)
- [Event Bus](architecture/eventbus.md)
- [Audit Logging](architecture/audit-logging.md)

## Validation
- [Validation Report](validation/validation.md)
- [Performance](validation/performance.md)
- [Scale Test Results](validation/scale-test-results.md)
- [Hardening](validation/hardening.md)
- [Chaos Tests](validation/chaos-tests.md)
- [Security Review](validation/security-review.md)

## CLI Reference
Individual command pages are in [cli-reference/](cli-reference/).
`;

export const metadata: Metadata = {
  title: "DSO Documentation",
  description: "Documentation for DSO Documentation",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
