---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DSO Documentation"
  text: "Native secrets for Docker — without Kubernetes"
  tagline: "Securely inject cloud secrets into Docker Compose at runtime"
  image:
    src: /assets/images/dso-logo.png
    alt: DSO Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: What is DSO?
      link: /guide/what-is-dso

features:
  - title: Secret Isolation
    details: "All secret values are held in-memory and injected via Unix socket. Zero persistence to disk by design."
    icon: 🔒
  - title: Unified Configuration
    details: "One standard YAML format for AWS, Azure, HashiCorp Vault, and Local File providers."
    icon: 🛠️
  - title: Smart Rotation
    details: "Hot-reload secrets without restarting your services. Atomic updates ensure zero downtime."
    icon: 🔄
---
