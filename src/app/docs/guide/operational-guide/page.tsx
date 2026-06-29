import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Operational Guide (Day-2 Operations)

## Overview

This guide covers operating DSO after initial setup, including monitoring, maintenance, troubleshooting, and scaling considerations.

## Daily Operations

### 1. Health Checks

**Morning Health Check**:
\`\`\`bash
# Comprehensive environment validation (all 17+ checks)
docker dso doctor --level full

# Machine-readable output for scripts and CI
docker dso doctor --json

# Current status snapshot
docker dso status

# Review recent logs
docker dso system logs -n 30
\`\`\`

**Quick Status Anytime**:
\`\`\`bash
# Single-line health check
docker dso doctor

# Real-time monitoring (dev)
docker dso status --watch
\`\`\`

**Interpreting Doctor Output**:

| Symbol | Meaning |
|--------|---------|
| ✓ PASS | Check passed |
| ⚠ WARN | Non-critical issue; DSO may still function |
| ✗ FAIL | Critical issue; action required |

Each WARN or FAIL entry includes a **root cause** and ordered **recovery steps**.

### 2. Automated Repair

When \`docker dso doctor\` reports failures, the repair engine can apply fixes automatically based on their risk level:

| Risk Level | Examples | Behaviour |
|------------|----------|-----------|
| Safe | Create missing runtime directory | Applied automatically without prompting |
| Moderate | Enable service, remove stale locks | Displayed with a description; requires confirmation |
| Destructive | Recreate config file | Displayed with a warning; requires explicit confirmation |

**Run a repair**:
\`\`\`bash
# See what repairs are available (prints plan, does not apply)
docker dso doctor --json | docker dso repair --dry-run

# Apply repairs interactively (safe actions auto-applied; moderate/destructive prompt)
docker dso repair

# Apply all repairs without prompting (use with care — e.g. in automation)
docker dso repair --yes
\`\`\`

After repair completes, Doctor runs automatically to verify the fixes. The repair report shows which actions were applied, which were declined, and whether the post-repair Doctor run is clean.

**Repair coverage** (by check ID):

| Category | Repaired automatically |
|----------|----------------------|
| Permissions | Socket mode (DSO-DOCTOR-004), config mode (DSO-DOCTOR-005, 009) |
| Configuration | Create default config (DSO-DOCTOR-007), recreate empty config (DSO-DOCTOR-008) |
| Runtime | Create runtime dir (DSO-DOCTOR-012), remove stale locks (DSO-DOCTOR-013) |
| Service | Write unit file (DSO-DOCTOR-015), enable service (DSO-DOCTOR-016), start service (DSO-DOCTOR-017) |
| Provider | Not automated — credential issues require manual intervention |

### 3. Monitoring (v3.5+)

**Setup Real-Time Monitoring**:
\`\`\`bash
# In one terminal: Watch status
docker dso status --watch

# In another terminal: Follow logs
docker dso system logs -f

# In third terminal: Monitor containers
docker ps --filter name=app --format "table {{.Names}}\t{{.Status}}"
\`\`\`

**Key Metrics to Watch**:
- Cache hit rate (should be >90% for normal operation)
- Rotation success rate (should be 100% or very close)
- Queue depth (should be <100)
- Container health status (all HEALTHY)
- Provider latency (should be <5 seconds for most operations)
- Lock contention (high contention >1s indicates scaling issues)

**v3.5 Observability Features**:
- Per-rotation trace IDs for end-to-end correlation
- Provider latency monitoring (tracks min/max/avg response times)
- Lock contention detection (alerts on slow acquisitions)
- Health check diagnostics (captures exit codes and output)
- Circuit breaker status (tracks provider failure isolation)

View details in status output:
\`\`\`bash
docker dso status --json | jq '.observability'
\`\`\`

### 4. Configuration Management

**Regular Config Reviews**:
\`\`\`bash
# View current configuration
docker dso config show

# Validate syntax
docker dso config validate

# Edit if needed
docker dso config edit

# Changes take effect on next rotation or manual restart
sudo docker dso system restart
\`\`\`

**Common Config Changes**:
\`\`\`yaml
# Increase cache for high-throughput applications
agent:
  cache:
    max_size: 1Gi  # from 500Mi

# Speed up rotation timeout for faster failover
  rotation:
    timeout: 15s   # from 30s

# Change polling for less frequent checks
  watch:
    polling_interval: 15m  # from 5m
\`\`\`

## v3.5 Automatic Recovery

DSO v3.5 automatically recovers from agent crashes:

**What Happens on Agent Restart**:
1. Detects incomplete rotations older than 5 minutes
2. Automatically cleans up orphaned containers (using naming patterns: \`_dso_backup_\`, \`_dso_new_\`)
3. Validates original container state
4. Resumes normal operations

**Operator Actions**:
- None required for most scenarios
- Check logs for automatic recovery confirmation:
  \`\`\`bash
  docker dso system logs | grep "Automatic recovery"
  \`\`\`
- For critical errors, review recovery procedures documentation

**View Recovery Status**:
\`\`\`bash
docker dso status --json | jq '.recovery'
\`\`\`

See **[Recovery Procedures](RECOVERY_PROCEDURES.md)** for manual recovery steps.

## Troubleshooting

### Issue: Rotation Failures

**Symptoms**: \`docker dso status\` shows failed rotations

**Diagnosis**:
\`\`\`bash
# Check recent rotation errors
docker dso system logs -p err --since 1h

# Check container health
docker ps --filter health=unhealthy

# Validate provider connectivity
docker dso doctor --level full
\`\`\`

**Solutions**:
\`\`\`bash
# 1. Check provider health
docker dso doctor | grep -A 2 "provider"

# 2. If provider is down, wait and retry
docker dso system restart

# 3. If still failing, check logs
docker dso system logs -f -p err

# 4. Manual recovery
# - Restore from backup
# - Or manually update secret in provider
# - Then restart agent
\`\`\`

### Issue: High Cache Miss Rate

**Symptoms**: Cache hit rate <80%, frequent provider lookups

**Diagnosis**:
\`\`\`bash
# Check cache status
docker dso status | grep -i cache

# Monitor cache behavior
docker dso system logs | grep cache_miss
\`\`\`

**Solutions**:
\`\`\`bash
# 1. Increase cache TTL
sudo nano /etc/dso/dso.yaml
# Change: cache.ttl: 1h → 4h

# 2. Increase cache size
# Change: cache.max_size: 500Mi → 1Gi

# 3. Reduce rotation frequency if possible
sudo docker dso system restart
\`\`\`

### Issue: Agent Service Won't Start

**Symptoms**: \`systemctl status dso-agent\` shows failed

**Diagnosis**:
\`\`\`bash
# Check service status
systemctl status dso-agent -l

# Check recent logs
journalctl -u dso-agent -n 50

# Validate configuration
docker dso config validate
\`\`\`

**Solutions**:
\`\`\`bash
# 1. Fix configuration errors
sudo docker dso config validate
# If errors, fix and validate again

# 2. Check permissions
ls -la /etc/dso /var/lib/dso /run/dso

# 3. Check disk space
df -h /var/lib/dso

# 4. Restart service
sudo systemctl restart dso-agent

# 5. Monitor startup
journalctl -u dso-agent -f
\`\`\`

### Issue: Container Rotation Slow

**Symptoms**: Rotations take >60 seconds

**Diagnosis**:
\`\`\`bash
# Check rotation timing
docker dso system logs | grep "rotation complete"

# Identify slow step
docker dso system logs | grep -E "health|verify|swap"

# Check health check config
docker inspect <container> --format '{{json .State.Health}}'
\`\`\`

**Solutions**:
\`\`\`bash
# 1. Reduce health check timeout
sudo nano /etc/dso/dso.yaml
# Change: rotation.timeout: 30s → 15s

# 2. Reduce container health check frequency
docker-compose.yml:
  healthcheck:
    interval: 10s  # from 30s
    timeout: 5s    # from 10s

# 3. Optimize application startup
# Reduce app initialization time
\`\`\`

### Issue: Provider Connection Issues

**Symptoms**: Doctor shows provider as "unavailable" or "unhealthy"

**Diagnosis**:
\`\`\`bash
# Check provider status
docker dso doctor --level full | grep -A 3 provider

# Test provider connectivity directly
docker dso doctor

# Check network connectivity
ping <provider-host>
curl <provider-endpoint>
\`\`\`

**Solutions**:
\`\`\`bash
# 1. Verify provider configuration
docker dso config show | grep -A 5 providers

# 2. Test provider access
# - Vault: vault status
# - AWS: aws secretsmanager list-secrets
# - Azure: az keyvault secret list

# 3. Check network rules
# - DNS resolution working?
# - Firewall allowing access?
# - Credentials valid?

# 4. Restart agent if fixed
sudo docker dso system restart
\`\`\`

## Maintenance

### Regular Tasks

**Daily**:
- Review status: \`docker dso doctor\`
- Check recent logs: \`docker dso system logs -n 20\`

**Weekly**:
- Review rotation history: \`docker dso system logs --since 7d | grep rotation\`
- Check cache effectiveness: \`docker dso status | grep cache\`
- Validate configuration: \`docker dso config validate\`

**Monthly**:
- Review operational metrics
- Test failover/recovery procedures
- Update documentation
- Review security logs

### Backup & Recovery

**Backup State**:
\`\`\`bash
# Backup configuration
sudo cp /etc/dso/dso.yaml /backup/dso-config-\$(date +%Y%m%d).yaml

# Backup state directory
sudo tar -czf /backup/dso-state-\$(date +%Y%m%d).tar.gz /var/lib/dso/state/

# Backup vault (if using local provider)
tar -czf /backup/dso-vault-\$(date +%Y%m%d).tar.gz ~/.dso/vault.enc
\`\`\`

**Restore State**:
\`\`\`bash
# 1. Stop agent
sudo docker dso system disable

# 2. Restore state files
sudo tar -xzf /backup/dso-state-20240512.tar.gz -C /

# 3. Restart agent
sudo docker dso system enable

# 4. Verify
docker dso doctor
docker dso status
\`\`\`

### Upgrade Procedure

**For Agent Binary**:
\`\`\`bash
# 1. Download new version
curl -Lo /tmp/dso-new https://releases.dso.dev/dso-v1.1.0-linux-amd64

# 2. Verify checksum
sha256sum /tmp/dso-new
# Compare with official checksum

# 3. Backup current binary
sudo cp /usr/local/bin/dso /usr/local/bin/dso-v1.0.0

# 4. Install new binary
sudo install -m 755 /tmp/dso-new /usr/local/bin/dso

# 5. Restart agent
sudo docker dso system restart

# 6. Verify upgrade
docker dso version
docker dso doctor
\`\`\`

**For Configuration**:
\`\`\`bash
# 1. Check compatibility
docker dso config validate

# 2. Make changes
sudo nano /etc/dso/dso.yaml

# 3. Validate new config
docker dso config validate

# 4. Apply changes
sudo docker dso system restart

# 5. Monitor for issues
docker dso system logs -f
\`\`\`

## Performance Tuning

### For High-Volume Environments

**Increase Cache**:
\`\`\`yaml
agent:
  cache:
    ttl: 8h
    max_size: 2Gi
\`\`\`

**Reduce Polling**:
\`\`\`yaml
  watch:
    polling_interval: 30m
    debounce_window: 10s
\`\`\`

**Optimize Rotation**:
\`\`\`yaml
  rotation:
    timeout: 45s
    parallelism: 3  # if supported
\`\`\`

### Monitor Performance Impact

\`\`\`bash
# Check resource usage
docker stats --no-stream dso-agent  # if running as container

# Check system load
top | grep dso

# Monitor disk I/O
iostat -x 1 5

# Monitor network
netstat -s | grep -E "TCP|UDP"
\`\`\`

## Scaling Considerations

### Single Host Limits
- Containers managed: Up to ~1000 per host (Docker limit)
- Secret rotations per second: ~10 (depends on provider)
- Cache memory: Configurable, typically 500MB-2GB
- Concurrent rotations: Limited by health check timeouts

### Multi-Host Deployment
DSO is designed for single-host deployment. For multiple hosts:
- Deploy independent agent per host
- Share provider (Vault, AWS, etc.)
- Use provider-level deduplication
- Consider rate limiting on backend

### Bottleneck Analysis

**CPU-bound**: Secret resolution from complex providers
- **Solution**: Increase cache TTL

**Memory-bound**: Large secret cache
- **Solution**: Reduce cache size, increase TTL

**I/O-bound**: Frequent state writes
- **Solution**: Reduce rotation frequency, batch updates

**Network-bound**: Provider communication
- **Solution**: Use webhooks instead of polling, increase TTL

## Alerting & Notifications

### Key Alerts to Set Up

\`\`\`bash
# Rotation failures
docker dso system logs | grep -i "rotation failed" | wc -l

# Provider unavailability
docker dso doctor | grep -i "unhealthy\|unavailable"

# Cache exhaustion
docker dso status | awk '/Cache/ {print \$NF}' | grep -E "99|100"

# Service crash detection
systemctl is-active dso-agent
\`\`\`

**Example alerting script**:
\`\`\`bash
#!/bin/bash
ROTATION_ERRORS=\$(docker dso system logs --since 1h | grep "rotation failed" | wc -l)
if [ \$ROTATION_ERRORS -gt 5 ]; then
  # Alert: high rotation failure rate
  echo "ALERT: \$ROTATION_ERRORS rotations failed in last hour"
fi
\`\`\`

## Best Practices

1. **Always validate before applying**
   - \`docker dso config validate\` before restart
   - \`docker dso doctor\` after changes

2. **Monitor continuously**
   - Daily: \`docker dso doctor\`
   - Weekly: \`docker dso system logs\`
   - Monthly: full audit

3. **Test recovery procedures**
   - Practice state restoration monthly
   - Test failover scenarios
   - Document recovery runbooks

4. **Keep audit logs**
   - Maintain 30+ days of logs
   - Archive rotation history
   - Track configuration changes

5. **Document changes**
   - Record all config modifications
   - Document scaling decisions
   - Update runbooks as needed

---

For runtime details, see [runtime.md](runtime.md).
For system architecture, see [architecture.md](architecture.md).
For CLI reference, see [cli.md](cli.md).
`;

export const metadata: Metadata = {
  title: "DSO Operational Guide (Day-2 Operations)",
  description: "Documentation for DSO Operational Guide (Day-2 Operations)",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
