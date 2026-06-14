import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO CLI Reference (Phase 1-6)

> **Docker Secret Operator CLI Plugin**
>
> All commands are invoked as \`docker dso <command>\`. DSO provides four phases of functionality:
> - **Quick Start** — Run \`docker dso setup\` for an interactive setup wizard (recommended)
> - **Phase 1: Bootstrap** — Initialize local or agent mode with \`docker dso bootstrap [local|agent]\` (manual alternative)
> - **Phase 2: Diagnose** — Check environment health with \`docker dso doctor\`
> - **Phase 3: Monitor** — View status and manage configuration with \`docker dso status\` and \`docker dso config\`
> - **Phase 4: Operate** — Manage systemd service with \`docker dso system\`

---

## Command Tree

\`\`\`
docker dso
├── setup                   # ★ Interactive setup wizard (recommended, Phase 1)
│   ├── --auto-detect      # Auto-detect cloud provider
│   ├── --mode [local|agent] # Specify deployment mode
│   ├── --provider <name>  # Specify cloud provider
│   └── --enable-nonroot   # Enable non-root access
├── bootstrap               # Initialize DSO runtime (Phase 1, manual alternative)
│   ├── local              # Setup local development mode (~/.dso/)
│   └── agent              # Setup production agent mode with systemd
├── doctor                 # Check environment health and connectivity (Phase 2)
│   ├── --level [default|full]  # Detail level
│   └── --json             # Machine-readable output
├── status                 # View real-time system metrics (Phase 3)
│   ├── --watch            # Auto-refresh every 2 seconds
│   └── --json             # Machine-readable output
├── config                 # Manage configuration (Phase 3)
│   ├── show               # Display current configuration
│   ├── edit               # Open configuration in \$EDITOR
│   ├── validate           # Validate configuration syntax
└── system                 # Systemd service management (Phase 4)
    ├── status             # Show service status and logs
    ├── enable             # Enable and start dso-agent service
    ├── disable            # Stop and disable service
    ├── restart            # Restart dso-agent service
    ├── setup              # Manually install provider plugins
    └── logs               # View journald logs with filtering
        ├── -f             # Follow logs in real-time
        ├── -n <lines>     # Show last N lines
        ├── -p <level>     # Filter by level (err, warning, etc)
        └── --since <time> # Show logs since time (e.g., 1h, 30m)
\`\`\`

---

## Quick Start: Interactive Setup Wizard

**Recommended for first-time users.** The setup wizard guides you through configuration with auto-detection and validation.

### Basic Usage
\`\`\`bash
docker dso setup
\`\`\`

The wizard will:
1. Auto-detect your cloud provider (AWS, Azure, Vault, Huawei, or local)
2. Suggest deployment mode (local for development or agent for production)
3. Install required provider plugins
4. Generate a pre-configured \`dso.yaml\` file
5. Show next steps

### Flags
- \`--auto-detect\` — Auto-detect cloud provider without prompting
- \`--mode local|agent\` — Skip mode selection, use specified mode
- \`--provider <name>\` — Skip provider detection, use specified provider
- \`--enable-nonroot\` — Configure non-root user access during setup

### Examples
\`\`\`bash
# Interactive setup (recommended)
docker dso setup

# Auto-detect cloud provider
docker dso setup --auto-detect

# Force local development mode
docker dso setup --mode local

# Force AWS provider
docker dso setup --provider aws

# Complete setup in one command
docker dso setup --mode agent --provider aws --enable-nonroot
\`\`\`

---

## Phase 1: Bootstrap (Manual Alternative)

Initialize DSO for local development or production deployment manually.

**Note:** Most users should use \`docker dso setup\` instead. Manual bootstrap is for advanced users who need more control.

### Local Bootstrap (Development)
\`\`\`bash
docker dso bootstrap local
\`\`\`
- Creates \`~/.dso/\` directory structure
- Generates encrypted local vault
- Creates development configuration
- No root required, non-root user only

**Success output:**
\`\`\`
✓ DSO local environment initialized
✓ Configuration: ~/.dso/dso.yaml
✓ Next steps:
  - Initialize vault: docker dso init
  - Store secrets: docker dso secret set myapp/db_password
  - Deploy: docker dso up -d
  - Verify: docker dso doctor
\`\`\`

**Note:** \`docker dso setup --mode local\` is recommended for most users as it handles initialization in one step. Use \`bootstrap\` only if you need manual control.

### Agent Bootstrap (Production)
\`\`\`bash
sudo docker dso bootstrap agent
\`\`\`
- Creates \`/etc/dso/\` and \`/var/lib/dso/\` directories
- Generates production configuration
- Creates systemd service file
- Requires root and systemd
- Does NOT start the service yet

**Success output:**
\`\`\`
✓ DSO agent initialized
✓ Configuration: /etc/dso/dso.yaml
✓ Service: /etc/systemd/system/dso-agent.service
✓ Next steps:
  - Review config: docker dso config show
  - Enable service: sudo docker dso system enable
  - Monitor: docker dso system logs -f
\`\`\`

---

## Phase 2: Doctor (Environment Diagnostics)

Check system health and provider connectivity.

### Basic Health Check
\`\`\`bash
docker dso doctor
\`\`\`

Output includes:
- Docker connectivity status
- Runtime environment validation
- Provider availability checks
- System permissions
- systemd service state (if agent mode)

### Detailed Diagnostics
\`\`\`bash
docker dso doctor --level full
\`\`\`

Includes:
- All basic checks
- Provider connection details
- Container health status
- Cache effectiveness
- System resource usage

### Machine-Readable Output
\`\`\`bash
docker dso doctor --json
\`\`\`

Returns JSON with all diagnostic data for integration with monitoring systems.

---

## Phase 3: Status (Real-Time Monitoring)

View current system metrics and state.

### Current Status
\`\`\`bash
docker dso status
\`\`\`

Shows:
- Runtime information and uptime
- Provider health status
- Container information
- Cache hit rates and size
- Rotation statistics
- System metrics

### Live Monitoring
\`\`\`bash
docker dso status --watch
\`\`\`

Auto-refreshes every 2 seconds. Press Ctrl+C to exit.

### Machine-Readable Status
\`\`\`bash
docker dso status --json
\`\`\`

Returns structured JSON for scripting and monitoring integration.

---

## Phase 3: Config (Configuration Management)

View, edit, and validate configuration.

### Show Configuration
\`\`\`bash
docker dso config show
\`\`\`

Displays current configuration from:
1. \`/etc/dso/dso.yaml\` (agent mode)
2. \`~/.dso/config.yaml\` (local mode)
3. \`./dso.yaml\` (current directory)

### Edit Configuration
\`\`\`bash
docker dso config edit
\`\`\`

Opens configuration in \`\$EDITOR\`. After saving:
- Validates YAML syntax
- Confirms changes are valid
- Suggests next steps (usually \`docker dso system restart\`)

**Typical workflow:**
\`\`\`bash
docker dso config edit
# Make changes, save and exit
docker dso config validate    # Verify syntax
sudo docker dso system restart # Apply changes
\`\`\`

### Validate Configuration
\`\`\`bash
docker dso config validate
\`\`\`

Checks:
- YAML syntax validity
- Required fields present
- Version compatibility
- Provider configuration
- Size format validity (100Mi, 1Gi, 500MB, etc)

Exit code 0 = valid, non-zero = errors with details.

---

## Phase 4: System (Systemd Service Management)

Manage the dso-agent systemd service (agent mode only).

### Service Status
\`\`\`bash
docker dso system status
\`\`\`

Shows:
- Service running/stopped state
- Enabled/disabled state
- Recent log lines
- Last activity timestamp

### Enable Service
\`\`\`bash
sudo docker dso system enable
\`\`\`

Enables and starts the dso-agent service:
\`\`\`
sudo systemctl enable dso-agent
sudo systemctl start dso-agent
\`\`\`

### Disable Service
\`\`\`bash
sudo docker dso system disable
\`\`\`

Stops and disables the service:
\`\`\`
sudo systemctl disable dso-agent
sudo systemctl stop dso-agent
\`\`\`

### Restart Service
\`\`\`bash
sudo docker dso system restart
\`\`\`

Restarts the service. Use after:
- Configuration changes
- Plugin updates
- Recovery from errors

### View Logs
\`\`\`bash
docker dso system logs
\`\`\`

Shows last 20 lines from journald.

**Common log filters:**
\`\`\`bash
docker dso system logs -f                    # Follow in real-time
docker dso system logs -n 100                # Last 100 lines
docker dso system logs -p err                # Errors only
docker dso system logs -p warning            # Warnings and errors
docker dso system logs --since 1h            # Last hour
docker dso system logs --since 1h -p err     # Errors in last hour
\`\`\`

---

## Global Flags

Available on all commands:

| Flag | Short | Default | Description |
|---|---|---|---|
| \`--help\` | \`-h\` | - | Show help for command |
| \`--version\` | \`-v\` | - | Show version information |

| Variable | Description |
|---|---|
| \`DSO_MODE\` | Force execution mode: \`cloud\` or \`local\` |
| \`DSO_FORCE_MODE\` | Alias for \`DSO_MODE\` |
| \`DSO_SOCKET_PATH\` | Override the agent Unix socket path (default: \`/var/run/dso.sock\`) |
| \`DSO_PLUGIN_DIR\` | Override the provider plugin directory (default: \`/usr/local/lib/dso/plugins\`) |

---

## Mode Detection

\`docker dso up\` and \`docker dso compose\` auto-detect mode using this priority:

1. \`--mode=<cloud|local>\` flag
2. \`DSO_MODE\` or \`DSO_FORCE_MODE\` env var
3. \`/etc/dso/dso.yaml\` exists → **Cloud**
4. \`./dso.yaml\` exists → **Cloud**
5. \`~/.dso/vault.enc\` exists → **Local**
6. No config found → guided error with setup instructions

If both a vault and cloud config are found, **Cloud wins** with a conflict warning.

---

## Core Commands

---

### \`docker dso up\`

**Deploy a Docker Compose stack with automatic secret injection.**

This is the primary DSO entrypoint. It detects mode, validates configuration, connects to or verifies the agent, injects secrets, and launches your stack.

#### Usage

\`\`\`bash
docker dso up [flags] [docker compose args...]
\`\`\`

#### Flags (DSO-specific)

| Flag | Description |
|---|---|
| \`--mode=<cloud\|local>\` | Force a specific execution mode |
| \`--debug\` | Enable verbose debug output |
| \`--dry-run\` | Parse and resolve secrets without actually starting containers |
| \`-f <file>\`, \`--file=<file>\` | Specify the docker-compose file (default: auto-detected) |
| \`-c <path>\`, \`--config=<path>\` | Specify the dso.yaml config path |

All other flags are passed directly to \`docker compose up\`.

#### Mode Behavior

| Condition | Mode | What Happens |
|---|---|---|
| \`/etc/dso/dso.yaml\` present | Cloud | Connects to systemd agent via \`/var/run/dso.sock\` |
| \`./dso.yaml\` present | Cloud | Same as above |
| \`~/.dso/vault.enc\` present | Local | Resolves secrets from encrypted vault in-process |
| Both vault + cloud config | Cloud | Warns user, defaults to Cloud |
| No config at all | — | Exits with guided setup message |

#### Examples

\`\`\`bash
# Auto-detect mode, use docker-compose.yml in current directory
docker dso up

# Cloud mode, detached
docker dso up -d

# Force local mode explicitly
docker dso up --mode=local

# Use a specific compose file
docker dso up -f my-stack.yml

# Dry run (resolve secrets, don't start containers)
docker dso up --dry-run
\`\`\`

#### Cloud Mode Output

\`\`\`
[DSO] Running in CLOUD mode (auto-detected (/etc/dso/dso.yaml))
[DSO] Using provider config: /etc/dso/dso.yaml
[DSO] ⚠️  Secrets will be fetched from external providers
\`\`\`

#### Requirements

| | Cloud Mode | Local Mode |
|---|---|---|
| Requires root | Socket access required (auto-checked) | No |
| Requires config | \`/etc/dso/dso.yaml\` or \`./dso.yaml\` | \`~/.dso/vault.enc\` |
| Requires agent | Yes (systemd \`dso-agent\`) | No |

---

### \`docker dso down\`

**Stop and remove containers, networks, images, and volumes.**

A thin, security-hardened wrapper around \`docker compose down\`. Rejects shell-injection characters in arguments.

#### Usage

\`\`\`bash
docker dso down [docker compose down flags...]
\`\`\`

#### Examples

\`\`\`bash
# Stop and remove containers
docker dso down

# Remove containers and volumes
docker dso down -v

# Remove containers, images, and volumes
docker dso down --rmi all -v
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ✅ Yes | No | No |

---

### \`docker dso init\`

**Initialize the DSO Native Vault (Local Mode setup).**

Creates the encrypted vault file at \`~/.dso/vault.enc\`. This is the first step to use Local Mode. Must be run as a regular user — never as root.

#### Usage

\`\`\`bash
docker dso init
\`\`\`

#### Examples

\`\`\`bash
docker dso init
# ✅ DSO Native Vault initialized successfully.
# Next step: docker dso secret set <project>/<path>
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ❌ No | ✅ Yes (sets up Local) | ❌ Must NOT be root | No |

---

### \`docker dso compose\`

**Secret-injecting wrapper for \`docker compose\` subcommands.**

Fetches secrets from the running DSO agent and merges them into the process environment before exec-ing \`docker compose\`. Supported subcommands: \`up\`, \`down\`, \`ps\`, \`logs\`, \`stop\`, \`restart\`, \`pull\`.

#### Usage

\`\`\`bash
docker dso compose <subcommand> [args...]
\`\`\`

#### Examples

\`\`\`bash
# Bring up stack with injected secrets
docker dso compose up -d

# Check stack status
docker dso compose ps

# View logs
docker dso compose logs -f
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No (agent-dependent) | No | Yes (\`dso.yaml\`) |

> **Note:** This command requires the agent to be running. Use \`docker dso up\` for Local Mode deployments.

---

## Secret Management (Local Mode)

---

### \`docker dso secret set\`

**Store a secret securely in the Local Vault.**

Accepts input interactively (hidden terminal prompt) or via stdin pipe. Vault must be initialized first with \`docker dso init\`.

#### Usage

\`\`\`bash
docker dso secret set <project>/<path>
\`\`\`

Key format: \`<project>/<path>\`
- If no \`/\` is provided, project defaults to \`global\`.
- Path cannot contain \`..\` (directory traversal blocked).
- Max secret size: **1MB**.

#### Examples

\`\`\`bash
# Interactive (hidden input prompt)
docker dso secret set myapp/db_password

# Pipe from stdin
echo "s3cr3t" | docker dso secret set myapp/db_password

# Global namespace (no project prefix)
docker dso secret set api_key
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ❌ No | ✅ Yes | No | No (vault must exist) |

---

### \`docker dso secret get\`

**Retrieve a secret from the Local Vault.**

Prints the raw secret value to stdout. No trailing newline by default (for safe piping).

#### Usage

\`\`\`bash
docker dso secret get <project>/<path> [flags]
\`\`\`

#### Flags

| Flag | Short | Default | Description |
|---|---|---|---|
| \`--newline\` | \`-n\` | \`false\` | Append a newline character to the output |

#### Examples

\`\`\`bash
# Print secret (no trailing newline)
docker dso secret get myapp/db_password

# Print with trailing newline
docker dso secret get myapp/db_password -n

# Capture in a variable
MY_SECRET=\$(docker dso secret get myapp/db_password)
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ❌ No | ✅ Yes | No | No (vault must exist) |

---

### \`docker dso secret list\`

**List all secret paths stored in the Local Vault.**

Lists paths within a project namespace. Does not expose values.

#### Usage

\`\`\`bash
docker dso secret list [project]
\`\`\`

If \`project\` is omitted, defaults to \`global\`.

#### Examples

\`\`\`bash
# List all global secrets
docker dso secret list

# List secrets for a specific project
docker dso secret list myapp
\`\`\`

#### Output

\`\`\`
Secrets in project 'myapp':
  - myapp/db_password
  - myapp/api_key
  - myapp/redis_url
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ❌ No | ✅ Yes | No | No (vault must exist) |

---

### \`docker dso env import\`

**Bulk-import secrets from a \`.env\` file into the Local Vault.**

Parses standard \`KEY=VALUE\` format. Strips surrounding quotes. Skips empty lines and \`#\` comments. Warns on duplicate keys (last value wins). Warns on malformed lines. Max per-line value: 1MB.

#### Usage

\`\`\`bash
docker dso env import <file> [project]
\`\`\`

If \`project\` is omitted, secrets are stored under \`global\`.

#### Examples

\`\`\`bash
# Import into global namespace
docker dso env import .env.production

# Import into a named project
docker dso env import .env.staging myapp

# After importing, delete the plaintext file securely
shred -u .env.production
\`\`\`

#### Output

\`\`\`
✅ Successfully imported 12 secrets to project 'myapp'.
⚠️  WARNING: Plaintext '.env.production' still exists on disk. Delete it securely when done.
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ❌ No | ✅ Yes | No | No (vault must exist) |

---

## Cloud Diagnostics & Operations

---

### \`docker dso fetch\`

**Manually fetch and display a secret from the running agent.**

Connects to the agent via Unix socket, resolves a named secret from \`dso.yaml\`, and prints its key-value pairs. Without an argument, lists all secrets defined in the config.

#### Usage

\`\`\`bash
docker dso fetch [secret-name]
\`\`\`

#### Examples

\`\`\`bash
# List all secrets defined in dso.yaml
docker dso fetch

# Fetch a specific named secret
docker dso fetch db_credentials
\`\`\`

#### Output

\`\`\`
Secret: db_credentials
  DB_HOST: prod-db.example.com
  DB_PASS: ********
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No | No | Yes (\`dso.yaml\`, agent must run) |

---

### \`docker dso export\`

**Export resolved secrets to a local file for CI/testing.**

Connects to the agent, fetches all secrets, and writes them to a file in \`.env\` format. Emits a warning to gitignore the output file.

#### Usage

\`\`\`bash
docker dso export [flags]
\`\`\`

#### Flags

| Flag | Short | Default | Description |
|---|---|---|---|
| \`--format\` | \`-f\` | \`env\` | Output format (\`env\`) |
| \`--output\` | \`-o\` | \`.env.local\` | Output file path |

#### Examples

\`\`\`bash
# Export to .env.local (default)
docker dso export

# Export to a custom path
docker dso export -o /tmp/ci-secrets.env

# Use in CI pipelines
docker dso export -o .env.ci && docker compose --env-file .env.ci up
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No | No | Yes (agent must run) |

> ⚠️ **Security:** Exported files contain plaintext secrets. Always add them to \`.gitignore\` and delete them after use.

---

### \`docker dso inspect\`

**Inspect the environment variables and secret mounts of a running container.**

Uses the Docker API to inspect a container's environment. Automatically masks values of variables with sensitive-sounding names (containing: \`pass\`, \`secret\`, \`key\`, \`token\`, \`auth\`, \`cred\`).

#### Usage

\`\`\`bash
docker dso inspect <container-id>
\`\`\`

#### Examples

\`\`\`bash
# Inspect by container ID
docker dso inspect a3f9b2c1d4e5

# Inspect by container name
docker dso inspect my-app-container
\`\`\`

#### Output

\`\`\`
Container Environment Variables for /my-app (a3f9b2c1d4):
  DB_HOST=prod-db.example.com
  DB_PASSWORD=******** (Masked)
  NODE_ENV=production

Mounted Secret Files (/run/secrets):
  Mount: /var/run/dso/secrets -> /run/secrets
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ✅ Yes | No | No |

---

### \`docker dso watch\`

**Real-time monitor of secret rotations and Docker container lifecycle events.**

Subscribes to the Docker event stream and periodically polls the agent for DSO-specific rotation events. Displays both streams in a unified colourised view.

#### Usage

\`\`\`bash
docker dso watch [flags]
\`\`\`

#### Flags

| Flag | Short | Default | Description |
|---|---|---|---|
| \`--debug\` | \`-d\` | \`false\` | Enable raw event payload output |
| \`--strategy\` | — | \`auto\` | Rotation strategy label: \`auto\`, \`rolling\`, \`restart\` |

#### Examples

\`\`\`bash
# Start monitoring
docker dso watch

# Enable raw payload debugging
docker dso watch --debug

# Filter to a specific rotation strategy
docker dso watch --strategy rolling
\`\`\`

#### Output

\`\`\`
DSO Watcher Active (Strategy: auto) - Monitoring live container events...
-----------------------------------------------------------------------------------
[DSO ROTATION] [14:22:01] Secret 'db_password' rotated for container my-app
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ✅ Yes | No | No |

---

### \`docker dso logs\`

**View logs from the DSO Agent service.**

Reads from \`journald\` if available on the system, with automatic fallback to the agent REST API. Supports log level filtering, time windows, and live following.

#### Usage

\`\`\`bash
docker dso logs [flags]
\`\`\`

#### Flags

| Flag | Short | Default | Description |
|---|---|---|---|
| \`--follow\` | \`-f\` | \`false\` | Follow log output in real-time |
| \`--tail\` | \`-n\` | \`100\` | Number of lines to show from end |
| \`--since\` | — | — | Show logs since timestamp/duration (e.g. \`"10 minutes ago"\`, \`"2026-04-07 10:00:00"\`) |
| \`--level\` | — | — | Filter by level: \`debug\`, \`info\`, \`warn\`, \`error\`, \`fatal\` |
| \`--api\` | — | \`false\` | Use the agent REST API instead of journald |
| \`--api-addr\` | — | \`http://localhost:8471\` | Agent REST API address (when \`--api\` is used) |

#### Examples

\`\`\`bash
# Show last 100 lines
docker dso logs

# Follow live output
docker dso logs -f

# Show last 50 lines
docker dso logs -n 50

# Filter errors only
docker dso logs --level error

# Logs from last 10 minutes
docker dso logs --since "10 minutes ago"

# Use REST API (non-systemd systems)
docker dso logs --api

# Combine: follow errors from REST API
docker dso logs --api -f --level error
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No | No (sudo for full journal) | No |

> **Tip:** If \`journalctl\` requires elevated permissions, run \`sudo docker dso logs\`, or use \`--api\` as an alternative.

---

### \`docker dso validate\`

**Validate the DSO configuration file.**

Loads and parses the resolved \`dso.yaml\`. Exits \`0\` on success, \`1\` on parse/schema failure.

#### Usage

\`\`\`bash
docker dso validate [--config <path>]
\`\`\`

#### Examples

\`\`\`bash
# Validate the auto-resolved config
docker dso validate

# Validate a specific file
docker dso validate --config /etc/dso/dso.yaml

# Use in CI
docker dso validate || exit 1
\`\`\`

#### Output

\`\`\`bash
✅ Configuration /etc/dso/dso.yaml is valid.
# or
❌ Validation failed for /etc/dso/dso.yaml: unknown provider 'vault2'
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No | No | Yes (\`dso.yaml\`) |

---

### \`docker dso diff\`

**Show structural differences between local configuration and the deployed stack.**

Compares provider mapping keys from \`dso.yaml\` against the deployed stack state. Does **not** compare or expose secret values (by design).

#### Usage

\`\`\`bash
docker dso diff [stack-name]
\`\`\`

If \`stack-name\` is omitted, defaults to \`default\`.

#### Examples

\`\`\`bash
# Diff the default stack
docker dso diff

# Diff a named stack
docker dso diff my-production-stack
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ❌ No | No | Yes (\`dso.yaml\`) |

---

## System Commands

---

### \`docker dso system setup\`

**Install and activate Cloud Mode infrastructure.**

Downloads provider plugin binaries from GitHub Releases, validates SHA256 checksums, installs them to \`/usr/local/lib/dso/plugins/\`, writes the systemd service unit, enables, and starts the \`dso-agent\` service. After completion, verifies the service is \`active\` via \`systemctl is-active\`.

**Must be run as root (\`sudo\`).**
**Linux only** (systemd required).

#### Usage

\`\`\`bash
sudo docker dso system setup
\`\`\`

#### What It Does

1. Creates \`/etc/dso/\` config directory
2. Writes \`/etc/systemd/system/dso-agent.service\`
3. Downloads plugin tarball from GitHub Releases matching current binary version
4. Validates SHA256 checksum
5. Extracts plugins to \`/usr/local/lib/dso/plugins/\`
6. Runs \`--version\` on each plugin binary to confirm executability
7. Runs \`systemctl daemon-reload && enable && restart\`
8. Confirms \`systemctl is-active dso-agent\`
9. Performs atomic rollback on any failure

#### Examples

\`\`\`bash
# Initial Cloud Mode setup
sudo docker dso system setup

# After setup, run your stack
docker dso up
\`\`\`

#### Output

\`\`\`
[DSO] Starting Cloud Mode setup...
[DSO] Creating /etc/dso...
[DSO] Writing systemd service to /etc/systemd/system/dso-agent.service...
[DSO] Downloading plugin tarball from https://github.com/.../dso-plugins-linux-amd64-latest.tar.gz...
[DSO] Validating plugin integrity (SHA256)...
[DSO] Extracting plugins to /usr/local/lib/dso/plugins/...
[DSO] Plugins verified: aws, azure, vault, huawei
[DSO] Running: systemctl daemon-reload
[DSO] Running: systemctl enable dso-agent
[DSO] Running: systemctl restart dso-agent
[DSO] Verifying dso-agent service status...

[DSO] ✅ Cloud mode configured successfully.
       Agent:   running (dso-agent.service)
       Plugins: installed to /usr/local/lib/dso/plugins
       Monitor: journalctl -u dso-agent -f
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Sets up Cloud | ❌ No | ✅ Yes (\`sudo\`) | No |

> **Note:** Cannot install if \`version = "dev"\` (local builds). Use a release binary.

---

### \`docker dso system doctor\`

**Diagnose the DSO installation and runtime environment (read-only).**

Checks the binary, effective UID, mode detection, config file, vault file, systemd service status, and all provider plugin paths + executability. Produces a tabular report.

#### Usage

\`\`\`bash
docker dso system doctor
\`\`\`

#### Examples

\`\`\`bash
# Run diagnostics
docker dso system doctor

# Use as a post-install check
sudo docker dso system setup && docker dso system doctor
\`\`\`

#### Output

\`\`\`
DSO System Diagnostics — latest
════════════════════════════════════════════════════════════════════
Component         Status     Detail
────────────────────────────────────────────────────────────────────
Binary            OK         /usr/local/lib/docker/cli-plugins/docker-dso (latest)
Effective UID     0 (root)
Detected Mode     CLOUD      Reason: auto-detected (/etc/dso/dso.yaml)
Config            OK         /etc/dso/dso.yaml
Vault             NOT FOUND  /home/user/.dso/vault.enc
Systemd Service   OK         File: /etc/systemd/system/dso-agent.service | Runtime: active
Plugin: aws       OK         /usr/local/lib/dso/plugins/dso-provider-aws (version: latest)
Plugin: azure     OK         /usr/local/lib/dso/plugins/dso-provider-azure (version: latest)
Plugin: vault     OK         /usr/local/lib/dso/plugins/dso-provider-vault (version: latest)
Plugin: huawei    OK         /usr/local/lib/dso/plugins/dso-provider-huawei (version: latest)
════════════════════════════════════════════════════════════════════
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ✅ Yes | No | No |

---

### \`docker dso version\`

**Print the DSO binary version.**

#### Usage

\`\`\`bash
docker dso version
\`\`\`

#### Output

\`\`\`
Docker Secret Operator (DSO) latest
\`\`\`

---

## Utility Commands

---

### \`docker dso completion\`

**Generate shell completion script for bash, zsh, fish, or powershell.**

Enables tab-completion support for your shell. After installing the completion script, you can tab-complete DSO subcommands and flags.

#### Usage

\`\`\`bash
docker dso completion <shell>
\`\`\`

Supported shells: \`bash\`, \`zsh\`, \`fish\`, \`powershell\`

#### Installation

**Bash:**
\`\`\`bash
docker dso completion bash | sudo tee /etc/bash_completion.d/dso
# Then reload: source ~/.bashrc
\`\`\`

**Zsh:**
\`\`\`bash
docker dso completion zsh | sudo tee /usr/share/zsh/site-functions/_dso
# Then reload: exec zsh
\`\`\`

**Fish:**
\`\`\`bash
docker dso completion fish | sudo tee /usr/share/fish/vendor_completions.d/dso.fish
# Then reload: exec fish
\`\`\`

**PowerShell:**
\`\`\`powershell
docker dso completion powershell | Out-String | Invoke-Expression
# Make permanent by adding to your PowerShell profile:
docker dso completion powershell >> \$PROFILE
\`\`\`

#### Examples

\`\`\`bash
# Generate bash completion script
docker dso completion bash

# Install for current user (bash)
docker dso completion bash >> ~/.bash_completion

# Install for current user (zsh)
docker dso completion zsh >> ~/.zshrc
\`\`\`

#### Mode Compatibility

| Cloud Mode | Local Mode | Requires Root | Requires Config |
|---|---|---|---|
| ✅ Yes | ✅ Yes | No | No |

---

## Hidden / Internal Commands

These commands are not shown in \`--help\` output.

### \`docker dso legacy-agent\`

**Run the DSO background reconciliation engine directly (Cloud Mode daemon).**

This is the process that the \`dso-agent\` systemd service executes. Not intended for direct user invocation — use \`docker dso system setup\` instead.

#### Flags

| Flag | Default | Description |
|---|---|---|
| \`--socket\` | \`/var/run/dso.sock\` | IPC socket path |
| \`--driver-socket\` | \`/run/docker/plugins/dso.sock\` | Docker V2 plugin socket |
| \`--api-addr\` | \`:8471\` | REST API address for health/monitoring |

---

### \`docker dso docker-cli-plugin-metadata\`

**Return Docker CLI plugin metadata (internal use).**

Used by the Docker CLI to discover and register the plugin. Hidden from users.

---

## Stub Commands (Not Yet Implemented)

The following commands exist in the CLI tree and are registered, but return \`not yet implemented\`. Do not use in production.

| Command | Description |
|---|---|
| \`docker dso apply\` | Apply a DSO configuration file |
| \`docker dso inject\` | Inject secrets directly into a specific running container |
| \`docker dso sync\` | Synchronize secrets manually against cloud providers |

---

## Workflow Examples

### Fresh User — Local Mode

\`\`\`bash
# 1. Install DSO
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash

# 2. Initialize vault
docker dso init

# 3. Store secrets
docker dso secret set myapp/db_password
docker dso secret set myapp/api_key

# 4. Or import from an existing .env file
docker dso env import .env myapp

# 5. Deploy
docker dso up
\`\`\`

### Cloud Mode Setup

\`\`\`bash
# 1. Install DSO globally
curl -fsSL ... | sudo bash

# 2. Configure Cloud Mode
sudo docker dso system setup

# 3. Create /etc/dso/dso.yaml (with your provider config)
# 4. Deploy
docker dso up

# 5. Monitor
docker dso logs -f
docker dso watch
\`\`\`

### Troubleshooting

\`\`\`bash
# Verify everything is installed and running
docker dso system doctor

# Validate your config file
docker dso validate

# Check agent logs
docker dso logs --level error

# Inspect a running container's secrets
docker dso inspect <container-id>
\`\`\`

---

## Cross-References

- **Getting Started**: See [\`README.md\`](../README.md)
- **Cloud Setup**: See [System Setup](#docker-dso-system-setup)
- **Local Vault**: See [\`docker dso init\`](#docker-dso-init) → [\`docker dso secret set\`](#docker-dso-secret-set)
- **Troubleshooting**: Run [\`docker dso system doctor\`](#docker-dso-system-doctor)
- **Config Format**: See [\`docs/docker-compose.md\`](docker-compose.md)
- **Architecture**: See [\`ARCHITECTURE.md\`](architecture.md)
`;

export const metadata: Metadata = {
  title: "DSO CLI Reference (Phase 1-6)",
  description: "Documentation for DSO CLI Reference (Phase 1-6)",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
