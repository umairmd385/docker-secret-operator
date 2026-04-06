# Production Examples

These examples demonstrate common DSO patterns for managing secrets in enterprise Docker environments.

---

## 1. Stateless API with Rolling Rotation (AWS)
This pattern is ideal for microservices that can scale horizontally. DSO performs a "Blue/Green" style update, starting a new container with the updated secret before removing the old one.

**`dso.yaml`**
```yaml
provider: aws
config:
  region: us-east-1

secrets:
  - name: prod/api/keys
    inject: env
    rotation: true
    reload_strategy:
      type: signal
      signal: SIGHUP
    mappings:
      STRIPE_API_KEY: STRIPE_KEY
      SENDGRID_API_KEY: MAIL_KEY
```

**`docker-compose.yml`**
```yaml
services:
  api:
    image: mycorp/api:v1.2.0
    labels:
      - "dso.reloader=true"
      - "dso.strategy=rolling"
    environment:
      - STRIPE_KEY
      - MAIL_KEY
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3
```

---

## 2. Stateful Database with Restart Strategy (Vault)
For databases or services with fixed host ports, a `rolling` strategy will fail due to port conflicts. Use the `restart` strategy to ensure a clean cutover.

**`dso.yaml`**
```yaml
provider: vault
config:
  vault_addr: "https://vault.internal:8200"

secrets:
  - name: database/mysql/prod
    inject: env
    rotation: true
    reload_strategy:
      type: restart
    mappings:
      password: MYSQL_ROOT_PASSWORD
```

**`docker-compose.yml`**
```yaml
services:
  db:
    image: mysql:8.0
    labels:
      - "dso.reloader=true"
      - "dso.strategy=restart"
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD
```

---

## 3. Signal-Based Reload (Nginx)
Nginx can reload its configuration without dropping connections using `SIGHUP`. DSO can trigger this automatically when a secret (like an SSL certificate or API upstream key) changes.

**`dso.yaml`**
```yaml
provider: azure
config:
  vault_url: "https://prod-kv.vault.azure.net/"

secrets:
  - name: PROXY-AUTH-TOKEN
    inject: env
    rotation: true
    reload_strategy:
      type: signal
      signal: SIGHUP
    mappings:
      value: PROXY_TOKEN
```

**`docker-compose.yml`**
```yaml
services:
  proxy:
    image: nginx:alpine
    labels:
      - "dso.reloader=true"
    environment:
      - PROXY_TOKEN
```

## Next Steps
- **[Configuration Reference](/guide/configuration)**: Detailed schema for `dso.yaml`.
- **[System Architecture](/guide/architecture)**: How the rotation engines operate.
- **[Troubleshooting](/guide/troubleshooting)**: Diagnosing failed rotation events.
