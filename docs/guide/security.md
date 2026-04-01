# Security Model

DSO is designed with a security-first architecture. This page documents every security property and the rationale behind each design decision.

## Core Guarantee: Secrets Never Touch Disk

The most critical property of DSO's security model:

```
Cloud Vault → DSO Agent (RAM) → Docker Unix Socket → Container (RAM)
                                                      ↑
                                           No disk write at any point
```

Secret values exist only in:
- The agent's in-memory cache (RAM)
- The container's environment (RAM)

They are **never** written to:
- The filesystem in plaintext
- Docker image layers
- Docker's container configuration on disk

## Authentication: No Manual Credentials

DSO uses cloud-native machine identity, which means developers never handle production credentials directly.

| Provider | Production Auth Method | Configuration | Security Notes |
|----------|------------------------|---------------|-----------------|
| AWS | EC2 Instance Profile | Attach IAM role, DSO auto-detects | No static credentials |
| Azure | Managed Identity | Enable on VM/ACI | Auto-authenticates via IMDS |
| Vault | AppRole with wrapped secret | Use response wrapping | Secret ID never exposed |
| Local File | File permissions | `0600`, owned by root | Never commit to git |

## Unix Socket Transport

The CLI and agent communicate over a **Unix domain socket** (`/var/run/dso.sock` or similar), not a TCP port. This means:

- The secret transport channel is **local to the host** — no network exposure
- Only processes running as root or in the `docker` group can access it
- No TLS configuration required (operating system enforces permissions)

## Not Visible in `docker inspect`

When secrets are injected via `inject: env`, they are passed to `docker compose` via a temporary environment file that is deleted immediately after the stack starts.

```bash
# Secrets are NOT visible in docker inspect
docker inspect my-container | grep DB_PASSWORD
# → (no output)
```

> [!NOTE]
> The container does have the secret in its runtime environment (accessible via `docker exec ... env`). This is by design — it matches the same access model as any environment variable.

## Provider Isolation

Each provider (AWS, Azure, Vault) runs as a **separate subprocess** communicating via RPC. This provides:

- **Process isolation** — a bug or crash in one provider doesn't affect others
- **Least privilege** — each provider subprocess only has the credentials it needs
- **Containment** — a compromised provider can't access secrets from other providers

## Secret Purge on Shutdown

When `docker dso down` is called, the agent:
1. Removes all containers
2. **Clears the in-memory secret cache**
3. Terminates provider RPC subprocesses

After a clean shutdown, no secret data remains in memory or on disk.

## Audit Trail

Every secret fetch, rotation event, and strategy decision is logged via structured logging. These logs can be forwarded to your SIEM (Splunk, Datadog, etc.):

```json
{"time":"2024-01-15T10:23:45Z","level":"INFO","msg":"Secret fetched","provider":"aws","secret":"myapp/db","status":"success"}
{"time":"2024-01-15T10:24:00Z","level":"INFO","msg":"Rotation triggered","secret":"myapp/db","strategy":"rolling","container":"api"}
```

## Threat Model

| Threat | DSO's Mitigation |
|--------|-----------------|
| Developer commits .env to GitHub | No .env files needed |
| Secrets visible on developer laptops | Never stored on disk |
| Credential rotation requires downtime | Automated rolling rotation |
| Compromised developer machine | Machine holds no credentials — IAM role is VM-scoped |
| Internal pod/container reads another's secrets | Each container receives only its mapped secrets |
| Network interception | Unix socket (local only), no network transport |

## Compliance

DSO's architecture directly supports:

- **SOC2 Type II** — Centralized access control, audit logging, zero disk persistence
- **ISO 27001** — Credential management and access control controls
- **PCI-DSS** — Secrets never stored in source code or on developer endpoints
