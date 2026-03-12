#!/bin/bash
set -e

echo "=========================================="
echo "Installing Docker Secret Operator (DSO)..."
echo "=========================================="

echo "[1/4] Building core binaries..."
go build -o dso cmd/dso/*.go
go build -o dso-agent cmd/dso-agent/*.go

echo "[2/4] Installing to /usr/local/bin..."
sudo mv dso dso-agent /usr/local/bin/

echo "[3/4] Building cloud providers and setting up plugin directory..."
sudo mkdir -p /usr/local/lib/dso/plugins
sudo chmod 755 /usr/local/lib/dso/plugins

(cd cmd/plugins/dso-provider-aws && go build -o ../../../dso-provider-aws main.go)
(cd cmd/plugins/dso-provider-azure && go build -o ../../../dso-provider-azure main.go)
(cd cmd/plugins/dso-provider-huawei && go build -o ../../../dso-provider-huawei main.go)

sudo mv dso-provider-aws dso-provider-azure dso-provider-huawei /usr/local/lib/dso/plugins/

echo "[4/4] Creating systemd service..."
cat << 'EOF' | sudo tee /etc/systemd/system/dso-agent.service > /dev/null
[Unit]
Description=Docker Secret Operator Agent
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/dso-agent
Restart=on-failure
RestartSec=5

# For Azure/AWS identity environments, you can define specific env vars
# Environment="AWS_REGION=us-east-1"
# Environment="AZURE_CLIENT_ID=client-id"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now dso-agent

echo "=========================================="
echo "DSO Installation Complete!"
echo "Agent status:"
sudo systemctl status dso-agent --no-pager
echo ""
echo "You can now run 'dso compose up -d' in your project directories."
