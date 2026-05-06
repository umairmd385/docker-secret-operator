# CLI: Compose

The `compose` command is a secret-injecting wrapper for Docker Compose subcommands. It allows you to use familiar compose commands while DSO automatically handles secret injection and management.

## Usage

```bash
docker dso compose <subcommand> [options]
```

## Supported Subcommands

| Subcommand | Purpose |
|------------|---------|
| `up` | Start and run services |
| `down` | Stop and remove containers |
| `ps` | List running containers |
| `logs` | View service logs |
| `stop` | Stop running services |
| `restart` | Restart services |
| `pull` | Pull latest images |

## Examples

### Start Services
```bash
docker dso compose up
docker dso compose up -d          # Detached mode
docker dso compose up --no-build  # Skip image build
```

### Stop Services
```bash
docker dso compose stop
docker dso compose stop <service> # Stop specific service
```

### View Logs
```bash
docker dso compose logs
docker dso compose logs -f        # Follow logs
docker dso compose logs -n 50     # Last 50 lines
docker dso compose logs <service> # Specific service logs
```

### List Containers
```bash
docker dso compose ps
docker dso compose ps -a          # All containers
docker dso compose ps <service>   # Specific service
```

### Pull Latest Images
```bash
docker dso compose pull
docker dso compose pull <service>
```

### Restart Services
```bash
docker dso compose restart
docker dso compose restart <service>
```

## Key Differences from `docker compose`

### Automatic Secret Injection
All compose commands automatically inject secrets from vault/provider:

```bash
# Traditional docker compose
docker compose up
# Secrets must be available via .env files or env vars

# DSO compose wrapper
docker dso compose up
# Secrets automatically injected from vault/provider
```

### Configuration Files
DSO compose respects both files:

```bash
docker dso compose -f docker-compose.prod.yaml -c dso.cloud.yaml up
```

### Global Flags
All subcommands support DSO global flags:

```bash
docker dso compose --debug logs
docker dso compose --config dso.yaml ps
```

## Common Workflows

### Development Workflow
```bash
# Initialize vault (first time only)
docker dso init

# Set development secrets
docker dso secret set myapp/db_host localhost
docker dso secret set myapp/db_user postgres
docker dso secret set myapp/db_pass devpass

# Start services with automatic secret injection
docker dso compose up -d

# View logs in real-time
docker dso compose logs -f

# Check service status
docker dso compose ps

# Restart a service if needed
docker dso compose restart api

# Cleanup
docker dso compose down -v
```

### Production Deployment
```bash
# Setup cloud provider
docker dso system setup --providers aws

# Pull latest images
docker dso compose pull

# Start stack with cloud-sourced secrets
docker dso compose up -d

# Monitor logs
docker dso compose logs -f

# Scale services if needed
docker dso compose up -d --scale api=3

# Graceful shutdown
docker dso compose down
```

### Debugging Service Issues
```bash
# Check service status
docker dso compose ps

# View detailed logs
docker dso compose logs <service> -f

# Inspect running container
docker dso inspect <container-id>

# Restart service
docker dso compose restart <service>
```

## Output Examples

### Up Command
```
[INFO] Detecting DSO mode...
[INFO] Loading secrets from vault...
[OK] Secrets loaded (5 secrets, 1.2 KiB)
Creating network "myapp_default" with the default driver
Creating myapp_db_1 ... done
Creating myapp_api_1 ... done
Creating myapp_cache_1 ... done
```

### Logs Command
```
myapp_api_1     | INFO: Starting application server
myapp_api_1     | INFO: Connected to database
myapp_api_1     | INFO: Server listening on :8080
myapp_cache_1   | [redis] Ready to accept connections
```

### PS Command
```
NAME              COMMAND               STATUS         PORTS
myapp_api_1       /app/bin/api          Up 2 minutes   0.0.0.0:8080->8080/tcp
myapp_db_1        postgres              Up 2 minutes   5432/tcp
myapp_cache_1     redis-server          Up 2 minutes   6379/tcp
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `COMPOSE_FILE` | Default docker-compose file |
| `COMPOSE_PROJECT_NAME` | Custom project name |
| `DSO_MODE` | Force mode: `local` or `cloud` |
| `DSO_CONFIG_PATH` | Default dso.yaml path |

## Best Practices

1. **Always use `-d` (detached) in production**
   ```bash
   docker dso compose up -d
   ```

2. **Monitor logs continuously**
   ```bash
   docker dso compose logs -f &
   ```

3. **Verify services are healthy**
   ```bash
   docker dso compose ps
   docker dso inspect <container-id>
   ```

4. **Use named services for scaling**
   ```yaml
   services:
     api:
       image: myapp:latest
       deploy:
         replicas: 3
   ```

5. **Separate compose files per environment**
   ```bash
   docker dso compose -f docker-compose.yaml \
     -f docker-compose.prod.yaml \
     -c dso.prod.yaml up -d
   ```

## Advanced Usage

### Multiple Compose Files
```bash
# Combine base and environment-specific configs
docker dso compose \
  -f docker-compose.yaml \
  -f docker-compose.override.yaml \
  -f docker-compose.prod.yaml \
  up -d
```

### Custom Service Selection
```bash
# Start only specific services
docker dso compose up -d api cache
# This starts only api and cache, plus dependencies
```

### Resource Limits
```bash
# View resource usage
docker dso compose stats

# Restart with resource constraints
docker dso compose up -d --compatibility
```

## Troubleshooting

### Service Won't Start
```bash
# Check service logs
docker dso compose logs <service>

# Verify secrets are loaded
docker dso secret list

# Check configuration
docker dso validate
```

### Secrets Not Available
```bash
# List available secrets
docker dso secret list

# Verify secret paths in dso.yaml
docker dso validate

# Export and inspect resolved secrets
docker dso export --format json
```

### Port Conflicts
```bash
# Check what's using the port
lsof -i :8080

# Use different port in override file
# docker-compose.override.yaml:
# services:
#   api:
#     ports:
#       - "8081:8080"
```

## Performance Tips

1. **Use `--no-deps` to skip dependencies**
   ```bash
   docker dso compose restart api --no-deps
   ```

2. **Parallel pulls for faster startup**
   ```bash
   docker dso compose pull --parallel
   ```

3. **Cache secrets locally when possible**
   ```bash
   docker dso export --output .env.cache
   # Use in development
   ```

## Related Commands

- **[CLI: Up](/guide/cli-up)** - Direct deployment command
- **[CLI: Down](/guide/cli-down)** - Stop and cleanup
- **[CLI: Logs](/guide/cli-management#logs)** - Advanced log filtering
- **[CLI: Inspect](/guide/cli-management#inspect)** - Container inspection
