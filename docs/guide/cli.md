# CLI Reference

DSO is implemented as a native Docker CLI plugin. All interactions are performed via the `docker dso` command space.

---

## Command Overview

| Command | Purpose | Mode |
|---------|---------|------|
| `docker dso init` | Initialize encrypted local vault | Local |
| `docker dso up` | Deploy stack with secret injection | Both |
| `docker dso down` | Stop and remove containers | Both |
| `docker dso compose` | Secret-injecting compose wrapper | Both |
| `docker dso secret` | Manage vault secrets | Local |
| `docker dso env import` | Bulk-import secrets from .env file | Local |
| `docker dso fetch` | Retrieve secrets from agent | Cloud |
| `docker dso export` | Export resolved secrets to file | Both |
| `docker dso inspect` | View container environment & mounts | Both |
| `docker dso watch` | Monitor secret rotations & events | Cloud |
| `docker dso logs` | View agent logs | Cloud |
| `docker dso validate` | Verify dso.yaml configuration | Both |
| `docker dso diff` | Compare local vs deployed config | Cloud |
| `docker dso system` | Manage system state & plugins | Cloud |
| `docker dso version` | Display binary version | Both |

---

## Core Commands

### `init`
Initializes a local, AES-256-GCM encrypted vault for **Local Mode**.

```bash
docker dso init
```

**Details:**
- Creates `~/.dso/vault.enc`
- Generates local master key (not stored in plaintext)
- Sets environment to **Local Mode**

👉 **Learn more**: [CLI: Init](/guide/cli-init)

---

### `up`
Deploys a Docker Compose stack with automatic secret injection.

```bash
docker dso up -d
```

**Mechanics:**
1. **Detection**: Automatically detects Local or Cloud mode
2. **Resolution**: Fetches secrets from vault or cloud provider
3. **Injection**: Streams secrets into memory-backed filesystems (tmpfs)

👉 **Learn more**: [CLI: Up](/guide/cli-up)

---

### `down`
Stops and removes containers via compose wrapper with security hardening.

```bash
docker dso down -v    # Remove volumes
```

**Features:**
- Safe container shutdown
- Automatic secret cleanup
- Volume management options

👉 **Learn more**: [CLI: Down](/guide/cli-down)

---

### `compose`
Secret-injecting wrapper for docker compose subcommands.

```bash
docker dso compose up -d
docker dso compose ps
docker dso compose logs -f
```

**Supported subcommands**: `up`, `down`, `ps`, `logs`, `stop`, `restart`, `pull`

👉 **Learn more**: [CLI: Compose](/guide/cli-compose)

---

## Secret Management

### `secret`
Manages secrets within the local vault.

```bash
docker dso secret set <project>/<path> <value>
docker dso secret get <project>/<path>
docker dso secret list [project]
```

**Examples:**
```bash
echo "s3cr3t" | docker dso secret set myapp/db_password
docker dso secret get myapp/db_password --newline
docker dso secret list myapp
```

👉 **Learn more**: [CLI: Secrets](/guide/cli-secret)

---

### `env import`
Bulk-import secrets from a `.env` file into the vault.

```bash
docker dso env import .env.local myapp
```

**Features:**
- Parses KEY=VALUE format
- Stores under specified project namespace
- Ideal for migration from .env files

---

## Cloud Diagnostics & Management

### `fetch`
Manually retrieve secrets from the running agent or list all defined secrets.

```bash
docker dso fetch                    # List all secrets
docker dso fetch my-secret-name     # Get specific secret
```

---

### `export`
Export resolved secrets to a local file for CI/testing.

```bash
docker dso export --format env --output .env.resolved
```

**Flags:**
- `--format/-f`: Output format (env, json, yaml)
- `--output/-o`: Output file path

---

### `inspect`
View environment variables and secret mounts with automatic sensitive value masking.

```bash
docker dso inspect <container-id>
```

**Shows:**
- Environment variables (sensitive values masked)
- Secret mount locations
- Container metadata

---

### `watch`
Real-time monitor of secret rotations and Docker container lifecycle events.

```bash
docker dso watch --debug
docker dso watch --strategy rolling
```

**Flags:**
- `--debug/-d`: Enable verbose logging
- `--strategy`: Update strategy (rolling, atomic, canary)

---

### `logs`
View systemd journald or REST API agent logs with filtering.

```bash
docker dso logs --follow
docker dso logs --tail 100 --level error
docker dso logs --since "10m" --api
```

**Flags:**
- `--follow/-f`: Stream logs in real-time
- `--tail/-n`: Number of lines to show
- `--since`: Time filter (e.g., "10m", "1h")
- `--level`: Filter by level (debug, info, warn, error)
- `--api`: Show REST API logs

---

### `validate`
Verify dso.yaml configuration syntax and schema compliance.

```bash
docker dso validate
docker dso validate --config ./custom-dso.yaml
```

---

### `diff`
Compare local configuration against deployed stack structure (values excluded).

```bash
docker dso diff
docker dso diff my-stack
```

---

### `system`
Manages the DSO system state and plugins.

**Subcommands:**
- `system setup`: Install cloud-mode agent and provider plugins
- `system doctor`: Diagnose installation and runtime environment

👉 **Learn more**: [CLI: System](/guide/cli-system)

---

### `version`
Display binary version number.

```bash
docker dso version
```

---

## Global Flags

| Flag | Description |
|------|-------------|
| `--config/-c` | Path to dso.yaml (default: `dso.yaml`) |
| `--debug` | Enable debug logging |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DSO_MODE` | Force mode: `local` or `cloud` |
| `DSO_SOCKET_PATH` | Custom socket path for agent communication |
| `DSO_PLUGIN_DIR` | Custom directory for provider plugins |
| `DSO_MASTER_PASSWORD` | Master password for local vault (init) |

---

## Detailed Guides

- **[CLI: Init](/guide/cli-init)** - Initialize encrypted vault
- **[CLI: Up](/guide/cli-up)** - Deploy stacks
- **[CLI: Down](/guide/cli-down)** - Stop containers
- **[CLI: Compose](/guide/cli-compose)** - Compose wrapper usage
- **[CLI: Secrets](/guide/cli-secret)** - Manage vault secrets
- **[CLI: Management](/guide/cli-management)** - Diagnostics & monitoring
- **[CLI: System](/guide/cli-system)** - System setup & diagnostics

---

## Next Steps
- **[System Architecture](/guide/architecture)**: Learn how the Dual-Mode engine works.
- **[Installation](/guide/installation)**: How to set up DSO for your platform.
- **[Configuration Reference](/guide/configuration)**: Detailed `dso.yaml` schema.
