import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Architecture Guide (SRE & Security Reference)

This document provides a production-grade, SRE and security-focused analysis of the **Docker Secret Operator (DSO)**. It details the internal components, event-driven pipelines, security boundaries, and container lifecycles that govern DSO.

---

## 1. Internal DSO Agent Components

The \`dso-agent\` is a long-running, concurrent Go daemon designed to run alongside standard Docker engines. It is divided into decoupled, asynchronous event loops that coordinate via memory channels and transactional locks.

\`\`\`mermaid
graph TD
    %% Styling
    classDef component fill:#e1f5fe,stroke:#039be5,stroke-width:2px,color:#000000;
    classDef storage fill:#efebe9,stroke:#5d4037,stroke-width:2px,color:#000000;
    classDef external fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,color:#000000;
    
    subgraph Host ["Docker Host (dso-agent Daemon)"]
        Socket[Unix Socket: /run/dso/dso.sock]:::component
        Controller[IPC Controller & API Server]:::component
        Watcher[Docker Event Watcher]:::component
        Engine[Rotation Engine]:::component
        Cache[Encrypted In-Memory Cache]:::component
        State[Transactional State Manager]:::component
        Lock[Distributed Lock Manager]:::component
        PluginMgr[Plugin Process Manager]:::component
    end

    subgraph Storage ["Persistent State"]
        Db[State Directory: /var/lib/dso/state/]:::storage
    end

    subgraph Plugins ["Isolated Provider Subprocesses"]
        AWS[dso-provider-aws]:::external
        Vault[dso-provider-vault]:::external
        Azure[dso-provider-azure]:::external
    end

    %% Interactions
    Socket -->|gRPC / HTTP IPC| Controller
    Watcher -->|Docker Event Stream| Engine
    Controller -->|Trigger Manual Run| Engine
    Engine -->|Cache Lookup| Cache
    Engine -->|State Query / Mutation| State
    Engine -->|Acquire Resource Lock| Lock
    State -->|Write-Ahead Log / Snapshots| Db
    Engine -->|Fetch Secrets| PluginMgr
    PluginMgr -->|JSON-RPC over Pipes| AWS
    PluginMgr -->|JSON-RPC over Pipes| Vault
    PluginMgr -->|JSON-RPC over Pipes| Azure
\`\`\`

### Component Breakdown
* **IPC Controller & API Server**: Exposes a secure Unix Domain Socket (\`/run/dso/dso.sock\`) with strict \`0660\` permissions owned by \`root:dso\`. It handles commands from the \`docker dso\` CLI (such as status queries, manual rotations, and environment health checks).
* **Docker Event Watcher**: Listens directly to the Docker engine event stream, filtering for container start, stop, destroy, and edit events to automatically rebuild internal target maps of managed compose services.
* **Rotation Engine**: The core orchestrator. It manages the rotation queue, debounces high-frequency trigger events (5-second window), and executes transactional blue-green swaps.
* **Encrypted In-Memory Cache**: Temporarily holds plaintext secrets in memory using locked memory pages (\`mlock\`), preventing secret values from being written to swap space. High-performance cache TTLs avoid rate-limiting cloud provider APIs.
* **Transactional State Manager**: Manages write-ahead logging (WAL) and service mapping metadata in \`/var/lib/dso/state/\` to guarantee deterministic recovery after host crashes.

---

## 2. Security Boundaries & Isolation Model

DSO is designed around a zero-trust model regarding the host filesystem and the Docker metadata storage engine. It strictly isolates credentials across multiple execution layers.

\`\`\`mermaid
graph TB
    %% Styling
    classDef redZone fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000000;
    classDef amberZone fill:#fff8e1,stroke:#ff8f00,stroke-width:2px,color:#000000;
    classDef greenZone fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000000;

    subgraph Cloud ["Secure Cloud Boundary"]
        KMS[Cloud KMS / Vault KMS]:::greenZone
        SM[Secrets Manager / Azure Key Vault]:::greenZone
    end

    subgraph Host ["Docker Host System"]
        subgraph DaemonSpace ["Root/dso Group Protected Space (mlock)"]
            Agent[dso-agent]:::amberZone
            Cache[Encrypted In-Memory Cache]:::amberZone
            Plugin[Provider Plugins]:::amberZone
        end
        
        subgraph UserSpace ["Unprivileged User Space"]
            CLI[docker dso CLI]:::redZone
        end

        subgraph DockerSpace ["Docker Engine Boundary"]
            Engine[Docker Daemon]:::redZone
        end
    end

    subgraph ContainerSpace ["Isolated Container Sandbox"]
        App[Application Process]:::greenZone
        Tmpfs[tmpfs mount: /run/secrets/]:::greenZone
    end

    %% Flow
    SM -->|TLS 1.3 encrypted fetch| Plugin
    Plugin -->|Plaintext in RAM| Agent
    Agent -->|Mounted directly via tmpfs API| Tmpfs
    Tmpfs -->|In-memory files| App
    CLI -->|IPC only - No direct secret access| Agent
    Engine -->|Orchestrates container launch| ContainerSpace
\`\`\`

### Key Security Controls
1. **No Disk Persistence for Secrets**: Under no circumstances are plaintext secret values written to physical host disks. They live exclusively in the \`mlock\`-guarded memory space of the agent and inside RAM-based \`tmpfs\` mounts.
2. **Docker Inspect Guard**: Traditional Docker secrets or environment variables injected via compose are visible via \`docker inspect <container>\`. DSO injects secrets at the process boundary (for environment variables) or via memory-mapped files (for file-based injection), ensuring \`docker inspect\` only reveals the dummy \`dso://\` or \`dsofile://\` reference URIs.
3. **IPC Unix Socket Isolation**: The communication channel \`/run/dso/dso.sock\` restricts access to root and members of the \`dso\` system group.

---

## 3. Provider Plugin Architecture

DSO isolates providers (AWS, Azure, HashiCorp Vault, Huawei Cloud) into distinct subprocesses. This ensures that provider SDK dependency vulnerabilities do not compromise the core DSO daemon.

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Agent as dso-agent (Core)
    participant Mgr as Plugin Process Manager
    participant Plugin as dso-provider-aws (Subprocess)
    participant AWS as AWS Secrets Manager API

    Agent->>Mgr: Request secret resolution (Provider: AWS, Key: db_pass)
    Note over Mgr: Process manager checks if subprocess is active
    alt Process Not Running
        Mgr->>Plugin: Spawns binary (/usr/local/lib/dso/plugins/dso-provider-aws)
        Note over Plugin: Subprocess starts, locks stdin/stdout
    end
    Mgr->>Plugin: Write JSON-RPC Request to Stdin Pipe
    Note over Plugin: Read request & parse credentials
    Plugin->>AWS: FetchSecretValue(SecretId="prod/db") via TLS 1.3
    AWS-->>Plugin: Return JSON Payload (Encrypted)
    Note over Plugin: Parse payload, extract target field
    Plugin-->>Mgr: Write JSON-RPC Response to Stdout Pipe
    Note over Mgr: Read stdout, enforce 1MB buffer max limit
    Mgr->>Agent: Deliver resolved plaintext secret bytes
    Note over Plugin: Subprocess kept alive for connection pooling
\`\`\`

### JSON-RPC IPC Schema
The core daemon communicates with the provider binaries using a structured, line-delimited JSON-RPC protocol over Unix Pipes (\`stdin\`/\`stdout\`).
* **Request Payload**:
  \`\`\`json
  {"jsonrpc":"2.0","method":"ResolveSecret","params":{"path":"myapp/db_password","config":{"region":"us-east-1"}},"id":1}
  \`\`\`
* **Response Payload**:
  \`\`\`json
  {"jsonrpc":"2.0","result":{"value":"s3cr3t_p4ssword"},"id":1}
  \`\`\`

---

## 4. Runtime Secret Injection & Compose Integration

DSO intercepts the normal \`docker compose\` execution flow. It acts as an Abstract Syntax Tree (AST) transformer for Compose YAML files, replacing \`dso://\` and \`dsofile://\` placeholders before they reach the Docker Engine.

\`\`\`mermaid
graph TD
    %% Styling
    classDef process fill:#fff3e0,stroke:#ffb74d,stroke-width:2px,color:#000000;
    classDef file fill:#eceff1,stroke:#b0bec5,stroke-width:2px,color:#000000;
    
    YAML[docker-compose.yml]:::file
    CLI[docker dso up]:::process
    AST[AST Parser & Validator]:::process
    Cache[In-Memory Secret Resolver]:::process
    Agent[DSO Systemd Agent]:::process
    Engine[Docker Engine API]:::process
    Container[Target Container]:::process

    YAML -->|Read Input| CLI
    CLI -->|Load YAML Structure| AST
    AST -->|Scan for dso:// and dsofile://| Cache
    Cache -->|Query Cached Secrets| Agent
    Agent -->|Return Plaintext Secret Bytes| Cache
    Cache -->|Mutate Compose AST in Memory| AST
    AST -->|Generate Real-Time Spec with tmpfs Mounts| Engine
    Engine -->|Launch sandboxed process| Container
\`\`\`

### AST Modification Process
1. **Placeholder Parsing**: DSO parses the YAML file structure and identifies variables prefixed with \`dso://\` (for Environment variables) or \`dsofile://\` (for file-based mounts).
2. **Mount Modification**: For every \`dsofile://myapp/cert\` entry, DSO dynamically injects a temporary \`tmpfs\` volume mount into the service specification before submitting it to the Docker socket, allocating exactly the required memory size.

---

## 5. Tmpfs Secret Flow

File-based secrets are written to memory-mapped \`/run/secrets/\` directories, preventing any cryptographic artifacts from touching non-volatile storage.

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Agent as dso-agent
    participant Engine as Docker Daemon
    participant HostRAM as RAM (tmpfs)
    participant Container as Container Process

    Note over Agent: Secret resolved in-memory
    Agent->>Engine: Create container spec with tmpfs mount at /run/secrets
    Note over Engine: Docker creates unprivileged mount namespace
    Engine->>HostRAM: Mount RAM-based tmpfs partition at host container path
    Agent->>HostRAM: Write plaintext secret bytes directly to mounted RAM path
    Agent->>Engine: Start container execution
    Engine->>Container: Launch application entrypoint
    Container->>HostRAM: Read secret file from /run/secrets/db_password
    Note over Container: Secret resides only inside RAM
    Note over Agent: On container stop/restart:
    Agent->>Engine: Stop container
    Engine->>HostRAM: Unmount tmpfs partition (data instantly lost from memory)
\`\`\`

---

## 6. Secret Rotation Lifecycle & Event Watcher Pipeline

DSO features a real-time event-driven rotation pipeline that monitors both Docker container lifecycles and Cloud Provider secret update triggers.

\`\`\`mermaid
graph TD
    %% Styling
    classDef watch fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000000;
    classDef queue fill:#e0f7fa,stroke:#00bcd4,stroke-width:2px,color:#000000;
    classDef exec fill:#fff3e0,stroke:#ff9800,stroke-width:2px,color:#000000;

    Webhook[Cloud Provider Webhook / EventGrid]:::watch
    Poller[Configured Provider Poller]:::watch
    Watcher[DSO Engine Watcher]:::watch
    
    Queue[FIFO Event Queue]:::queue
    Debouncer[Debounce Logic: 5-second window]:::queue
    
    Orchestrator[Rotation Engine Orchestrator]:::exec
    Swap[Execute Blue-Green Swap]:::exec

    %% Flows
    Webhook -->|Webhook Event| Queue
    Poller -->|Polling Change Detected| Queue
    Watcher -->|Docker Engine Event| Queue
    
    Queue --> Debouncer
    Debouncer -->|Coalesce High-Frequency Events| Orchestrator
    Orchestrator -->|Trigger Active Pipeline| Swap
\`\`\`

---

## 7. Blue-Green Container Replacement

When a secret rotation is triggered, DSO performs an in-place, zero-downtime blue-green container swap to avoid service disruptions.

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Agent as dso-agent
    participant Docker as Docker Daemon
    participant Blue as Container [Blue] (Running V1)
    participant Green as Container [Green] (Spawning V2)
    participant Proxy as Load Balancer / Host Port

    Note over Agent: Secret rotation triggered for target service
    Agent->>Docker: Spawn Container [Green] with updated secrets
    Docker->>Green: Launch in background
    
    loop Health Checks
        Agent->>Green: Execute HTTP / TCP health probes
    end
    
    alt Container [Green] Healthy
        Note over Agent: Atomic Swap Phase
        Agent->>Proxy: Redirect incoming port traffic to [Green]
        Agent->>Docker: Rename [Blue] -> [Blue-Old]
        Agent->>Docker: Rename [Green] -> [Blue] (Take over active name)
        Agent->>Docker: Terminate and stop [Blue-Old]
        Note over Agent: Rotation complete successfully!
    else Container [Green] Unhealthy
        Note over Agent: Failure Detected! Trigger Rollback
        Agent->>Docker: Stop and destroy [Green]
        Agent->>Agent: Increment failure metrics & Alert
    end
\`\`\`

---

## 8. Rollback and Recovery Workflows

If a newly spawned container fails its operational health checks during rotation, the transactional state manager performs an automatic, deterministic rollback to keep production services running.

\`\`\`mermaid
graph TD
    %% Styling
    classDef step fill:#fafafa,stroke:#616161,stroke-width:2px,color:#000000;
    classDef err fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000000;
    classDef success fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000000;

    Start[Start Secret Rotation]:::step
    Spawn[Spawn Green Container]:::step
    Probe{Execute Health Probes}:::step
    Swap[Atomic Swap Names]:::success
    StopBlue[Stop Blue Container]:::success
    
    Rollback[Stop & Remove Green]:::err
    Restore[Restore Blue Port Mappings]:::err
    Alert[Trigger Systemd Failure Alert]:::err

    %% Path
    Start --> Spawn
    Spawn --> Probe
    Probe -->|Probes Pass| Swap
    Swap --> StopBlue
    
    Probe -->|Probes Fail / Timeout| Rollback
    Rollback --> Restore
    Restore --> Alert
\`\`\`

---

## 9. SRE Operational Metrics & Health Signals

To monitor DSO health in production environments, track the following operational parameters using Prometheus or \`docker dso status\`:

| Metric Name | Type | Description | Alerting Threshold |
|---|---|---|---|
| \`dso_rotation_success_total\` | Counter | Total successful secret rotations | N/A (Diagnostic) |
| \`dso_rotation_failures_total\` | Counter | Total failed rotations (triggered rollback) | \`> 0\` (Warning) |
| \`dso_provider_api_latency_seconds\` | Histogram | Latency to cloud secret provider APIs | \`> 2.5s\` (Degraded Performance) |
| \`dso_active_managed_containers\` | Gauge | Total containers currently managed by DSO | N/A (Capacity Planning) |
| \`dso_cache_hit_ratio\` | Gauge | Ratio of cache hits vs total secret requests | \`< 0.85\` (API rate limit risk) |
`;

export const metadata: Metadata = {
  title: "DSO Architecture Guide (SRE & Security Reference)",
  description: "Documentation for DSO Architecture Guide (SRE & Security Reference)",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
