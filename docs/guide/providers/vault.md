# HashiCorp Vault

Use DSO with HashiCorp Vault for self-hosted secret management.

## Prerequisites
- A running Vault instance (OSS or Enterprise)
- A secret engine enabled (KV v2 recommended)
- A Vault token or AppRole credentials

## Configuration

```yaml
provider: vault
config:
  address: "http://vault.example.com:8200"
  mount: "secret"  # KV mount path
  token: "s.xxxxxxx" # Or use VAULT_TOKEN env var

secrets:
  - name: my-app/db-password   # Path within the mount
    inject: env
    mappings:
      password: DB_PASSWORD    # Map JSON key 'password' -> Env Var
  
  - name: my-app/api-key?version=3 # KV v2 version pinning
    inject: env
    mappings:
      apiKey: API_KEY
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
