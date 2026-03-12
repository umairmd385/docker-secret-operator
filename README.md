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
    Socket[/var/run/dso.sock]
    
    ProviderAWS[dso-provider-aws]
    ProviderAzure[dso-provider-azure]

    CLI --> Agent
    Agent --> Socket
    Agent -. Init() config .-> ProviderAWS
    Agent <-->|gRPC| ProviderAWS
    Agent <-->|gRPC| ProviderAzure
    
    ProviderAWS <--> AWS[AWS Secrets Manager]
    ProviderAzure <--> Azure[Azure Key Vault]
```

1. **`dso-agent` (Secret Daemon)**: The persistent background process managing authentication, cache TTLs, secret rotation, and exposing the gRPC Unix socket.
2. **Provider Plugins**: Standalone binaries loaded dynamically based on your `dso.yaml` configuration.
3. **`dso` CLI**: The wrapper tool overriding standard `docker compose` calls to intercept, map, and inject credentials via the `exec` syscall.

---

## 🚀 Deployment Guide (Linux / EC2)

This guide deploys the persistent `dso-agent` and configures the provider plugins globally on a Linux server.

### 1. Install Core Binaries
```bash
git clone https://github.com/docker-secret-operator/dso.git
cd dso

# Build the main CLI tools
go build -o dso cmd/dso/*.go
go build -o dso-agent cmd/dso-agent/*.go

# Move to system path
sudo mv dso dso-agent /usr/local/bin/
```

### 2. Configure Plugin Discovery
DSO discovers its cloud integrations via standalone binaries prefixed with `dso-provider-` inside the plugin directory. 
By default, DSO searches `/usr/local/lib/dso/plugins/`.

```bash
# Create the secure plugin directory
sudo mkdir -p /usr/local/lib/dso/plugins
sudo chmod 755 /usr/local/lib/dso/plugins

# Build and install the required cloud providers (e.g., AWS & Azure)
cd cmd/plugins/dso-provider-aws && go build -o ../../../dso-provider-aws main.go && cd ../../../
cd cmd/plugins/dso-provider-azure && go build -o ../../../dso-provider-azure main.go && cd ../../../

sudo mv dso-provider-aws dso-provider-azure /usr/local/lib/dso/plugins/
```

When you define `provider: aws` in your `dso.yaml`, the agent dynamically attempts to execute `/usr/local/lib/dso/plugins/dso-provider-aws`.

### 3. Setup systemd Service
To ensure the socket is always available and surviving reboots, run `dso-agent` as a system service.

Create `/etc/systemd/system/dso-agent.service`:
```ini
[Unit]
Description=Docker Secret Operator Agent
After=network.target

[Service]
Type=simple
# Optionally, restrict the daemon to a specific user instead of root
# User=dso
ExecStart=/usr/local/bin/dso-agent
Restart=on-failure
RestartSec=5

# For Azure/AWS identity environments, you can define specific env vars
# Environment="AWS_REGION=us-east-1"

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dso-agent
sudo systemctl status dso-agent
```
Verify the socket exists: `ls -la /var/run/dso.sock`

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
