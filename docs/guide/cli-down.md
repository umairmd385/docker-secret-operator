# CLI: Down

The `down` command stops and removes containers via Docker Compose wrapper with automatic security hardening. It safely cleans up all resources created by a DSO deployment.

## Usage

```bash
docker dso down [flags]
```

## Description

Running `down` will:
1. **Stop Services**: Gracefully stops all running containers
2. **Remove Containers**: Removes container instances
3. **Cleanup Secrets**: Securely wipes secrets from memory
4. **Resource Management**: Optionally removes volumes, networks, and images
5. **Security Hardening**: Ensures no secrets remain accessible after shutdown

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--volumes` | `-v` | Remove named volumes declared in the compose file |
| `--images` | | Remove images (local, all) |
| `--remove-orphans` | | Remove containers for services not defined in compose file |
| `--rmi` | | Remove images (local, all) |
| `--timeout` | `-t` | Timeout for graceful shutdown (default: 10s) |
| `--config` | `-c` | Path to dso.yaml (default: `dso.yaml`) |
| `--file` | `-f` | Path to docker-compose.yaml (default: `docker-compose.yaml`) |
| `--debug` | | Enable debug logging |

## Examples

### Basic Shutdown
```bash
docker dso down
```

### Remove Volumes
```bash
docker dso down -v
```

### Remove Volumes and Images
```bash
docker dso down -v --rmi all
```

### Clean Up Everything
```bash
docker dso down -v --remove-orphans --rmi all
```

### With Custom Timeout
```bash
docker dso down --timeout 30s
```

### With Specific Compose File
```bash
docker dso down -f docker-compose.prod.yaml -v
```

## Security Features

### Automatic Secret Cleanup
- Clears all secrets from memory
- Unmounts tmpfs filesystems
- Erases secret metadata

### Signal Handling
- Sends SIGTERM to containers (graceful shutdown)
- Waits for configured timeout
- Sends SIGKILL if timeout exceeded (default: 10s)

### Network Isolation
- Removes custom networks (can be preserved with `--keep-networks`)
- Revokes inter-container access

## Output Example

```
[INFO] Loading configuration...
[INFO] Stopping 3 services...
Stopping myapp_api_1 ... done
Stopping myapp_db_1 ... done
Stopping myapp_cache_1 ... done
[INFO] Removing containers...
Removing myapp_api_1 ... done
Removing myapp_db_1 ... done
Removing myapp_cache_1 ... done
[INFO] Clearing secrets from memory...
[OK] Secrets cleared (3 secret mounts wiped)
[INFO] Removing custom network 'myapp_default'
Removing network myapp_default
✓ Shutdown complete
```

## Common Scenarios

### Development Environment Reset
```bash
# Clean and prepare for fresh deployment
docker dso down -v --remove-orphans
docker dso up -d
```

### Graceful Service Maintenance
```bash
# 60-second graceful shutdown for cleanup
docker dso down --timeout 60s
```

### Full Stack Cleanup (with volume removal)
```bash
# Remove everything except images
docker dso down -v --remove-orphans

# Remove images too (for complete cleanup)
docker dso down -v --remove-orphans --rmi all
```

### Production Blue-Green Deployment
```bash
# Verify new stack is healthy
docker dso ps

# Only then remove old stack
docker dso down -v
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DSO_COMPOSE_SHUTDOWN_TIMEOUT` | Default shutdown timeout (default: 10s) |
| `COMPOSE_FILE` | Default docker-compose file |

## Behavior Comparison

| Scenario | Command | Result |
|----------|---------|--------|
| Stop containers | `down` | Stops and removes containers |
| + Remove data | `down -v` | Also removes named volumes |
| + Remove images | `down --rmi all` | Also removes images |
| Development reset | `down -v --remove-orphans` | Full cleanup for fresh start |

## Order of Operations

```
1. Load Configuration
   ├─ Read dso.yaml
   └─ Read docker-compose.yaml
   
2. Prepare Shutdown
   ├─ Notify applications (graceful shutdown signal)
   └─ Wait for configured timeout
   
3. Remove Containers
   ├─ SIGTERM → SIGKILL after timeout
   └─ Remove container instances
   
4. Cleanup Resources
   ├─ Remove volumes (if -v flag)
   ├─ Remove networks
   └─ Remove images (if --rmi flag)
   
5. Security Cleanup
   ├─ Wipe secret memory
   ├─ Unmount tmpfs
   └─ Clear metadata
```

## Best Practices

1. **Backup volumes before removing them**
   ```bash
   docker cp myapp_db_1:/var/lib/postgresql/data ./backup/
   docker dso down -v
   ```

2. **Use explicit timeouts for critical services**
   ```bash
   # Give DB 30 seconds to flush data
   docker dso down --timeout 30s
   ```

3. **Verify cleanup in production**
   ```bash
   # Check no containers remain
   docker ps

   # Verify no tmpfs mounts exist
   df | grep tmpfs
   ```

4. **Preserve important data volumes**
   ```bash
   # Keep database volume, only remove app containers
   docker dso down
   # Don't use -v flag if you need the data
   ```

## Troubleshooting

### Container Won't Stop
```bash
# Use longer timeout
docker dso down --timeout 60s

# Or force with docker directly
docker-compose down --force
```

### Permission Denied
```bash
# Ensure docker socket is accessible
ls -la /var/run/docker.sock

# Or use sudo
sudo docker dso down -v
```

### Secrets Not Cleared
```bash
# Manual cleanup
docker dso inspect <container-id>
sudo mount | grep tmpfs | grep dso
# Unmount manually if needed
sudo umount /path/to/tmpfs
```

## Related Commands

- **[CLI: Up](/guide/cli-up)** - Deploy stack
- **[CLI: Compose](/guide/cli-compose)** - Direct compose wrapper
- **[CLI: Logs](/guide/cli-management#logs)** - View shutdown logs
