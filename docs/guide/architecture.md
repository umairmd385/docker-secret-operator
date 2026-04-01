# Architecture & Internals

Docker Secret Operator (DSO) uses a robust client-server architecture, combined with a plugin-based provider system, to securely manage the entire lifecycle of secrets.

This guide provides deep-dive sequence diagrams of the most critical flows.

## Component Overview

DSO consists of three principal logical components:

1. **CLI Plugin (`docker dso`)**: The user-facing tool that intercepts commands, parses configurations, and invokes Docker APIs.
2. **Daemon Agent (`dso-agent`)**: A background service exposing a Unix socket. It handles caching, rotation engines, and provider orchestration.
3. **Provider Plugins (`dso-provider-*`)**: Standalone RPC binaries that execute cloud-specific authentication and retrieval logic.

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

## Secret Fetch and Injection Sequence

When you execute a deployment via `docker dso up`, the following synchronous injection flow occurs to ensure zero disk persistence of plaintext secrets.

```mermaid
sequenceDiagram
    autonumber
    participant CLI as docker dso
    participant Agent as dso-agent (socket)
    participant Provider as Provider Plugin (RPC)
    participant Cloud as Cloud Vault (AWS/Azure)
    participant Docker as Docker Engine

    CLI->>CLI: Parse docker-compose.yml & dso.yaml
    CLI->>Agent: FetchAllEnvs(config)
    
    loop For each Secret Mapping
        Agent->>Provider: GetSecret("prod/db")
        Provider->>Cloud: REST API Call (with Machine Auth)
        Cloud-->>Provider: Encrypted JSON/String Payload
        Provider-->>Agent: Parsed map[string]string
        Agent->>Agent: Apply 'mappings' re-keying & Cache
    end
    
    Agent-->>CLI: Final Environment Variable Map
    CLI->>CLI: Generate secure tmpfs env file
    CLI->>Docker: compose --env-file /tmp/dso-*.env up
    Docker-->>CLI: Containers started
    CLI->>CLI: Delete /tmp/dso-*.env
    CLI-->>User: Deployment Successful
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

---

## Provider Plugin Architecture

DSO employs HashiCorp's `go-plugin` framework over `net/rpc`. Providers act as completely isolated operating system processes.

```mermaid
graph TD
    subgraph Host System
        A[dso-agent] -->|net/rpc (Unix Socket)| B(dso-provider-aws)
        A -->|net/rpc (Unix Socket)| C(dso-provider-vault)
        A -->|net/rpc (Unix Socket)| D(dso-provider-azure)
    end
    
    B -->|HTTPS| E[AWS Secrets Manager]
    C -->|HTTPS| F[HashiCorp Vault]
    D -->|HTTPS| G[Azure Key Vault]

    classDef agent fill:#f9f,stroke:#333,stroke-width:2px;
    classDef plugin fill:#bbf,stroke:#333,stroke-width:1px;
    classDef cloud fill:#ffe,stroke:#e6a23c,stroke-width:2px,stroke-dasharray: 5 5;
    
    class A agent;
    class B,C,D plugin;
    class E,F,G cloud;
```
