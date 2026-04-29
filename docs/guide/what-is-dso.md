# What is DSO?

**Docker Secret Operator (DSO)** is an event-driven secret lifecycle manager for Docker. It provides a native mechanism to synchronize, inject, and rotate secrets from enterprise vaults (AWS, Azure, HashiCorp Vault) or a local encrypted vault directly into containerized workloads.

DSO is designed to eliminate the risks associated with static secret management, specifically targeting **Secret Proliferation** (credentials left in images, `.env` files, or host storage) and **Secret Drift** (stale credentials in running containers).

## The Core Design: Dual-Mode Execution

DSO v3.2 introduces **Dual-Mode Execution**, allowing teams to use the same secure workflow from local development to production.

- **Local Mode**: Uses an AES-256-GCM encrypted local vault. Perfect for development and air-gapped environments.
- **Cloud Mode**: Connects to high-assurance vaults like AWS Secrets Manager or Azure Key Vault using machine identity.

---

## Core Pillars

- **Zero-Persistence**: Secrets are stored in-process RAM and injected into `tmpfs`. They never touch the host's physical disk as plaintext.
- **Event-Driven**: Immediate response to secret rotation in the vault or container restarts via the Docker event stream.
- **Docker-Native**: Built to work with Docker Engine and Docker Compose, requiring no custom entrypoints or sidecars.
- **Least Privilege**: DSO leverages machine-identity-based access and secure Unix sockets.

## Why DSO?

While Kubernetes has mature secret operators, the Docker ecosystem has historically lacked a professional-grade alternative to insecure `.env` files or manual injection. DSO fills this gap by bringing enterprise-grade secret orchestration to teams running Docker on-premise, on the edge, or in standard cloud instances without the overhead of a full orchestration layer.

## Next Steps

- **[Design Principles](/guide/design-principles)**: Understand the philosophy behind the project.
- **[System Architecture](/guide/architecture)**: Deep dive into the Watcher, Reloader, and Streamer.
- **[Security Model](/guide/security)**: How we protect secrets from host-level compromise.
- **[Quickstart](/guide/getting-started)**: Get running in under 2 minutes.
