# DSO — Docker Secret Operator
## Complete Presenter's Guide

---

## 1. ELEVATOR PITCH (30 seconds)

> "DSO is a native Docker CLI plugin that gives you Kubernetes-grade secret security without leaving Docker. You run `docker dso up -d` and your containers start with secrets pulled live from AWS, Azure, or HashiCorp Vault — no `.env` files, nothing on disk, fully auditable."

---

## 2. THE PROBLEM (Why DSO Exists)

### The `.env` File Crisis
Every Docker team hits this wall:
- `.env` files get **accidentally committed** to GitHub
- Developers Slack each other **production credentials**  
- Secrets sit **unencrypted on laptops and servers**
- You **can't centrally rotate** credentials without restarting everything manually
- **Fails SOC2 audits** out of the box

### The False Alternative: Kubernetes
The standard "solution" is to migrate to Kubernetes — but that means:
- Months of infrastructure migration
- Massive operational complexity
- Overkill for teams running Docker Compose stacks

### DSO's Answer
**Kubernetes-level secret security, Docker-native simplicity.**

---

## 3. WHAT IS DSO?

DSO (Docker Secret Operator) is:
- A **native Docker CLI plugin** (`docker dso`)
- Written in **Go** — fast, concurrent, lightweight (~20MB RAM, <1% CPU)
- Connects to **cloud secret managers** at runtime
- Injects secrets **directly into container memory** via Unix socket
- **Nothing ever touches disk**
- Currently at **v3.0.0** — Production Ready, SOC2 Ready

---

## 4. SUPPORTED PROVIDERS

| Provider | Status |
|----------|--------|
| AWS Secrets Manager | ✅ Production |
| Azure Key Vault | ✅ Production |
| HashiCorp Vault | ✅ Production |
| Huawei Cloud CSMS | ✅ Production |
| Local File | ✅ Dev/Testing |

---

## 5. ARCHITECTURE

### High-Level Flow
```
Cloud Vault (AWS/Azure/Vault)
        │
        ▼
   DSO Agent (Go binary, Unix socket)
        │
        ├─── Secret Fetch Engine ──► In-Memory Secure Store
        │                                    │
        │                                    ▼
        │                          Docker Unix Socket
        │                                    │
        │                                    ▼
        │                            Docker Engine
        │                                    │
        │                                    ▼
        │                          Container Runtime
        │
        └─── Rotation Watcher ──► Hash Tracking ──► Strategy Engine
```

### Internal Component Map

| Component | Package | Responsibility |
|-----------|---------|----------------|
| **CLI** | `internal/cli` | `docker dso up/down/compose/fetch/watch` |
| **Agent** | `internal/agent` | Unix socket server, secret cache, trigger system |
| **Provider** | `pkg/provider` | RPC-based plugin interface for all secret backends |
| **Watcher** | `internal/watcher` | Docker event listener, debounce controller |
| **Analyzer** | `internal/analyzer` | Container metadata profiler |
| **Strategy Engine** | `internal/strategy` | Decides rolling vs restart rotation |
| **Rotation** | `internal/rotation` | Blue/green container clone, health check, rollout |
| **Observability** | `pkg/observability` | Prometheus metrics, structured logging (zap) |
| **Config** | `pkg/config` | `dso.yaml` parser |
| **Injector** | `internal/injector` | Env + file injection into container runtime |

---

## 6. KEY WORKFLOWS

### Workflow 1: `docker dso up -d` (Startup)
1. CLI reads `docker-compose.yml` + `dso.yaml`
2. Agent authenticates to cloud vault (IAM role, no manual credentials)
3. Secret Fetch Engine pulls secrets into **in-memory store only**
4. Injector delivers secrets via Docker Unix socket → container env layer
5. Docker Engine starts containers with enriched environment
6. Watcher begins background monitoring loop

### Workflow 2: Automatic Secret Rotation
1. Watcher polls vault at configured interval (or receives webhook event)
2. **Hash Tracking** detects if secret value has changed
3. Debouncer prevents spam events (e.g., 3 rapid changes → 1 rotation)
4. Analyzer profiles the container:
   - Has fixed port binding? (e.g., `80:80`)
   - Is stateful? (e.g., `/var/lib/mysql` mount)
   - Has health check? Has restart policy?
5. **Strategy Engine** calculates a score (0–100)
6. Score ≥ 70 → **Rolling (Blue/Green)** update
7. Score < 70 → **Graceful Restart**

### Workflow 3: Strategy Engine Scoring
```
Base Score: 100

Deductions:
  Fixed port binding:    -50  (can't run parallel containers)
  Explicit container name: -20  (name conflict)
  restart_always policy: -20  (conflicts with rotation engine)
  No health check:       -10  (can't validate safe cutover)
  Stateful workload:     -20  (data corruption risk)

Result:
  Score ≥ 70 → Rolling (Blue/Green) update
  Score < 70 → Safe restart
```

### Workflow 4: Watch Mode (`docker dso watch`)
- Continuous background mode
- Subscribes to Docker Engine event stream
- Reacts immediately to container start/stop events
- Re-injects secrets when containers restart

