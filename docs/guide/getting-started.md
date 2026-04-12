# Quickstart Guide

This guide will help you set up **Docker Secret Operator (DSO)** and synchronize your first secret from a cloud vault to a running container in under 2 minutes.

---

## 1. Installation

The recommended way to run DSO is as a native Docker CLI plugin. This integrates DSO directly into the `docker` command space.

```bash
# Install the official DSO CLI Plugin (Linux/macOS)
curl -sSL https://get.dso.run | sh
```

### Verify Installation
Check that the `dso` subcommand is available:

```bash
docker dso version
```

---

## 2. Infrastructure Identity

DSO is designed to use **Machine Identity** (IAM Roles, Managed Identities) to avoid storing static credentials on your host.

### AWS (IAM Instance Profile)
Ensure your EC2 instance has an IAM role with `secretsmanager:GetSecretValue` permissions.

### Huawei Cloud (ECS Agency)
Ensure your ECS instance has an **Agency** with `CSMS Administrator` or custom read-only permissions for Cloud Secret Management Service.


---

## 3. Define the Secret Mapping (`dso.yaml`)

Create a `dso.yaml` file in your project root. This file tells DSO which secrets to fetch and how to map them to your containers.

```yaml
# dso.yaml
provider: aws
config:
  region: us-east-1

secrets:
  - name: myapp/db-credentials
    inject: env
    rotation: true
    mappings:
      password: DB_PASSWORD
      username: DB_USER
```

---

## 4. Prepare your Docker Compose

In your `docker-compose.yml`, define the environment variable names as keys without values. DSO will intercept these and inject the values from the vault at runtime.

```yaml
# docker-compose.yml
services:
  api:
    image: myapp/api:latest
    labels:
      - "dso.reloader=true"
    environment:
      - DB_PASSWORD
      - DB_USER
```

---

## 5. Launch the Stack

Use the `docker dso up` command. DSO will automatically resolve the secrets, inject them into the environment, and start the stack.

```bash
docker dso up -c dso.yaml -f docker-compose.yml -d
```

---

## 6. Verify Injection

Verify that the secrets have been successfully injected into the running container's environment:

```bash
docker exec -it api_container env | grep DB_
```

You can also use the DSO CLI to check the connectivity and value resolution (values are masked by default):

```bash
docker dso fetch myapp/db-credentials
```

---

## Next Steps

- **[System Architecture](/guide/architecture)**: Learn how the Watcher and Streamer engines work.
- **[Configuration Reference](/guide/configuration)**: Detailed documentation for `dso.yaml`.
- **[Production Readiness](/guide/production-readiness)**: Best practices for scaling DSO in production.
