# 🔹 Release Notes v1.0.0

## Initial Release (Stable Base)

Welcome to the initial stable release of **Docker Secret Operator (DSO)**! 

DSO aims to fix the massive gap in Docker security by bringing Kubernetes-grade external secret mapping to standalone Docker environments. Stop committing your secrets in `.env` files or relying on hardcoded YAML files!

### ✨ Features
- **Basic Secret Injection**: Natively fetches secrets and injects them as environments into Docker workloads at runtime.
- **Provider Integrations**:
  - AWS Secrets Manager
  - Azure Key Vault
  - Huawei Cloud CSMS
  - HashiCorp Vault
- **Standalone `dso` CLI**: Simple wrapper around docker-compose. Just define your secrets in `/etc/dso/dso.yaml` and run `dso compose up -d`.
- **In-Memory Security**: Secrets are never written to disk. They are held in memory locally during runtime only.

### 🐛 Limitations
- No background secret rotation or event triggers yet.
- Only environment variable injection natively supported.
