#!/bin/bash
# ==============================================================================
# Docker Secret Operator (DSO) - Uninstaller
# ==============================================================================

set -e

INSTALL_DIR="/usr/local/bin"
LIB_DIR="/usr/local/lib/dso"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}==========================================${NC}"
echo -e "${RED}       Uninstalling DSO Operator...        ${NC}"
echo -e "${BLUE}==========================================${NC}"

if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (sudo).${NC}"
  exit 1
fi

echo -e "${GREEN}Stopping and disabling dso-agent service...${NC}"
systemctl stop dso-agent || true
systemctl disable dso-agent || true
rm -f /etc/systemd/system/dso-agent.service
systemctl daemon-reload

echo -e "${GREEN}Removing binaries and plugin...${NC}"
rm -f $INSTALL_DIR/dso
rm -f $INSTALL_DIR/dso-agent
rm -f /usr/local/lib/docker/cli-plugins/docker-dso

echo -e "${GREEN}Removing library and plugins...${NC}"
rm -rf $LIB_DIR

echo -e "${GREEN}Cleaning up sockets...${NC}"
rm -f /var/run/dso.sock

echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}   DSO has been successfully removed.      ${NC}"
echo -e "${BLUE}==========================================${NC}"
