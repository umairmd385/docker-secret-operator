import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Docker Plugin Integration

## Overview

DSO is a Docker CLI plugin, making it accessible as \`docker dso <command>\`. This document covers the Docker plugin architecture and integration specifics.

## What is a Docker CLI Plugin?

Docker CLI plugins extend Docker's functionality by adding new commands that are seamlessly integrated into the \`docker\` command itself.

**Instead of**:
\`\`\`bash
dso bootstrap local
\`\`\`

**You use**:
\`\`\`bash
docker dso bootstrap local
\`\`\`

## How Docker Discovers Plugins

Docker automatically discovers binaries named \`docker-<pluginname>\` in designated plugin directories:

1. **System-wide plugins**: \`/usr/local/lib/docker/cli-plugins/\`
2. **User plugins**: \`~/.docker/cli-plugins/\`

## Installation

### Method 1: Automated Install Script
\`\`\`bash
# User install (local development)
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash

# System install (production)
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash
\`\`\`

### Method 2: Manual Install

**User-level** (recommended for development):
\`\`\`bash
mkdir -p ~/.docker/cli-plugins
curl -Lo ~/.docker/cli-plugins/docker-dso https://github.com/docker-secret-operator/dso/releases/download/v1.0.0/dso-linux-amd64
chmod +x ~/.docker/cli-plugins/docker-dso
\`\`\`

**System-wide** (for production):
\`\`\`bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -Lo /usr/local/lib/docker/cli-plugins/docker-dso https://github.com/docker-secret-operator/dso/releases/download/v1.0.0/dso-linux-amd64
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-dso
\`\`\`

### Method 3: From Source
\`\`\`bash
git clone https://github.com/docker-secret-operator/dso.git
cd dso

# Build the binary
make build

# Install to user plugin directory
mkdir -p ~/.docker/cli-plugins
cp docker-dso ~/.docker/cli-plugins/

# Or system-wide
sudo install -m 755 docker-dso /usr/local/lib/docker/cli-plugins/
\`\`\`

## Verifying Installation

\`\`\`bash
# List installed plugins
docker plugin ls

# Specifically check for DSO
docker dso version

# Verify plugin location
which docker-dso
# or
ls ~/.docker/cli-plugins/docker-dso
\`\`\`

## Plugin Architecture

### Binary Naming
- **File name**: \`docker-dso\` (follows Docker convention)
- **Command used**: \`docker dso <command>\`
- Docker strips the \`docker-\` prefix and adds it after \`docker\`

### Argument Handling

When you run \`docker dso bootstrap local\`, Docker actually calls:
\`\`\`
docker-dso dso bootstrap local
\`\`\`

DSO handles this by detecting and stripping the duplicate argument:
\`\`\`go
// From internal/cli/root.go
if len(os.Args) > 1 && os.Args[1] == "dso" {
    os.Args = append(os.Args[:1], os.Args[2:]...)
}
\`\`\`

### Environment

Plugin runs with:
- Same environment variables as docker CLI
- Current working directory from parent docker command
- Access to Docker socket (inherited)
- Same user context

## Integration with Docker Commands

### Docker Compose Integration
\`\`\`bash
# DSO wraps docker compose for secret injection
docker dso compose up
docker dso compose down
docker dso compose ps
\`\`\`

### Docker Context Support
\`\`\`bash
# Use with specific Docker context
docker --context myhost dso status

# List contexts
docker context list
\`\`\`

### Docker Stack Integration (Swarm)
DSO is **not** Swarm-compatible (intentionally).
- DSO designed for single-host or compose-based deployments
- Use Kubernetes or Docker Swarm for orchestration
- DSO manages secrets, not cluster-wide services

## Plugin Compatibility

### Supported Docker Versions
- Docker 20.10+
- Docker Desktop 4.0+
- Moby (Docker's open-source engine)

### Supported Platforms
- Linux: amd64, arm64
- macOS: amd64, arm64
- Docker Desktop: Linux, Windows (WSL2), macOS

### Known Limitations
- Plugins on Windows: Docker Desktop (Linux VM) or WSL2
- Rootless Docker: Limited to user mode (\`docker dso bootstrap local\`)
- Docker in Docker: Requires socket mounting

## Plugin Settings

### Metadata File
Docker uses metadata to describe plugins. DSO's metadata includes:

\`\`\`json
{
  "SchemaVersion": "0.1.0",
  "Vendor": "Docker Secret Operator",
  "Version": "1.0.0",
  "ShortDescription": "Secret lifecycle runtime for Docker Compose",
  "URL": "https://github.com/docker-secret-operator/dso"
}
\`\`\`

### Help Text
Each command provides help via \`--help\`:
\`\`\`bash
docker dso --help
docker dso bootstrap --help
docker dso doctor --help
\`\`\`

## Configuration with Docker

### Docker Socket Access
DSO requires Docker socket access:
- Default: \`/var/run/docker.sock\`
- Custom: \`DOCKER_HOST\` environment variable

**Verify access**:
\`\`\`bash
docker ps  # If this works, DSO has socket access
\`\`\`

### Docker Context
Use with different Docker contexts:
\`\`\`bash
# List available contexts
docker context list

# Use specific context
docker --context production dso status
\`\`\`

### Docker Daemon Configuration
No special Docker daemon configuration required.
DSO is a client-side plugin only.

## Troubleshooting

### Plugin Not Found
\`\`\`bash
# Plugin not recognized
docker: 'dso' is not a docker command

# Solution 1: Verify installation
ls ~/.docker/cli-plugins/docker-dso
ls /usr/local/lib/docker/cli-plugins/docker-dso

# Solution 2: Fix permissions
chmod +x ~/.docker/cli-plugins/docker-dso

# Solution 3: Restart docker (if necessary)
docker ps  # This reloads plugins
\`\`\`

### Socket Connection Errors
\`\`\`bash
# Error: cannot connect to Docker daemon
# Solution 1: Verify docker is running
docker ps

# Solution 2: Check socket accessibility
ls -la /var/run/docker.sock

# Solution 3: Fix socket permissions
sudo usermod -aG docker \$USER
newgrp docker

# Solution 4: Use explicit socket
export DOCKER_HOST=unix:///var/run/docker.sock
docker dso status
\`\`\`

### Permission Issues
\`\`\`bash
# Error: permission denied while trying to connect
# Solution 1: Add user to docker group
sudo usermod -aG docker \$USER

# Solution 2: Log out and log back in
exit  # Log out
# Log back in

# Solution 3: Verify group membership
groups \$USER  # Should include 'docker'

# Solution 4: Use sudo (temporary)
sudo docker dso bootstrap agent
\`\`\`

### Plugin Caching Issues
\`\`\`bash
# Old plugin version running
docker dso version  # Shows old version

# Solution: Clear Docker's plugin cache (if it exists)
docker plugin ls  # Lists plugins
docker ps  # Reloads plugins

# Or restart Docker daemon
sudo systemctl restart docker
\`\`\`

## Best Practices

### 1. Update Regularly
\`\`\`bash
# Check for updates
docker dso version

# Download latest
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash

# Verify update
docker dso version
\`\`\`

### 2. Verify After Installation
\`\`\`bash
# Test basic functionality
docker dso version
docker dso doctor

# Try a command
docker dso status
\`\`\`

### 3. Keep Plugin Updated
\`\`\`bash
# Add to weekly cron
0 9 * * 1 curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash
\`\`\`

### 4. Multiple Host Support
\`\`\`bash
# Different Docker contexts
docker context create prod --docker "host=ssh://prodhost:2376"
docker --context prod dso bootstrap agent
\`\`\`

## Advanced: Building a Custom Plugin

To extend DSO or create a related plugin:

\`\`\`bash
# Clone the repo
git clone https://github.com/docker-secret-operator/dso.git

# Modify source code
# Edit internal/cli/root.go to add new commands

# Build plugin
make build

# Install locally for testing
cp docker-dso ~/.docker/cli-plugins/docker-custom

# Test
docker custom <command>
\`\`\`

See [docs/](README.md) for development guidelines.

## Compatibility with Other Plugins

DSO works alongside other Docker plugins:

\`\`\`bash
# List all plugins
docker plugin ls

# Use different plugins
docker myapp --help
docker dso status
docker compose up  # Built-in docker compose (not DSO)
\`\`\`

**Note**: If there's a naming conflict, use full path:
\`\`\`bash
~/.docker/cli-plugins/docker-dso version
\`\`\`

## Plugin Lifecycle

### Discovery
- Docker scans plugin directories on startup
- Plugins loaded on-demand

### Execution
- Runs as subprocess of docker CLI
- Inherits environment and working directory
- Communicates via stdin/stdout/stderr

### Termination
- Exits when command completes
- Clean exit recommended
- Resources cleaned up by OS

---

For installation and setup help, see [Getting Started](getting-started.md).
For CLI reference, see [cli.md](cli.md).
For Docker Compose integration, see [docker-compose.md](docker-compose.md).
`;

export const metadata: Metadata = {
  title: "DSO Docker Plugin Integration",
  description: "Documentation for DSO Docker Plugin Integration",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
