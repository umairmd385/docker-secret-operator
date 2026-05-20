import { generatePageMetadata } from "@/lib/seo/metadata-helpers";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

export const metadata = generatePageMetadata(
  {
    title: "Troubleshooting Guide | Docker Secret Operator",
    description: "Diagnose and fix common Docker Secret Operator issues. Solutions for agent startup failures, rotation timeouts, health check errors, permission denied errors, provider connection failures, and stale lock conflicts.",
    keywords: ["dso troubleshooting", "docker secret operator debug", "rotation not working", "dso agent won't start", "secret rotation timeout", "docker dso issues"],
    ogTitle: "DSO Troubleshooting Guide",
    ogDescription: "Step-by-step solutions for common DSO issues: agent startup, rotation failures, health checks.",
    twitterCard: "summary",
  },
  "/docs/guide/troubleshooting"
);

const content = `# Troubleshooting

Step-by-step solutions for common Docker Secret Operator issues.

---

## Diagnostic Commands

Start here whenever something seems wrong:

\`\`\`bash
# Check agent service status
sudo systemctl status dso-agent

# Follow agent logs in real time
sudo journalctl -u dso-agent -f

# Last 100 log lines
sudo journalctl -u dso-agent -n 100

# Agent status and state summary
sudo dso status

# Check HTTP health endpoint
curl http://localhost:8081/health

# Collect full diagnostic bundle
sudo dso diagnose
\`\`\`

---

## Agent Won't Start

**Symptom:** \`sudo systemctl start dso-agent\` fails or exits immediately.

**Diagnose:**

\`\`\`bash
sudo journalctl -u dso-agent -n 50
docker ps                            # verify Docker is running
ls -la /var/run/docker.sock          # check socket permissions
docker dso validate-config           # validate config YAML
\`\`\`

**Solutions:**

\`\`\`bash
# Add dso-agent user to docker group
sudo usermod -aG docker dso-agent

# Fix socket permissions if needed
sudo chmod 660 /var/run/docker.sock

# Restart after fixes
sudo systemctl restart dso-agent
\`\`\`

---

## Rotations Not Triggering

**Symptom:** Secrets change in provider but containers don't update.

**Diagnose:**

\`\`\`bash
grep rotation /etc/dso/dso.yaml      # check rotation is enabled
sudo dso status | grep poll          # check polling interval
\`\`\`

**Solutions:**

\`\`\`yaml
# dso.yaml — ensure rotation is enabled
rotation:
  enabled: true
  poll_interval: 60s
\`\`\`

\`\`\`bash
# Trigger a manual rotation to test
sudo dso rotation trigger
\`\`\`

---

## Rotation Timeouts

**Symptom:** Rotations fail with timeout errors.

| Timeout Setting | Default | Config Key |
|----------------|---------|------------|
| Rotation timeout | 5m | \`rotation.timeout\` |
| Health check timeout | 30s | \`health_check.timeout\` |

\`\`\`yaml
# dso.yaml — increase timeouts for slow apps
rotation:
  timeout: 10m
health_check:
  timeout: 60s
\`\`\`

---

## Health Checks Failing

**Symptom:** Rotations roll back because health checks don't pass.

**Diagnose:**

\`\`\`bash
# Check your app's health endpoint
curl http://localhost:8081/health

# View container startup logs
docker logs <container-name>
\`\`\`

**Solutions:**

- Increase \`health_check.timeout\` if the app takes time to start
- Verify the health check URL and port are correct
- Ensure the health endpoint returns HTTP 200

---

## Permission Denied Errors

**Symptom:** Errors accessing Docker socket or state files.

\`\`\`bash
# Fix Docker socket access
sudo usermod -aG docker dso-agent

# Fix state directory ownership
sudo chown -R dso-agent:dso-agent /var/lib/dso

# Restart agent
sudo systemctl restart dso-agent
\`\`\`

---

## Provider Connection Failures

**Symptom:** Errors connecting to AWS, Azure, Vault, or other providers.

**Diagnose:**

\`\`\`bash
# Test connectivity to AWS
curl -I https://secretsmanager.us-east-1.amazonaws.com

# Check IAM permissions (AWS)
aws secretsmanager get-secret-value --secret-id my-secret

# Check Azure credentials
az keyvault secret show --vault-name my-vault --name my-secret
\`\`\`

**Common Causes:**

| Error | Fix |
|-------|-----|
| No credentials found | Check IAM role / managed identity is attached |
| Access denied | Update IAM policy to grant \`GetSecretValue\` |
| TLS error | Verify network connectivity and firewall rules |
| Expired credentials | Rotate access keys or renew managed identity |

---

## Stale Lock Conflicts

**Symptom:** Multiple agents blocking each other, rotations delayed.

\`\`\`bash
# Check lock file
ls -la /var/lib/dso/lock

# Check running agent processes
pgrep -a dso
\`\`\`

> Stale locks **auto-break after 5 minutes** — wait it out if not urgent.

\`\`\`bash
# Emergency: manually remove stale lock
sudo rm /var/lib/dso/lock
sudo systemctl restart dso-agent
\`\`\`

---

## Performance Issues

| Symptom | Solution |
|---------|----------|
| High memory (>300MB) | Check for memory leaks; restart agent |
| Slow rotations | Profile stage timing with \`sudo dso diagnose\` |
| High CPU | Increase poll interval in config (\`rotation.poll_interval: 120s\`) |

---

## Recovery Procedures

### Manual Rotation Trigger

\`\`\`bash
sudo dso rotation trigger
\`\`\`

### Manual Rollback

\`\`\`bash
docker ps -a                                    # list all containers
docker rename old-container-name app-web        # restore old container name
docker restart app-web                          # start it
\`\`\`

### State Recovery

If the state file is corrupted, DSO auto-detects and rebuilds it on next startup. No manual action required.

---

## Getting More Help

\`\`\`bash
# Collect full diagnostic bundle for support
sudo dso diagnose > /tmp/dso-diag.txt
\`\`\`

- Review full logs: \`sudo journalctl -u dso-agent --all\`
- Check [GitHub Issues](https://github.com/docker-secret-operator/dso/issues)
- Join [Discord](https://discord.gg/skycloudops) for community support
`;

export default function TroubleshootingPage() {
  return <MarkdownRenderer content={content} />;
}
