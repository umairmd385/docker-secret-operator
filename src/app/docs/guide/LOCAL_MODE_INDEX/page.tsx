import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# Local Mode Documentation Index

Complete reference for Docker Secret Operator in local development mode.

---

## 📚 Documentation Structure

### Getting Started

**New to DSO? Start here:**

1. **[Quick Start (5 min)](getting-started.md#local-mode-setup)** - Minimal setup to deploy your first service
2. **[Complete Local Mode Guide](LOCAL_MODE_GUIDE.md)** - Comprehensive guide with examples and troubleshooting

### Real-World Examples

**Learn by doing:**

- **[MySQL + phpMyAdmin Quick Start](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md)** ⭐ **START HERE**
  - Your real-world use case
  - Step-by-step walkthrough
  - Common tasks and troubleshooting
  - ~5 minute deployment

- **[MySQL + phpMyAdmin Full Example](../examples/mysql-phpmyadmin-local.yml)**
  - Complete, annotated docker-compose.yml
  - Production-like configuration
  - Best practices included

- **[Minimal Example](../examples/local-mode-minimal.yml)**
  - PostgreSQL + Python app
  - Simplest possible setup
  - Good for learning

- **[Full-Featured Example](../examples/local-mode-compose.yml)**
  - PostgreSQL, API, Redis, pgAdmin
  - Multiple secret injection patterns
  - Advanced configuration

- **[Local Mode Examples Guide](../examples/LOCAL_MODE_EXAMPLES.md)**
  - How to run each example
  - Rotation strategies explained
  - Secret management reference

### Reference Documentation

**For specific information:**

- **[CLI Reference](cli.md)** - Complete command reference
- **[Configuration Reference](configuration.md)** - YAML schema and options
- **[Quick Reference Card](QUICKREF.md)** - One-page cheat sheet

### Advanced Topics

- **[Architecture Guide](architecture.md)** - How DSO works internally
- **[Operational Guide](operational-guide.md)** - Day-2 operations
- **[Security Model](../SECURITY.md)** - Security analysis
- **[Recovery Procedures](RECOVERY_PROCEDURES.md)** - Failure recovery

---

## 🎯 By Use Case

### I want to...

#### **Get started in 5 minutes** ⭐
→ [MySQL + phpMyAdmin Quick Start](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md)

#### **Understand how local mode works**
→ [Complete Local Mode Guide](LOCAL_MODE_GUIDE.md)

#### **Set up my own Docker Compose file**
→ [Complete Local Mode Guide - Docker Compose Configuration](LOCAL_MODE_GUIDE.md#docker-compose-configuration)

#### **Manage my secrets**
→ [Complete Local Mode Guide - Secret Management](LOCAL_MODE_GUIDE.md#secret-management)

#### **Test secret rotation**
→ [MySQL + phpMyAdmin Quick Start - Update a Secret](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md#update-a-secret)

#### **Troubleshoot issues**
→ [MySQL + phpMyAdmin Quick Start - Troubleshooting](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md#troubleshooting)

#### **Learn all CLI commands**
→ [CLI Reference](cli.md)

#### **Move to production**
→ [Complete Local Mode Guide - Next Steps](LOCAL_MODE_GUIDE.md#next-steps)

---

## 📋 Documentation Overview

### Local Mode Guide (\`LOCAL_MODE_GUIDE.md\`)
**Length**: ~2000 words | **Time to Read**: 20 minutes | **Scope**: Comprehensive

Topics:
- What is local mode
- Installation (3 steps)
- Quick start (5 minutes)
- Real-world example: MySQL + phpMyAdmin
- Secret management (set, list, get, delete, import)
- Docker Compose configuration (labels, injection methods, rotation strategies)
- Deployment & verification
- Monitoring & debugging
- Troubleshooting (9 common issues)
- Best practices (8 guidelines)
- Security model

**Best for**: Complete understanding, reference material

---

### MySQL + phpMyAdmin Quick Start (\`MYSQL_PHPMYADMIN_QUICKSTART.md\`)
**Length**: ~1000 words | **Time to Read**: 5-10 minutes | **Scope**: Hands-on tutorial

Topics:
- 5-step deployment walkthrough
- How to access services
- Common tasks (backup, logs, connection)
- Troubleshooting (4 common issues)
- Command cheat sheet
- Tips & tricks

**Best for**: Hands-on learning, quick reference

---

### Complete Examples (\`examples/LOCAL_MODE_EXAMPLES.md\`)
**Length**: ~1500 words | **Time to Read**: 10 minutes | **Scope**: All examples explained

Topics:
- How to run minimal example
- How to run full-featured example
- Secret injection methods explained
- All DSO labels and meanings
- Rotation strategies (rolling, restart, signal, none)
- Secret management commands
- Monitoring & debugging
- Troubleshooting

**Best for**: Understanding different configurations, learning features

---

### Quick Reference (\`QUICKREF.md\`)
**Length**: ~500 words | **Time to Read**: 2-3 minutes | **Scope**: Condensed reference

Topics:
- Essential commands
- Configuration examples
- Docker Compose integration
- File locations
- Permissions

**Best for**: Quick lookup, one-page reference

---

### Getting Started Guide (\`getting-started.md\`)
**Length**: ~1000 words | **Time to Read**: 10 minutes | **Scope**: All modes (local & cloud)

Topics:
- Prerequisites
- Installation
- Mode selection
- Local mode setup (step-by-step)
- Cloud mode setup
- Verification

**Best for**: Official getting started guide, all deployment modes

---

## 🔄 Common Workflows

### Workflow 1: Initial Setup
\`\`\`
1. Read: MySQL + phpMyAdmin Quick Start (5 min)
2. Follow: Steps 1-5 in MYSQL_PHPMYADMIN_QUICKSTART.md
3. Reference: QUICKREF.md for available commands
4. Done! ✅
\`\`\`

### Workflow 2: Deep Learning
\`\`\`
1. Read: Local Mode Guide introduction
2. Follow: Real-world example walkthrough
3. Practice: Run example from examples/
4. Reference: CLI and configuration docs as needed
5. Done! ✅
\`\`\`

### Workflow 3: Troubleshooting
\`\`\`
1. Run: docker dso doctor --level full
2. Check: Troubleshooting section in LOCAL_MODE_GUIDE.md
3. Search: MYSQL_PHPMYADMIN_QUICKSTART.md#troubleshooting
4. Read: Complete Local Mode Guide for detailed info
5. Done! ✅
\`\`\`

### Workflow 4: Docker Compose Setup
\`\`\`
1. Read: Docker Compose Configuration section (LOCAL_MODE_GUIDE.md)
2. Reference: mysql-phpmyadmin-local.yml for example
3. Reference: local-mode-minimal.yml for minimal setup
4. Create: Your own docker-compose.yml
5. Follow: Deployment & Verification section
6. Done! ✅
\`\`\`

---

## 📖 Quick Navigation

### By Learning Style

**Visual Learners**
- Start with examples: \`examples/\`
- Use annotated compose files: \`mysql-phpmyadmin-local.yml\`
- Follow step-by-step: \`MYSQL_PHPMYADMIN_QUICKSTART.md\`

**Hands-On Learners**
- Follow quick start: \`MYSQL_PHPMYADMIN_QUICKSTART.md\`
- Modify example configs: \`examples/\`
- Experiment with commands: \`QUICKREF.md\`

**Reference-Oriented Learners**
- Read complete guide: \`LOCAL_MODE_GUIDE.md\`
- Check CLI reference: \`cli.md\`
- Use quick reference: \`QUICKREF.md\`

**Deep-Dive Learners**
- Read architecture: \`architecture.md\`
- Study security: \`SECURITY.md\`
- Review operations: \`operational-guide.md\`

---

## 🎓 Learning Paths

### Path 1: 30-Minute Quick Start (Beginner)
1. Read MYSQL_PHPMYADMIN_QUICKSTART.md (5 min)
2. Follow steps 1-5 (10 min)
3. Explore services (10 min)
4. Practice updating a secret (5 min)
5. Done! ✅

### Path 2: 1-Hour Comprehensive (Intermediate)
1. Read LOCAL_MODE_GUIDE.md introduction (10 min)
2. Follow quick start (5 min)
3. Read real-world example section (15 min)
4. Follow MySQL + phpMyAdmin example (20 min)
5. Practice troubleshooting (10 min)
6. Done! ✅

### Path 3: 2-Hour Deep Dive (Advanced)
1. Read LOCAL_MODE_GUIDE.md completely (30 min)
2. Review all examples (20 min)
3. Follow MySQL + phpMyAdmin (15 min)
4. Test rotation strategies (20 min)
5. Troubleshoot intentionally (20 min)
6. Read security model (15 min)
7. Done! ✅

---

## 📌 Key Concepts

### Secret Injection Methods

| Method | Visibility | Best For | Documentation |
|--------|-----------|----------|---------------|
| \`dso://\` | Env vars | Simple secrets | LOCAL_MODE_GUIDE.md#environment-variable |
| \`dsofile://\` | Files | Sensitive data | LOCAL_MODE_GUIDE.md#file-injection |

→ [Learn more](LOCAL_MODE_GUIDE.md#docker-compose-configuration)

### Rotation Strategies

| Strategy | Downtime | Best For | Documentation |
|----------|----------|----------|---------------|
| \`rolling\` | Zero | Production services | LOCAL_MODE_GUIDE.md#rolling |
| \`restart\` | Brief | Stateless services | LOCAL_MODE_GUIDE.md#restart |
| \`signal\` | None | SIGHUP-aware apps | LOCAL_MODE_GUIDE.md#signal |
| \`none\` | N/A | Manual rotation | LOCAL_MODE_GUIDE.md#none |

→ [Learn more](LOCAL_MODE_GUIDE.md#rotation-strategies)

### Secret Management

\`\`\`bash
docker dso secret set <name>        # Create/update
docker dso secret list [project]    # View all
docker dso secret get <name>        # Retrieve (local mode only)
docker dso secret delete <name>     # Remove
docker dso env import <file> <proj> # Bulk import
\`\`\`

→ [Learn more](LOCAL_MODE_GUIDE.md#secret-management)

---

## ✅ Verification Checklist

After following any guide, verify your setup:

\`\`\`bash
# ✅ 1. DSO installed
docker dso version

# ✅ 2. Local vault exists
ls ~/.dso/vault.enc ~/.dso/master.key

# ✅ 3. Secrets are set
docker dso secret list

# ✅ 4. Services running
docker ps

# ✅ 5. Health check passing
docker dso doctor

# ✅ 6. Status OK
docker dso status

# ✅ All systems operational!
\`\`\`

---

## 🔗 Related Documentation

**For other deployment modes:**
- Cloud mode: [Agent Mode in Getting Started](getting-started.md#cloud-mode-setup)
- Providers: [Providers Guide](providers.md)

**For operations:**
- Day-2 operations: [Operational Guide](operational-guide.md)
- Recovery: [Recovery Procedures](RECOVERY_PROCEDURES.md)
- Monitoring: [Status Monitoring](LOCAL_MODE_GUIDE.md#monitoring--debugging)

**For development:**
- Architecture: [Architecture Guide](architecture.md)
- Security: [Security Model](../SECURITY.md)
- API: [API Reference](../docs/) (if available)

---

## 🎯 Quick Links

### Most Popular
- [MySQL + phpMyAdmin Quick Start](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md) ⭐
- [Complete Local Mode Guide](LOCAL_MODE_GUIDE.md)
- [Quick Reference Card](QUICKREF.md)

### Examples
- [MySQL + phpMyAdmin Compose File](../examples/mysql-phpmyadmin-local.yml)
- [Minimal Example](../examples/local-mode-minimal.yml)
- [Full-Featured Example](../examples/local-mode-compose.yml)

### Reference
- [CLI Commands](cli.md)
- [Configuration Schema](configuration.md)
- [Troubleshooting](LOCAL_MODE_GUIDE.md#troubleshooting)

---

## 📞 Getting Help

**Something not working?**

1. **Quick check**: \`docker dso doctor --level full\`
2. **View logs**: \`docker compose logs -f\`
3. **Check secrets**: \`docker dso secret list\`
4. **Read troubleshooting**:
   - [MySQL Quick Start Troubleshooting](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md#troubleshooting)
   - [Local Mode Guide Troubleshooting](LOCAL_MODE_GUIDE.md#troubleshooting)

**Still stuck?**

- **Full documentation**: [LOCAL_MODE_GUIDE.md](LOCAL_MODE_GUIDE.md)
- **Examples**: [LOCAL_MODE_EXAMPLES.md](../examples/LOCAL_MODE_EXAMPLES.md)
- **GitHub Issues**: https://github.com/docker-secret-operator/dso/issues
- **Discussions**: https://github.com/docker-secret-operator/dso/discussions

---

## 📄 Document Versions

| Document | Version | Updated | Status |
|----------|---------|---------|--------|
| LOCAL_MODE_GUIDE.md | 1.0 | May 2026 | ✅ Current |
| MYSQL_PHPMYADMIN_QUICKSTART.md | 1.0 | May 2026 | ✅ Current |
| LOCAL_MODE_EXAMPLES.md | 1.0 | May 2026 | ✅ Current |
| getting-started.md | 3.5.17 | May 2026 | ✅ Current |
| QUICKREF.md | Latest | May 2026 | ✅ Current |

---

## 🚀 Next Steps

### After Local Mode Works

1. **Test rotation** - Intentionally change a secret and watch zero-downtime swap
2. **Add more services** - Expand to full-stack application
3. **Explore advanced features** - Try different rotation strategies
4. **Move to production** - Switch to agent mode with cloud provider
5. **Contribute** - Help improve documentation or contribute to DSO

---

**Ready to get started?**

👉 **[Go to MySQL + phpMyAdmin Quick Start](../examples/MYSQL_PHPMYADMIN_QUICKSTART.md)**

**Want to learn everything?**

👉 **[Go to Complete Local Mode Guide](LOCAL_MODE_GUIDE.md)**

**Need a quick reference?**

👉 **[Go to Quick Reference Card](QUICKREF.md)**

---

**Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✅
`;

export const metadata: Metadata = {
  title: "Local Mode Documentation Index",
  description: "Documentation for Local Mode Documentation Index",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
