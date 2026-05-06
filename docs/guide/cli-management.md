# CLI: Management & Diagnostics

This guide covers DSO management and diagnostic commands for monitoring, inspecting, and troubleshooting your deployments.

---

## `fetch` — Retrieve Secrets

Manually retrieve secrets from the running agent or list all defined secrets.

### Usage
```bash
docker dso fetch [secret-name]
```

### Examples

List all available secrets:
```bash
docker dso fetch
```

Get a specific secret:
```bash
docker dso fetch database.password
docker dso fetch api.key
```

### Output
```
Available Secrets:
  database.password     ●●●●●●●●
  database.username     ●●●●●●●
  api.key              ●●●●●●●●●●●●
  api.secret           ●●●●●●●●
```

---

## `export` — Export Resolved Secrets

Export resolved secrets to a local file for CI/testing purposes.

### Usage
```bash
docker dso export [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--format/-f` | Output format: `env` (default), `json`, `yaml` |
| `--output/-o` | Output file path (default: stdout) |

### Examples

Export as .env format:
```bash
docker dso export --format env --output .env.resolved
```

Export as JSON:
```bash
docker dso export --format json --output secrets.json
```

Print to stdout:
```bash
docker dso export --format yaml
```

### Output Examples

**env format:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
API_KEY=sk-1234567890
API_SECRET=secret-value
```

**json format:**
```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "user": "postgres"
  },
  "api": {
    "key": "sk-1234567890",
    "secret": "secret-value"
  }
}
```

---

## `inspect` — Inspect Container

View environment variables and secret mounts with automatic masking of sensitive values.

### Usage
```bash
docker dso inspect <container-id>
```

### Examples

Inspect by container ID:
```bash
docker dso inspect a3f4b2c1d5e6
```

Inspect by container name:
```bash
docker dso inspect myapp_api_1
```

### Output
```
Container: myapp_api_1
ID: a3f4b2c1d5e6
Status: running
Uptime: 2h 45m

Environment Variables:
  NODE_ENV = production
  APP_PORT = 8080
  DB_HOST = ●●●●●●●●
  DB_USER = ●●●●●●●
  API_KEY = ●●●●●●●●●●●●

Secret Mounts:
  /run/secrets/database.password (1.2 KiB, readonly)
  /run/secrets/api.key (256 B, readonly)

Resource Usage:
  Memory: 128 MiB / 512 MiB
  CPU: 0.5%
