import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Persistence Model

This document clarifies what data DSO persists and where, correcting the misleading "zero persistence" claim in the README.

## Executive Summary

DSO keeps **secrets out of persistent storage**, but does persist:
- **Encrypted vault files** (Local Mode only)
- **Rotation state files** (for crash recovery)
- **Lock files** (for concurrency control)

**Actual behavior:** Plaintext secrets are NOT written to disk. State metadata IS written to disk.

---

## What DSO Persists

### Local Mode

| Data | Location | Format | Purpose | Lifetime |
|------|----------|--------|---------|----------|
| Encrypted vault | \`~/.dso/vault.enc\` | Binary (AES-256-GCM) | Secret storage | Permanent |
| Config | \`./dso.yaml\` (current dir) | YAML | Configuration | Permanent |

**Secrets themselves:** Never written to disk; only in-memory

### Cloud Mode (Agent)

| Data | Location | Format | Purpose | Lifetime |
|------|----------|--------|---------|----------|
| Configuration | \`/etc/dso/dso.yaml\` | YAML | Provider credentials, rotation settings | Permanent |
| Rotation state | \`/var/lib/dso/state/rotations.json\` | JSON | In-flight rotation tracking | Until completed/recovered |
| Lock files | \`/var/lib/dso/locks/*.lock\` | Files | Concurrency control | Duration of rotation |
| Systemd service | \`/etc/systemd/system/dso-agent.service\` | Unit file | Service configuration | Permanent |

**Secrets themselves:** Never written to disk; only in-memory during rotation

---

## Data Retention

### Rotation State Files
- **Created:** When rotation starts
- **Updated:** Throughout rotation lifecycle
- **Deleted:** Automatically after 7 days (configurable)
- **Purpose:** Crash recovery and operator visibility

### Lock Files
- **Created:** When acquiring lock
- **Duration:** Held during rotation
- **Deleted:** When lock is released
- **Max age:** 30 minutes (stale lock cleanup)

### Encrypted Vault (Local Mode)
- **Created:** During \`dso bootstrap local\`
- **Updated:** When secrets are added/changed
- **Location:** \`~/.dso/vault.enc\`
- **Encryption:** AES-256-GCM with user's master key
- **Permissions:** \`0600\` (user-readable only)

### Provider Configuration (Cloud Mode)
- **Created:** During \`dso bootstrap agent\`
- **Location:** \`/etc/dso/dso.yaml\`
- **Contains:** Provider credentials (protect like \`/etc/passwd\`)
- **Permissions:** \`0664\` (readable by dso group)
- **Warning:** Store credentials carefully; ideally use IAM roles instead

---

## Security Implications

### Local Mode
- Encrypted vault file is the only persistent secret data
- File is encrypted with user's master key
- Only accessible to the user who owns the file
- **Risk:** File owner can decrypt; protect the machine

### Cloud Mode
- Configuration file contains provider credentials
- Lock and state files contain container IDs (not secrets)
- **Risk:** Compromised \`/etc/dso/dso.yaml\` exposes provider access
- **Best Practice:** Use provider IAM roles instead of static credentials

---

## Filesystem Footprint

\`\`\`
Local Mode:
  ~/.dso/
    ├── vault.enc          # ~10 KB - encrypted vault
    └── state/             # Created only if agent is running
        └── rotations.json # ~1 KB per 100 rotations

Cloud Mode:
  /etc/dso/
    ├── dso.yaml           # ~2 KB - configuration
    └── ca.crt             # Optional TLS certificate
  
  /var/lib/dso/
    ├── state/
    │   └── rotations.json # Rotation tracking
    └── locks/             # Lock files (~100 bytes each)
\`\`\`

---

## Cleanup Behavior

### Automatic Cleanup
- Completed/recovered rotations deleted after 7 days (configurable)
- Stale lock files cleaned up after 30 minutes
- Encrypted vault never auto-deleted

### Manual Cleanup
\`\`\`bash
# Local Mode: Remove all local state
rm -rf ~/.dso/state ~/.dso/locks

# Cloud Mode: Remove rotation tracking
rm -rf /var/lib/dso/state /var/lib/dso/locks

# Keep configuration (contains provider setup)
# Keep encrypted vault (contains secrets)
\`\`\`

---

## Configuration Discovery

DSO searches for configuration in this order:

### Local Mode
1. \`./dso.yaml\` (current directory) ← Checked first
2. \`~/.dso/dso.yaml\` (home directory)

### Cloud Mode
1. \`/etc/dso/dso.yaml\` (system-wide)
2. \`./dso.yaml\` (fallback, not recommended)

**Recommendation:** Store config in mode-appropriate location and don't mix.

---

## Correcting the README

**Current (misleading):**
> "No secrets written to host filesystem (except encrypted vault file)"

**Accurate:**
> "Plaintext secrets not written to disk. Encrypted vault, rotation state, and lock files are persisted in mode-appropriate locations for crash recovery and operational visibility."

---

## Migration & Upgrades

### Backup Before Upgrading
\`\`\`bash
# Local Mode
cp ~/.dso/vault.enc ~/.dso/vault.enc.backup

# Cloud Mode  
sudo cp /etc/dso/dso.yaml /etc/dso/dso.yaml.backup
\`\`\`

### State Preservation
- Rotation state is automatically loaded on startup
- Lock files are cleaned up if stale
- Configuration is never auto-modified

---

## FAQ

**Q: Can I delete state files?**  
A: Yes, but pending rotations will be lost. Only delete if you've verified no rotations are in-flight.

**Q: What if /var/lib/dso gets full?**  
A: State files are small (~1KB each). If space is an issue, clean up rotations older than 7 days.

**Q: Should I commit dso.yaml to version control?**  
A: No. It contains credentials. Use a secrets management tool to manage configuration.

**Q: Can I use a network filesystem for /var/lib/dso?**  
A: Possible but not recommended. Lock files assume local filesystem semantics. Use local storage for best reliability.
`;

export const metadata: Metadata = {
  title: "DSO Persistence Model",
  description: "Documentation for DSO Persistence Model",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
