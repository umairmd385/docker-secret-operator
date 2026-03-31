# What is DSO?

**Docker Secret Operator (DSO)** is a native Docker plugin that securely injects secrets from cloud providers directly into your running containers — without the complexity of Kubernetes or sidecars.

Historically, managing secrets in a pure Docker environment was a challenge. You either had to resort to unsecure environment variables in `.env` files (which stay on disk) or use Docker Secrets (which are limited in scope and don't natively sync with external cloud providers like AWS or Azure).

DSO bridges that gap by providing a **runtime-only injection mechanism**.

---

## 🔒 Security-First Architecture
DSO is built with a deep focus on security and performance.

- **Secrets Never Touch Disk**: All secret values are held in-memory and injected directly into the container's environment via Unix socket communication.
- **Memory-Only Core**: Once DSO is shut down, all secret information is purged from the host's memory.
- **Zero Persistence**: No secret configuration or values are ever written to the local file system in a readable format.

---

## 🚀 Key Features

### 🏢 Unified Cloud Support
DSO provides a single, standard `dso.yaml` configuration format across all major secret stores:
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Google Cloud Secret Manager (Coming soon)
- Local File Provider (for development)

### 🔄 Hot-Reload & Rotation
You can rotate your secrets in your cloud provider and DSO will automatically detect the change and re-inject the new values into your containers in real-time — **without restarting your services.**

### 🧩 Native Docker Experience
DSO runs as a native Docker Engine plugin and is managed through the standard `docker` CLI. No new binaries to manage, no complex cluster configurations.

---

## 🏗️ How it Works
1. **DSO Plugin**: Runs as a lightweight background agent on your Docker host.
2. **dso.yaml**: Defines which secrets to fetch and where to inject them.
3. **Runtime Injection**: When you run `docker dso up -d`, the plugin fetches secrets and securely delivers them to your containers as environment variables or file mounts.

Ready to secure your secrets? [Get Started with the Installation →](/guide/getting-started)
