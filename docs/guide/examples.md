# Examples

Real-world Docker Compose stacks using DSO with different cloud providers.

## AWS Secrets Manager with Docker Compose

This example shows how to use DSO to inject database credentials into a standard application stack.

**`dso.yaml`:**
```yaml
provider: aws
config:
  region: us-east-1

secrets:
  - name: myapp/database
    inject: env
    mappings:
      DB_USER: username
      DB_PASSWORD: password
    rotation: true

  - name: myapp/api-keys
    inject: file
    mount_path: /run/secrets/api
    file_mode: "0600"
```

**`docker-compose.yaml`:**
```yaml
services:
  app:
    image: myapp:latest
    environment:
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    secrets:
      - api-key

secrets:
  api-key:
    external: true
```

---

## Signal-Based Hot Reload

Apps that handle `SIGHUP` can reload configuration without any container restart. This example shows a Go app doing live config reloads.

**`dso.yaml`:**
```yaml
provider: aws
config:
  region: us-east-1

secrets:
  - name: myapp/config
    inject: env
    rotation: true
    reload_strategy:
      type: signal    # sends SIGHUP — zero downtime reload
    mappings:
      API_KEY: API_KEY
      DATABASE_URL: DATABASE_URL
```

---

## Azure — MySQL + phpMyAdmin

Same stack using Azure Key Vault.

**`dso.yaml`:**

```yaml
provider: azure
config:
  vault_url: "https://my-keyvault.vault.azure.net/"

secrets:
  - name: MYSQL-ROOT-PASSWORD
    inject: env
    mappings:
      value: MYSQL_ROOT_PASSWORD

  - name: MYSQL-USER
    inject: env
    mappings:
      value: MYSQL_USER
```
