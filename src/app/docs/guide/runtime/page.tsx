import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Runtime Operation & Systemd Integration

## Overview

This document covers how DSO operates as a runtime service, with emphasis on the systemd-managed agent mode (Phase 4 integration).

---

## v3.5 Runtime Enhancements

### Automatic Crash Recovery

On agent startup, DSO v3.5 automatically recovers from incomplete rotations:

1. **Detection Phase** — Scans state file for rotations older than 5 minutes
2. **Recovery Phase** — Identifies orphaned containers using naming patterns (\`_dso_backup_\`, \`_dso_new_\`)
3. **Cleanup Phase** — Removes orphaned containers automatically
4. **Validation Phase** — Verifies original container state
5. **Completion Phase** — Marks recovery in state tracker

**Result**: Most agent crashes require zero operator intervention.

### Enhanced State Tracking

The state tracker now persists additional metadata:
- **New statuses**: \`recovered\`, \`critical_error\`
- **7-day retention**: Automatic cleanup of completed rotations prevents state file bloat
- **24-hour stale detection**: Rotations without progress marked for operator review

### Observability Monitoring

v3.5 includes comprehensive monitoring:
- **Per-rotation tracing**: Unique trace IDs for end-to-end correlation
- **Provider latency monitoring**: Tracks min/max/average response times
- **Lock contention detection**: Alerts on slow acquisitions (>1s)
- **Health check diagnostics**: Captures exit codes and output for debugging
- **Circuit breaker status**: Monitors provider failure isolation

Access via:
\`\`\`bash
docker dso status --json | jq '.observability'
\`\`\`

### Provider Failure Isolation (Circuit Breaker)

When a provider fails:
1. **Closed State** — Normal operation
2. **Open State** — After failure threshold, rejects requests
3. **Half-Open State** — Tests recovery periodically
4. **Auto-Recovery** — Returns to closed when provider recovers

Prevents cascade failures when one provider is unavailable.

---

## Agent Lifecycle

### Initialization Phase
\`\`\`
1. Binary Installed
   └─ /usr/local/bin/dso (or ~/.local/bin/dso)

2. Bootstrap Agent
   └─ sudo docker dso bootstrap agent
      ├─ Create directories (/etc/dso, /var/lib/dso, /var/log/dso, /run/dso)
      ├─ Generate config (/etc/dso/dso.yaml)
      ├─ Create systemd service (/etc/systemd/system/dso-agent.service)
      └─ Verify permissions

3. Enable Service
   └─ sudo docker dso system enable
      ├─ systemctl enable dso-agent
      └─ systemctl start dso-agent

4. Operational
   └─ Agent running as systemd service
      ├─ Listening on /run/dso/agent.sock
      ├─ Logging to journald
      └─ Processing events
\`\`\`

### Systemd Service Configuration

**File**: \`/etc/systemd/system/dso-agent.service\`

\`\`\`ini
[Unit]
Description=DSO Secret Injection Runtime Agent
Documentation=https://github.com/docker-secret-operator/dso
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/var/lib/dso

ExecStart=/usr/local/bin/dso agent --config /etc/dso/dso.yaml

Restart=on-failure
RestartSec=10
StartLimitInterval=60s
StartLimitBurst=3

StandardOutput=journal
StandardError=journal
SyslogIdentifier=dso-agent

LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
\`\`\`

**Key Features**:
- \`Type=simple\`: Direct service execution
- \`Restart=on-failure\`: Automatic restart on unexpected exit
- \`StartLimitBurst=3\`: Allow 3 restarts within 60 seconds
- \`journald\`: All output goes to systemd journal
- \`LimitNOFILE=65535\`: High file descriptor limit for many connections

## Service Management (Phase 4 Commands)

### Check Service Status
\`\`\`bash
docker dso system status
# Shows:
# - Service running/stopped
# - Enabled/disabled
# - Recent logs
# - Last activity
\`\`\`

### Enable Service
\`\`\`bash
sudo docker dso system enable
# - systemctl enable dso-agent
# - systemctl start dso-agent
# - Verifies startup
\`\`\`

### Disable Service
\`\`\`bash
sudo docker dso system disable
# - systemctl disable dso-agent
# - systemctl stop dso-agent
\`\`\`

### Restart Service
\`\`\`bash
sudo docker dso system restart
# - systemctl restart dso-agent
# - Useful after config changes
\`\`\`

### View Service Logs
\`\`\`bash
docker dso system logs                    # Last 20 lines
docker dso system logs -f                 # Follow in real-time
docker dso system logs -n 100             # Last 100 lines
docker dso system logs -p err             # Errors only
docker dso system logs --since 1h         # Last hour
\`\`\`

## Directory Structure

### Local Mode
\`\`\`
~/.dso/
├── config.yaml              # Configuration file
├── vault.enc                # Encrypted vault (AES-256)
├── state/                   # State tracking
│   ├── rotations.json       # Rotation history
│   ├── containers.json      # Container mappings
│   └── runtime.json         # Runtime metadata
├── cache/                   # Secret cache
│   ├── .metadata            # Cache metadata
│   └── secrets.db           # Cached secrets
├── logs/                    # Local logs
│   └── dso.log              # Application logs
└── plugins/                 # Provider plugins
    ├── vault                # Vault provider binary
    ├── aws                  # AWS provider binary
    └── azure                # Azure provider binary
\`\`\`

### Agent Mode
\`\`\`
/etc/dso/
├── config.yaml              # Production configuration
└── tls/                     # Optional TLS certificates
    ├── cert.pem
    └── key.pem

/var/lib/dso/
├── state/                   # Persistent state
│   ├── rotations.json
│   ├── containers.json
│   └── runtime.json
├── cache/                   # Secret cache
│   └── secrets.db
├── locks/                   # Rotation locks
├── plugins/                 # Provider plugins
└── snapshots/               # Rollback snapshots

/var/log/dso/
└── agent.log                # Agent logs (if file logging enabled)

/run/dso/
└── agent.sock               # Unix socket for communication
\`\`\`

## Configuration Loading

### Priority Order
1. CLI flag: \`dso agent -c /custom/path/config.yaml\`
2. Agent config: \`/etc/dso/dso.yaml\` (requires root)
3. Local config: \`~/.dso/config.yaml\`
4. Current directory: \`./dso.yaml\`

### Validation
On startup, DSO validates:
- YAML syntax
- Required fields presence
- Version compatibility
- Provider configuration
- File permissions

### Hot Reload
Configuration changes:
\`\`\`bash
# Edit configuration
sudo nano /etc/dso/dso.yaml

# Validate changes
docker dso config validate

# Apply changes
sudo docker dso system restart
\`\`\`

## Event-Driven Operation

### Docker Events
DSO monitors for:
- Container start/stop
- Container health changes
- Network changes
- Volume changes

\`\`\`bash
# View Docker events
docker events --filter 'service=dso'
\`\`\`

### Secret Backend Events
DSO monitors providers for:
- Secret creation
- Secret updates
- Secret deletion
- Provider availability changes

### Rotation Workflow
\`\`\`
Event Detected
    ↓
Queue operation (with debounce)
    ↓
Wait 5 seconds (debounce window)
    ↓
Fetch fresh secret from provider
    ↓
Create new container with updated secret
    ↓
Verify health (configurable timeout/retries)
    ├─ PASS: Atomic swap (rename containers)
    │        Stop old container
    │        Mark rotation complete
    ├─ FAIL: Rollback to previous container
    │        Log failure reason
    │        Alert (if configured)
    └─ TIMEOUT: Rollback on timeout
              Log timeout event
              Alert (if configured)
\`\`\`

## State Persistence

### Why Persistent State?
- Detect incomplete rotations on restart
- Resume interrupted operations
- Track rotation history
- Implement crash recovery

### State Files
- **rotations.json**: Rotation audit log
- **containers.json**: Container-to-secret mappings
- **runtime.json**: Startup metadata

### Crash Recovery
If agent crashes during rotation:
1. On restart, load last state
2. Detect incomplete rotation
3. Either resume or rollback based on state
4. Log recovery action

\`\`\`bash
# Monitor recovery
docker dso system logs --since 5m | grep recovery
\`\`\`

## Health Checks

### Container Health
DSO uses Docker's health check:
\`\`\`yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8471/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
\`\`\`

### Agent Health
Check agent availability:
\`\`\`bash
# Via socket (internal)
curl --unix-socket /run/dso/agent.sock http://health

# Via status command
docker dso status
docker dso doctor
\`\`\`

## Performance Tuning

### Cache Configuration
\`\`\`yaml
agent:
  cache:
    ttl: 1h              # Time-to-live for cached secrets
    max_size: 500Mi      # Max cache size
\`\`\`

### Rotation Tuning
\`\`\`yaml
agent:
  rotation:
    strategy: restart    # or: reload (if supported)
    timeout: 30s
    rollback_on_failure: true
    
  watch:
    polling_interval: 5m    # Fallback poll if no webhooks
    debounce_window: 5s     # Debounce rapid changes
\`\`\`

### Resource Limits
\`\`\`
Memory: ~100-200MB baseline
CPU: <5% idle
Disk I/O: Minimal (state updates only)
Network: Per-provider (polling or webhooks)
\`\`\`

## Monitoring & Logging

### Journald Integration
\`\`\`bash
# View all agent logs
journalctl -u dso-agent

# Follow in real-time
journalctl -u dso-agent -f

# Filter by level
journalctl -u dso-agent -p err    # Errors only
journalctl -u dso-agent -p warning # Warnings and errors

# Time-based filtering
journalctl -u dso-agent --since "1 hour ago"
journalctl -u dso-agent --until "5 minutes ago"

# JSON output
journalctl -u dso-agent -o json
\`\`\`

### Log Levels
- \`DEBUG\`: Verbose operation details
- \`INFO\`: Normal operation (default)
- \`WARNING\`: Recoverable issues
- \`ERROR\`: Failures requiring attention

### Key Log Events
\`\`\`
[INFO] Agent started, version v1.0.0
[INFO] Configuration loaded from /etc/dso/dso.yaml
[INFO] Docker socket connected
[INFO] Secret backend connected: vault
[INFO] Event watcher started
[DEBUG] Secret rotation triggered: app/db_password
[DEBUG] Rotation debounce: 5 second window
[INFO] Rotation complete: app/db_password
[ERROR] Rotation failed: health check timeout
[WARNING] Provider connection lost, retrying...
\`\`\`

## Troubleshooting

### Service Won't Start
\`\`\`bash
# Check service status
systemctl status dso-agent

# Check recent logs
journalctl -u dso-agent -n 50

# Verify configuration
docker dso config validate

# Check permissions
ls -la /etc/dso /var/lib/dso /run/dso
\`\`\`

### High Memory Usage
\`\`\`bash
# Check cache size
docker dso status | grep -i cache

# Reduce cache if needed
sudo nano /etc/dso/dso.yaml
# Reduce max_size: 500Mi → 100Mi
sudo docker dso system restart
\`\`\`

### Rotation Failures
\`\`\`bash
# View recent rotations
journalctl -u dso-agent | grep rotation

# Check container health
docker ps --filter health=unhealthy

# Manually check provider
docker dso doctor --level full
\`\`\`

### Socket Communication Issues
\`\`\`bash
# Check socket exists and is accessible
ls -la /run/dso/agent.sock

# Verify permissions
stat /run/dso/agent.sock

# Test socket communication
echo '{"action":"status"}' | nc -U /run/dso/agent.sock
\`\`\`

## Operational Runbooks

### Graceful Restart
\`\`\`bash
# 1. Get current state
docker dso status --json > ~/dso-backup.json

# 2. Stop agent
sudo docker dso system disable

# 3. Make changes (e.g., update config)
sudo nano /etc/dso/dso.yaml

# 4. Validate changes
docker dso config validate

# 5. Restart agent
sudo docker dso system enable

# 6. Verify
docker dso doctor
docker dso status
\`\`\`

### Upgrade Agent
\`\`\`bash
# 1. Download new binary
curl -Lo /tmp/dso-new https://...

# 2. Verify checksum
sha256sum -c /tmp/dso-new.sha256

# 3. Backup current
sudo cp /usr/local/bin/dso /usr/local/bin/dso.backup

# 4. Install new version
sudo install -m 755 /tmp/dso-new /usr/local/bin/dso

# 5. Restart service
sudo docker dso system restart

# 6. Verify upgrade
docker dso version
docker dso doctor
\`\`\`

---

For system architecture, see [architecture.md](architecture.md).
For day-2 operations, see [operational-guide.md](operational-guide.md).
`;

export const metadata: Metadata = {
  title: "DSO Runtime Operation & Systemd Integration",
  description: "Documentation for DSO Runtime Operation & Systemd Integration",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
