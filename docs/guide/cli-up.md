# CLI: Up

The `up` command deploys a Docker Compose stack with automatic secret injection. It's the primary entrypoint for both **Local Mode** and **Cloud Mode** operations.

## Usage

```bash
docker dso up [flags]
```

## Description

Running `up` will:
1. **Detect Mode**: Automatically identifies whether to use Local Mode (encrypted vault) or Cloud Mode (external provider)
2. **Resolve Secrets**: Fetches secrets from the configured source
3. **Inject Secrets**: Streams secrets directly into memory-backed filesystems (`tmpfs`) — zero persistence to disk
4. **Deploy Stack**: Starts Docker Compose services with secrets available in containers

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--file` | `-f` | Path to docker-compose.yaml (default: `docker-compose.yaml`) |
| `--config` | `-c` | Path to dso.yaml (default: `dso.yaml`) |
| `--mode` | | Force mode: `local` or `cloud` |
| `--debug` | | Enable debug logging |
| `--dry-run` | | Preview changes without deploying |
| `--detach` | `-d` | Run in background |

## Examples

### Basic Deployment
```bash
docker dso up
```

### Detached Mode
```bash
docker dso up -d
```

### With Custom Compose File
```bash
docker dso up -f docker-compose.prod.yaml -d
```

### With Specific DSO Config
```bash
docker dso up -c dso.cloud.yaml
```

### Force Cloud Mode
```bash
docker dso up --mode cloud
```

### Preview Changes (Dry-Run)
```bash
docker dso up --dry-run
```

## Mechanics

### Secret Resolution Flow

```
1. Configuration Load
   └─ Load dso.yaml and docker-compose.yaml
   
2. Mode Detection
   ├─ If DSO_MODE env var set → use that
   ├─ If cloud provider config exists → Cloud Mode
   └─ Otherwise → Local Mode
   
3. Secret Fetching
   ├─ Local Mode: Read from ~/.dso/vault.enc
   └─ Cloud Mode: Contact provider API via agent
   
4. Memory-Backed Injection
   ├─ Create tmpfs mount points
   ├─ Write secrets to tmpfs
   └─ Mount into container namespaces
   
5. Compose Deployment
   └─ Execute docker compose up with injected environment
```

### Local Mode Example

```bash
# Initialize vault first
docker dso init

# Set secrets
docker dso secret set myapp/db_password "secret-value"
docker dso secret set myapp/api_key "api-key-value"

# Deploy with automatic secret injection
docker dso up -d
```

### Cloud Mode Example

```bash
# Setup cloud provider
docker dso system setup --providers aws

# Configure dso.yaml with AWS provider
# dso.yaml:
# provider: aws
# region: us-west-2
# vault: my-secrets-vault

# Deploy with automatic secret injection
docker dso up -d
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DSO_MODE` | Force mode: `local` or `cloud` |
| `DSO_SOCKET_PATH` | Socket path for agent communication |
| `DSO_CONFIG_PATH` | Default path to dso.yaml |
| `COMPOSE_FILE` | Default docker-compose file |

## Output Example

```
[INFO] Detecting DSO mode...
[INFO] Mode: local
[INFO] Loading secrets from vault...
[INFO] Found 8 secrets for project 'myapp'
[INFO] Validating dso.yaml configuration...
[OK] Configuration valid
[INFO] Preparing memory-backed filesystem...
[INFO] Injecting secrets into tmpfs...
[OK] Secrets injected (8 secrets, 2.3 KiB)
[INFO] Deploying docker-compose stack...
Creating network "myapp_default" with the default driver
Creating myapp_db_1 ... done
Creating myapp_api_1 ... done
✓ Deployment complete
```

## Best Practices

1. **Use `--dry-run` before deployment** to verify configuration
   ```bash
   docker dso up --dry-run
   ```

2. **Store compose files in version control** but keep dso.yaml flexible
   ```bash
   docker dso up -c dso.$(ENV).yaml
   ```

3. **Use named volumes for data persistence** (secrets go to tmpfs)
   ```yaml
   services:
     db:
       volumes:
         - db_data:/var/lib/postgresql/data  # Named volume
         - /dso/secrets:/run/secrets:ro      # Secret tmpfs mount
   ```

4. **Monitor logs in real-time**
   ```bash
   docker dso up -d && docker dso logs -f
   ```

## Troubleshooting

### Mode Detection Issues
```bash
# Force specific mode if detection fails
docker dso up --mode local
```

### Secret Not Found
```bash
# Verify secrets exist
docker dso secret list

# Check dso.yaml references correct projects
docker dso validate
```

### Permission Denied (Local Mode)
```bash
# Ensure vault file is readable
ls -la ~/.dso/vault.enc

# Reinitialize if needed
docker dso init --force
```

## Related Commands

- **[CLI: Down](/guide/cli-down)** - Stop deployed stack
- **[CLI: Compose](/guide/cli-compose)** - Direct compose wrapper
- **[Configuration](/guide/configuration)** - dso.yaml schema reference
