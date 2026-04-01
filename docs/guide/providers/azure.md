# Azure Key Vault

Connect DSO to Azure Key Vault for enterprise-grade secret management.

## Configuration

```yaml
# dso.yaml - Azure Provider
provider: azure
config:
  vault_url: https://my-keyvault.vault.azure.net
  # Use Managed Identity (recommended for production)
  # or Service Principal credentials

secrets:
  - name: my-secret-name
    inject: env
    rotation: true
    mappings:
      DB_PASSWORD: secret-value
      # Note: Azure Key Vault converts underscores to hyphens automatically
```

## Azure Key Vault Naming

Azure Key Vault does not allow underscores (`_`) in secret names. DSO automatically:
- Converts underscores to hyphens when fetching from Azure
- Maps back to your desired environment variable names

Example:
- Secret in Azure: `database-credentials`
- Mapped to: `DB_PASSWORD` (env var)

## Prerequisites
- An Azure account with Key Vault resource created
- A secret stored in your Key Vault
- A Service Principal or Managed Identity with `Key Vault Secrets User` role

## Authentication

DSO supports Service Principal authentication:

```bash
export AZURE_CLIENT_ID=...
export AZURE_CLIENT_SECRET=...
export AZURE_TENANT_ID=...
```

> [!TIP]
> On Azure VMs or AKS with Managed Identity enabled, no credentials are needed — DSO will use the assigned identity automatically.
