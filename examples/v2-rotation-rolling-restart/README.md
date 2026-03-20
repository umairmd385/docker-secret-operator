# DSO v2.0.0 — Continuous Secret Rotation & Best-Effort Rolling Restart

This example showcases the high-performance features introduced in **Docker Secret Operator (DSO) v2.0.0**.

---

## What's New in v2.0.0?

DSO v2.0.0 transforms the engine from a container-startup injector into a **state-aware telemetry operator**.

| Feature | Description |
| :--- | :--- |
| **Continuous Provider Watch** | Agent sub-routines passively monitor cloud secret streams and validate MD5 hashes relative to clusters. |
| **Best-Effort Rolling Restart** | For environment-bound (`inject: env`) secrets, DSO clones container footprints and swaps them gracefully based on health checks. |
| **Dynamic File Overwriting** | For file-bound (`inject: file`) secrets, DSO performs live `tmpfs` overwrites without restarting containers. |
| **Rich Telemetry Traces** | Structured JSON events for every lifecycle stage (cloned, swapped, failed, healthy) via `/api/events`. |

---

## 1. Prerequisites

- **DSO v2.0.0+** installed.
- **Docker Compose** installed.
- Valid cloud provider credentials (this example defaults to AWS).

---

## 2. Review Example Configuration

### `docker-compose.yaml` (The Footprint)

Notice the `healthcheck` definition. DSO v2.0.0 requires this for **Rolling Restarts** to verify the integrity of cloned containers before dropping traffic from the old instance.

```yaml
services:
  web-server:
    image: nginx:latest
    environment:
      - DATABASE_PASSWORD
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 10s
```

### `dso.yaml` (The Engine)

Configures the **Trigger Engine** and **Restart Strategy**.

```yaml
agent:
  refresh_interval: 1m
  watch:
    mode: hybrid # poll + webhook
  
restart_strategy:
  type: rolling
  grace_period: 20s
```

---

## 3. Deployment

Start the DSO Agent and run the stack:

```bash
# 1. Start Agent (v2.0.0)
sudo systemctl start dso-agent

# 2. Deploy the stack (DSO wraps Compose)
dso compose up -d
```

---

## 4. Testing Secret Rotation

To test v2.0.0's **Rotation Logic** and **Rolling Restart**:

1.  **Modify a secret** in your cloud provider console (e.g., AWS Secrets Manager).
2.  **Observe the Agent Logs**: DSO's Continuous Watcher will detect the MD5 diff variation.
    ```bash
    journalctl -u dso-agent -f
    ```
3.  **Witness the Rolling Restart**:
    - DSO will spin up a temporary `web-server-temp` container.
    - It will wait for the `healthcheck` to pass.
    - Once healthy, it swaps the container ID and discards the old one gracefully.
4.  **Verify the New Value**:
    ```bash
    docker compose exec web-server printenv | grep DATABASE_
    ```

---

## 5. Rich Telemetry & Events

V2.0.0 introduces a detailed event stream mapping the internal state of trigger boundaries.

- **Check Lifecycle Events**: `GET /api/events`
- **Real-Time Trace**: `curl -s http://localhost:8080/api/events/ws` (WebSocket feed)

Look for events like `container_cloned`, `health_check_passed`, or `restart_completed`.

---

## 6. Cleanup

```bash
dso compose down
```
