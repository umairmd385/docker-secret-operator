# Examples

Real-world Docker Compose stacks using DSO with different cloud providers. All examples are available in the [`examples/`](https://github.com/umairmd385/docker-secret-operator/tree/main/examples) directory of the repository.

## AWS — MySQL + phpMyAdmin

Inject MySQL credentials from AWS Secrets Manager into a database stack.

**`dso.yaml`:**
```yaml
provider: aws
config:
  region: us-east-2

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m
  restart_strategy:
    type: rolling
    health_check_timeout: 45s
    grace_period: 20s

secrets:
  - name: arn:aws:secretsmanager:us-east-2:123456789:secret:production-db
    inject: env
    rotation: true
    reload_strategy:
      type: restart
    mappings:
      MYSQL_ROOT_PASSWORD: MYSQL_ROOT_PASSWORD
      MYSQL_USER: MYSQL_USER
      MYSQL_PASSWORD: MYSQL_PASSWORD
```

**`docker-compose.yml`:**
```yaml
services:
  mysql_db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD   # ← injected by DSO
      - MYSQL_USER
      - MYSQL_PASSWORD
    volumes:
      - mysql-data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8080:80"
    environment:
      PMA_HOST: mysql_db

volumes:
  mysql-data:
```

**Run:**
```bash
docker dso up -d
```

→ [Full example with screenshots](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/aws-compose)

---

## Azure — MySQL + phpMyAdmin

Same stack using Azure Key Vault. Note the `value` mapping key specific to Azure.

**`dso.yaml`:**
```yaml
provider: azure
config:
  vault_url: "https://my-keyvault.vault.azure.net/"

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m

secrets:
  - name: MYSQL-ROOT-PASSWORD   # Azure uses hyphens, not underscores
    inject: env
    mappings:
      value: MYSQL_ROOT_PASSWORD   # Azure always uses 'value' as the key

  - name: MYSQL-USER
    inject: env
    mappings:
      value: MYSQL_USER

  - name: MYSQL-PASSWORD
    inject: env
    mappings:
      value: MYSQL_PASSWORD
```

→ [Full example with screenshots](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/azure-compose)

---

## Signal-Based Hot Reload

Apps that handle `SIGHUP` can reload configuration without any container restart. This example shows a Go app and a Python app doing live config reloads.

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

**Go app snipped (`main.go`):**
```go
sigs := make(chan os.Signal, 1)
signal.Notify(sigs, syscall.SIGHUP)
go func() {
    for range sigs {
        log.Println("SIGHUP received — reloading config")
        reloadConfig()
    }
}()
```

→ [Full Go + Python signal reload example](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/v2-signal-reloading)

---

## Rolling Restart Rotation

Demonstrates zero-downtime secret rotation where DSO clones the container with updated secrets, waits for healthcheck, then removes the old one.

**`dso.yaml`:**
```yaml
provider: aws
config:
  region: us-east-1

agent:
  rotation:
    strategy: rolling
    health_check_timeout: 30s
    max_parallel: 1

secrets:
  - name: myapp/api-key
    inject: env
    rotation: true
    reload_strategy:
      type: restart
    mappings:
      API_KEY: API_KEY
```

→ [Full rolling restart example](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/v2-rotation-rolling-restart)

---

## Docker Swarm

DSO works with Docker Swarm service definitions.

→ [Docker Swarm example](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/docker-swarm)

---

## Huawei Cloud CSMS

For teams running on Huawei Cloud using ECS Agency authentication.

→ [Huawei CSMS example](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/huawei-compose)

---

## Production Compose Setup

A full production-hardened Compose stack with health checks, restart policies, and explicit secret rotation.

→ [Production compose example](https://github.com/umairmd385/docker-secret-operator/tree/main/examples/production-compose)
