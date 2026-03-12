#!/bin/bash
# ==============================================================================
# Docker Secret Operator (DSO) - Production Installer
# ==============================================================================
# This script performs a full, production-ready installation of DSO.
# Supported OS: Ubuntu, Debian (amd64)
# ==============================================================================

set -e

# Configuration
REPO_URL="https://github.com/umairmd385/docker-secret-operator"
INSTALL_DIR="/usr/local/bin"
LIB_DIR="/usr/local/lib/dso"
PLUGIN_NAME="dso-secret-driver"
BUILD_DIR="/tmp/dso-install"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   Installing Docker Secret Operator (DSO) ${NC}"
echo -e "${BLUE}==========================================${NC}"

# 1. Root Check
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (sudo).${NC}"
  exit 1
fi

# 2. Dependency Installation
echo -e "${GREEN}[1/7] Checking dependencies...${NC}"

# Function to install if missing
install_if_missing() {
    if ! command -v $1 &> /dev/null; then
        echo -e "Installing $1..."
        apt-get update && apt-get install -y $1
    fi
}

install_if_missing "curl"
install_if_missing "git"
install_if_missing "tar"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi

# Check for Go (Minimum 1.22)
install_go() {
    echo -e "Installing Go 1.24..."
    GO_VERSION="1.24.0"
    curl -LO https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz
    rm -rf /usr/local/go && tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz
    rm go${GO_VERSION}.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
}

if ! command -v go &> /dev/null; then
    install_go
else
    CURRENT_GO_VER=$(go version | awk '{print $3}' | sed 's/go//' | cut -d. -f2)
    if [ "$CURRENT_GO_VER" -lt 22 ]; then
        echo -e "Current Go version is too old. Upgrading..."
        install_go
    fi
fi
export PATH=$PATH:/usr/local/go/bin

# 3. Download Project Files
echo -e "${GREEN}[2/7] Downloading DSO source...${NC}"
rm -rf $BUILD_DIR && mkdir -p $BUILD_DIR
cd $BUILD_DIR
# Using git clone for now to ensure we get the latest main, but tarball is also an option
git clone $REPO_URL .

# 4. Build Core Binaries
echo -e "${GREEN}[3/7] Building core binaries...${NC}"
go build -ldflags="-s -w" -o dso cmd/dso/main.go cmd/dso/compose.go
go build -ldflags="-s -w" -o dso-agent cmd/dso-agent/main.go

mv dso dso-agent $INSTALL_DIR/

# 5. Build and Install Plugins
echo -e "${GREEN}[4/7] Setting up provider plugins...${NC}"
mkdir -p $LIB_DIR/plugins

build_plugin() {
    local name=$1
    echo "Building dso-provider-$name..."
    go build -ldflags="-s -w" -o $LIB_DIR/plugins/dso-provider-$name cmd/plugins/dso-provider-$name/main.go
}

build_plugin "aws"
build_plugin "azure"
build_plugin "huawei"
build_plugin "vault"

# 6. Create systemd service
echo -e "${GREEN}[5/7] Configuring dso-agent service...${NC}"
cat << EOF > /etc/systemd/system/dso-agent.service
[Unit]
Description=Docker Secret Operator Agent
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=$INSTALL_DIR/dso-agent
Restart=on-failure
RestartSec=5
# Allow security permissions for socket
RuntimeDirectory=dso
UMask=0007

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now dso-agent

# 7. Setup Docker Secret Driver (V2 Plugin)
echo -e "${GREEN}[6/7] Installing Docker Secret Plugin...${NC}"

# Create a temporary rootfs for the plugin
ROOTFS="$BUILD_DIR/rootfs"
mkdir -p "$ROOTFS/usr/local/bin"
cp $INSTALL_DIR/dso-agent "$ROOTFS/usr/local/bin/"
cp $BUILD_DIR/plugin/config.json "$BUILD_DIR/config.json"

docker plugin disable $PLUGIN_NAME --force &> /dev/null || true
docker plugin rm $PLUGIN_NAME --force &> /dev/null || true

# We use the local directory to create the plugin
# In a real CD, this would be a pre-built image
cd $BUILD_DIR
docker plugin create $PLUGIN_NAME .
docker plugin enable $PLUGIN_NAME

echo -e "${GREEN}[7/7] Verifying installation...${NC}"

# Check binaries
if [ -f "$INSTALL_DIR/dso" ] && [ -f "$INSTALL_DIR/dso-agent" ]; then
    echo -e "${GREEN}Binaries installed successfully.${NC}"
else
    echo -e "${RED}Binary installation failed.${NC}"
    exit 1
fi

# Check service
if systemctl is-active --quiet dso-agent; then
    echo -e "${GREEN}dso-agent service is running.${NC}"
else
    echo -e "${RED}dso-agent service failed to start.${NC}"
    exit 1
fi

# Success message
echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}   Docker Secret Operator (DSO) successfully installed!         ${NC}"
echo -e "${BLUE}================================================================${NC}"
echo -e "Usage:"
echo -e "  - Start Agent:  ${BLUE}systemctl start dso-agent${NC}"
echo -e "  - Check Status: ${BLUE}systemctl status dso-agent${NC}"
echo -e "  - Use CLI:      ${BLUE}dso compose up -d${NC}"
echo -e ""
echo -e "Refer to ${REPO_URL} for advanced configuration (dso.yaml)."
echo -e "To uninstall, run: curl -fsSL ${REPO_URL}/raw/main/uninstall.sh | bash"
echo -e "${BLUE}================================================================${NC}"

# Cleanup
rm -rf $BUILD_DIR
