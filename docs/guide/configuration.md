# dso.yaml Reference

`dso.yaml` is the single configuration file that controls everything DSO does — which provider to connect to, which secrets to fetch, how to inject them, and how to handle rotation.

DSO looks for this file in the following order:
1. Path specified via `--config` flag
2. `./dso.yaml` (current directory)
3. `/etc/dso/dso.yaml` (system-wide)

## Full Schema

```yaml
# ── Provider ────────────────────────────────────────────────
provider: aws                  # Required: aws | azure | vault | huawei

config:                        # Provider-specific configuration
  region: us-east-1            # AWS: region
  # vault_url: "https://..."   # Azure: vault URL
  # vault_addr: "http://..."   # Vault: server address
  # vault_mount: "secret"      # Vault: KV mount path

# ── Agent ────────────────────────────────────────────────────
agent:
  cache: true                  # Cache secrets in memory
  refresh_interval: 5m         # How often to refresh cached secrets
  auto_sync: true              # Automatically sync on container events

  watch:
    mode: polling              # polling | event | hybrid
    polling_interval: 5m       # How often to poll the provider

  webhook:
    enabled: false             # Enable webhook endpoint for push-based events
    auth_token: ""             # Token for validating incoming webhook calls

  rotation:
    strategy: rolling          # rolling | restart (default strategy)
    health_check_timeout: 30s  # Time to wait for healthcheck after rolling update
    max_parallel: 2            # Max containers to rotate simultaneously

  restart_strategy:
    type: rolling              # rolling | restart
    grace_period: 10s          # Time to wait before force-stopping old container

# ── Secrets ──────────────────────────────────────────────────
secrets:
  - name: myapp/db-credentials # Secret path/name in the provider
    inject: env                # env | file (file is experimental)
    rotation: true             # Enable watcher for this secret (default: false)

    reload_strategy:
      type: signal             # signal | restart | none

    mappings:                  # Map provider key → container env var name
      DB_PASSWORD: DB_PASSWORD
      DB_USER: DB_USER

  - name: myapp/tls-cert       # Example: file injection
    inject: file               # experimental
    path: /run/secrets/tls.crt # Target path inside the container
```

## Field Reference

### `provider`

| Value | Backend |
|-------|---------|
| `aws` | AWS Secrets Manager |
| `azure` | Azure Key Vault |
| `vault` | HashiCorp Vault (KV v2) |
| `huawei` | Huawei Cloud CSMS |

### `config`

Provider-specific settings passed to the provider plugin. See each [provider's guide](/guide/providers/aws) for the full list.

### `agent.watch.mode`

| Mode | Behavior |
|------|----------|
| `polling` | Checks the provider API on a fixed interval |
| `event` | Waits for a webhook `POST /api/events/secret-update` |
| `hybrid` | Polling as safety net + webhooks for instant updates |

### `secrets[].inject`

| Mode | Behavior |
|------|----------|
| `env` | Injects secret values as container environment variables |
| `file` | Writes secret values to a file path inside the container *(experimental)* |

### `secrets[].reload_strategy.type`

| Type | What It Does |
|------|-------------|
| `signal` | Sends `SIGHUP` to the container's PID 1 |
| `restart` | Stops and restarts the container with updated environment |
| `none` | Updates the in-memory cache but does not affect running containers |

### `secrets[].mappings`

Maps the **provider's key name** to the **container's environment variable name**:

```yaml
mappings:
  DB_PASSWORD: DB_PASSWORD    # provider_key: container_env_var
  DB_USER: DATABASE_username  # keys can be renamed
```

> [!NOTE]
> **Azure Key Vault** stores secrets as plain strings (not JSON). DSO wraps them internally as `{"value": "<string>"}`, so the mapping key for any Azure secret is always `value`.
> ```yaml
> mappings:
>   value: DB_PASSWORD   # Azure: always use 'value' as the source key
> ```

## Examples

### Minimal AWS Config

```yaml
provider: aws
config:
  region: us-east-1
secrets:
  - name: production-db
    inject: env
    mappings:
      DB_PASSWORD: DB_PASSWORD
```

### Full Production Config

```yaml
provider: aws
config:
  region: us-east-1

agent:
  cache: true
  refresh_interval: 5m
  watch:
    mode: hybrid
    polling_interval: 10m
  webhook:
    enabled: true
    auth_token: "your-webhook-token"
  rotation:
    strategy: rolling
    health_check_timeout: 45s
    max_parallel: 1
  restart_strategy:
    type: rolling
    grace_period: 20s

secrets:
  - name: arn:aws:secretsmanager:us-east-1:123456789:secret:myapp/db
    inject: env
    rotation: true
    reload_strategy:
      type: signal
    mappings:
      DB_PASSWORD: DB_PASSWORD
      DB_USER: DB_USER
      DB_HOST: DB_HOST
```
