# Core Concepts

DSO is built on a few fundamental architectural pillars that ensure secrets are managed securely and predictably in Docker environments.

---

## 1. The Secret Lifecycle

DSO manages the entire lifecycle of a secret from the moment it is requested to the moment it is rotated or the container is destroyed.

1.  **Resolution**: DSO identifies the secret in the external vault (AWS, Azure, Vault) and authenticates using the host's machine identity.
2.  **Acquisition**: The secret is fetched over a secure TLS connection and held exclusively in the `dso-agent` process memory.
3.  **Injection**: The secret is "pushed" into the target container. Unlike standard Docker secrets or environment variables, DSO can update these values *without* a container restart.
4.  **Observation**: The Watcher Engine monitors for "Secret Drift" (changes in the vault) or container lifecycle events.
5.  **Reconciliation**: If a drift is detected, the system automatically triggers a rotation to bring the container's state back in sync with the vault.

---

## 2. Zero-Persistence Philosophy

Security in DSO is rooted in the principle of **Transient Secrets**. 

- **No Host Disk Access**: Secrets never touch the host's physical storage (HDD/SSD). They are streamed directly from the agent's memory into the container's RAM.
- **In-Memory Cache**: The `dso-agent` maintains a thread-safe, in-process cache. This cache is purged immediately when the agent stops.
- **RAMfs Mounts**: Injected files are stored in `tmpfs` mounts within the container, ensuring they disappear if the container is compromised or restarted.

---

## 3. The Reconciliation Loop

DSO operates as a **State Reconciler**. It treats your `dso.yaml` and the external Vault as the "Desired State" and the running containers as the "Actual State."

The system continuously works to minimize the "Reconciliation Gap":
- **Passive Reconcile**: Polling the vault for updates.
- **Active Reconcile**: Responding to container start/restart events to ensure they always boot with the latest credentials.

---

## 4. Atomic Injection Mechanisms

To prevent "Partial Secret Reads" (where an app reads a half-updated config file), DSO uses atomic injection:

- **Tar Streaming**: We stream a complete directory of secrets as a single TAR archive. Docker's extraction process is atomic at the file level.
- **SIGHUP Reloads**: For applications that support it, DSO sends a signal (e.g., `SIGHUP`) only *after* the entire secret payload has been successfully updated on the filesystem.

---

## 5. Metadata-Driven Orchestration

DSO relies on Docker Object Metadata (Labels) to discover its targets. This allows for "Zero-Config" scaling.

- **`dso.reloader=true`**: Tells DSO that this container should be managed.
- **`dso.strategy=rolling`**: Defines how the container should be updated.
- **`dso.signal=SIGHUP`**: Specifies the reload signal for the application.

By using labels, you can deploy new services that are "DSO-Aware" without ever updating the central DSO configuration.

## Next Steps

- **[System Architecture](/guide/architecture)**: Deep dive into the internal engines.
- **[Security Model](/guide/security)**: Understand the threat landscape.
- **[Production Readiness](/guide/production-readiness)**: How to deploy at scale.
 In-Memory Cache

The agent maintains a thread-safe in-memory cache of all fetched secrets. This serves two purposes:

1. **Performance** — avoids hitting the cloud API on every container start
2. **Resilience** — if the cloud provider is temporarily unavailable, the agent serves from cache

Cache TTL is controlled by `agent.refresh_interval` in `dso.yaml`.
