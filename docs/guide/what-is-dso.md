# What is DSO?

**Docker Secret Operator (DSO)** is a native Docker CLI plugin that injects secrets from cloud vaults (AWS, Azure, HashiCorp Vault, Huawei CSMS) directly into your Docker containers at runtime — without `.env` files, without hardcoded credentials, and without Kubernetes.

## The Problem

Every Docker team eventually hits the same wall:

```bash
# The .env way — a security disaster
DB_PASSWORD=my-super-secret-password-123  # sitting on every developer laptop
API_KEY=sk-prod-abcdef                    # accidentally committed to GitHub
```

The "proper" solution is Kubernetes with external-secrets — but that's months of migration and massive operational overhead for teams running Docker Compose stacks.

**DSO solves this without leaving Docker.**

## How it Works

DSO runs as a native Docker Engine plugin (`~/.docker/cli-plugins/docker-dso`). When you run `docker dso up -d`, it:

1. Reads your `dso.yaml` to know which secrets to fetch and from where
2. Authenticates to your cloud vault using machine identity (IAM role, Managed Identity, Vault token)
3. Fetches secrets and holds them **in memory only** — nothing written to disk
4. Injects secrets into containers via the Docker Unix socket
5. Starts a background **Watcher Engine** that monitors for secret changes and rotates automatically

## Key Properties

| Property | Detail |
|----------|--------|
| **Runtime only** | Secrets exist only while your stack is running |
| **Memory-only** | Never written to disk, not visible in `docker inspect` |
| **Zero manual credentials** | Uses cloud-native identity (IAM, Managed Identity) |
| **Multi-cloud** | AWS, Azure, HashiCorp Vault, Huawei CSMS |
| **Docker-native** | First-class `docker dso` CLI subcommand |
| **Auto-rotation** | Detects secret changes and rotates containers intelligently |

## Who Is It For?

- **DevOps engineers** who need SOC2 compliance without migrating to Kubernetes
- **Startups** running production workloads on Docker Compose
- **Security teams** eliminating `.env` files from developer machines
- **Platform engineers** building a multi-cloud secret management layer

## Next Steps

- [Get Started in 5 minutes →](/guide/getting-started)
- [Understand the internals →](/guide/concepts)
- [View configuration reference →](/guide/configuration)
