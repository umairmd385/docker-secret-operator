/**
 * Local Mode (Native Vault) Integration Content
 *
 * Verified integration guide for DSO's built-in encrypted vault.
 * Targets: Development, testing, air-gapped environments
 * Status: Fully Verified (2026-05-10)
 */

export const localModeIntegration = {
  slug: "local-mode",
  title: "Local Mode - Development with Encrypted Vault",
  description: "Use DSO's built-in encrypted vault for development, testing, and air-gapped environments. Zero external dependencies, AES-256-GCM encryption, perfect for getting started with DSO.",
  keywords: [
    "dso local mode",
    "local encrypted vault",
    "development secrets",
    "docker secret development",
    "air-gapped secrets",
    "offline secret management",
  ],
  provider: {
    name: "Local Encrypted Vault",
    logo: "https://img.icons8.com/?size=100&id=rLMUZ5XJ96lM&format=png&color=ffffff",
    url: "/integrations/local-mode",
  },

  problemOverview: `
Developers need a simple way to manage secrets locally without cloud accounts or external dependencies. Getting started with Docker Secret Operator should be fast and straightforward.

Traditional Local Development Problems:
- Hardcoded secrets in docker-compose.yaml (committed to git)
- .env files exposed via docker inspect
- No encryption for local development
- Difficult to migrate to production providers
- No way to practice secret management patterns

Why DSO Local Mode Matters:
Built-in encrypted vault lets you practice DSO patterns immediately. No cloud setup needed. When ready for production, simply switch providers—same dso.yaml format, same injection mechanism.
  `,

  architecture: {
    overview: `
Local Mode provides a secure, development-friendly secret system:

1. Trust Boundary: Local file encryption (AES-256-GCM)
2. Secret Lifecycle: Create with CLI → Encrypt at rest → Inject at runtime
3. Persistence: Encrypted only (plaintext never on disk)
4. Rotation: Manual update and redeploy
5. Perfect For: Learning DSO, testing patterns, air-gapped environments
    `,

    steps: [
      {
        title: "Initialize Vault",
        description: "Create encrypted vault at ~/.dso/vault.enc with master key derivation.",
      },
      {
        title: "Create Secrets",
        description: "Use CLI to add secrets to local vault with AES-256-GCM encryption.",
      },
      {
        title: "Configure DSO",
        description: "Define secrets in dso.yaml (no provider field needed for Local Mode).",
      },
      {
        title: "Deploy Stack",
        description: "Run docker dso up to inject secrets from encrypted vault into containers.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "Docker 20.10+ installed",
      "Docker Compose installed",
      "DSO v3.2+ installed (docker dso version)",
      "No cloud accounts needed",
      "No internet required (air-gapped ready)",
    ],

    steps: [
      {
        number: 1,
        title: "Initialize Local Vault",
        description: "Create encrypted vault for storing secrets.",
        code: `
# Initialize local vault
docker dso init

# This creates:
# - ~/.dso/vault.enc (encrypted secrets)
# - ~/.dso/ (master key)
        `,
      },
      {
        number: 2,
        title: "Create Secrets",
        description: "Add secrets to the encrypted vault.",
        code: `
# Create secrets using simple CLI
docker dso secret set DB_PASSWORD "your-secure-password"
docker dso secret set DB_USER "postgres"
docker dso secret set API_KEY "sk-1234567890abcdef"

# List all secrets (names only)
docker dso secret list

# Retrieve a secret (plaintext)
docker dso secret get DB_PASSWORD --reveal
        `,
      },
      {
        number: 3,
        title: "Create dso.yaml",
        description: "Configure DSO (no provider needed for Local Mode).",
        code: `
# dso.yaml - Local Mode configuration
# Note: No 'provider' field—Local Mode is default

secrets:
  - name: DB_PASSWORD
    inject: env

  - name: DB_USER
    inject: env

  - name: API_KEY
    inject: env
        `,
      },
      {
        number: 4,
        title: "Create docker-compose.yaml",
        description: "Define application stack with dso:// references.",
        code: `
version: "3.9"

services:
  app:
    image: python:3.11
    environment:
      - DB_PASSWORD=dso://DB_PASSWORD
      - DB_USER=dso://DB_USER
      - API_KEY=dso://API_KEY
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://DB_PASSWORD
      POSTGRES_USER: dso://DB_USER
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
        `,
      },
      {
        number: 5,
        title: "Deploy Stack",
        description: "Start containers with secrets injected from local vault.",
        code: `
# Deploy
docker dso up -d

# Verify injection
docker logs app | grep DB_PASSWORD

# Verify zero-persistence
docker inspect app | grep DB_PASSWORD
# Should output nothing (secret not persisted)
        `,
      },
      {
        number: 6,
        title: "Test Secret Update",
        description: "Update secret and redeploy to see rotation.",
        code: `
# Update secret in vault
docker dso secret set DB_PASSWORD "newpassword123"

# Redeploy to apply new secret
docker dso down
docker dso up -d

# Verify new secret
docker logs app | grep DB_PASSWORD
# Should show new value
        `,
      },
    ],
  },

  securityBenefits: [
    "Encrypted Storage: AES-256-GCM encryption at ~/.dso/vault.enc",
    "Zero Persistence: Plaintext never written to disk",
    "Machine-Locked: Master key derived from system (not portable)",
    "User-Private: Secrets only readable by owning user (chmod 600)",
    "No Network: Completely offline capable",
    "Development-Safe: Perfect for learning and testing",
  ],

  troubleshooting: [
    {
      problem: "Vault not initialized",
      solution: `Run: docker dso init
This creates ~/.dso/vault.enc and master key.
      `,
    },
    {
      problem: "Secret not found error",
      solution: `1. List existing secrets: docker dso secret list
2. Create missing secret: docker dso secret set SECRET_NAME "value"
3. Verify dso.yaml uses exact secret name
      `,
    },
    {
      problem: "Secret visible in docker inspect",
      solution: `Make sure docker-compose.yaml uses dso:// references:
❌ WRONG: environment: DB_PASSWORD=mysecret
✅ CORRECT: environment: DB_PASSWORD=dso://DB_PASSWORD
      `,
    },
    {
      problem: "Permission denied on vault file",
      solution: `Fix file permissions:
chmod 600 ~/.dso/vault.enc
chmod 700 ~/.dso/
      `,
    },
    {
      problem: "Vault lost after machine restart",
      solution: `Vault is machine-specific and can't be recovered.
Lesson: Backup ~/.dso/vault.enc regularly.
To recover: Re-initialize and re-create all secrets.
      `,
    },
  ],

  faqItems: [
    {
      question: "Can I use Local Mode in production?",
      answer: `No. Local Mode is for development only. For production, use AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault. They provide audit logging, high availability, and proper secret management.`,
    },
    {
      question: "How do I migrate from Local Mode to AWS/Azure?",
      answer: `Copy your secrets to the cloud provider, update dso.yaml with provider settings, and redeploy. The docker-compose.yaml and secret injection mechanism remain the same.`,
    },
    {
      question: "Is the vault encrypted?",
      answer: `Yes. Secrets stored in ~/.dso/vault.enc are encrypted with AES-256-GCM. The master key is derived from your system and not stored as plaintext.`,
    },
    {
      question: "Can I share the vault file with team members?",
      answer: `No. The vault is locked to your machine. The master key is derived from your system. To share secrets, use a cloud provider or self-hosted Vault instead.`,
    },
    {
      question: "What happens if I delete ~/.dso/vault.enc?",
      answer: `All secrets are lost (unless you have a backup). Re-initialize with docker dso init and re-create all secrets.`,
    },
    {
      question: "Is Local Mode the same as Docker secrets?",
      answer: `No. Docker secrets are for Swarm mode. Local Mode is DSO's development feature using encrypted local storage.`,
    },
    {
      question: "Can I use Local Mode in containers running on remote servers?",
      answer: `No. Vault is machine-specific. For remote deployments, use cloud providers (AWS/Azure/Vault) instead.`,
    },
  ],

  relatedPages: [
    { label: "AWS Secrets Manager Integration", href: "/integrations/aws-secrets-manager" },
    { label: "Azure Key Vault Integration", href: "/integrations/azure-key-vault" },
    { label: "HashiCorp Vault Integration", href: "/integrations/hashicorp-vault" },
    { label: "Getting Started Guide", href: "/docs/guide/getting-started" },
  ],
};
