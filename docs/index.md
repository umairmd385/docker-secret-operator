---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DSO Documentation"
  text: "Native Secret Lifecycle for Docker"
  tagline: "No Files. No Leaks. No Restarts. Native secret orchestration for Docker."
  image:
    src: /assets/images/logo-transparent.png
    alt: DSO Logo
  actions:
    - theme: brand
      text: Introduction
      link: /guide/what-is-dso
    - theme: alt
      text: Quickstart
      link: /guide/getting-started

features:
  - title: Secret Isolation
    details: "All secret values are held in-memory and injected via Unix socket. Zero persistence to disk by design."
    icon: 🔒
  - title: Unified Configuration
    details: "One standard YAML format for AWS, Azure, Huawei Cloud, HashiCorp Vault, and Local File providers."
    icon: 🛠️
  - title: Smart Rotation
    details: "Hot-reload secrets without restarting your services. Atomic updates ensure zero downtime."
    icon: 🔄

---

## Why DSO?

Docker Secret Operator (DSO) addresses a critical gap in infrastructure security: the management of sensitive credentials in non-Kubernetes environments. While Kubernetes has a mature ecosystem for secret orchestration, standalone Docker Engine deployments often rely on insecure `.env` files or manual, friction-heavy procedures.

DSO provides a **Kubernetes-grade** control loop for Docker Engine. It ensures that secrets are fetched from high-assurance vaults (like AWS Secrets Manager or HashiCorp Vault) and injected directly into target containers with **Zero-Persistence**. This means your secrets never touch the host filesystem, providing a strictly ephemeral and auditable lifecycle.

### Core Security Pillars:

- **Zero Persistence**: Secrets reside only in process RAM and target container memory-mapped filesystems.
- **Event-Driven**: Immediate reconciliation of container lifecycle events.
- **Provider Agnostic**: Standardized interface for AWS, Azure, Huawei Cloud, and HashiCorp Vault.
- **Operations First**: Built-in strategy engine for rolling updates and atomic shifts.
