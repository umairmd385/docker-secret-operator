# 🔹 Release Notes v3.0.0 (The Docker-Native Era)

Welcome to the largest, most structural update to **DSO** ever built: v3.0.0!

This update transforms DSO from a standalone CLI tool to a fully integrated **Docker CLI Plugin**. The experience of orchestrating your Docker containers securely just became fundamentally identical to using standard Docker logic.

### 🔥 Huge Features
- **Docker CLI Plugin (`docker-dso`)**: We've introduced full structural compliance with the Docker CLI plugin matrix. Running `dso compose up` is dead; long live `docker dso up`.
- **`docker dso up`**: Total native Docker Compose integration. For the first time, you can map secrets right inside `docker-compose.yml` using standard `secrets: dso: ...` syntax, and we will safely mount and cleanly remove these mappings securely at runtime.
- **Enhanced Secret Rotation**: Building on the Event-Driven Trigger Engine of v2, rotation now deeply integrates securely with file and environment bounds. Update your Secrets Manager without dropping a single packet.
- **Repo Restructuring**: The entire codebase has been cleanly migrated into structural idiomatic Go architectures (`/cmd/docker-dso`, `/internal/cli`, `/internal/core`, `/internal/watcher`, `/internal/providers`).

### 💥 Breaking Changes & Deprecations
- **Standalone `dso` binary is Deprecated**. It technically still functions right now as a wrapper to maintain backward stability in CI pipelines for the next few months, but it will be safely removed in v4.

### 🔁 Migration Guide
Transitioning is easy. 
If you used:
`dso compose up -d`

Start using:
`docker dso up -d`

If you used:
`dso fetch my-secret`

Start using:
`docker dso fetch my-secret`

Update your install scripts to pipe to the `.docker/cli-plugins/` bounds utilizing the updated `v3.0.0` installer script.
