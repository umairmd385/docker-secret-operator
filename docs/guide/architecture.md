# Architecture & Internals

Docker Secret Operator (DSO) uses a robust client-server architecture, combined with a plugin-based provider system, to securely manage the entire lifecycle of secrets.

This guide provides deep-dive sequence diagrams of the most critical flows.

## Component Overview

DSO consists of three principal logical components:

1. **CLI Plugin (`docker dso`)**: The user-facing tool that intercepts commands, parses configurations, and invokes Docker APIs.
2. **Daemon Agent (`dso-agent`)**: A background service exposing a Unix socket. It handles caching, rotation engines, and provider orchestration.
3. **Provider Plugins (`dso-provider-*`)**: Standalone RPC binaries that execute cloud-specific authentication and retrieval logic.

---

## Provider Plugin Architecture

DSO uses a plugin-based architecture for secret providers. Each provider runs as an isolated Go binary, communicating with the main DSO daemon via RPC.

```mermaid
graph TB
    subgraph "DSO Daemon"
        A[DSO Main Process]
        B[Config Watcher]
        C[Audit Logger]
        D[Secret Cache]
    end
    
    subgraph "Provider Plugins"
        E[AWS Provider Plugin]
        F[Azure Provider Plugin]
        G[Vault Provider Plugin]
        H[Huawei Provider Plugin]
    end
    
    subgraph "Cloud Secret Stores"
        I[AWS Secrets Manager]
        J[Azure Key Vault]
        K[HashiCorp Vault]
        L[Huawei CSMS]
    end
    
    A -->|Load| E
    A -->|Load| F
    A -->|Load| G
    A -->|Load| H
    
    E -->|Fetch| I
    F -->|Fetch| J
    G -->|Fetch| K
    H -->|Fetch| L
    
    A -->|Log| C
    A -->|Store| D
    B -->|Reload| A
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style E fill:#FF9800,stroke:#E65100,color:#fff
    style F fill:#FF9800,stroke:#E65100,color:#fff
    style G fill:#FF9800,stroke:#E65100,color:#fff
    style H fill:#FF9800,stroke:#E65100,color:#fff
```

### Secret Fetch Flow with Plugins

```mermaid
sequenceDiagram
    participant User
    participant CLI as Docker DSO CLI
    participant Daemon as DSO Daemon
    participant Plugin as Provider Plugin
    participant Cloud as Cloud Secret Store
    participant Container
    
    User->>CLI: docker dso up -d
    CLI->>Daemon: gRPC: Start stack
    Daemon->>Plugin: Load provider binary
    Daemon->>Plugin: Fetch secret
    Plugin->>Cloud: API call with IAM/auth
    Cloud-->>Plugin: Secret value
    Plugin-->>Daemon: Return secret
    Daemon->>Daemon: Store in memory cache
    Daemon->>Container: Inject via Unix socket
    Container-->>User: Running with secrets
```

---

## Installation Flow

The following sequence illustrates how the `docker plugin install` command interacts with Docker Engine and the DSO image bundle.

```mermaid
sequenceDiagram
    participant User
    participant Docker as Docker Engine
    participant Registry as Docker Hub
    participant Host as Host OS

    User->>Docker: docker plugin install umairmd385/docker-secret-operator:latest --alias dso
    Docker->>Registry: Pull DSO Plugin Image bundle
    Registry-->>Docker: Download plugin layers
    Docker->>Host: Create rootfs for plugin
    Docker->>Host: Start Plugin daemon process (dso-agent)
    Host-->>Docker: agent running, socket created at /run/docker/plugins/dso.sock
    Docker-->>User: Plugin 'dso' successfully installed
```

---

## Rotation Lifecycle

DSO supports automated secret rotations via its built-in polling and trigger subsystem. The "Rolling" strategy prevents downtime by spawning an updated clone before destroying the old container.

```mermaid
sequenceDiagram
    autonumber
    participant Cloud as Cloud Vault
    participant Watcher as DSO Watcher Engine
    participant Strategy as Strategy Engine
    participant Docker as Docker Engine

    loop Every polling_interval
        Watcher->>Cloud: Fetch latest secret hashes
        Cloud-->>Watcher: New Hash Detected
    end

    Watcher->>Strategy: Trigger Rotation (Secret: "prod/api-key")
    Strategy->>Docker: Inspect running containers
    Docker-->>Strategy: Matches "api" container (Score: 85)
    Strategy->>Strategy: Select "Rolling" Strategy

    Strategy->>Docker: Clone "api" -> "api-new" with updated Envs
    Docker-->>Strategy: "api-new" Started
    
    loop Wait for Health
        Strategy->>Docker: Inspect "api-new" healthcheck
        Docker-->>Strategy: "healthy"
    end
    
    Strategy->>Docker: Stop & Remove "api" (Graceful drain)
    Docker-->>Strategy: Old container removed
    Strategy->>Docker: Rename "api-new" -> "api"
```
