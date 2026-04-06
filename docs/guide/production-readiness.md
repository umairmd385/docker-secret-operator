# Production Readiness

This checklist provides the critical configuration steps and architectural requirements for deploying DSO in high-security production environments.

---

## 1. Authentication & Identity Checklist

- [ ] **Use Machine Identity**: Never use static AWS Access Keys, Azure Client Secrets, or Vault Tokens on the host. 
    - **AWS**: Configure the host with an IAM Instance Profile.
    - **Azure**: Enable Managed Identity on the virtual machine.
    - **HashiCorp Vault**: Use AppRole with response wrapping.
- [ ] **Least Privilege Policy**: Ensure the host's identity only has `GetSecretValue` permissions for the specific secrets DSO is managing. Avoid `secretsmanager:*` or equivalent broad permissions.

## 2. Infrastructure Hardening

- [ ] **Restricted Unix Socket**: Ensure the DSO socket (`/run/docker/plugins/dso.sock`) is only accessible by the `root` user and the `docker` group.
- [ ] **Dedicated Service User**: Run the `dso-agent` as a dedicated non-root user if your environment supports this (requires specific Docker socket permissions).
- [ ] **No Host-Path Mounts**: Audit your `docker-compose.yaml` and ensure no plaintext secrets are being mounted from the host filesystem. Use DSO's `RAMfs` injection instead.

## 3. Operational Configuration

- [ ] **Rotation Strategies**: Define explicit rotation strategies (`sighup`, `rolling`, or `restart`) in your container labels (`dso.strategy`).
- [ ] **Healthchecks**: Always define a `healthcheck` in your Docker Compose service. DSO uses this to verify a successful rotation before deactivating the older secret version.
- [ ] **Polling Interval**: Adjust `agent.watch.polling_interval` based on your compliance needs. Standard is 2 minutes; high-security environments may require 30 seconds.

## 4. Observability & Auditing

- [ ] **Structured Logging**: Enable JSON logging in the DSO agent.
- [ ] **Log Export**: Stream DSO's log output to a centralized SIEM (Splunk, Datadog, ELK) for real-time monitoring of secret access events.
- [ ] **Alerting**: Set alerts for `level=ERROR` in the DSO logs, which typically indicate vault authentication failures or failed secret injections.

---

## Deployment Architectures

### Edge / Single-Node Deployment
For edge devices running on-premise, ensure that the DSO binary is protected by OS-level file integrity monitoring (FIM) and that the edge host has limited network access to only the required Vault endpoints.

### Cloud Virtual Machines (EC2/Azure VM)
In cloud environments, leverage the cloud's native IAM system. Use VPC Endpoints (AWS) or Private Links (Azure) to communicate with the Vault over private network paths, avoiding any traversal of the public internet.

## Next Steps
- **[Design Principles](/guide/design-principles)**: The core pillars of the project.
- **[Security Model](/guide/security)**: Detailed threat mitigations.
- **[Troubleshooting](/guide/troubleshooting)**: Diagnosing common production issues.
