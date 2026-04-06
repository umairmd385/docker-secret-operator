# Docker Sponsored Open Source (DSOS) Application

## Project Name

Docker Secret Operator (DSO)

## Project Description

DSO is a secret management agent for Docker. It connects your Docker containers to cloud secret providers like AWS Secrets Manager, Azure Key Vault, and HashiCorp Vault, and keeps the secrets in sync automatically.

Here's the simplest way to explain it: you define which secrets your containers need in a YAML file, and DSO fetches them at runtime and injects them into the container's environment. When a secret changes upstream, DSO detects the change and updates the running containers — without you doing anything.

It ships as a native Docker CLI plugin, so using it feels like regular Docker:

```bash
docker dso up -d
```

The project is written in Go, open-source under the Apache-2.0 license, and has no commercial component.

**Repository:** https://github.com/docker-secret-operator/dso  
**License:** Apache-2.0  
**Language:** Go  

## The Problem

Docker users don't have a simple, built-in way to manage secrets from cloud providers.

Docker Swarm has a `docker secret` command, but most teams aren't using Swarm anymore. The common alternative — `.env` files — is a security problem that doesn't scale. These files sit on disk, get committed to repositories by accident, and make compliance audits painful.

If you want proper secret management with Docker today, your realistic options are:

1. Migrate to Kubernetes (which is often massive overkill for what you need)
2. Write custom scripts to pull secrets from cloud APIs before starting containers (fragile, no rotation, no reconciliation)
3. Accept the risk and use `.env` files

None of these are good answers for the majority of Docker users who just want to run a Compose stack securely.

## How DSO Solves This

DSO runs as a lightweight systemd service on the Docker host. It:

- **Fetches secrets** from cloud providers using machine-level authentication (IAM roles, Managed Identity — no static credentials)
- **Injects them** into containers as environment variables or tmpfs mounts (never written to disk)
- **Monitors for changes** using a reconciliation loop with SHA-256 hash comparison
- **Rotates automatically** — when a secret changes upstream, DSO updates the affected containers with zero manual intervention
- **Chooses the right strategy** — it analyzes each container's characteristics (ports, statefulness, health checks) and picks the safest update approach (rolling, restart, or signal)

## Why a "Verified" Badge Matters

A Docker Hub "Verified Publisher" badge would help DSO in a few important ways:

1. **Trust signal** — DSO handles secrets. Users need to trust the tool they're using for security-critical infrastructure. A verified badge from Docker signals that the project meets a quality bar.

2. **Visibility** — Most Docker users discover tools through Docker Hub. Being verified and visible there means reaching the teams who actually have this problem.

3. **Community confidence** — We're a small project asking people to trust us with their cloud credentials. Having Docker's endorsement helps bridge that initial trust gap.

## Open Source Commitment

DSO is fully open-source and non-commercial:

- **License:** Apache-2.0
- **No paid tier or enterprise edition** — Everything is in the public repo
- **No telemetry or tracking** — The agent doesn't phone home
- **No vendor lock-in** — Supports multiple cloud providers, and adding new ones is straightforward

The project is maintained by individual contributors, not backed by a company.

## CNCF Sandbox

We're targeting CNCF Sandbox admission in 2026. DSO follows the same reconciliation pattern used by Kubernetes controllers — desired state vs actual state, continuously converged — but applies it to Docker environments. We believe this makes it a natural fit for the cloud-native ecosystem.

Having both CNCF Sandbox status and Docker's Verified badge would position DSO as a trusted, neutral tool in the secret management space — not tied to any single vendor or platform.

## Project Stats

- **3 major versions** released (v1, v2, v3)
- **4 cloud providers** supported (AWS, Azure, Vault, Huawei)
- **Go** — minimal runtime dependencies, ~20MB memory footprint
- **Active CI/CD** with security scanning (gosec, govulncheck)
- **Documentation site** built with VitePress

## Maintainer

| Name | GitHub | Contact |
|------|--------|---------|
| Umair | [@umairmd385](https://github.com/umairmd385) | umairmd385@gmail.com |
