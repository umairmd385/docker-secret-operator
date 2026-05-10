---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DSO Documentation"
  text: "Secrets for Docker — Local to Cloud"
  tagline: "Inject secrets at runtime without storing them on disk. Use local encrypted vaults or cloud providers with the same workflow."
  image:
    src: /logo/dso-primary-logo.svg
    alt: DSO Logo
  actions:
    - theme: brand
      text: Introduction
      link: /guide/what-is-dso
    - theme: alt
      text: Quickstart
      link: /guide/getting-started

features:
  - title: Dual-Mode Execution
    details: "Seamlessly switch between Local Mode (Native AES-256 Vault) and Cloud Mode (AWS, Azure, Huawei) with automatic detection."
    icon: ⚡
  - title: Secret Isolation
    details: "All secret values are held in-memory and injected via Unix socket. Zero persistence to disk as plaintext."
    icon: 🔒
  - title: Verified Plugins
    details: "Selective, SHA256-verified plugin installation. Only install what you need, with full integrity checks."
    icon: 🛡️

---

## Why DSO?

Docker Secret Operator (DSO) addresses a critical gap in infrastructure security: the management of sensitive credentials in non-Kubernetes environments. While Kubernetes has a mature ecosystem for secret orchestration, standalone Docker Engine deployments often rely on insecure `.env` files or manual, friction-heavy procedures.

DSO provides a Kubernetes-grade control loop for Docker Engine. It ensures that secrets are fetched from high-assurance vaults (like AWS Secrets Manager or HashiCorp Vault) and injected directly into target containers with Zero-Persistence. This means your secrets never touch the host filesystem, providing a strictly ephemeral and auditable lifecycle.

### Core Security Pillars:

- Zero Persistence: Secrets reside only in process RAM and target container memory-mapped filesystems.
- Event-Driven: Immediate reconciliation of container lifecycle events.
- Provider Agnostic: Standardized interface for AWS, Azure, Huawei Cloud, and HashiCorp Vault.
- Operations First: Built-in strategy engine for rolling updates and atomic shifts.
