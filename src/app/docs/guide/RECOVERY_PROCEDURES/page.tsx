import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Recovery Procedures

This document describes how to recover DSO from common failure scenarios.

## Overview

DSO v3.5+ includes **automatic crash recovery** that handles most failure modes transparently. This document covers:
- Automatic recovery (what happens behind the scenes)
- Manual recovery (if automatic recovery fails)
- Troubleshooting (diagnosing issues)

---

## Automatic Recovery (v3.5+)

When the DSO agent restarts, it automatically:

1. **Detects pending rotations** from state file
2. **Inspects Docker state** to find orphaned containers
3. **Cleans up orphans** using naming patterns (\`_dso_backup_\`, \`_dso_new_\`)
4. **Marks rotations as recovered**
5. **Continues normal operations**

**What this means:** Most agent crashes recover automatically without operator action.

### Identifying Automatic Recovery

Look for these log messages on agent startup:

\`\`\`json
{"level":"info","msg":"Detected pending rotations, performing automatic recovery","count":2}
{"level":"info","msg":"Removing orphaned backup container","backup_id":"abc123"}
{"level":"info","msg":"Automatic recovery completed","rotations_processed":2}
\`\`\`

---

## Manual Recovery Procedures

### Scenario 1: Agent Crashes During Rotation

**Symptoms:**
- Agent process exited unexpectedly
- Container is stuck in intermediate state (suffix \`_dso_backup_\` or \`_dso_new_\`)

**Automatic Fix (v3.5+):**
\`\`\`
[agent restarts]
→ Automatic recovery cleans up orphaned containers
→ Rotation marked as "recovered"
→ Original container verified to be running
[Done - no operator action needed]
\`\`\`

**Manual Fix (v3.4 or if automatic recovery fails):**

\`\`\`bash
# 1. Check Docker state
docker ps -a | grep "dso_backup\|dso_new"

# 2. Identify original container
docker ps | grep "original-app-name"

# 3. Remove orphaned containers
docker stop old-app_dso_backup_1234567890  # Stop old container
docker rm old-app_dso_backup_1234567890    # Remove it

docker stop app_dso_new_1234567890         # Stop new container  
docker rm app_dso_new_1234567890           # Remove it

# 4. Verify original container is running
docker inspect original-app-name | grep "Running"

# 5. Restart agent
sudo systemctl restart dso-agent
\`\`\`

---

### Scenario 2: Original Container is Missing

**Symptoms:**
- \`docker ps\` doesn't show the original container
- Agent logs show "CRITICAL: Original container is missing"

**This is a critical failure - operator judgment required:**

\`\`\`bash
# 1. Check for containers with similar name
docker ps -a | grep "app-name"

# 2. If backup exists, it might be the original
docker ps -a | grep "app_dso_backup"

# Option A: Restore from backup (if backup has correct state)
docker rename app_dso_backup_1234 original-app-name
docker start original-app-name

# Option B: Restart the original image
docker run -d --name original-app-name original-app:latest

# 3. Verify the container is operational
docker exec original-app-name health-check-command

# 4. Check agent logs for the rotation state
docker dso status

# 5. If needed, manually mark rotation as recovered
# (This would be a future dso-cli recover subcommand)
\`\`\`

---

### Scenario 3: Lock Files are Stale

**Symptoms:**
- Rotations are stuck/hung
- Lock file is old (>30 min)

**Fix:**

\`\`\`bash
# 1. Identify stale locks
ls -la /var/lib/dso/locks/

# 2. Check modification time
find /var/lib/dso/locks -type f -mmin +30  # Files >30 min old

# 3. If rotation is not active, remove stale lock
rm /var/lib/dso/locks/secret-name.lock

# 4. Restart rotation or agent
sudo systemctl restart dso-agent
\`\`\`

---

### Scenario 4: State File is Corrupted

**Symptoms:**
- Agent fails to start
- Logs show "failed to unmarshal state"

**Fix:**

\`\`\`bash
# 1. Backup corrupted state
sudo cp /var/lib/dso/state/rotations.json /var/lib/dso/state/rotations.json.corrupt

# 2. Remove corrupted state
sudo rm /var/lib/dso/state/rotations.json

# 3. Restart agent (creates clean state)
sudo systemctl restart dso-agent

# 4. Verify any pending rotations
docker dso status
\`\`\`

---

### Scenario 5: Multiple Agents Running (Concurrency Issue)

**Symptoms:**
- Contradictory log messages from different agent processes
- Containers being rotated multiple times simultaneously

**Fix:**

\`\`\`bash
# 1. Stop all DSO agents
sudo systemctl stop dso-agent
killall -9 dso  # Force kill if needed

# 2. Inspect Docker state for corruption
docker ps | grep "dso_"
# Should be empty or only running containers with original names

# 3. Clean up any dual-running containers
docker stop app_dso_backup_*
docker rm app_dso_backup_*
docker stop app_dso_new_*
docker rm app_dso_new_*

# 4. Clear state file (fresh start)
sudo rm /var/lib/dso/state/rotations.json

# 5. Clear locks
sudo rm -rf /var/lib/dso/locks/*

# 6. Verify only ONE agent is configured
sudo systemctl list-units "dso*"

# 7. Start single agent
sudo systemctl start dso-agent

# 8. Verify health
docker dso doctor
\`\`\`

---

## Troubleshooting

### Check Agent Health

\`\`\`bash
# Quick status
docker dso status

# Detailed diagnostics
docker dso doctor

# Systemd status (Cloud Mode)
sudo systemctl status dso-agent

# Recent logs
docker dso system logs -n 100
\`\`\`

### Check Rotation State

\`\`\`bash
# View pending rotations
sudo cat /var/lib/dso/state/rotations.json | jq '.'

# Check specific rotation
jq '.["provider:secret:container_id"]' /var/lib/dso/state/rotations.json
\`\`\`

### Check Lock Contention

\`\`\`bash
# View all locks
ls -la /var/lib/dso/locks/

# See lock age
find /var/lib/dso/locks -exec ls -lh {} \;
\`\`\`

---

## Recovery Checklist

After any failure, use this checklist:

- [ ] Verify no dual-running containers (same name, different ID)
- [ ] Verify original container is running and healthy
- [ ] Remove any \`_dso_backup_\` or \`_dso_new_\` containers
- [ ] Check rotation state file integrity
- [ ] Remove stale lock files (>30 min old)
- [ ] Verify agent can access Docker socket
- [ ] Check provider connectivity (Vault, AWS, etc.)
- [ ] Restart agent and monitor logs
- [ ] Run \`docker dso doctor\` to validate setup
- [ ] Run one manual rotation test (\`docker dso secret set <name>\`)

---

## Getting Help

If recovery steps don't resolve the issue:

1. **Collect diagnostics:**
   \`\`\`bash
   docker dso doctor --json > diagnostics.json
   sudo journalctl -u dso-agent -n 1000 > logs.txt
   \`\`\`

2. **Check documentation:**
   - See [PERSISTENCE_MODEL.md](PERSISTENCE_MODEL.md) for state files
   - See [architecture.md](architecture.md) for recovery design
   - See [SECURITY.md](SECURITY.md) for permission issues

3. **Open an issue:** https://github.com/docker-secret-operator/dso/issues
   - Attach diagnostics.json and logs.txt
   - Include your mode (Local vs Cloud)
   - Describe what you did before the failure

---

## Prevention

To avoid needing recovery:

1. **Monitor actively:**
   \`\`\`bash
   watch -n 2 "docker dso status"
   \`\`\`

2. **Alert on errors:**
   - Set up log alerting on ERROR level messages
   - Monitor \`dso_events_dropped_total\` metric

3. **Test recovery:**
   - Periodically kill the agent and verify automatic recovery works
   - Test manual rotation under controlled conditions

4. **Backup configuration:**
   \`\`\`bash
   cp /etc/dso/dso.yaml /etc/dso/dso.yaml.\$(date +%s)
   \`\`\`

5. **Use stable provider:**
   - Vault is preferred for production
   - Test local mode before switching to cloud providers
`;

export const metadata: Metadata = {
  title: "DSO Recovery Procedures",
  description: "Documentation for DSO Recovery Procedures",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
