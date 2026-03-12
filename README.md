# Docker Secret Operator (DSO)

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go)](https://go.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Prometheus Metrics](https://img.shields.io/badge/Metrics-Prometheus-E6522C?logo=prometheus)](https://prometheus.io/)

**Docker Secret Operator (DSO)** brings the capabilities of Kubernetes External Secrets and Vault Agent to pure Docker and Docker Compose environments. 

It automatically retrieves credentials from cloud secret managers (AWS, Azure, HashiCorp Vault, Huawei CSMS), caches them dynamically, handles automatic credential rotation, and injects them securely into Docker containers at runtime—without requiring any modifications to application source code.

---

## 🏗 System Architecture

DSO uses a high-performance Agent architecture alongside an extensible `hashicorp/go-plugin` ecosystem.

```mermaid
graph TD
    CLI[dso compose up]
    Agent[dso-agent Daemon]
    Socket["/var/run/dso.sock"]
    
    ProviderAWS[dso-provider-aws]
    ProviderAzure[dso-provider-azure]

    CLI --> Agent
    Agent --> Socket
    Agent -. "Init() config" .-> ProviderAWS
    Agent <-->|gRPC| ProviderAWS
    Agent <-->|gRPC| ProviderAzure
    
    ProviderAWS <--> AWS[AWS Secrets Manager]
    ProviderAzure <--> Azure[Azure Key Vault]
```

1. **`dso-agent` (Secret Daemon)**: The persistent background process managing authentication, cache TTLs, secret rotation, and exposing the gRPC Unix socket.
2. **Provider Plugins**: Standalone binaries loaded dynamically based on your `dso.yaml` configuration.
3. **`dso` CLI**: The wrapper tool overriding standard `docker compose` calls to intercept, map, and inject credentials via the `exec` syscall.

---

## 🚀 Deployment Guide

There are two primary ways to deploy the `dso-agent` and its plugins: using our fully automated install script on a Linux host, or running the agent securely within a Docker container.

### Method A: Automated Installation (Linux / EC2)

The quickest way to get started is using the provided `install.sh` script, which compiles the core and all cloud plugins, mounts them to your `$PATH`, and sets up a `systemd` background service automatically.

```bash
git clone https://github.com/docker-secret-operator/dso.git
cd dso
chmod +x install.sh

# Run the automated installer
sudo ./install.sh
```
Verify the agent service is running: `systemctl status dso-agent` and check `ls -la /var/run/dso.sock`.

### Method B: Docker Container Deployment

If you prefer not to install bare-metal binaries, you can run the `dso-agent` daemon itself inside a Docker container. We volume mount the host's `/var/run` so that the generated socket is accessible to the `dso compose up` CLI on your host.

```bash
git clone https://github.com/docker-secret-operator/dso.git
cd dso

# Build the host CLI binary (required to run `dso compose up`)
go build -o dso cmd/dso/*.go
sudo mv dso /usr/local/bin/

# Start the agent container in daemon mode
docker compose -f docker-compose.agent.yml up -d
```

---

## 🛠 Configuration (`dso.yaml`)

Define your secret connections in a `dso.yaml` file located in the same directory as your `docker-compose.yml`.

### Example 1: AWS Secrets Manager
Leverages the robust `aws-sdk-go-v2`. Supports EC2 Instance Profiles automatically.

AWS Secret stored as JSON (`my-production-db`):
```json
{
  "username": "admin",
  "password": "super_secret_password"
}
```

**`dso.yaml`:**
```yaml
provider: aws
config:
  region: us-east-1

agent:
  refresh_interval: 2m
  cache: true

secrets:
  - name: my-production-db
    inject: env
    mappings:
      username: DB_USER    # Maps JSON 'username' to 'DB_USER' in the container
      password: DB_PASSWORD
```

### Example 2: Azure Key Vault (File Injection)
Uses `azidentity`. Works natively with Azure Managed Identities. If a secret is injected as a file, the DSO framework mounts an overlay `tmpfs` volume array ensuring the secret never touches physical disk storage and remains invisible to `docker inspect`.

**`dso.yaml`:**
```yaml
provider: azure
config:
  vault_url: "https://my-company-vault.vault.azure.net/"

secrets:
  - name: my-api-token
    inject: file
    path: /run/secrets/api_token
    # If mappings are omitted, the entire raw secret value writes to the file
```
Application reading the file (NodeJS):
```javascript
const fs = require('fs');
const token = fs.readFileSync('/run/secrets/api_token', 'utf8');
```

---

## 🐋 Docker Compose End-to-End Workflow

Instead of typing `docker compose up`, wrap your workflow via `dso compose up`. The tool pre-parses the environment, calls the Unix socket, retrieves the latest cached/rotated secrets from the cloud, and executes your stack seamlessly.

**`docker-compose.yml`:**
```yaml
version: '3.8'
services:
  api:
    image: node-api
    environment:
      - DB_USER      # Leave empty. DSO populates this from memory via Sychronized exec injection
      - DB_PASSWORD
```

**Run the stack:**
```bash
dso compose up -d
```

**Verification:**
```bash
# Check if secrets were mapped, yet securely hidden from inspect:
docker exec -it node-api env | grep DB_USER
# DB_USER=admin (Available inside the container at runtime!)

docker inspect node-api | grep DB_USER
# (Empty! The credentials do not exist in the inspect manifest.)
```

---

## 📂 Examples Directory
See the `/examples` directory in this repository for full working boilerplate files:
* `examples/aws-docker-compose`
* `examples/azure-docker-compose`
* `examples/huawei-docker-compose`

---

## 📊 Observability (Prometheus)
The `dso-agent` exposes Prometheus metrics natively on `:9090/metrics` for advanced alerting on secret rotation and API availability.

**Scrape Configuration** (`prometheus.yml`):
```yaml
scrape_configs:
  - job_name: 'dso-agent'
    static_configs:
      - targets: ['127.0.0.1:9090']
```

**Exposed Metrics**:
- `dso_secret_requests_total{provider="aws", status="success|error|rotation"}`: Count of all requests per provider plugin.
- `dso_secret_cache_hits_total{secret="my-production-db"}`: Effectiveness of the memory cache.
- `dso_secret_cache_misses_total`: Raw count of uncached socket hits crossing the wire.

---

## 🩺 Troubleshooting Guide

**Error: `failed to connect to dso-agent socket at /var/run/dso.sock`**
> The daemon `dso-agent` is inactive. Start it via `systemctl start dso-agent`. Ensure your user has filesystem permissions to read/write the `.sock`.

**Error: `failed to start provider plugin client dso-provider-aws`**
> The DSO Agent cannot find the plugin binary. Ensure `dso-provider-aws` is downloaded/compiled and exists inside `/usr/local/lib/dso/plugins/` with execution permissions (`chmod +x`).

**Error: `aws secret ... has no string value / parsing JSON`**
> The AWS SDK failed to decode the SecretString. Ensure your AWS Secrets Manager credential is stored as Plaintext JSON.

**Metrics server port collision**
> By default the Agent binds to port `9090`. If this conflicts with your workloads, modify the agent start command or edit the `main.go`.
