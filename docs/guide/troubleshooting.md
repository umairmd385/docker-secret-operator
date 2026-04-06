# Troubleshooting & Diagnostics

DSO is designed to fail securely. When a synchronization or rotation event fails, the system prioritizes existing secret integrity over applying potentially corrupted or unauthorized updates.

---

## 1. Provider Authentication Failures
**Symptom**: `ERROR: [Watcher] Failed to fetch secret 'myapp/db': AccessDenied`

DSO relies on **Machine Identity**. Authentication failures typically indicate a mismatch between the host's IAM profile and the required vault permissions.

**Diagnostic Steps**:
1.  **Verify IAM Policy**: Ensure the host's IAM Role (AWS) or Managed Identity (Azure) has explicit `GetSecretValue` permissions for the specific Resource ARN.
2.  **Context Check**: If running in a containerized environment (e.g., Docker-in-Docker), ensure the cloud metadata service (IMDS) is reachable from within the network namespace.
3.  **Manual Resolution Test**: Use the DSO CLI to verify connectivity independently of the rotation engine:
    ```bash
    docker dso fetch <secret-name>
    ```

---

## 2. Secret Drift & Rotation Stalls
**Symptom**: Secret updated in Vault, but container remains on the legacy version.

**Diagnostic Steps**:
1.  **Watcher Mode**: Verify `agent.watch.polling_interval` in `dso.yaml`. If the interval is high (e.g., `10m`), the "Reconciliation Gap" may be expected.
2.  **Debouncer Interaction**: DSO ignores rapid successions of vault updates to prevent "flapping." Check logs for `[Debouncer] Update suppressed`.
3.  **Label Verification**: Ensure the target container has `dso.reloader=true`. DSO ignores all containers without this explicit opt-in label.

---

## 3. Atomic Rotation Failures (Rolling Strategy)
**Symptom**: `ERROR: [Reloader] Rolling update failed for 'api': Healthcheck timeout`

When using the `rolling` strategy, DSO starts a new container and waits for it to become `healthy` before removing the old one. If the new container fails its healthcheck, DSO aborts the rotation.

**Diagnostic Steps**:
1.  **Healthcheck Definition**: Ensure a valid `healthcheck` is defined in `docker-compose.yml`.
2.  **Logs Inspection**: Check the logs of the "Candidate" container (usually named `<service>_dso_new`) to see if the application failed to boot with the new secret.
3.  **Timeout Adjustment**: If the application has a long cold-start time, increase `agent.rotation.health_check_timeout`.

---

## 4. Signal-Based Reload Issues (SIGHUP)
**Symptom**: `INFO: [Reloader] Signal SIGHUP sent to 'proxy'`, but configuration remains old.

**Diagnostic Steps**:
1.  **PID 1 Requirement**: DSO sends signals to the container's PID 1. If your entrypoint is a shell script (`sh -c ...`), the signal may not be propagated to the application. Use `exec` in your entrypoint scripts.
2.  **App Support**: Verify that the application (e.g., Nginx, Go-binary) actually implements a handler for `SIGHUP` to reload its configuration from the environment or filesystem.

---

## 5. Socket Connectivity
**Symptom**: `failed to connect to /run/docker/plugins/dso.sock: connection refused`

**Diagnostic Steps**:
1.  **Plugin Status**: Verify the DSO plugin is enabled: `docker plugin ls`.
2.  **Daemon Logs**: Inspect the plugin's internal logs via the host's journal:
    ```bash
    # For native installs
    journalctl -u dso-agent -f
    ```

## Diagnostic Reference

| Command | Purpose |
|---------|---------|
| `docker dso version` | Check binary version and build hash |
| `docker dso fetch <name>` | Test vault connectivity and resolution |
| `docker dso watch` | Foreground watcher logs (real-time diagnostics) |
| `docker dso inspect <id>` | View active secret mappings for a container |

## Next Steps
- **[System Architecture](/guide/architecture)**: Understand the internal reconciliation loop.
- **[Security Model](/guide/security)**: Detailed boundaries and threat mitigations.
- **[Production Readiness](/guide/production-readiness)**: Best practices to avoid common issues.
