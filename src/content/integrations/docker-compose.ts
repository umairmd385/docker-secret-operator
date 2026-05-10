/**
 * Docker Compose Integration Content
 *
 * Comprehensive guide for DSO with Docker Compose.
 * Targets: "Docker Compose secrets" (150+ mo/searches)
 */

export const dockerComposeIntegration = {
  slug: "docker-compose",
  title: "Docker Compose Secret Injection with Docker Secret Operator",
  description: "Integrate Docker Secret Operator with Docker Compose for zero-persistence secret management. Works with local, AWS, Azure, and Vault backends.",
  keywords: [
    "docker compose secrets",
    "docker compose secret injection",
    "secure docker compose",
    "environment variables docker compose",
    "secret management docker compose",
    "docker compose aws secrets",
  ],
  provider: {
    name: "Docker Compose",
    logo: "https://cdn.simpleicons.org/docker/ffffff",
    url: "https://docs.docker.com/compose",
  },

  problemOverview: `
Docker Compose is the standard for defining multi-container applications locally and in production, but managing secrets securely is challenging:

Docker Compose Secret Problems:
- Secrets in .env files (gitignore doesn't always work; version control leaks)
- Secrets in environment variables (docker inspect, ps aux, /proc exposure)
- Secrets in docker-compose.yaml (hardcoded values or references)
- No automatic secret rotation
- Difficult to switch between local, staging, production backends
- No audit trail for secret access
- Secrets leak in logs and debug output

Why DSO with Docker Compose:
DSO transforms Docker Compose into a secure, cloud-integrated secret management system. Define secrets as dso:// references, and DSO handles authentication, fetching, injection, and rotation. Works locally (Local Mode) or cloud (AWS, Azure, Vault).
  `,

  architecture: {
    overview: `
DSO + Docker Compose creates a complete secret management workflow:

1. Reference Definition: Secrets defined in docker-compose.yaml as dso:// URIs
2. Docker Compose Parsing: docker dso up parses compose file, identifies dso:// references
3. Provider Connection: DSO connects to secret provider (local, AWS, Azure, Vault)
4. Secret Retrieval: Fetches actual secret values from provider
5. Container Injection: Injects secrets into containers via tmpfs (memory)
6. Runtime Access: Containers access secrets without persistence
7. Lifecycle: Container stops → secrets deleted from memory
    `,

    steps: [
      {
        title: "Local Mode Development",
        description: "Use DSO Local Mode (encrypted local vault) for development without cloud dependencies.",
      },
      {
        title: "Cloud Mode Production",
        description: "Switch to Cloud Mode (AWS/Azure/Vault) for production without changing docker-compose.yaml syntax.",
      },
      {
        title: "Secret Reference Syntax",
        description: "Define secrets in compose file using dso:// protocol. DSO replaces with actual values at runtime.",
      },
      {
        title: "Container Startup",
        description: "docker dso up replaces native docker-compose, handles secret injection before container start.",
      },
      {
        title: "Multiple Backends",
        description: "Single compose file works with multiple backends. Switch backends by changing DSO config.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "Docker 20.10+ and Docker Compose installed",
      "DSO v3.2+ installed (docker dso --version)",
      "For Cloud Mode: AWS account/Azure account/Vault server (optional for Local Mode)",
      "Basic understanding of docker-compose.yaml format",
    ],

    steps: [
      {
        number: 1,
        title: "Initialize DSO (Choose Local or Cloud Mode)",
        description: "Set up DSO for local development or cloud production.",
        code: `
# Option A: Local Mode (development, no cloud required)
docker dso init --mode local
# Creates encrypted vault at ~/.dso/vault.enc
# Master password required (or use DSO_MASTER_PASSWORD env var)

# Option B: Cloud Mode - AWS
docker dso init --mode cloud \\
  --provider aws \\
  --aws-region us-east-1

# Option C: Cloud Mode - Azure
docker dso init --mode cloud \\
  --provider azure \\
  --azure-vault-name myKeyVault \\
  --azure-managed-identity myIdentity

# Option D: Cloud Mode - Vault
docker dso init --mode cloud \\
  --provider vault \\
  --vault-address https://vault.example.com:8200 \\
  --vault-auth-method approle

# Verify configuration
docker dso system info
        `,
      },
      {
        number: 2,
        title: "Add Secrets to Provider (Local Mode Example)",
        description: "Create secrets in your chosen backend.",
        code: `
# For Local Mode:
docker dso secret create db-password "my-secure-db-password"
docker dso secret create api-key "sk_live_1234567890"
docker dso secret create jwt-secret "your-jwt-secret-key"

# List secrets
docker dso secret list

# For Cloud Mode (AWS example):
aws secretsmanager create-secret \\
  --name "app/db-password" \\
  --secret-string "my-secure-db-password"

# For Cloud Mode (Azure example):
az keyvault secret set \\
  --vault-name myKeyVault \\
  --name db-password \\
  --value "my-secure-db-password"
        `,
      },
      {
        number: 3,
        title: "Create docker-compose.yaml with DSO Syntax",
        description: "Define services using dso:// secret references.",
        code: `
version: "3.9"

services:
  web:
    image: myapp:latest
    environment:
      # Reference secrets from DSO provider
      - DATABASE_PASSWORD=dso://db-password
      - API_KEY=dso://api-key
      - JWT_SECRET=dso://jwt-secret
      # Regular env vars work normally
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://db-password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
        `,
      },
      {
        number: 4,
        title: "Deploy with docker dso up",
        description: "Use docker dso instead of docker-compose to deploy with secret injection.",
        code: `
# Deploy with automatic secret injection
docker dso up -d

# DSO handles:
# 1. Parse docker-compose.yaml
# 2. Find dso:// references
# 3. Authenticate to secret provider
# 4. Fetch secrets
# 5. Inject into containers
# 6. Start services

# Monitor deployment
docker dso ps

# View service status
docker dso inspect web
docker dso inspect db
docker dso inspect cache
        `,
      },
      {
        number: 5,
        title: "Test Secret Injection",
        description: "Verify secrets are injected and working.",
        code: `
# Check app can access database using injected secret
docker dso exec db psql -U postgres -d myapp -c "SELECT version();"
# Should connect successfully

# Verify connection from app container
docker dso exec web curl http://db:5432
# Should show postgres response

# Test API with injected API key
docker dso exec web curl -H "Authorization: Bearer \\$API_KEY" \\
  http://localhost:3000/api/status
# Should return success

# Confirm secret NOT in environment (most important)
docker dso exec web sh -c 'printenv | grep DATABASE_PASSWORD'
# Should show: DATABASE_PASSWORD=<actual-secret>

# Confirm secret NOT in logs
docker dso logs web | grep DATABASE_PASSWORD
# Should show NOTHING
        `,
      },
      {
        number: 6,
        title: "Local Development Workflow",
        description: "Use docker dso for development just like docker-compose.",
        code: `
# Start development environment
docker dso up -d

# View logs
docker dso logs -f web

# Execute commands in containers
docker dso exec web npm run migrate
docker dso exec web npm run seed

# Stop services
docker dso down

# Remove volumes (careful!)
docker dso down -v
        `,
      },
      {
        number: 7,
        title: "Switch Between Local and Cloud Backends",
        description: "Same compose file works with different secret backends.",
        code: `
# Local Mode (development)
docker dso init --mode local
docker dso up -d
# Secrets from local encrypted vault

# Switch to AWS (production)
docker dso init --mode cloud --provider aws
docker dso up -d
# Secrets from AWS Secrets Manager
# Same docker-compose.yaml, different backend!

# Switch to Azure
docker dso init --mode cloud --provider azure
docker dso up -d
# Secrets from Azure Key Vault

# Same services, same secrets, different providers
# No docker-compose.yaml changes needed
        `,
      },
    ],
  },

  securityBenefits: [
    "Zero Persistence: Secrets never written to disk, .env files, or environment",
    ".env File Elimination: No .env files to accidentally commit or copy",
    "Cloud Integration: Leverage AWS, Azure, or Vault without application changes",
    "Local Development: Local Mode provides secure local vault for dev/testing",
    "Easy Backend Switch: Change providers (local → AWS) with single command",
    "No Docker Layer Leaks: Secrets not baked into Docker images",
    "Automatic Rotation: Update secrets in provider, DSO refreshes containers",
    "Audit Logging: All secret access logged in external provider (if cloud)",
    "Compose File Safe: docker-compose.yaml can be in source control (uses dso:// references, not values)",
    "Production-Ready: Works for local dev and production deployments",
  ],

  troubleshooting: [
    {
      problem: "Command not found: 'docker dso' (DSO not installed properly)",
      solution: `
DSO must be installed as Docker CLI plugin.

Verify installation:
  docker dso --version

If not installed:
  # macOS with Homebrew
  brew install docker-secret-operator

  # Linux - download and install
  curl -fsSL https://dso.skycloudops.in/install.sh | sudo bash

  # Windows - use installer
  # Download from https://github.com/docker-secret-operator/dso/releases

Verify Docker recognizes it:
  docker plugin ls
      `,
    },
    {
      problem: "Error: 'dso:// reference not found' when starting containers",
      solution: `
Secret path is incorrect or hasn't been created.

Debug:
1. List available secrets:
   docker dso secret list

2. Verify secret exists:
   docker dso secret get db-password
   # Should show secret value

3. Check docker-compose.yaml references match actual secrets:
   Compose: DATABASE_PASSWORD=dso://db-password
   Actual:  docker dso secret list | grep "db-password"

4. Recreate secret if needed:
   docker dso secret create db-password "new-value"

5. Restart services:
   docker dso down
   docker dso up -d
      `,
    },
    {
      problem: "Cloud provider authentication fails (AWS, Azure, Vault)",
      solution: `
DSO can't authenticate to cloud provider.

For AWS:
  1. Verify AWS credentials configured:
     aws sts get-caller-identity
  2. Verify IAM permissions:
     aws iam get-user
  3. Verify AWS region:
     docker dso system info | grep region

For Azure:
  1. Verify Azure CLI authentication:
     az account show
  2. Verify Key Vault access:
     az keyvault secret list --vault-name myKeyVault
  3. Verify managed identity (if applicable):
     curl -H "Metadata:true" \\
       "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2017-09-01"

For Vault:
  1. Verify Vault connectivity:
     curl https://vault.example.com:8200/v1/sys/health
  2. Verify auth method:
     docker dso system info | grep auth-method
  3. Verify credentials:
     docker dso secret list --provider vault
      `,
    },
    {
      problem: "Services can't communicate (network connectivity issues)",
      solution: `
Docker Compose networking issue (not DSO-specific).

Debug:
1. Verify services are running:
   docker dso ps

2. Check network:
   docker network ls
   docker network inspect <network-name>

3. Test connectivity between containers:
   docker dso exec web ping db
   # Should show successful ping

4. Check DNS resolution:
   docker dso exec web nslookup db
   # Should resolve to container IP

5. Verify service dependencies:
   In docker-compose.yaml, ensure depends_on is set:
   depends_on:
     - db
     - cache
      `,
    },
    {
      problem: "Secrets work in dev (Local Mode) but not prod (Cloud Mode)",
      solution: `
Cloud provider configuration or permissions issue.

Check cloud provider configuration:
1. Verify DSO Cloud Mode initialized:
   docker dso system info
   # Should show correct provider and settings

2. Verify secret names match between local and cloud:
   docker dso secret list
   # Should list same secrets in cloud provider

3. If secrets don't exist in cloud provider, create them:
   For AWS:
     aws secretsmanager create-secret --name db-password \\
       --secret-string "value"

4. Verify IAM/RBAC permissions in cloud:
   For AWS: Check IAM role has secretsmanager:GetSecretValue
   For Azure: Check managed identity has Key Vault get permission

5. Test cloud provider directly:
   For AWS: aws secretsmanager get-secret-value --secret-id db-password
   For Azure: az keyvault secret show --vault-name myKeyVault --name db-password
      `,
    },
  ],

  faqItems: [
    {
      question: "Can I use docker-compose up instead of docker dso up?",
      answer: `No, not with dso:// references. Native docker-compose won't understand dso:// syntax and will treat them as literal values. You must use docker dso up to enable DSO's secret injection. However, regular docker-compose.yaml syntax is fully compatible - all service definitions, networking, volumes, etc. work exactly the same.`,
    },
    {
      question: "Is it safe to commit docker-compose.yaml with dso:// references to git?",
      answer: `Yes, absolutely safe. The dso:// references are just placeholders that don't contain actual secret values. Committing docker-compose.yaml with dso:// references is intentional - it documents which secrets your application needs. The actual secret values remain safely in your secret provider (local vault, AWS, Azure, or Vault).`,
    },
    {
      question: "How do I handle different secrets for different environments (dev, staging, prod)?",
      answer: `Create separate secret stores for each environment. You can use Docker Compose environment variable substitution or multiple compose files. For example: docker-compose.prod.yaml with the same service definitions. When you switch DSO providers (docker dso init --provider aws for prod, --mode local for dev), the same compose file fetches different secrets from different backends.`,
    },
    {
      question: "Can I use DSO with docker-compose services from Docker Hub (official images)?",
      answer: `Yes, completely. DSO works with any Docker image (official or custom). The image doesn't need to know about DSO - DSO injects secrets as normal environment variables from the host. The container receives secrets the same way it would from .env files or environment variable passing.`,
    },
    {
      question: "What if a container crashes and restarts - does it get fresh secrets?",
      answer: `Yes. When a container restarts (due to crash or manual restart), DSO re-injects fresh secrets from the provider. For dynamic secrets (AWS RDS, Vault database credentials), new credentials are generated. This ensures crashed containers don't use stale credentials.`,
    },
    {
      question: "Can I use .env files alongside dso:// references?",
      answer: `Yes. You can mix approaches: some variables from .env files, some from dso://. However, best practice is to use dso:// for all secrets and .env only for non-sensitive configuration. This eliminates the risk of accidentally committing .env files with secrets.`,
    },
    {
      question: "How does docker dso down handle secrets?",
      answer: `docker dso down stops and removes containers, just like docker-compose down. When containers stop, their memory is freed and secrets are completely cleared. There's no persistent secret storage to clean up (that's the point of zero-persistence). Docker volumes are preserved unless you use docker dso down -v.`,
    },
    {
      question: "Can I use DSO for non-database secrets (API keys, tokens, etc.)?",
      answer: `Yes, DSO is generic. It works with any secret: database passwords, API keys, JWT secrets, OAuth tokens, SSH keys, SSL certificates - anything. You define them in your provider and reference them in docker-compose.yaml with dso://.`,
    },
  ],

  relatedPages: [
    { label: "Compare DSO vs Docker Secrets", href: "/comparisons/docker-secrets" },
    { label: "AWS Secrets Manager Integration", href: "/integrations/aws-secrets-manager" },
    { label: "Azure Key Vault Integration", href: "/integrations/azure-key-vault" },
    { label: "Kubernetes Integration", href: "/integrations/kubernetes" },
  ],
};
