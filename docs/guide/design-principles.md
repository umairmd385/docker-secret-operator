# Design Principles

Docker Secret Operator (DSO) is guided by a set of core principles that prioritize security, operational simplicity, and native integration. Every feature and architectural decision must align with these pillars.

---

## 1. Zero Persistence by Default
Secrets should never touch persistent storage. 
- **The Rule**: No `.env` files, no host-path mounts for plaintext secrets, and no secret data in image layers.
- **The Implementation**: Secrets are held in the agent's RAM and injected via `tmpfs` mounts or the `CopyToContainer` API.

## 2. Event-Driven Reconciliation
DSO is not a one-time "fetch and forget" tool. It is a state reconciler.
- **The Rule**: The system must respond immediately to changes in either the source (Vault) or the destination (Docker).
- **The Implementation**: A continuous Control Loop (Watch-Analyze-Inject) ensuring the "Actual State" always matches the "Desired State."

## 3. Docker-Native Experience
DSO should feel like a first-class citizen of the Docker ecosystem.
- **The Rule**: No complex external dependencies or sidecar architectures where possible.
- **The Implementation**: Native CLI plugin support (`docker dso`), metadata-driven discovery via Labels, and interaction through the standard Docker Unix socket.

## 4. Least Privilege / Machine Identity
Human intervention in secret management should be minimized to prevent credential leakage.
- **The Rule**: Eliminate static credentials (API Keys, Client Secrets) on the host.
- **The Implementation**: Deep integration with cloud-native identity providers (AWS IAM, Azure Managed Identity) so the host "is" the credential.

## 5. Atomic and Non-Destructive Rotation
Secret updates should never leave an application in a partially-configured or broken state.
- **The Rule**: Updates must be all-or-nothing and verified for health.
- **The Implementation**: Tar-streamed injection and intelligent rotation strategies that wait for health-checks before removing old container instances.

---

## Why These Principles Matter
By strictly adhering to these principles, DSO provides a security model that is significantly more robust than traditional Docker secret management, while maintaining the simplicity that makes Docker the preferred choice for many engineering teams.

## Next Steps
- **[System Architecture](/guide/architecture)**: See how these principles are implemented.
- **[Security Model](/guide/security)**: Detailed threat mitigations.
- **[Production Readiness](/guide/production-readiness)**: Deploying DSO in high-security environments.