```

---

## `watch` — Monitor Secret Rotations & Events

Real-time monitor of secret rotations and Docker container lifecycle events.

### Usage
```bash
docker dso watch [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--debug/-d` | Enable verbose logging |
| `--strategy` | Update strategy: `rolling` (default), `atomic`, `canary` |

### Examples

Monitor in default (rolling) mode:
```bash
docker dso watch
```

Monitor with debug output:
```bash
docker dso watch --debug
```

Monitor with atomic strategy:
```bash
docker dso watch --strategy atomic
```

### Output
```
[INFO] Watching for secret rotations and container events...

[10:45:23] SECRET_ROTATION: database.password
  - Detected new version (v2)
  - Strategy: rolling
  - Starting: myapp_db_1
  - Status: ✓ Successfully rotated

[10:45:45] CONTAINER_CREATED: myapp_api_1
  - Secrets injected: 5
  - Status: ✓ Ready

[10:46:12] SECRET_ROTATION: api.key
  - Detected new version (v3)
  - Strategy: rolling
  - Starting: myapp_api_1
  - Status: ✓ Successfully rotated
  - Stopping: myapp_api_2
  - Status: ✓ Terminated
```

---

## `logs` — View Agent Logs

View systemd journald or REST API agent logs with filtering.

### Usage
```bash
docker dso logs [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--follow/-f` | Stream logs in real-time |
| `--tail/-n` | Number of lines to show (default: 50) |
| `--since` | Time filter (e.g., `10m`, `1h`, `2023-01-15`) |
| `--until` | End time for log range |
| `--level` | Filter by level: `debug`, `info`, `warn`, `error` |
| `--api` | Show REST API agent logs instead of systemd |

### Examples

Show last 100 lines:
```bash
docker dso logs --tail 100
```

Stream logs in real-time:
```bash
docker dso logs -f
```

Show logs from last 10 minutes:
```bash
docker dso logs --since 10m
```

Show only errors:
```bash
docker dso logs --level error
```

Show API agent logs:
```bash
docker dso logs --api --follow
```

Complex filtering:
```bash
docker dso logs --since 30m --until 10m --level warn,error -f
```

### Output
```
2026-05-06 10:45:23 [INFO] DSO Agent started (v1.2.0)
2026-05-06 10:45:24 [INFO] Connecting to Docker daemon...
2026-05-06 10:45:24 [INFO] Docker connection established
2026-05-06 10:45:25 [INFO] Loading configuration from dso.yaml
2026-05-06 10:45:25 [INFO] Starting secret rotation monitor
2026-05-06 10:45:26 [DEBUG] Vault health check: OK
2026-05-06 10:45:30 [INFO] Container event: myapp_api_1 started
2026-05-06 10:45:31 [INFO] Injecting 5 secrets into myapp_api_1
2026-05-06 10:45:31 [INFO] Secrets injection complete (1.2ms)
```

---

## `validate` — Validate Configuration

Verify dso.yaml configuration syntax and schema compliance.

### Usage
```bash
docker dso validate [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--config/-c` | Path to dso.yaml (default: `dso.yaml`) |

### Examples

Validate default dso.yaml:
```bash
docker dso validate
```

Validate specific config:
```bash
docker dso validate --config dso.prod.yaml
```

### Output (Valid)
```
✓ Configuration valid
  - File: dso.yaml
  - Format: YAML
  - Schema version: 1.0
  - Provider: aws
  - Services: 3
  - Secrets: 12
```

### Output (Invalid)
```
✗ Configuration validation failed

Errors:
  - Line 5: Unknown field 'providor' (did you mean 'provider'?)
  - Line 12: Secret path 'my-app/db-pass' uses invalid characters
  - Line 15: Provider 'unknown' not supported

Warnings:
  - Line 8: Deprecated field 'vault_path' (use 'vault' instead)
```

---

## `diff` — Compare Configurations

Compare local configuration against deployed stack structure (values excluded for security).

### Usage
```bash
docker dso diff [stack-name]
```

### Examples

Compare default stack:
```bash
docker dso diff
```

Compare specific stack:
```bash
docker dso diff my-production-stack
```

### Output
```
Stack: default

Changes:
  + Services:
    + api (newly added)
    - cache (removed)
    ~ db (modified)

  ~ db service:
    Image changed: postgres:13 → postgres:14
    Replicas changed: 1 → 2
    New secret: database.ssl_cert
    New mount: /certs:ro

  ~ api service:
    Image changed: myapp:v1.0 → myapp:v1.1
    New environment: LOG_LEVEL=debug
    Removed environment: DEBUG=false

No changes:
  api.key (unchanged)
  database.password (unchanged)
```

---

## `env import` — Bulk Import Secrets

Bulk-import secrets from a `.env` file into the vault (Local Mode).

### Usage
```bash
docker dso env import <file> [project]
```

### Examples

Import into default project:
```bash
docker dso env import .env.local
```

Import into specific project:
```bash
docker dso env import .env.prod myapp
```

### Input File Format
```env
# Comments are ignored
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secretpass

API_KEY=sk-1234567890abcdef
API_SECRET=secret-value-here

# Empty lines are ignored

REDIS_URL=redis://localhost:6379
```

### Output
```
[INFO] Importing secrets from .env.local...
[OK] Successfully imported 8 secrets

Imported secrets:
  ✓ db_host
  ✓ db_port
  ✓ db_user
  ✓ db_password
  ✓ api_key
  ✓ api_secret
  ✓ redis_url
  ✓ app_name

Project: myapp
Storage: ~/.dso/vault.enc
Total secrets: 28 (8 new)
```

---

## `version` — Display Version

Display DSO binary version number and build information.

### Usage
```bash
docker dso version
```

### Examples

Show version:
```bash
docker dso version
```

### Output
```
Docker Secret Operator (DSO) v1.2.0

Build Information:
  Commit: a3f4b2c1d5e6f7g8h9i0
  Build Date: 2026-04-15T10:30:00Z
  Go Version: go1.21.0
  Platform: linux/amd64

Licensed under Apache 2.0
```

---

## Workflow Examples

### Daily Monitoring
```bash
# Check current logs
docker dso logs --since 24h --level warn,error

# Monitor for changes
docker dso watch &

# Check system health
docker dso system doctor

# Verify all secrets present
docker dso fetch | head -20
```

### Secret Rotation Verification
```bash
# Start monitoring
docker dso watch --debug &

# Rotate a secret
docker dso secret set myapp/api_key "new-key-value"

# Watch containers restart and secrets inject
# Verify with inspect
docker dso inspect myapp_api_1
```

### Configuration Migration
```bash
# Export current secrets
docker dso export --format json --output backup.json

# Validate new config
docker dso validate --config dso.new.yaml

# Compare changes
docker dso diff

# Import to new provider
docker dso env import backup.json myapp
```

### Debugging Issues
```bash
# Inspect failing container
docker dso inspect myapp_api_1

# Check agent logs
docker dso logs -f --level debug

# Validate configuration
docker dso validate

# Check available secrets
docker dso fetch

# Export and verify
docker dso export --format json
```

---

## Best Practices

1. **Monitor continuously in production**
   ```bash
   docker dso watch &
   docker dso logs -f
   ```

2. **Validate before deployment**
   ```bash
   docker dso validate
   docker dso diff
   ```

3. **Regular backup of secrets**
   ```bash
   docker dso export --format json --output backup-$(date +%Y%m%d).json
   ```

4. **Inspect containers after changes**
   ```bash
   docker dso compose restart api
   sleep 2
   docker dso inspect myapp_api_1
   ```

5. **Archive logs for compliance**
   ```bash
   docker dso logs --since 30d > logs-archived.txt
   ```

---

## Related Commands

- **[CLI: Up](/guide/cli-up)** - Deploy stacks
- **[CLI: Down](/guide/cli-down)** - Stop containers
- **[CLI: System](/guide/cli-system)** - System setup
- **[CLI: Secrets](/guide/cli-secret)** - Secret management
