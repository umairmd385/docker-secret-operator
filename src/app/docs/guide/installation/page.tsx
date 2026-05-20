import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Installation Guide

DSO is distributed as a single binary that functions as a native Docker CLI plugin.

## 1. Quick Install

Run the following command to download the latest binary for your architecture and place it in the Docker plugins directory (\`~/.docker/cli-plugins\`).

\`\`\`bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install-plugins.sh | sudo bash
\`\`\`

### Verify
\`\`\`bash
docker dso version
\`\`\`

---

## 2. Selective Provider Installation (Cloud Mode)

Unlike previous versions, DSO v3.2 uses a **Plugin-Based Architecture**. By default, the core binary does not include heavy cloud SDKs. You must install the specific providers you need.

Use the \`system setup\` command to download and verify provider plugins:

\`\`\`bash
# Install AWS provider only
docker dso system setup --providers aws

# Install multiple providers
docker dso system setup --providers aws,azure,vault
\`\`\`

### Why Selective?
- **Security**: Reduces the attack surface by only including code you actually use.
- **Speed**: Smaller binary size and faster startup.
- **Integrity**: Each plugin is SHA256-verified before installation.

---

## 3. Environment Modes

### Local Mode (Non-Root)
If you only need the **Local Vault**, no further setup is required. DSO runs with user-level permissions.

### Cloud Mode (Root Required)
To use cloud providers and automatic rotation, DSO needs to install a systemd service to manage the background reconciliation loop.
\`\`\`bash
# This command requires sudo/root access
sudo docker dso system setup --providers <your-providers>
\`\`\`

---

## 4. Platform Support

| OS | Architecture | Status |
| :--- | :--- | :--- |
| Linux | amd64 / arm64 | ✅ Supported |
| macOS | amd64 / arm64 | ✅ Supported |
| Windows | x64 | ⚠️ Beta (CLI only) |
`;

export const metadata: Metadata = {
  title: "DSO Installation",
  description: "Install Docker Secret Operator on Linux, macOS, and Windows."
};

export default function InstallationPage() {
  return <MarkdownRenderer content={content} />;
}
