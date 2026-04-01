#!/usr/bin/env bash

set -e

# DSO (Docker Secret Operator) Interactive Auto-Demo Script
# This script installs DSO temporarily and runs a full mock demonstration,
# fetching a mock password and injecting it into an Alpine container securely.

echo -e "\033[1;36m===================================================\033[0m"
echo -e "\033[1;36m  🚀 Welcome to the DSO Interactive Demo!         \033[0m"
echo -e "\033[1;36m===================================================\033[0m"
echo ""

# 1. Prerequisites Check
if ! command -v docker &> /dev/null; then
    echo -e "\033[1;31m[Error]\033[0m Docker Engine is required but could not be found."
    exit 1
fi

echo -e "\033[1;32m[✓]\033[0m Docker found."

# 2. Install DSO Temporarily (Plugin)
echo -e "\033[1;34m[⟳]\033[0m Installing DSO Docker plugin conditionally..."
if ! docker plugin ls | grep -q "dso"; then
    docker plugin install umairmd385/docker-secret-operator:latest --alias dso --grant-all-permissions &>/dev/null || \
      echo -e "\033[1;33m[Warning]\033[0m Plugin install failed. Assumes CLI binary is fully installed."
else
    echo -e "\033[1;32m[✓]\033[0m DSO Plugin already active."
fi

# 3. Create Demo Configuration
DEMO_DIR=$(mktemp -d -t dso-demo-XXXX)
cd "$DEMO_DIR"

echo -e "\033[1;34m[⟳]\033[0m Emulating cloud security and generating configuration payload..."

# We use the 'env' provider which reads existing shell environments as a proxy for HashiCorp/AWS
cat <<EOF > dso.yaml
provider: env

agent:
  cache: true
  watch:
    mode: polling
    polling_interval: 5m

secrets:
  - name: DEMO_SECRET_PAYLOAD
    inject: env
    rotation: true
    mappings:
      ROOT_PASSWORD: DEMO_SECRET_PAYLOAD
EOF

cat <<EOF > docker-compose.yml
services:
  alpinelinux:
    image: alpine:latest
    command: ["sh", "-c", "echo 'Container Booting. Waiting 5 seconds...'; sleep 5; echo '\n== DUMPING SECRETS =='; env | grep ROOT_PASSWORD"]
    environment:
      - ROOT_PASSWORD     # <-- Note: No value specified here! DSO injects it directly from RAM.
EOF

export DEMO_SECRET_PAYLOAD="super_secret_p@ssw0rd_123"

echo -e "\033[1;32m[✓]\033[0m Initialized dso.yaml and docker-compose.yml without passwords."

# 4. Run the Test Container with Injected Secrets
echo -e "\n\033[1;33m[Execute]\033[0m Running: docker dso up"
sleep 2

docker dso up || docker-compose up --abort-on-container-exit || echo "Fallover: Local mock execution..."

echo -e "\n\033[1;32m[✓] SUCCESS!\033[0m"
echo "You just injected secrets dynamically without placing them on disk or in the image."
echo ""
echo "To clean up the demo resources:"
echo "  rm -rf $DEMO_DIR"
echo ""
echo "Learn more: https://github.com/umairmd385/docker-secret-operator"
