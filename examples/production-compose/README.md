# Production Deployment with Docker Compose

This example shows how to deploy a stack using DSO for secret management.

## Prerequisites
- DSO installed via `install.sh`
- A configured `/etc/dso/dso.yaml`

## Steps

1. **Verify the Agent is running**
   ```bash
   sudo systemctl status dso-agent
   ```

2. **Deploy the stack via docker-dso plugin**
   ```bash
   docker dso up -d
   ```

3. **Verify injection**
   ```bash
   docker compose exec web env | grep DB_PASSWORD
   ```
