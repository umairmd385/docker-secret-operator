# Docker Swarm Deployment (Native Integration)

DSO acts as a native **Secret Driver** for Docker Swarm.

## Prerequisites
- DSO installed and `dso-agent` running.
- Docker Plugin `dso-secret-driver` enabled (`docker plugin ls`).

## Usage

1. **Create a Secret using the DSO Driver**
   ```bash
   docker secret create \
     -d dso-secret-driver \
     db_password "aws/prod/db-password"
   ```

2. **Deploy the stack**
   ```bash
   docker stack deploy -c docker-compose.yaml my-app
   ```

The Docker daemon will call the DSO Secret Driver to resolve the value of `aws/prod/db-password` before mounting it into the container.
