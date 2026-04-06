# Configuration Reference

The `dso.yaml` file is the central source of truth for the Docker Secret Operator. It defines the provider identity, the agent's reconciliation behavior, and the mapping of secrets to container environments.

---

## Configuration Schema

```yaml
# ── Global Provider ──────────────────────────────────────────
provider: aws                  # Options: aws | azure | vault

config:                        # Provider-specific auth/endpoint configuration
  region: us-east-1            # AWS: Region
  # vault_url: "https://..."   # Azure: Vault URL
  # vault_addr: "http://..."   # Vault: Server address

# ── Agent Orchestration ──────────────────────────────────────
agent:
  watch:
    polling_interval: 2m       # Frequency of vault synchronization
  
  rotation:
    max_parallel: 2            # Concurrent container rotations
    health_check_timeout: 45s  # Wait time for container health verification
    strategy: rolling          # Global default strategy: rolling | restart

# ── Secret Definitions ───────────────────────────────────────
secrets:
  - name: myapp/db-credentials # Path inside the provider
    inject: env                # Target: env (RAM-only)
    rotation: true             # Enable continuous reconciliation
    
    reload_strategy:           # How to update the container
      type: signal             # Options: signal | restart | none
      signal: SIGHUP           # Signal to send if type is 'signal'

    mappings:                  # Vault Key → Container Env Var
      password: DB_PASSWORD
      username: DB_USER
```

---

## Core Fields

### `provider`
Defines the external secret store DSO will communicate with.
- **`aws`**: AWS Secrets Manager.
- **`azure`**: Azure Key Vault.
- **`vault`**: HashiCorp Vault (KV v2).

### `agent.watch.polling_interval`
The frequency at which the **Watcher Engine** checks the provider for "Secret Drift." 
- Default: `2m`
- Recommendation: Use `30s` for high-security environments; `5m` for low-churn dev environments.

### `agent.rotation.strategy`
The default method used by the **Reloader Controller** to update a container.
- **`rolling`**: Creates a new container, waits for health, then removes the old one. Best for zero-downtime stateless apps.
- **`restart`**: Stops the current container and starts it again with new secrets. Required for stateful apps or apps with fixed host ports.

---

## Secret Injection & Reloading

### `secrets[].inject`
DSO currently supports one primary injection mode:
- **`env`**: Secrets are held in the agent's memory and pushed into the container's environment space. This method is the most secure as it leaves no trace on the host filesystem.

### `secrets[].reload_strategy`
Defines what happens *after* the secret has been successfully synchronized.
- **`signal`**: Sends a Linux signal (default `SIGHUP`) to the container's PID 1. Ideal for Nginx or Go-based services that reload config on signal.
- **`restart`**: Performs a standard Docker container restart.
- **`none`**: DSO updates the secret value in the agent's cache for future containers, but does not affect the currently running instance.

---

## Advanced Feature: Label-Based Overrides

While `dso.yaml` provides the global configuration, individual containers can override these settings using Docker Labels.

| Label | Description | Example |
|-------|-------------|---------|
| `dso.reloader` | Opt-in for DSO management | `true` |
| `dso.strategy` | Override rotation strategy | `rolling` |
| `dso.signal` | Specific reload signal | `SIGUSR1` |
| `dso.timeout` | Health check timeout | `60s` |

## Next Steps
- **[System Architecture](/guide/architecture)**: Understand the engines behind these fields.
- **[Security Model](/guide/security)**: How we protect the communication between agent and providers.
- **[CLI Reference](/guide/cli)**: Using the CLI to test your configuration.
