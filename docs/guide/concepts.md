# Concepts

Understanding DSO's internal architecture helps you configure it effectively and debug issues with confidence.

## The Three Components

DSO consists of three binaries that work together:

```
docker-dso    ← The CLI plugin (docker dso up, down, fetch, watch)
dso-agent     ← The background daemon (Unix socket server, secret cache, watcher)
dso-provider-* ← One binary per cloud provider (aws, azure, vault, huawei)
```

### How They Connect

```
┌─────────────────────────────────────────────┐
│  Your Terminal                               │
│                                             │
│  $ docker dso up -d                         │
│         │                                   │
│         ▼                                   │
│  docker-dso (CLI plugin)                    │
│    ├── reads docker-compose.yml + dso.yaml  │
│    ├── connects to dso-agent via Unix socket │
│    └── passes enriched env to Docker Engine │
│                                             │
│  dso-agent (daemon)                         │
│    ├── loads dso-provider-aws (RPC binary)  │
│    ├── calls GetSecret("myapp/db")          │
│    ├── stores result in in-memory cache     │
│    ├── serves secrets over Unix socket      │
│    └── runs Watcher loop (rotation)         │
│                                             │
│  dso-provider-aws (RPC subprocess)          │
│    ├── calls AWS Secrets Manager API        │
│    └── returns map[string]string values     │
└─────────────────────────────────────────────┘
```

## The Provider Plugin System

Providers are separate Go binaries (`dso-provider-aws`, `dso-provider-azure`, etc.) that communicate with the agent over **net/rpc** using HashiCorp's `go-plugin` framework.

This design means:
- **Each provider is isolated** — a crash in one provider doesn't affect others
- **New providers can be added** without modifying DSO core
- **Auth logic is contained** inside the provider binary

The provider interface has two methods:
```go
Init(config map[string]string) error
GetSecret(name string) (map[string]string, error)
```

## Secret Injection Flow

When you run `docker dso up -d`:

```
1. CLI reads dso.yaml → knows: provider=aws, secrets=[myapp/db], inject=env
2. CLI connects to agent via Unix socket
3. Agent calls dso-provider-aws → GetSecret("myapp/db")
4. AWS returns: {"DB_PASSWORD": "s3cr3t", "DB_USER": "myapp"}
5. Agent applies mappings from dso.yaml:
     DB_PASSWORD → DB_PASSWORD  (in container env)
     DB_USER → DB_USER
6. CLI writes enriched env to a temp file
7. CLI calls: docker compose --env-file /tmp/dso-*.env up -d
8. Docker Engine starts containers with secrets in their environment
```

> [!IMPORTANT]
> Secrets are injected via Docker's standard environment variable mechanism — the agent does **not** modify the Docker image or write to any persistent storage.

## How Secret Rotation Works

### Polling Mechanism

When `rotation: true` is set on a secret, the agent starts a background polling loop:

- **Default polling interval:** 2 minutes (configurable per-environment)
- DSO polls the upstream cloud providers at these defined intervals.
- Example Configuration: `agent.watch.polling_interval: 30s`

### Atomic Update Process

1. DSO detects a secret change in the upstream provider by hashing the new payload.
2. It fetches the new value while continuing to hold the old value in memory, ensuring zero downtime.
3. It applies the update based on the configured injection strategy:
   - **env**: Sends a `SIGHUP` (or custom `reload_signal`) to the running container, prompting the application to reload its environment cleanly.
   - **file**: Uses an atomic rename operation on the mounted tmpfs payload. It writes the new secret to a temporary file, calls `rename()` to swap it, and unlinks the old file. This guarantees that file-watching applications never read a partially written secret.
   - **restart**: Performs a graceful container restart with health check verification.

### Handling Rotation Failures

- **Resilience:** If the new secret is invalid, malformed, or the provider API is unreachable, DSO aborts the rotation and retains the old valid value.
- **Audit Logging:** The error is immediately recorded to the structured JSON audit log.
- **Retry Backoff:** DSO supports configurable retry attempts and exponential backoff, preventing rate-limiting from cloud providers during outages.

### Debouncer

The watcher includes a debouncer that prevents multiple rapid vault changes from triggering multiple rotations. If 3 secret updates arrive within 30 seconds, only one rotation event fires.

## The Strategy Engine

Before rotating a container, DSO analyzes it and computes a **score (0–100)**:

| Check | Deduction | Reason |
|-------|-----------|--------|
| Fixed host port (e.g., `80:80`) | -50 | Can't run two containers on same port |
| Explicit `container_name` | -20 | Name conflict with parallel container |
| `restart: always` policy | -20 | Conflicts with rotation engine |
| No `healthcheck` defined | -10 | Can't validate safe cutover |
| Stateful workload (MySQL, Postgres, `/var/lib/` mounts) | -20 | Data corruption risk |

**Scoring result:**
- Score ≥ 70 → **Rolling (Blue/Green)** update
- Score < 70 → **Graceful restart**

### Rolling Update Flow

```
1. Clone the container with updated environment
2. Start the new container
3. Wait for healthcheck to pass (health_check_timeout)
4. Remove the old container
```

### Graceful Restart Flow

```
1. Stop the container (with grace_period)
2. Restart it with the updated environment
```

## Reload Strategies

The `reload_strategy` field controls what happens *inside* the container after rotation:

| Strategy | Behavior |
|----------|----------|
| `signal` | Sends `SIGHUP` to the container's main process — ideal for apps that reload config on signal (Nginx, many Go/Python apps) |
| `restart` | Restarts the container (safe for stateless services) |
| `none` | Updates the cached value but does not signal the container |

## In-Memory Cache

The agent maintains a thread-safe in-memory cache of all fetched secrets. This serves two purposes:

1. **Performance** — avoids hitting the cloud API on every container start
2. **Resilience** — if the cloud provider is temporarily unavailable, the agent serves from cache

Cache TTL is controlled by `agent.refresh_interval` in `dso.yaml`.
