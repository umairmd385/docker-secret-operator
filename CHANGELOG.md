# Changelog

All notable changes to this project will be documented in this file.

## [v3.0.0] - Docker-Native Era
### Added
- **Docker CLI Plugin**: Renamed binary to `docker-dso` and added `docker-cli-plugin-metadata` compliance.
- **Native Compose Integration**: Added `docker dso up` which parses `docker-compose.yml`, safely fetches, and mounts custom `dso:` attributes natively.
- **Deep Rotation Support**: Secret rotation natively monitors events and automatically runs Best-Effort Rolling Restarts.
- **Restructured Repository**: Code architecture strictly aligned into `/cmd/docker-dso`, `/internal/cli`, `/internal/core`, `/internal/providers`, and `/internal/watcher`.

### Deprecated
- **Standalone `dso` command**: Kept temporarily for CI backward compatibility but will be removed in v4. Use `docker dso` instead.

---

## [v2.0.0] - Event-Driven Trigger Engine
### Added
- **Trigger Engine**: Shifted to hybrid event-driven Webhook APIs mapping (`POST /api/events/secret-update`) removing severe polling delays.
- **Rolling Restarts**: Fully integrated Docker-native health checks safely substituting environments seamlessly.
- **Real-Time WebSockets**: Live event streaming exposed formally.
- **Tmpfs Overlay File Bounds**: Enabled `inject: file` securely.

### Changed
- Refactored core cache and background agent logic natively.

---

## [v1.0.0] - Initial Release
### Added
- **Core CLI Runtime**: Standalone `dso format` wrapping `docker compose` calls correctly.
- **Multi-Cloud Backends**: Formal capabilities parsing AWS Secrets Manager, Azure Key Vault, HashiCorp Vault securely.
- **In-Memory Buffer Security**: Bypassed disk utilization natively mounting strings functionally.
