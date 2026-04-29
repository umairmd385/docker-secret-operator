# Quickstart Guide

This guide will help you set up **Docker Secret Operator (DSO)** and synchronize your first secret in under 2 minutes, using either **Local Mode** or **Cloud Mode**.

---

## 1. Installation

DSO is a native Docker CLI plugin. Use the installer to place the binary in your Docker plugins directory.

### Linux / macOS
```bash
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash
```

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.ps1 | iex
```

### Verify Installation
```bash
docker dso version
```

---

## 2. Choose Your Mode

DSO v3.2 supports **Dual-Mode Execution**. Choose the one that fits your environment.

### A. Local Mode (Development)
Uses a local, AES-256-GCM encrypted vault. No cloud providers or root access required.

1. **Initialize Vault**:
   ```bash
   docker dso init
   ```
2. **Set a Secret**:
   ```bash
   docker dso secret set DB_PASSWORD mysecret
   ```

### B. Cloud Mode (Production)
Syncs secrets from AWS, Azure, Huawei Cloud, or HashiCorp Vault. Requires root for systemd agent installation.

1. **Setup Providers**:
   ```bash
   docker dso system setup --providers aws
   ```
2. **Verify Connectivity**:
   ```bash
   docker dso system doctor
   ```

---

## 3. Map Your Secrets

Create a `dso.yaml` file to define how secrets are injected into your containers.

### Local Mode Example
```yaml
# dso.yaml
secrets:
  - name: DB_PASSWORD
    inject: env
```

### Cloud Mode Example
```yaml
# dso.yaml
provider: aws
config:
  region: us-east-1

secrets:
  - name: production/db-pass
    inject: env
    mappings:
      password: DB_PASSWORD
```

---

## 4. Run Your Stack

DSO automatically detects your mode and injects secrets into your Docker Compose services at runtime.

```bash
docker dso up -d
```

---

## 5. Verify Injection

```bash
docker exec -it <container_name> env | grep DB_
```

---

## Next Steps

- **[System Architecture](/guide/architecture)**: Learn how the Dual-Mode engine works.
- **[CLI Reference](/guide/cli)**: Detailed documentation for all subcommands.
- **[Configuration Reference](/guide/configuration)**: Detailed documentation for `dso.yaml`.
