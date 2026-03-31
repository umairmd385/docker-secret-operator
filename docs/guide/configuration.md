# dso.yaml Configuration

The `dso.yaml` file is the single configuration file that tells DSO which secrets to fetch and how to inject them.

## Full Schema

```yaml
# Provider to use: aws | azure | vault | local
provider: aws

# Provider-specific settings
region: us-east-1          # AWS only
vault_addr: ""             # Vault only
tenant_id: ""              # Azure only

# Secret definitions
secrets:
  - name: my-app/db-password    # Secret path/name in the provider
    inject: env                 # Injection mode: env | file
    as: DB_PASSWORD             # Name of the env var (for 'env' mode)

  - name: my-app/tls-cert
    inject: file                # Inject as a file mount
    path: /run/secrets/tls.crt  # Target path inside the container

# Rotation policy
rotation:
  enabled: true
  interval: 1h      # How often to check for updated secrets
  strategy: signal  # What to do on update: signal | restart | reload
```

## Injection Modes

| Mode | Description |
|------|-------------|
| `env` | Injects the secret value as an environment variable |
| `file` | Writes the secret value to a file path inside the container |

## Rotation Strategies

| Strategy | Description |
|----------|-------------|
| `signal` | Sends `SIGHUP` to the container process — ideal for apps that reload config on signal |
| `restart` | Restarts the container gracefully after updating secrets |
| `reload` | Updates the injected env var in-place with no process interruption (requires app support) |

> [!IMPORTANT]
> When using `inject: file`, ensure the target `path` is inside a volume or tmpfs mount — never a layer in the container image.
