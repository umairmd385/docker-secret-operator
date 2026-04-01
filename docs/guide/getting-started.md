# Getting Started

This guide gets you from zero to injecting real cloud secrets into Docker containers in under 10 minutes.

## Prerequisites

- **Docker Engine:** Version 20.10 or higher with Docker Compose V2
- **Operating Systems:** Linux, macOS, or Windows (via WSL2)
- **Cloud Provider:** One of:
  - An AWS account with Secrets Manager enabled
  - An Azure Key Vault
  - A running HashiCorp Vault instance
- **Host Tools:** `curl` and `sudo` access (if using the alternative installer)

## Step 1 — Install DSO

### Recommended Installation

The easiest and safest way to use DSO is as a native Docker plugin.

```bash
docker plugin install umairmd385/docker-secret-operator:latest --alias dso
```

### Alternative Installation (Script)

If you prefer to run the agent directly on the host as a systemd service (good for edge routers or standalone VMs):

```bash
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/install.sh | sudo bash
```

Both methods make `docker dso` a first-class Docker subcommand.

**Verify the installation:**

```bash
docker dso version
```

You should see the DSO command version printed.

## Step 2 — Create Your Secret in the Cloud

### AWS (Secrets Manager)

```bash
aws secretsmanager create-secret \
  --name "myapp/db" \
  --secret-string '{"DB_PASSWORD":"supersecret","DB_USER":"myapp"}'
```

### Azure (Key Vault)

```bash
az keyvault secret set --vault-name my-vault --name DB-PASSWORD --value "supersecret"
az keyvault secret set --vault-name my-vault --name DB-USER --value "myapp"
```

### HashiCorp Vault

```bash
vault kv put secret/myapp/db DB_PASSWORD=supersecret DB_USER=myapp
```

## Step 3 — Configure `dso.yaml`

Create `dso.yaml` in your project directory (or at `/etc/dso/dso.yaml` for system-wide use):

::: code-group

```yaml [AWS]
provider: aws
config:
  region: us-east-1

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m

secrets:
  - name: myapp/db           # Secret ARN or name in Secrets Manager
    inject: env
    rotation: true
    reload_strategy:
      type: signal           # Send SIGHUP to reload, or use 'restart'
    mappings:
      DB_PASSWORD: DB_PASSWORD
      DB_USER: DB_USER
```

```yaml [Azure]
provider: azure
config:
  vault_url: "https://my-vault.vault.azure.net/"

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m

secrets:
  - name: DB-PASSWORD        # Azure secret names are hyphenated
    inject: env
    mappings:
      value: DB_PASSWORD     # Azure secrets use 'value' as the key

  - name: DB-USER
    inject: env
    mappings:
      value: DB_USER
```

```yaml [Vault]
provider: vault
config:
  vault_addr: "http://vault.example.com:8200"
  vault_mount: "secret"

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m

secrets:
  - name: myapp/db           # Path within the KV mount
    inject: env
    rotation: true
    mappings:
      DB_PASSWORD: DB_PASSWORD
      DB_USER: DB_USER
```

:::

## Step 4 — Write Your `docker-compose.yml`

Declare environment variable names without values — DSO fills them in:

```yaml
services:
  app:
    image: my-app:latest
    environment:
      - DB_PASSWORD    # ← DSO injects this from your vault
      - DB_USER        # ← DSO injects this from your vault
    ports:
      - "8080:8080"
```

> [!TIP]
> Do not set `DB_PASSWORD=` in your compose file. Just list the key name. DSO will inject the value at runtime.

## Step 5 — Run

```bash
docker dso up -d
```

DSO reads `dso.yaml`, fetches your secrets, injects them, and runs your stack.

## Step 6 — Verify

```bash
# Inspect the running container's environment
docker exec <container-name> env | grep DB_

# Or use DSO's fetch command to test connectivity
docker dso fetch myapp/db
```

Expected output:
```
Secret: myapp/db
  DB_PASSWORD: *****
  DB_USER: myapp
```

> [!NOTE]
> Secret values are masked in DSO's output by default. Your container receives the real value.

## Step 7 — Tear Down

```bash
docker dso down
```

This stops all containers and securely purges all in-memory secrets.

## Next Steps

- [Understand how DSO works internally →](/guide/concepts)
- [Full `dso.yaml` configuration reference →](/guide/configuration)
- [CLI command reference →](/guide/cli)
