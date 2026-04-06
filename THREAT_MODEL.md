# DSO Threat Model

## 1. Attacker Profiles

### Unprivileged Host User
- **Capability**: Can read/write to the host's physical and temporary directories (e.g., `/tmp`).
- **DSO Mitigation**: DSO's zero-disk policy and `tmpfs` mounts prevent unprivileged host users from scraping plaintext secret data from the filesystem.

### Compromised Target Container
- **Capability**: Attacker has achieved code execution inside an application container and can read anything in its RAM or volume-mounts.
- **DSO Mitigation**: DSO uses `0400` permissions (read-only) for secrets, preventing an attacker from rewriting or tampering with their own configuration files. However, DSO does **not** protect against a compromised process reading its *own* secrets.

### Malicious Insider (Privileged)
- **Capability**: Attacker has administrative rights on the host or access to the Docker socket.
- **DSO Mitigation**: DSO is not designed to protect secrets against a root-level host compromise. An administrative user can still `docker exec` into any container or scrape the DSO process memory.

### Network Attacker
- **Capability**: Attacker can intercept network traffic between DSO and the Secret Provider.
- **DSO Mitigation**: DSO mandates TLS for all provider communications. It verifies certificates to prevent Man-in-the-Middle (MitM) attacks.

---

## 2. Trust Boundaries

- **DSO Agent**: Privileged boundary. DSO assumes its own process memory and configuration are secure.
- **Docker Daemon API**: Trusted boundary. DSO relies on the Docker daemon to correctly isolate containers and manage volumes.
- **External Secret Providers (Vault/AWS)**: Trusted boundary. DSO trusts that the provider securely authenticates the agent and provides authorized data.
- **Container Environment (Untrusted)**: Data in target containers is considered "at rest" and is susceptible to leakage if the container is compromised.

---

## 3. Attack Scenarios and Mitigations

| Attack Scenario | Mitigation |
| :--- | :--- |
| **Secret Leakage via Logs** | Centralized log redaction utility (`pkg/observability`) ensures secrets are masked before hitting any observability stack. |
| **Filesystem Scraping** | Zero-persistence model ensures secrets live in RAM or `tmpfs` mounts, which are destroyed upon container removal. |
| **Container Escape** | DSO assumes total host compromise if container escape is achieved. Does not mitigate escapes, but minimizes the blast radius of secrets available *to* the escaping process. |
| **Docker Socket Abuse** | DSO requires strict host-level permissions on `/var/run/docker.sock` and assumes access is limited to the **DSO Agent** and authorized administrators. |

---

## 4. Guarantees and Limitations

### DSO Protects Against
- [x] Unintentional persistent storage of secrets on the host engine.
- [x] Metadata-level secret exposure (e.g., `docker inspect` for file injection).
- [x] Residual secret data after container deletion or agent shutdown.
- [x] Insecure file permissions within target containers.

### DSO Does NOT Protect Against
- [!] Host-level root compromise where an attacker can inspect RAM or system calls.
- [!] Compromised secret provider (if Vault itself is breached, DSO cannot mitigate).
- [!] Misconfigurations in the target container's application (e.g., app logs its own secrets).

---

## 5. Residual Risks
- **RAM Scraping**: Secrets exist in the DSO Agent process RAM and the target container's address space. High-skill attackers with root host access can still retrieve them.
- **Socket Hijacking**: Exposure of the Docker socket to untrusted users remains the single greatest risk vector for Docker-native operators.
