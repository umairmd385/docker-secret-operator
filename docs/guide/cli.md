# CLI Commands

DSO integrates as a native Docker CLI plugin. All commands use the form `docker dso <subcommand>`.

## `docker dso up`

Start a Docker Compose stack with secrets injected from your vault.

```bash
docker dso up [flags] [compose-args...]
```

**Examples:**

```bash
# Start in detached mode (most common)
docker dso up -d

# Use a specific compose file
docker dso up -f docker-compose.prod.yml -d

# Use a custom DSO config file
docker dso up --config /etc/dso/prod.yaml -d

# Scale a specific service
docker dso up -d --scale api=3
```

**What it does:**
1. Reads `dso.yaml` (or `--config` path)
2. Connects to the DSO agent via Unix socket
3. Fetches secrets and injects them as environment variables
4. Calls `docker compose up` with the enriched environment

---

## `docker dso down`

Stop the stack and securely purge all in-memory secrets.

```bash
docker dso down [compose-args...]
```

**Examples:**

```bash
docker dso down

# Remove volumes too
docker dso down -v
```

---

## `docker dso compose`

Run any Docker Compose subcommand with DSO secret injection enabled.

```bash
docker dso compose <subcommand> [args...]
```

**Examples:**

```bash
# View logs
docker dso compose logs -f api

# Check status
docker dso compose ps

# Run a one-off command with secrets injected
docker dso compose run --rm api python manage.py migrate

# Pull images
docker dso compose pull
```

---

## `docker dso fetch`

Fetch and display a specific secret from the configured provider.

```bash
docker dso fetch <secret-name>
```

**Examples:**

```bash
docker dso fetch myapp/db
docker dso fetch MYSQL-ROOT-PASSWORD
```

**Output:**

```
Secret: myapp/db
  DB_PASSWORD: [REDACTED]
  DB_USER: myapp
```

> [!TIP]
> Use `docker dso fetch` to verify connectivity and authentication to your vault before running `docker dso up`.

---

## `docker dso watch`

Start the background watcher in foreground mode — useful for debugging rotation events.

```bash
docker dso watch
```

The watcher will print rotation events as they occur:

```
[DSO WATCHER] Polling secret: myapp/db
[DSO ANALYZER] Container: api_container
  - Fixed Port: NO
  - Stateful: NO
  - Health Check: YES
[DSO STRATEGY] Selected: rolling | Score: 80
[DSO ROTATION] Secret changed. Starting rolling update...
[DSO ROTATION] New container started: api_container_blue
[DSO ROTATION] Health check passed. Removing: api_container
[DSO ROTATION] Done.
```

---

## Global Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--config`, `-c` | `./dso.yaml` | Path to `dso.yaml` config file |
| `--file`, `-f` | `docker-compose.yml` | Path to Docker Compose file |

---

## Config Resolution Order

If `--config` is not specified, DSO looks for `dso.yaml` in this order:

1. Path from `--config` flag
2. `./dso.yaml` (current directory)
3. `/etc/dso/dso.yaml` (system-wide default)