---

## 7. SECURITY MODEL

| Property | Detail |
|----------|--------|
| **Disk persistence** | ❌ None — secrets never written to filesystem |
| **Transport** | Unix socket (local, no network exposure) |
| **Auth** | IAM instance roles / service principals — no manual passwords |
| **Shutdown** | All in-memory secrets purged on agent stop |
| **Compliance** | SOC2 Ready |
| **Provider isolation** | Each provider is an isolated RPC Go binary |
| **Hash tracking** | Detects secret drift without storing plaintext history |

---

## 8. CONFIGURATION (`dso.yaml`)

```yaml
provider: aws
region: us-east-1

agent:
  cache: true
  refresh_interval: 5m
  auto_sync: true
  watch:
    mode: polling         # polling | event | hybrid
    polling_interval: 30s
  webhook:
    enabled: false
    auth_token: ""
  rotation:
    strategy: rolling
    health_check_timeout: 30s
    max_parallel: 2
  restart_strategy:
    type: signal
    grace_period: 10s

secrets:
  - name: production-db-credentials
    inject: env
    rotation: true
    reload_strategy:
      type: signal          # signal | restart | none
    mappings:
      DB_PASS: DB_PASSWORD
      DB_USER: DATABASE_USER
  - name: tls-certificate
    inject: file
    path: /run/secrets/tls.crt
```

---

## 9. CLI REFERENCE

| Command | Description |
|---------|-------------|
| `docker dso up -d` | Start Compose stack with secrets injected |
| `docker dso down` | Stop stack, purge secrets from memory |
| `docker dso compose <cmd>` | Run any Compose subcommand with DSO injection |
| `docker dso fetch <secret>` | Fetch and print a specific secret value |
| `docker dso watch` | Start continuous background watcher |

---

## 10. OBSERVABILITY (Prometheus Metrics)

| Metric | Type | Description |
|--------|------|-------------|
| `dso_secret_requests_total` | Counter | Total fetch attempts per provider/status |
| `dso_secret_fetch_latency_seconds` | Histogram | Fetch latency per provider |
| `dso_secret_cache_hits_total` | Counter | Cache hit efficiency per secret |
| `dso_secret_cache_misses_total` | Counter | Total cache misses |
| `dso_backend_failures_total` | Counter | Provider errors by error type |

Metrics exposed at: `http://localhost:<port>/metrics`

---

## 11. REAL EXAMPLES (From Repo)

### AWS Example (`examples/aws-compose/`)
```yaml
# dso.yaml
provider: aws
secrets:
  - name: production-db-credentials
    inject: env
    mappings:
      DB_PASS: DB_PASS
```

### Azure Example (`examples/azure-compose/`)
```yaml
# dso.yaml
provider: azure
secrets:
  - name: my-azure-secret
    inject: env
    mappings:
      API_KEY: API_KEY
```

### Signal Reloading Example (`examples/v2-signal-reloading/`)
- Go app + Python app that reload configs on `SIGHUP`
- DSO sends signal after rotation — zero downtime

### Rolling Restart Example (`examples/v2-rotation-rolling-restart/`)
- Blue/Green container swap demonstrated end-to-end
- Healthcheck-gated cutover

---

## 12. VERSION HISTORY

| Version | Headline |
|---------|----------|
| **v1.0** | Initial release — basic secret injection |
| **v2.0** | Event-Driven Trigger Engine, webhook support, rotation strategies |
| **v3.0** | Full Docker CLI Plugin (`docker dso`), idiomatic Go rewrite, Blue/Green rotation |

---

## 13. TARGET AUDIENCE

| Persona | Pain Point DSO Solves |
|---------|-----------------------|
| **DevOps Engineers** | SOC2 compliance without Kubernetes migration |
| **Startups** | Enterprise secret security on Docker Compose budgets |
| **Security Teams** | Eliminate `.env` files from dev laptops forever |
| **Platform Engineers** | Multi-cloud, plugin-extensible secret management |

---

## 14. INSTALLATION

```bash
# One-line installer
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/install.sh | sudo bash

# Verify
docker dso --version
```

The installer places the binary into `~/.docker/cli-plugins/docker-dso` — making it a first-class `docker` subcommand.

---

## 15. ANTICIPATED QUESTIONS & ANSWERS

**Q: How is this different from Docker Secrets?**
> Docker Secrets only work in Swarm mode and don't integrate with external cloud vaults. DSO works with standard Compose and pulls from AWS, Azure, Vault.

**Q: What if the cloud provider is temporarily unavailable?**
> DSO caches secrets in-memory with a configurable TTL. If the provider is unreachable at rotation time, it applies exponential backoff and continues serving from cache.

**Q: Are secrets visible in `docker inspect`?**
> No. DSO injects secrets via the Docker Unix socket's environment override mechanism — they are not stored in the image layer or container config that `docker inspect` reads from disk.

**Q: Does this work with Docker Swarm?**
> Yes — see `examples/docker-swarm/`. DSO integrates with Swarm service definitions.

**Q: What languages/frameworks are supported?**
> Any application that reads environment variables or files works. Language-agnostic by design.
