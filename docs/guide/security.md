# Security Model

DSO is designed for high-trust environments where secret persistence on peripheral storage is unacceptable. This document formalizes the DSO security architecture, threat model, and mitigation strategies.

---

## 1. Threat Model

DSO identifies and mitigates three primary threat vectors in Docker-based infrastructure.

### Threat Vector A: Static Secret Proliferation
- **Actor**: Rogue developer or compromised CI/CD pipeline.
- **Action**: Credentials committed to VCS (GitHub/GitLab) or stored in persistent `.env` files.
- **DSO Mitigation**: **Zero-File Footprint**. Secrets are fetched at runtime and held in RAM. No plaintext credentials ever exist on the developer's laptop or in the repository.

### Threat Vector B: Compromised Host / Lateral Movement
- **Actor**: Attacker with non-root access to the host OS.
- **Action**: Reading secrets from the host's filesystem, scanning `/proc`, or intercepting network traffic.
- **DSO Mitigation**: 
    - **Unix Socket Isolation**: CLI-to-Agent communication is restricted to a secure Unix socket. No network ports are exposed.
    - **Memory-Only Store**: Secrets never touch the physical disk (SSD/HDD).
    - **UID Separation**: The DSO agent can be configured to run under a dedicated system user, isolating its memory space.

### Threat Vector C: Secret Drift & Stale Credentials
- **Actor**: Phishing attacker or ex-employee.
- **Action**: Exploiting a recycled or "leaked" credential that is still active in a running container.
- **DSO Mitigation**: **Continuous Reconciliation**. The Watcher Engine ensures that secret rotations in the Vault are reflected in running containers within minutes/seconds, minimizing the "Window of Vulnerability."

---

## 2. Zero-Persistence Guarantees

DSO's most critical security property is its commitment to **Zero-Persistence**.

### The RAMfs / Tar Streaming Mechanism
DSO does not use traditional host-path mounts for secrets. Instead, it leverages a two-stage injection process:

1.  **Memory Capture**: The agent fetches secrets and wraps them into a TAR archive in process memory.
2.  **RAMfs Injection**: DSO uses the `CopyToContainer` API to stream the TAR ball directly into a `tmpfs` volume inside the container.

**Security Result**: If the server loses power or the container is killed, the secrets vanish instantly. There is no forensic trace of the secret value on the physical storage media.

---

## 3. Boundary Protection: The Docker Socket

DSO interacts with the Docker Engine via the authenticated Unix socket (`/var/run/docker.sock`). 

- **Authenticated Access**: DSO uses the official Docker SDK, ensuring all actions are logged by the Docker daemon's audit stream.
- **Encryption**: While Unix sockets are local, DSO's communication with external Vaults (AWS/Azure/Vault) is strictly over **TLS 1.2+**.
- **No Sidecars**: Unlike Kubernetes-based solutions that require a sidecar container (increasing the attack surface), DSO's agent-based model keeps the container internal environment clean and isolated.

---

## 4. Least Privilege & Identity

DSO advocates for **Machine Identity** over **Static Tokens**.

- **IAM Instance Profiles**: In AWS/Azure environments, DSO auto-detects the host's instance profile. This means no AWS Access Keys or Azure Client Secrets are stored on the machine.
- **Vault AppRole**: For HashiCorp Vault, we recommend using AppRole with response wrapping, ensuring that even a local attacker cannot easily "sniff" the initial authentication token.
- **Granular Mappings**: DSO only injects the specific keys mapped in `dso.yaml` into a container. A compromised container only has access to its own secrets, not the entire vault.

---

## 5. Compliance Alignment

DSO's architecture is built to satisfy the most stringent requirements of:
- **SOC2 Type II**: Control over secret access and detailed audit trails.
- **PCI-DSS**: Protecting cardholder data by eliminating static credentials.
- **ISO 27001**: Establishing a robust, identity-based access control system.

## Next Steps

- **[System Architecture](/guide/architecture)**: Deep dive into the internal components.
- **[Production Readiness](/guide/production-readiness)**: Best practices for secure deployment.
- **[Design Principles](/guide/design-principles)**: The core pillars of the project.
