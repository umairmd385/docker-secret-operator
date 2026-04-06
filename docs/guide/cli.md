# CLI Reference

DSO is implemented as a native Docker CLI plugin. All interactions are performed via the `docker dso` command space.

---

## Command: `up`
Synchronizes secrets and initializes a Docker Compose stack.

```bash
docker dso up [flags] [compose-args...]
```

**Mechanics:**
1.  **Pre-flight**: Parses `dso.yaml` and establishes a connection to the `dso-agent` via the Unix socket.
2.  **Resolution**: Fetches the latest secret values from the configured provider (AWS/Azure/Vault).
3.  **Injection**: Maps secret values to the environment of services defined in `docker-compose.yml`.
4.  **Execution**: Calls `docker compose up` with the enriched environment.

**Common Flags:**
- `-d, --detach`: Run containers in the background.
- `-c, --config`: Path to a custom `dso.yaml` (Default: `./dso.yaml`).
- `-f, --file`: Path to a custom `docker-compose.yml`.

---

## Command: `down`
Stops the stack and performs a secure memory purge.

```bash
docker dso down [compose-args...]
```

**Mechanics:**
1.  **Termination**: Calls `docker compose down` to stop and remove containers.
2.  **Purge**: Signals the `dso-agent` to flush the sensitive secret cache from its process memory.

---

## Command: `fetch`
Resolves and displays a specific secret (for debugging purposes).

```bash
docker dso fetch <secret-name>
```

**Usage:**
Use this command to verify that your host has the correct IAM permissions or API access to reach the vault before launching a full stack. **Note**: Secret values are masked in the terminal output to prevent "shoulder surfing" leaks.

---

## Command: `watch`
Starts the Watcher Engine in foreground mode.

```bash
docker dso watch
```

**Usage:**
Ideal for debugging rotation strategies and SIGHUP signals. The command streams real-time reconciliation logs, showing exactly when a secret drift is detected and how the Reloader Controller responds.

---

## Command: `version`
Displays the DSO binary version and build metadata.

```bash
docker dso version
```

---

## Global Configuration Resolution
DSO resolves its configuration using the following priority:
1.  Explicit flag via `--config`.
2.  Environment variable `DSO_CONFIG`.
3.  Local file `./dso.yaml`.
4.  System-wide file `/etc/dso/dso.yaml`.

## Next Steps
- **[System Architecture](/guide/architecture)**: Learn how the CLI interacts with the Agent.
- **[Configuration Reference](/guide/configuration)**: Detailed `dso.yaml` schema.
- **[Security Model](/guide/security)**: How the CLI-to-Agent socket is protected.
