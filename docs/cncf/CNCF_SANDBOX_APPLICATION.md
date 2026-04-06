# CNCF Sandbox Application — Docker Secret Operator (DSO)

## Project Description

Docker Secret Operator (DSO) is a reconciliation engine that syncs secrets from cloud providers (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, Huawei CSMS) into Docker containers at runtime.

It runs as a lightweight agent on the Docker host. You define which secrets your containers need in a YAML file, and DSO handles the rest — fetching, caching, injecting, and automatically rotating secrets when they change upstream.

The project ships as a native Docker CLI plugin (`docker dso up -d`) and is written in Go. It uses about 20MB of RAM and runs as a systemd service.

**Repository:** https://github.com/docker-secret-operator/dso  
**License:** Apache-2.0  
**Language:** Go  
**Current version:** v3.0.0  

## Problem Statement

Docker's ecosystem has a secret management gap.

If you use Kubernetes, you have the External Secrets Operator, Sealed Secrets, and native `Secret` resources. The reconciliation model is well-established — controllers continuously ensure desired state matches actual state.

If you use plain Docker or Docker Compose, your options are:

- **`.env` files** — Insecure. They sit on disk, get committed to git, and fail compliance audits
- **Docker Swarm secrets** — Requires Swarm mode, which most teams don't use in 2026
- **Manual injection** — Scripting `docker run -e` with values pulled from a vault. Fragile, no rotation, no reconciliation

There's no native way to say "this container needs secret X from AWS, keep it updated" without building a custom solution or moving to Kubernetes.

DSO fills this gap.

## Cloud Native Alignment

DSO follows the reconciliation pattern that is fundamental to cloud-native infrastructure:

1. **Desired state** — Defined in `dso.yaml` (which secrets, which provider, which containers)
2. **Actual state** — What's currently in the running container's environment
3. **Reconciliation loop** — The trigger engine continuously compares desired vs actual state using SHA-256 hashing, and converges them when they diverge

This is the same pattern used by Kubernetes controllers, Flux, ArgoCD, and the Operator Framework. DSO applies it to Docker.

Additional cloud-native alignment:

- **Pluggable provider model** — Each cloud provider is a separate binary loaded via RPC. Adding a new backend doesn't require modifying the core agent.
- **Observability** — Prometheus metrics for secret fetch latency, cache hits/misses, rotation events, and backend failures. Structured JSON audit logging.
- **Declarative configuration** — The YAML config describes desired state, not imperative steps.
- **In-memory security model** — Secrets never touch disk. They're held in process memory and injected via environment variables or tmpfs mounts.

## CNCF Landscape Fit

DSO fits in two areas of the [CNCF Landscape](https://landscape.cncf.io/):

### Runtime → Container Runtime
DSO operates at the container runtime layer, injecting secrets directly into Docker containers as they start and updating them while they run.

### Provisioning → Security & Compliance
DSO is fundamentally a security tool. It eliminates static credentials on disk, provides audit-compliant secret rotation, and ensures secrets are sourced from approved cloud providers.

The closest existing CNCF project is the **External Secrets Operator** — but ESO requires Kubernetes. DSO serves the same purpose for Docker environments.

## Why CNCF Sandbox

We're applying for Sandbox for three reasons:

### 1. Neutral governance
DSO is currently maintained by a single developer. Moving to CNCF provides neutral governance, which matters for adoption by organizations that need vendor independence.

### 2. Community growth
The Docker secret management problem is widely felt but poorly addressed. Being part of the CNCF ecosystem will help DSO reach the teams that need it — particularly those running Docker Compose in production without Kubernetes.

### 3. Long-term ecosystem value
As the cloud-native ecosystem matures, we believe the reconciliation pattern should be available everywhere — not just in Kubernetes. DSO extends cloud-native principles to the broader Docker ecosystem, and CNCF is the right home for that work.

## Project Health

- Active development since 2024
- 3 major releases (v1, v2, v3)
- 4 production cloud providers supported
- Architecture designed for extensibility (pluggable providers, strategy engine)
- CI/CD with security scanning (gosec, govulncheck)
- Comprehensive documentation (VitePress site)

## Maintainers

| Name | GitHub | Affiliation |
|------|--------|-------------|
| Umair | [@umairmd385](https://github.com/umairmd385) | Independent |

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md) — Technical deep-dive
- [GOVERNANCE.md](../GOVERNANCE.md) — Project governance model
- [CONTRIBUTING.md](../CONTRIBUTING.md) — How to contribute
- [SECURITY.md](../SECURITY.md) — Security policy
