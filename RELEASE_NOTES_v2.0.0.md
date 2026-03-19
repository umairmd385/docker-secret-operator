# Release Notes v2.0.0

## Automatic Secret Rotation with Best-Effort Rolling Restarts

DSO v2.0.0 fundamentally changes the way dynamically fetched secrets persist continuously inside active workloads, transforming the engine into a state-aware telemetry operator.

### High-Impact Features

- **Continuous Provider Watch**: Sub-routines passively monitor integrated backend API streams (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) checking payload MD5 hashes passively against the live cluster footprint utilizing new config properties like `refresh_interval: 1m`.
- **Best-Effort Rolling Restart with Health Checks**: Workloads mapping environments strictly against dynamically rotating credential caches orchestrate explicit background rolling restarts (cloning footprints, diverting traffic based on health probes, and discarding drained instances gracefully). This strategy is best-effort and includes fallback logic.
- **Dynamic File Overwriting**: Credentials mounted securely exclusively utilizing host `.file` architectures inherit real-time transparent overwrites bypassing workload orchestration bounds completely.
- **Rich Telemetry Traces**: Expanded the native API and Log systems mapping structured events like `new_container_created`, `restart_failed`, and `health_check_passed` sequentially over `/api/events` and explicit system-level logs.
