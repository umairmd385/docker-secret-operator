# When Not to Use DSO

While DSO is highly versatile, it is designed for a specific set of use cases. This page outlines the technical constraints and environments where DSO may not be the optimal solution.

---

## 1. Kubernetes-Native Environments
If your workload is already running on Kubernetes (EKS, GKE, AKS, or bare-metal K8s), **use the official External Secrets Operator (ESO)**.
- **Why**: ESO is the industry standard for Kubernetes, with native CRD support and deep integration with the K8s RBAC system. DSO is built specifically for teams who are *not* on Kubernetes.

## 2. Windows-Based Docker Hosts
DSO relies on Linux-specific kernel features (Unix sockets, `tmpfs`, and specific Docker Engine APIs) for its security and injection model.
- **Constraint**: DSO is currently **Linux-only**. It does not support Docker Desktop on Windows (WSL2) or native Windows containers.

## 3. High-Churn Serverless Functions (AWS Lambda, etc.)
DSO's agent architecture is designed for long-running Docker Engine instances.
- **Why**: Serverless environments like AWS Lambda or Google Cloud Run have their own native secret injection mechanisms. The overhead of the DSO agent is unnecessary for short-lived, transient functions.

## 4. Legacy Docker Engine (< v20.10)
DSO leverages modern Docker Engine features for its "Zero-Persistence" injection and lifecycle monitoring.
- **Constraint**: While DSO may work on older versions, it is only officially supported and tested on **Docker Engine v20.10 and later**.

## 5. Non-Docker Workloads
DSO is deeply coupled with the Docker Engine and its metadata (Labels).
- **Why**: If you need to manage secrets for non-containerized Linux processes (e.g., standard systemd services), consider using a direct integration with HashiCorp Vault or a cloud-specific secret manager CLI.

---

## Technical Limitations

- **Binary-Only Providers**: DSO uses an RPC-based plugin model. Adding a custom provider requires writing a Go binary that implements the DSO Provider interface.
- **No Native HSM Integration**: DSO provides a high-security software layer but does not currently offer direct integration with hardware security modules (HSMs).

## Next Steps
- **[Design Principles](/guide/design-principles)**: The core pillars of the project.
- **[System Architecture](/guide/architecture)**: Deep dive into the internal engines.
- **[Security Model](/guide/security)**: Detailed threat mitigations.
