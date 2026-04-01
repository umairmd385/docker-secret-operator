# Azure Key Vault

Connect DSO to Azure Key Vault for enterprise-grade secret management.

## Prerequisites
- An Azure account with Key Vault resource created
- A secret stored in your Key Vault
- A Service Principal or Managed Identity with `Key Vault Secrets User` role

## Configuration

```yaml
provider: azure
config:
  vault_url: "https://my-key-vault.vault.azure.net/"

secrets:
  - name: db-password      # Note: underscores are automatically converted to hyphens
    inject: env
    mappings:
      value: DB_PASSWORD   # Azure default key is 'value'
  - name: tls-certificate
    inject: file
    path: /run/secrets/tls.pem
    mappings:
      value: "."           # Mount the entire secret value as a file
```

## Authentication

DSO supports Service Principal authentication:

```bash
export AZURE_CLIENT_ID=...
export AZURE_CLIENT_SECRET=...
export AZURE_TENANT_ID=...
```

> [!TIP]
> On Azure VMs or AKS with Managed Identity enabled, no credentials are needed — DSO will use the assigned identity automatically.
