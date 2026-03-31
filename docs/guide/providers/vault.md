# HashiCorp Vault

Use DSO with HashiCorp Vault for self-hosted secret management.

## Prerequisites
- A running Vault instance (OSS or Enterprise)
- A secret engine enabled (KV v2 recommended)
- A Vault token or AppRole credentials

## Configuration

```yaml
provider: vault
vault_addr: "http://vault.example.com:8200"
vault_mount: "secret"  # KV mount path

secrets:
  - name: my-app/db-password   # Path within the mount
    inject: env
    as: DB_PASSWORD
```

## Authentication

```bash
# Token Auth (simplest)
export VAULT_TOKEN=s.xxxxxxxx

# AppRole Auth
export VAULT_ROLE_ID=...
export VAULT_SECRET_ID=...
```

> [!NOTE]
> DSO will automatically renew short-lived Vault tokens before they expire mid-rotation cycle.
