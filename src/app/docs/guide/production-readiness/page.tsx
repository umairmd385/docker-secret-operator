import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

export const metadata = generatePageMetadata(
  {
    title: "Production Readiness Checklist | Docker Secret Operator",
    description: "Complete production readiness checklist for Docker Secret Operator. Infrastructure requirements, security configuration, monitoring setup, compliance (PCI-DSS, HIPAA, SOC 2), and performance considerations.",
    keywords: ["dso production readiness", "docker secret operator production", "production deployment checklist", "pci-dss compliance docker", "hipaa secrets management"],
    ogTitle: "DSO Production Readiness Guide",
    ogDescription: "Complete production checklist: infrastructure, security, monitoring, compliance.",
    twitterCard: "summary",
  },
  "/docs/guide/production-readiness"
);

const content = `# Production Readiness

Use this checklist before deploying Docker Secret Operator in a production environment.

---

## Pre-Deployment Checklist

### Infrastructure Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| **OS** | Ubuntu 18.04+ / RHEL 8+ | systemd required for Agent Mode |
| **Docker** | v20.10+ | \`docker info\` must succeed |
| **Docker Compose** | v2.0+ | Required for \`dso up\` |
| **RAM** | 2 GB available | Agent uses ~50–100 MB at rest |
| **Disk** | 500 MB free | State files, logs |
| **Network** | HTTPS to provider | No inbound port required (polling mode) |

\`\`\`bash
# Verify Docker version
docker --version    # should be 20.10+

# Verify Compose version
docker compose version    # should be 2.x

# Check available memory
free -h
\`\`\`

### Security Configuration

- ✅ Use IAM roles or managed identities — **not** static access keys
- ✅ Apply least-privilege IAM/RBAC policies (only \`GetSecretValue\` on specific paths)
- ✅ Configure firewall rules (deny by default, allow only HTTPS to provider)
- ✅ Enable TLS certificate validation (never set \`verify_tls: false\`)
- ✅ Enable audit logging in secret provider (CloudTrail, Activity Log, Vault audit)

### Operational Setup

- ✅ Configure rotation schedule in provider (event-driven recommended)
- ✅ Set up monitoring and alerting for rotation failures
- ✅ Configure log aggregation (syslog, CloudWatch, Datadog, etc.)
- ✅ Document recovery procedures for your operator team
- ✅ Test automatic rollback scenario manually before going live

### Testing Requirements

\`\`\`bash
# 1. Verify agent starts cleanly
sudo systemctl start dso-agent
sudo systemctl status dso-agent

# 2. Verify health endpoint
curl http://localhost:8081/health
# → {"status":"ok","provider":"aws"}

# 3. Check logs are clean
sudo journalctl -u dso-agent -n 50

# 4. Test rotation manually
sudo dso rotation trigger

# 5. Verify rollback works — stop container during health check
# and verify the old container is restored automatically
\`\`\`

---

## Deployment Best Practices

### Rolling Deployment

For multi-host deployments, update agents one host at a time:

\`\`\`bash
# On each host, in sequence:
sudo systemctl stop dso-agent
# ... update binary ...
sudo systemctl start dso-agent
sleep 30  # verify health before moving to next host
\`\`\`

### Monitoring & Alerting

Set up alerts for these events:

| Alert | Threshold | Severity |
|-------|-----------|----------|
| Rotation failure | 1 failure | Warning |
| Agent not responding | 2 min | Critical |
| Health check timeout | >30s | Warning |
| Provider unavailable | 1 failure | Critical |

\`\`\`bash
# Quick health check for monitoring scripts
curl -sf http://localhost:8081/health | jq .status
\`\`\`

### Backup & Recovery

\`\`\`bash
# Back up DSO state files
sudo cp /var/lib/dso/state.json /backup/dso-state-$(date +%Y%m%d).json
sudo cp /var/lib/dso/checkpoint.json /backup/dso-checkpoint-$(date +%Y%m%d).json
\`\`\`

- Keep provider credentials in a separate secure vault
- Document manual recovery steps for complete provider failure
- Test recovery procedure quarterly

---

## Compliance Checklist

### PCI-DSS
- ✅ Secrets never on disk as plaintext (Requirement 3.4)
- ✅ Audit logging enabled and reviewed (Requirement 10.2)
- ✅ TLS for all network communication (Requirement 4.1)
- ✅ Credential rotation every 90 days or less (Requirement 8.6)

### HIPAA
- ✅ Encryption at rest and in transit (§164.312)
- ✅ Access logs for audit trail (§164.312(b))
- ✅ Automatic rollback on failure — data integrity (§164.310(d))

### SOC 2
- ✅ Audit logging with timestamps
- ✅ Access control and authentication
- ✅ Availability monitoring
- ✅ Automatic recovery from failures

---

## Performance Reference

### Rotation Timing

| Stage | Typical Duration |
|-------|-----------------|
| Lock acquisition | 100–500ms |
| Secret fetch from provider | 200ms–1s |
| New container creation | 1–3s |
| Health check | 1–5s (app-dependent) |
| Atomic swap | ~100ms |
| Old container cleanup | 1–2s |
| **Total** | **3–12 seconds** |

### Resource Usage

| Resource | At Rest | During Rotation |
|----------|---------|-----------------|
| Memory | 50–100 MB | 150–300 MB |
| CPU | Minimal | Temporary spike |
| Disk I/O | Minimal | State file writes |
| Network | 0 (polling idle) | 1–5 API calls |

---

## Scaling Considerations

### Single Host (Recommended)

Single agent manages all containers on one host with automatic lock management and crash recovery. This is the most common and recommended configuration.

### Multi-Host

- Each host runs an independent agent
- Agents coordinate via lock file and state timestamps
- Stale locks auto-break after 5 minutes
- No distributed consensus required

---

## Next Steps

- Complete this checklist before going to production
- Schedule runbook training with your operator team
- Set up monitoring and alerting dashboards
- Plan and test disaster recovery procedures
- Read [Observability](/docs/guide/observability) for metrics setup
`;

export default function ProductionReadinessPage() {
  return <MarkdownRenderer content={content} />;
}
