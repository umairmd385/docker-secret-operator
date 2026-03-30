# 🔥 docker-dso

**Secrets for Docker, done right.**

[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/Version-v3.0.0-blueviolet.svg)](https://github.com/umairmd385/docker-secret-operator/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Docker Support](https://img.shields.io/badge/Docker-Native%20Plugin-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/engine/extend/)

👉 **Stop using `.env` files. Run secure Docker apps with dynamic secrets in one command.**

---

## ⚡ QUICK DEMO

```bash
docker dso up -d
```

- **Fetch secrets** automatically from AWS, Azure, GCP, or Vault.
- **Inject securely** into containers temporarily at runtime.
- **Start Docker Compose** exactly like normal.

> *No `.env`. No leaks. No Kubernetes.*

---

## 🚀 WHAT IS docker-dso?

We've all been there: You're trying to spin up a Docker Compose stack, but you end up hardcoding secret tokens in `docker-compose.yml`, or relying on insecure, committed `.env` files that inevitably leak onto GitHub. To solve this properly, people usually migrate their entire stack to Kubernetes, adopting immense unnecessary complexity.

**docker-dso** solves this. It's a proper, native Docker CLI plugin that hooks directly into Docker Compose to fetch centralized credentials from cloud provider vaults exactly precisely when containers boot. 

It is the missing secret operator for Docker. 

---

## 😡 THE PROBLEM

- **`.env` files leak secrets**: They get accidentally committed, shared insecurely over Slack, and sit plainly unencrypted on local disks.
- **Docker secrets are limited**: Native `docker secret` requires full Docker Swarm mode. They do not natively pull from external cloud backends.
- **Kubernetes is too heavy**: Don't rewrite your infrastructure just to get external secret mapping.

---

## ✅ THE SOLUTION

`docker-dso` makes secret management a native part of your existing Docker ecosystem. By seamlessly mapping cloud provider credentials (like AWS Secrets Manager) directly into simple Compose tags, it eliminates friction securely and intuitively.

---

## ⚔️ COMPARISON TABLE

| Feature                   | Built-in Docker Secrets | docker-dso |
| ------------------------- | ----------------------- | ---------- |
| Works without Swarm       | ❌                       | ✅          |
| External secret providers | ❌                       | ✅          |
| Secret rotation           | ❌                       | ✅          |
| Zero-downtime updates     | ❌                       | ✅          |
| Dev-friendly              | ⚠️                       | ✅          |

---

## 🧠 KEY FEATURES

- **Docker CLI Plugin**: First-party operational feel (`docker dso <cmd>`).
- **Compose Integration**: Parse `docker-compose.yml` natively and inject automatically without wrappers.
- **Secure Injection**: Injects fetched tokens securely and dynamically into tmpfs boundaries or environment variables.
- **Secret Rotation**: Watcher engine detects cloud provider updates, gracefully restarting bounded containers.
- **Multi-Cloud Support**: Connects to AWS Secrets Manager, Azure Key Vault, Huawei CSMS, HashiCorp Vault.

---

## ⚡ QUICK START

```bash
# Initialize limits & configuration natively
docker dso init

# Inject securely and boot your app
docker dso up -d
```

---

## 📦 REAL WORLD EXAMPLE

You declare `dso:` attributes directly inside your generic Compose file.

**`docker-compose.yml`**
```yaml
version: "3.9"

services:
  app:
    image: my-secure-app:latest
    secrets:
      - db_password

secrets:
  db_password:
    # 💥 The Magic Happens Here!
    dso: aws-sm://prod/db/password
```

---

## 🔄 SECRET ROTATION

Hardcoded files get stale. Credentials expire.
`docker-dso` utilizes an **Event-Driven Watcher system** that natively secures rotation endpoints gracefully. 

When you configure rotation:
1. `docker-dso` securely polls or listens via webhook for updates from your cloud provider (e.g. AWS Secrets Manager).
2. It detects structural ID payload shifts cleanly.
3. Automatically performs a *Zero-Downtime Rolling Restart* of any affected container seamlessly.

---

## 🧱 ARCHITECTURE

```text
   AWS / Vault / Azure
            ↓ (Fetches Secret)
  [ docker-dso CLI Plugin ] 
            ↓ (Secures dynamically into execution map)
 [ docker compose up -d ]
            ↓
     Live Containers
```

---

## 🔁 MIGRATION GUIDE

If you used DSO versions 1.x or 2.x, migrating to 3.x is exceptionally simple:

From:
```bash
dso apply
dso fetch my-secret
dso compose up -d
```

To:
```bash
docker dso apply
docker dso fetch my-secret
docker dso up -d
```

The legacy `dso` binary is officially deprecated.

---

## 👥 WHO IS THIS FOR?

- **DevOps Engineers** seeking secure operational bounds without extreme scaling costs.
- **Startups** actively avoiding the heavy lift of migrating to Kubernetes.
- **Security-Focused Teams** explicitly trying to eliminate `.env` file credentials.

---

## 🤝 CONTRIBUTING

We strongly encourage community contributions. Refer to `CONTRIBUTING.md` for guidelines on submitting pulls, adding features, and developing plugins.

---

## ⭐ CALL TO ACTION

👉 **Star this repo if you care about secure Docker deployments.** 
Your support fundamentally strengthens the open-source DevOps ecosystem. Stop leaking `.env` files today!
