<p align="center">
  <img src="docs/assets/logo.png" alt="Docker Secret Operator Logo" width="300">
</p>

<h1 align="center">Docker Secret Operator (DSO)</h1>

<p align="center">
  <strong>A lightweight, production-grade secret management layer for Docker environments — no Kubernetes required.</strong>
</p>

<p align="center">
  <a href="https://go.dev/"><img src="https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go&logoColor=white" alt="Go Version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://github.com/umairmd385/docker-secret-operator/releases"><img src="https://img.shields.io/github/v/release/umairmd385/docker-secret-operator?color=blue" alt="Latest Release"></a>
  <a href="https://github.com/umairmd385/docker-secret-operator/stargazers"><img src="https://img.shields.io/github/stars/umairmd385/docker-secret-operator?style=social" alt="GitHub Stars"></a>
  <a href="https://github.com/umairmd385/docker-secret-operator/actions"><img src="https://github.com/umairmd385/docker-secret-operator/actions/workflows/lint-test.yml/badge.svg" alt="CI Status"></a>
</p>

---

**Docker Secret Operator (DSO)** securely retrieves secrets from external cloud secret managers — such as **AWS Secrets Manager**, **Azure Key Vault**, **Huawei CSMS**, and **HashiCorp Vault** — and injects them into your Docker containers at runtime. It brings a Kubernetes External Secrets-like experience to pure Docker and Docker Compose workflows, with zero infrastructure overhead.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [CLI Commands](#cli-commands)
- [Docker Compose Integration](#docker-compose-integration)
- [Plugin System](#plugin-system)
- [Security Model](#security-model)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Documentation](#documentation)

---

## Quick Start

Install DSO with a single command on Ubuntu/Debian:

```bash
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/install.sh | bash
```

Start the agent:

```bash
sudo systemctl start dso-agent
sudo systemctl status dso-agent
```

Create your configuration at `/etc/dso/dso.yaml`:

```yaml
provider: aws
config:
  region: us-east-1
secrets:
  - name: prod/database/credentials
    inject: env
    mappings:
      password: DB_PASSWORD
```

Deploy your application:

```bash
dso compose up -d
```

---

## Features

| Feature | Description |
| :--- | :--- |
| **No Kubernetes Required** | Works directly with Docker and Docker Compose. |
| **Multi-Cloud Support** | AWS Secrets Manager, Azure Key Vault, Huawei CSMS, HashiCorp Vault. |
| **Local Backends** | `file` and `env` backends for development and air-gapped environments. |
| **Runtime Injection** | Secrets are injected at container startup — never stored on disk. |
| **Secret Rotation** | Automatic polling of cloud providers with in-memory cache invalidation. |
| **Docker Plugin API** | Native V2 Secret Driver support for Docker Swarm. |
| **Unix Socket IPC** | High-speed RPC over Unix socket between CLI and the agent daemon. |
| **Observability** | Structured logging with `zap`, Prometheus metrics, and a REST health API. |
| **Plugin Architecture** | Extend DSO by writing a Go plugin for any secret backend. |
| **One-Command Install** | Idempotent installer handles all dependencies and systemd lifecycle. |

---

## Architecture

DSO is composed of two primary components: the **Agent** (`dso-agent`) and the **CLI** (`dso`).

```mermaid
graph TD
    subgraph Cloud Providers
        AWS[AWS Secrets Manager]
        Azure[Azure Key Vault]
        Vault[HashiCorp Vault]
        Huawei[Huawei CSMS]
    end

    subgraph DSO Host
        Plugins[Provider Plugins\ndso-provider-aws, dso-provider-azure, ...]
        Agent["dso-agent (Daemon)\nCache · Rotator · REST API\n:8080 · :9090/metrics"]
        Socket[Unix Socket\n/var/run/dso.sock]
    end

    subgraph Docker
        CLI["dso CLI\ndso compose · dso fetch"]
        Container[Your Application Container]
    end

    Cloud Providers --> Plugins
    Plugins --> Agent
    Agent --> Socket
    Socket --> CLI
    CLI -->|"ENV injection at startup"| Container
```

### How it works

1. **`dso-agent`** starts as a background daemon (systemd service). It loads provider plugins and polls the cloud provider for secrets on a configurable interval, storing them in an in-memory cache.
2. **When you run `dso compose up`**, the CLI connects to the agent via the Unix socket (`/var/run/dso.sock`), retrieves the required secrets, and injects them as environment variables before invoking the underlying `docker compose` command.
3. **For Docker Swarm**, the DSO native V2 Secret Driver API resolves secrets on-demand when the Swarm manager calls `docker secret create`.

---

## Installation

### Option 1: Automated (Recommended)

The installer handles dependencies (Docker, Go), builds all plugins, configures systemd, and optionally creates the Docker V2 Secret Plugin.

```bash
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/install.sh | bash
```

> **Requirements**: Ubuntu 20.04+ / Debian 11+, `sudo` access, internet connectivity.

### Option 2: Manual Build

```bash
# Clone the repository
git clone https://github.com/umairmd385/docker-secret-operator.git
cd docker-secret-operator

# Build binaries
go build -o /usr/local/bin/dso       ./cmd/dso/
go build -o /usr/local/bin/dso-agent ./cmd/dso-agent/

# Build provider plugins
mkdir -p /usr/local/lib/dso/plugins
for prov in aws azure huawei vault; do
  go build -o /usr/local/lib/dso/plugins/dso-provider-$prov ./cmd/plugins/dso-provider-$prov/
done
```

### Uninstalling

```bash
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/uninstall.sh | bash
```

---

## Configuration

DSO is configured via a YAML file at `/etc/dso/dso.yaml` (or any path passed with `--config`).

### Configuration Schema

```yaml
# Cloud provider to use. Options: aws | azure | huawei | vault | file | env
provider: aws

# Provider-specific configuration
config:
  region: us-east-1   # AWS: region | Azure: vault_name | Vault: address, token

# Secret mappings
secrets:
  - name: prod/database/credentials   # Secret name in the cloud provider
    inject: env                       # Injection method: env | file
    mappings:
      # <cloud-json-key>: <container-env-var-name>
      username: DB_USER
      password: DB_PASSWORD
```

### Provider Examples

<details>
<summary><strong>AWS Secrets Manager</strong></summary>

```yaml
provider: aws
config:
  region: us-east-1
secrets:
  - name: prod/database/credentials
    inject: env
    mappings:
      username: DB_USER
      password: DB_PASSWORD
```

> Credentials are sourced automatically from `~/.aws/credentials`, environment variables, or EC2 Instance Profile / IAM Role.

</details>

<details>
<summary><strong>Azure Key Vault</strong></summary>

```yaml
provider: azure
config:
  vault_name: my-key-vault
secrets:
  - name: app-secret
    inject: env
    mappings:
      username: APP_USER
      password: APP_PASS
```

> Uses Azure Managed Identity, environment variables (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`), or `az login`.

</details>

<details>
<summary><strong>HashiCorp Vault</strong></summary>

```yaml
provider: vault
config:
  address: http://127.0.0.1:8200
  token: hvs.your_vault_token
  mount: secret
secrets:
  - name: database/credentials
    inject: env
    mappings:
      password: DB_PASSWORD
```

</details>

<details>
<summary><strong>Huawei Cloud CSMS</strong></summary>

```yaml
provider: huawei
config:
  region: ap-southeast-1
  project_id: my-project
secrets:
  - name: prod-db-secret
    inject: env
    mappings:
      username: DB_USER
      password: DB_PASSWORD
```

</details>

<details>
<summary><strong>Local File (Development)</strong></summary>

```yaml
provider: file
config:
  path: /etc/dso/secrets/   # Directory containing <secret-name>.json files
secrets:
  - name: database
    inject: env
    mappings:
      password: DB_PASSWORD
```

</details>

### How Mappings Work

Secrets stored in cloud providers are JSON objects. The `mappings` field translates JSON keys into container environment variable names:

```
Cloud Secret                 dso.yaml mapping             Container ENV
─────────────────────────    ──────────────────────────   ────────────────────
{ "password": "s3cr3t" }  →  password: DB_PASSWORD     →  DB_PASSWORD=s3cr3t
```

---

## Usage

### Starting the Agent

The agent is managed automatically by systemd after installation:

```bash
sudo systemctl start   dso-agent   # Start
sudo systemctl stop    dso-agent   # Stop
sudo systemctl restart dso-agent   # Restart
sudo systemctl status  dso-agent   # Status
journalctl -u dso-agent -f        # Live logs
```

### Fetching a Secret Manually

```bash
dso fetch prod/database/credentials
```

### Running Docker Compose with Secret Injection

```bash
dso compose up
dso compose up -d
dso compose -f my-compose.yaml up -d
```

---

## CLI Commands

| Command | Description |
| :--- | :--- |
| `dso compose up` | Fetch secrets and run `docker compose up`. |
| `dso compose up -d` | Fetch secrets and run `docker compose up -d`. |
| `dso compose [args...]` | Pass any `docker compose` arguments through the DSO wrapper. |
| `dso fetch <secret-name>` | Manually fetch and display a secret's key-value pairs. |

---

## Docker Compose Integration

DSO acts as a transparent wrapper around `docker compose`. It intercepts execution, fetches secrets from the agent socket, and injects them as environment variables before your containers start.

**`docker-compose.yaml`**:

```yaml
version: "3.9"
services:
  api:
    image: my-node-api:latest
    environment:
      - DB_USER         # ← Injected by DSO from cloud provider
      - DB_PASSWORD     # ← Injected by DSO from cloud provider
```

**`/etc/dso/dso.yaml`**:

```yaml
provider: aws
config:
  region: us-east-1
secrets:
  - name: prod/database/credentials
    inject: env
    mappings:
      username: DB_USER
      password: DB_PASSWORD
```

**Deploy**:

```bash
dso compose up -d
```

### Verify Secret Injection

```bash
docker compose exec api env | grep DB_
# DB_USER=admin
# DB_PASSWORD=s3cr3t
```

---

## Plugin System

DSO uses a [hashicorp/go-plugin](https://github.com/hashicorp/go-plugin) based RPC architecture.

The agent discovers plugins from `/usr/local/lib/dso/plugins/` (overridable via `DSO_PLUGIN_DIR`). A plugin is any executable named `dso-provider-<name>` that implements the `SecretProvider` interface.

### Built-in Providers

| Plugin | Binary Name |
| :--- | :--- |
| AWS Secrets Manager | `dso-provider-aws` |
| Azure Key Vault | `dso-provider-azure` |
| Huawei CSMS | `dso-provider-huawei` |
| HashiCorp Vault | `dso-provider-vault` |

### Native Backends (no plugin required)

| Provider | Config `provider:` value |
| :--- | :--- |
| Local files | `file` |
| Environment variables | `env` |

### Writing a Custom Provider

Implement the `api.SecretProvider` interface from `pkg/api`:

```go
type SecretProvider interface {
    Init(config map[string]string) error
    GetSecret(name string) (map[string]string, error)
    WatchSecret(name string, interval time.Duration) (<-chan SecretUpdate, error)
}
```

---

## Security Model

DSO is built with a security-first mindset:

| Control | Detail |
| :--- | :--- |
| **In-memory only** | Secrets are never written to disk. They live only in the agent's RAM and are injected directly into container processes. |
| **Unix socket IPC** | The agent-CLI channel is a Unix socket (`/var/run/dso.sock`) with strict OS-level permissions. No network exposure. |
| **Log redaction** | Structured logging via `zap` is configured to omit all secret values. Only secret names and metadata are logged. |
| **IAM roles** | On AWS/Azure/Huawei, use Instance Profiles or Managed Identities. Avoid hardcoding credentials. |
| **File injection via tmpfs** | When using `inject: file`, secrets are written to memory-backed `tmpfs` mounts, not persistent storage. |
| **Plugin binary trust** | *(Roadmap)* Plugin binaries will be verified against SHA256 checksums before execution. |

---

## Examples

The `examples/` directory contains fully working reference configurations:

```
examples/
├── aws-compose/          # AWS Secrets Manager + Docker Compose
├── azure-compose/        # Azure Key Vault + Docker Compose
├── huawei-compose/       # Huawei CSMS + Docker Compose
├── production-compose/   # Production-grade multi-service example
└── docker-swarm/         # Docker Swarm with native Secret Driver
```

---

## Troubleshooting

### Plugin Not Found

```
Error: failed to start provider plugin client dso-provider-aws
```

**Fix**: Verify the plugin binary exists and is executable:

```bash
ls -la /usr/local/lib/dso/plugins/
chmod +x /usr/local/lib/dso/plugins/dso-provider-aws
```

Check that `provider:` in `dso.yaml` matches the binary name suffix exactly (case-sensitive).

---

### Authentication Failure

```
Error: operation error Secrets Manager: GetSecretValue, StatusCode: 403
```

**Fix**: Ensure the host has valid credentials:

```bash
# AWS
aws sts get-caller-identity

# Azure
az account show

# Or for EC2/VM — verify the Instance Profile/Managed Identity is attached.
```

---

### Secret Mapping Errors

```
Error: key "password" not found in secret "my-secret"
```

**Fix**: Confirm the secret in the cloud provider is valid JSON and the key names match your `mappings` exactly (case-sensitive):

```bash
aws secretsmanager get-secret-value --secret-id my-secret | jq '.SecretString | fromjson'
```

---

### Socket Permission Issues

```
Error: failed to connect to dso-agent socket at /var/run/dso.sock
```

**Fix**: Verify the agent is running and the socket exists:

```bash
sudo systemctl status dso-agent
ls -la /var/run/dso.sock
```

If needed, restart the agent:

```bash
sudo systemctl restart dso-agent
```

---

## Project Structure

```
docker-secret-operator/
├── cmd/
│   ├── dso/                        # CLI entrypoint (dso compose, dso fetch)
│   ├── dso-agent/                  # Agent daemon entrypoint
│   └── plugins/
│       ├── dso-provider-aws/       # AWS Secrets Manager plugin
│       ├── dso-provider-azure/     # Azure Key Vault plugin
│       ├── dso-provider-huawei/    # Huawei CSMS plugin
│       └── dso-provider-vault/     # HashiCorp Vault plugin
├── internal/
│   ├── agent/                      # Agent core (cache, server, rotator)
│   ├── auth/                       # Token-based authentication
│   ├── injector/                   # Secret injection logic for CLI
│   └── server/                     # REST API server
├── pkg/
│   ├── api/                        # Shared interfaces and types
│   ├── backend/                    # Native local backends (file, env)
│   ├── config/                     # YAML config loader
│   ├── observability/              # Logging (zap) + Prometheus metrics
│   └── provider/                   # Plugin loader (hashicorp/go-plugin)
├── plugin/
│   └── config.json                 # Docker V2 Secret Driver manifest
├── examples/                       # Reference deployments
├── .github/workflows/              # CI/CD (lint, security, release)
├── install.sh                      # One-command production installer
├── uninstall.sh                    # Clean removal script
└── dso.yaml                        # Example configuration
```

---

## Service Management

| Action | Command |
| :--- | :--- |
| **Start** | `sudo systemctl start dso-agent` |
| **Stop** | `sudo systemctl stop dso-agent` |
| **Restart** | `sudo systemctl restart dso-agent` |
| **Enable on boot** | `sudo systemctl enable dso-agent` |
| **View logs** | `journalctl -u dso-agent -f` |
| **Metrics** | `curl http://localhost:9090/metrics` |
| **Health check** | `curl http://localhost:8080/health` |
| **List active secrets** | `curl http://localhost:8080/secrets` |

---

## Contributing

Contributions are welcome! Please open an Issue to discuss your idea before submitting a Pull Request.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request.

All PRs are automatically checked for lint, tests, and security vulnerabilities.

---

## License

DSO is licensed under the [MIT License](LICENSE).

---

## Documentation

Full documentation is published at:

**[https://umairmd385.github.io/docker-secret-operator/](https://umairmd385.github.io/docker-secret-operator/)**

To enable GitHub Pages on your fork:
1. Go to **Settings → Pages**.
2. Set **Source** → `Deploy from a branch` → `main` / `/ (root)`.
3. Click **Save**.
