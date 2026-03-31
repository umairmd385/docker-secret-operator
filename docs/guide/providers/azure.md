# Azure Key Vault

Connect DSO to Azure Key Vault for enterprise-grade secret management.

## Prerequisites
- An Azure account with Key Vault resource created
- A secret stored in your Key Vault
- A Service Principal or Managed Identity with `Key Vault Secrets User` role

## Configuration

```yaml
provider: azure
tenant_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
vault_url: "https://my-key-vault.vault.azure.net/"

secrets:
  - name: db-password      # Secret name in Key Vault
    inject: env
    as: DB_PASSWORD
  - name: tls-certificate
    inject: file
    path: /run/secrets/tls.pem
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
