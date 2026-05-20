import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Operational Limitations & Design Assumptions

This document explicitly defines DSO's operational boundaries, design constraints, and assumptions to ensure clear expectations for production deployments.

## Runtime Environment Scope

### Supported Runtimes

- **Docker Engine** (Linux, macOS, Windows with Docker Desktop)
  - Version: 20.10+
  - API: 1.41+
  - Socket: \`/var/run/docker.sock\` (Linux/macOS), \`npipe:////./pipe/docker_engine\` (Windows)

### Not Supported

- **Kubernetes** - DSO operates at container runtime level, not orchestration layer
- **Podman** - Not currently validated; future roadmap item
- **containerd** - Not currently validated; future roadmap item
- **Docker Swarm** - Swarm mode not tested or supported
- **Docker in Docker** - Nested Docker may have unpredictable socket access behavior

## Operational Constraints

### Event Processing

- **Maximum sustained event rate**: ~10,000 container lifecycle events per minute
  - Beyond this, events will be queued with potential delays
  - At 20,000+ events/min, queue overflow protection will drop oldest events
- **Event processing latency**: 50-500ms per event under normal load
- **Queue size**: 1000-2000 events (configurable)
- **Worker pool**: 4-32 threads (configurable by deployment mode)

### Secret Handling

- **Secret size limit**: No hard limit, but assumes <100KB per secret
  - Larger secrets may degrade injection performance
  - Very large secrets (>10MB) may cause memory pressure
- **Maximum secrets per container**: No hard limit, but 10-50 is practical range
  - Each secret requires separate injection operation
  - Performance scales linearly with secret count
- **Secret retention**: Memory-only, destroyed on container exit
  - No persistence between container restarts
  - No cross-host secret sharing

### Concurrency & Scalability

- **Non-multi-tenant design**: Single daemon instance per machine
  - Shared state across all managed containers
  - No namespace isolation between applications
- **Maximum managed containers**: ~1000 per daemon instance
  - Beyond this, performance degrades
  - Recommend multiple daemon instances for larger fleets
- **Concurrent rotations**: Limited to 16-32 workers
  - Higher concurrency increases memory usage
  - Serialized by Docker daemon socket connection

### Provider Integration

- **Provider connection pool**: 1 connection per provider
  - No connection pooling beyond single active connection
  - Serialized RPC calls to provider processes
- **Provider timeout**: 30 seconds default, configurable
  - Slow provider backends will increase injection latency
- **Provider failure tolerance**: 5 consecutive failures triggers reconnection
  - Transient failures are automatically recovered
  - Permanent provider outage requires manual intervention

### Cache Behavior

- **Cache type**: In-memory, unencrypted
  - Suitable for development/CI, less so for production with sensitive data
- **Cache TTL**: Configurable, default 10 minutes
  - Expired entries automatically cleaned
  - No manual cache invalidation mechanism
- **Cache size**: Unbounded, limited only by available memory
  - Growth depends on secret frequency and diversity
  - Memory monitoring recommended

### Docker Daemon Dependency

- **Hard dependency**: Requires accessible Docker daemon
  - No fallback or graceful degradation if daemon unavailable
  - Agent will terminate on sustained daemon unavailability (100 reconnect attempts)
  - Local mode requires socket at \`/var/run/docker.sock\`
  - Cloud mode requires accessible Docker API endpoint

### Storage & Persistence

- **Zero disk persistence**: Secrets never written to disk
  - Secrets exist only in container tmpfs and daemon memory
  - Host reboots destroy all active secrets
  - No secret archival or audit trail
- **Configuration storage**: YAML files, must be secured manually
  - Configuration files may contain provider credentials
  - No built-in encryption for config files
  - Protect with OS-level permissions

## Performance Characteristics

### Injection Latency

- **File injection** (dsofile://): 50-200ms per secret
  - Uses Docker exec with tar streaming
  - Latency increases with container filesystem overhead
- **Environment injection** (dso://): 10-50ms per variable
  - Simpler mechanism, faster but visible to docker inspect
- **Total container startup impact**: 100-1000ms added to startup

### Memory Growth

- **Per-secret**: ~1KB base + actual secret size
- **Per-container**: ~2KB for tracking metadata
- **Expected memory per 1000 managed containers**: ~10-50MB
  - Plus cache size and provider connection overhead
  - Typical daemon memory usage: 50-200MB under normal load

### CPU Usage

- **Idle**: <1% CPU (primarily event loop waiting)
- **Active rotation**: 5-20% CPU per concurrent rotation
  - Peak during large-scale concurrent rotations
- **Event processing**: <1% CPU at normal event rates

## Known Limitations

### Event Stream Reliability

- **Transient event loss**: Possible during daemon restart
  - Events during daemon downtime are not recovered
  - Periodic reconciliation (10 minutes) catches most inconsistencies
- **Duplicate event processing**: Possible in rare race conditions
  - Idempotent operations mitigate duplicate handling
  - Deduplication not implemented

### Error Handling

- **Partial failures**: Not atomically handled
  - If multi-secret injection fails on 3rd secret, first 2 are already injected
  - No rollback mechanism for multi-secret operations
- **Network failures**: Treated as provider unavailability
  - No retry with backoff for network transients beyond provider level

### Logging & Observability

- **Sensitive data redaction**: Pattern-based, not exhaustive
  - Some credential formats may not be recognized
  - Logs should be treated as containing potential secrets
  - Logs should be protected with strict access control

## Design Assumptions

### Environment

1. **Docker daemon is stable and responsive**
   - Assumes daemon responds to API calls within 5 seconds
   - Assumes daemon doesn't experience cascading failures

2. **Network connectivity is reasonable**
   - Assumes sub-second latency to provider backends
   - Assumes no long-term network partitions (>5 minutes)

3. **Container images are cooperative**
   - Assumes container processes don't interfere with secret files
   - Assumes container doesn't mount / as read-only

4. **Host OS provides tmpfs mounts**
   - Required for file-based secret injection
   - tmpfs must support 0600 permissions

### Operational

1. **Secrets are not extremely sensitive**
   - Secrets exist in memory while container runs
   - Host memory dumps can extract active secrets
   - Not suitable for highest-classification data

2. **Operator is present for troubleshooting**
   - Silent failures may not be immediately detected
   - Manual intervention may be required for recovery
   - Log monitoring is operator's responsibility

3. **Deployments don't require HA**
   - Single daemon instance per host
   - No active-active redundancy
   - No automated failover

### Security

1. **Host is trusted and secure**
   - Any process with Docker socket access can extract secrets
   - Host compromise = secret compromise
   - Operator must secure Docker socket (/var/run/docker.sock)

2. **Containers are not mutually hostile**
   - No isolation between container secret handling
   - One container can potentially read another's secrets via shared tmpfs

3. **Providers are reachable and trusted**
   - Network path to provider must be secure
   - Provider availability directly impacts DSO availability

## Version & Support

- **Current version**: 1.x (Beta - Production-Capable)
- **Supported for**: Docker 20.10+, Linux/macOS/Windows
- **EOL policy**: Not yet established
- **Breaking changes**: Possible in 1.x pre-GA releases

## Recommendations for Production Use

1. **Monitoring**: Enable Prometheus metrics, alert on connection failures
2. **Limits**: Set resource limits (memory, goroutines) via container runtime
3. **Updates**: Regular updates for bug fixes and hardening
4. **Logging**: Protect logs with strict access control due to potential sensitive data
5. **Secrets**: Use with non-highest-classification secrets (development, staging, standard production)
6. **Redundancy**: Deploy multiple instances for critical workloads (manual failover)
7. **Provider**: Ensure provider backend is highly available and performant

## Future Improvements

- Podman/containerd runtime support
- Active-active deployment with state synchronization
- Built-in HA with automatic failover
- Enhanced secret redaction patterns
- Audit trail and secret access logging
- Circuit breaker pattern for provider failures
- Event deduplication and loss detection
`;

export const metadata: Metadata = {
  title: "DSO Operational Limitations & Design Assumptions",
  description: "Documentation for DSO Operational Limitations & Design Assumptions",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
