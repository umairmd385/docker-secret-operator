/**
 * Huawei Cloud CSMS Integration Content
 *
 * Verified integration guide for Huawei Cloud Secret Management Service.
 * Targets: Teams running on Huawei Cloud (China and international regions)
 * Status: Fully Verified (2026-05-10)
 */

export const huaweiCloudIntegration = {
  slug: "huawei-cloud",
  title: "Huawei Cloud CSMS Integration with Docker Secret Operator",
  description: "Integrate Docker Secret Operator with Huawei Cloud's Cloud Secret Management Service. Production-ready guides for ECS, polling-based rotation, zero-persistence secret injection.",
  keywords: [
    "huawei cloud csms",
    "huawei secrets manager",
    "dso huawei",
    "docker huawei cloud",
    "secret injection huawei",
    "huawei ecs secrets",
  ],
  provider: {
    name: "Huawei Cloud CSMS",
    logo: "https://img.icons8.com/?size=100&id=ewbtYzSRF6tS&format=png&color=ffffff",
    url: "https://www.huaweicloud.com/intl/en-us/product/csms.html",
  },

  problemOverview: `
Huawei Cloud teams need robust secret management for Docker deployments, but integrating with CSMS (Cloud Secret Management Service) requires careful orchestration of authentication, permissions, and secret injection workflows.

Huawei Cloud + Docker Integration Challenges:
- Secrets in environment variables (exposed via docker inspect)
- Manual secret rotation requiring container restarts
- Complex authentication flows (ECS Agency, IAM credentials)
- No unified secret management across development and production
- Difficulty implementing zero-persistence architecture

Why This Integration Matters:
DSO integrates natively with Huawei Cloud's ECS Agency and CSMS, eliminating credential management while providing zero-persistence secret injection. Your containers inherit Huawei Cloud security posture automatically.
  `,

  architecture: {
    overview: `
DSO + Huawei Cloud CSMS creates a secure, identity-based secret system:

1. Trust Boundary: ECS Agency grants container permission to CSMS
2. Secret Lifecycle: Container authenticates via Agency → Fetches secret → Injection into memory
3. Persistence: Zero - secrets never written to disk, environment, or logs
4. Rotation: Polling-based refresh (default 2 minutes, configurable)
5. Audit Trail: All secret access logged in Huawei Cloud CloudTrace
    `,

    steps: [
      {
        title: "ECS Agency Flow",
        description: "Container uses Huawei Cloud ECS Agency (managed identity equivalent) to authenticate without managing credentials.",
      },
      {
        title: "CSMS Access",
        description: "ECS Agency authenticates to CSMS, IAM role grants container access to specific secrets.",
      },
      {
        title: "Memory Injection",
        description: "DSO receives secret from CSMS, injects into container environment variables at startup.",
      },
      {
        title: "Polling Rotation",
        description: "DSO polls CSMS every 2 minutes (configurable), detects changes via hash comparison, applies reload strategy.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "Huawei Cloud account with CSMS enabled",
      "Secret created in Cloud Secret Management Service",
      "Docker 20.10+ installed locally",
      "Docker Compose installed",
      "DSO v3.2+ installed",
      "Huawei Cloud CLI (optional, for automation)",
      "ECS instance with IAM agency (for production) or IAM credentials",
    ],

    steps: [
      {
        number: 1,
        title: "Create Secret in CSMS",
        description: "Create a secret in Huawei Cloud Secret Management Service.",
        code: `
# Using Huawei Cloud Console or CLI
huaweicloud csms create-secret \\
  --name my-app-database-password \\
  --secret-value "your-secure-password" \\
  --region cn-north-4

# List secrets
huaweicloud csms list-secrets --region cn-north-4

# Verify secret created
huaweicloud csms get-secret-value \\
  --name my-app-database-password \\
  --region cn-north-4
        `,
      },
      {
        number: 2,
        title: "Set Up Huawei Cloud Authentication",
        description: "Choose between ECS Agency (recommended) or IAM credentials.",
        code: `
# Option A: ECS Agency (Recommended for Huawei ECS instances)
# Automatically discovered—no configuration needed
# Just ensure ECS instance has CSMS read permissions assigned

# Option B: IAM Credentials
export HUAWEI_ACCESS_KEY_ID="your-access-key-id"
export HUAWEI_SECRET_ACCESS_KEY="your-secret-access-key"

# In Huawei Cloud Console:
# My Credentials → Access Keys → Create Access Key
        `,
      },
      {
        number: 3,
        title: "Install DSO Provider",
        description: "Setup DSO with Huawei Cloud support.",
        code: `
# Install Huawei Cloud provider
docker dso system setup --providers huawei

# Verify installation
docker dso system doctor
# Should show: huawei ... OK
        `,
      },
      {
        number: 4,
        title: "Create dso.yaml",
        description: "Configure DSO to connect to Huawei Cloud CSMS.",
        code: `
# dso.yaml - Huawei Cloud configuration
provider: huawei

config:
  # Your Huawei Cloud region
  region: cn-north-4
  # Options: cn-north-4, cn-east-3, cn-south-1, ap-southeast-1

# Define secrets to inject
secrets:
  - name: my-app-database-password
    inject: env
    rotation: true
    reload_strategy:
      type: restart  # Options: restart, rolling, signal
    mappings:
      password: DB_PASSWORD

# Optional: configure polling
agent:
  watch:
    polling_interval: 2m  # Check CSMS every 2 minutes (default)
        `,
      },
      {
        number: 5,
        title: "Create docker-compose.yaml",
        description: "Define application stack with dso:// references.",
        code: `
version: "3.9"

services:
  app:
    image: myapp:latest
    environment:
      - DB_PASSWORD=dso://my-app-database-password
      - APP_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://my-app-database-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
        `,
      },
      {
        number: 6,
        title: "Deploy with DSO",
        description: "Start containers with secrets from Huawei Cloud CSMS.",
        code: `
# Deploy
docker dso up -d

# Check status
docker dso ps

# View logs
docker dso logs app

# Verify injection
docker exec -it app env | grep DB_PASSWORD
# Output: DB_PASSWORD=your-secure-password
        `,
      },
      {
        number: 7,
        title: "Verify Zero-Persistence",
        description: "Confirm secrets are not persisted.",
        code: `
# Verify secret IS in environment
docker exec -it app env | grep DB_PASSWORD
# Shows: DB_PASSWORD=your-secure-password ✓

# Verify secret is NOT in docker inspect
docker inspect app | grep DB_PASSWORD
# Should show NOTHING ✓

# Verify secret is NOT in logs
docker logs app | grep DB_PASSWORD
# Should show NOTHING ✓
        `,
      },
    ],
  },

  securityBenefits: [
    "Zero Persistence: Secrets exist only in RAM, never on disk or in logs",
    "ECS Agency: No credentials to store; Huawei Cloud manages it automatically",
    "RBAC Support: Fine-grained access control via Huawei Cloud IAM",
    "CloudTrace Auditing: All secret access visible in Huawei Cloud audit logs",
    "Encryption in Transit: TLS 1.2+ for all CSMS communication",
    "Regional Isolation: Secrets remain within your chosen region",
    "Compliance: Meets Huawei Cloud compliance standards",
  ],

  troubleshooting: [
    {
      problem: "Authentication failed or access denied",
      solution: `For ECS Agency:
1. Verify agency assigned to ECS instance
2. Ensure agency has CSMS read permissions

For IAM Credentials:
1. Verify HUAWEI_ACCESS_KEY_ID is set
2. Verify HUAWEI_SECRET_ACCESS_KEY is set
3. Confirm credentials have CSMS permissions
      `,
    },
    {
      problem: "Secret not found (404 error)",
      solution: `1. Verify secret exists in CSMS:
   huaweicloud csms list-secrets --region cn-north-4

2. Check secret name in dso.yaml matches CSMS:
   grep "name:" dso.yaml

3. Verify region in dso.yaml matches secret location
      `,
    },
    {
      problem: "Permission denied",
      solution: `1. Verify IAM role/agency has CSMS read permissions
2. In Huawei Cloud Console, check:
   - ECS instance agency assignment
   - Agency's IAM role policies
   - Permission scope

3. If permissions changed, restart containers:
   docker dso down && docker dso up -d
      `,
    },
    {
      problem: "Old secret in container after rotation",
      solution: `1. Check polling interval:
   grep polling_interval dso.yaml

2. Wait for interval (default 2 minutes)

3. Verify new secret:
   docker exec -it app env | grep DB_PASSWORD

4. Or force update:
   docker dso down && docker dso up -d
      `,
    },
    {
      problem: "Timeout connecting to CSMS",
      solution: `1. Verify network connectivity:
   docker exec -it app ping api.csms.huaweicloud.com

2. Check firewall/security group rules

3. If using VPC, verify:
   - Network connectivity to CSMS endpoint
   - Security group allows HTTPS outbound
   - No network policies blocking CSMS access
      `,
    },
  ],

  faqItems: [
    {
      question: "Does DSO store Huawei Cloud credentials?",
      answer: `No. When using ECS Agency, Huawei Cloud provides temporary tokens via instance metadata. DSO fetches tokens, uses them once, then discards them. Credentials are never stored on disk.`,
    },
    {
      question: "How does ECS Agency authentication work?",
      answer: `ECS Agency is Huawei Cloud's managed identity service. When you assign an agency to an ECS instance, Huawei Cloud automatically provides authentication tokens via a local endpoint. DSO retrieves these tokens to access CSMS.`,
    },
    {
      question: "What are the supported Huawei Cloud regions?",
      answer: `CSMS is available in: cn-north-4 (Beijing), cn-east-3 (Shanghai), cn-south-1 (Guangzhou), and ap-southeast-1 (Singapore). Specify your region in dso.yaml config.`,
    },
    {
      question: "Does DSO support Huawei Cloud CSMS dynamic secrets?",
      answer: `DSO supports retrieving secrets from CSMS. Dynamic secret generation is handled by CSMS itself. DSO will detect and refresh rotated secrets based on polling interval.`,
    },
    {
      question: "How often does DSO check for secret changes?",
      answer: `By default, every 2 minutes (configurable from 30 seconds to 5 minutes). This is polling-based, not event-driven. When a change is detected, the configured reload_strategy is applied.`,
    },
    {
      question: "Can I audit secret access?",
      answer: `Yes. All GetSecret calls are logged in Huawei Cloud CloudTrace with timestamps, identity information, secret name, and results. Query CloudTrace to view audit trails.`,
    },
    {
      question: "What's the cost of using DSO with Huawei Cloud CSMS?",
      answer: `DSO is free. Huawei Cloud charges for CSMS: approximately $0.40 per secret per month + API call costs. Typical deployments cost less than $1 per month.`,
    },
    {
      question: "Can multiple containers share the same secret?",
      answer: `Yes. Multiple containers can reference the same secret. Huawei Cloud IAM controls which agencies can access which secrets. Different identities can have different permissions.`,
    },
  ],

  relatedPages: [
    { label: "AWS Secrets Manager Integration", href: "/integrations/aws-secrets-manager" },
    { label: "Azure Key Vault Integration", href: "/integrations/azure-key-vault" },
    { label: "HashiCorp Vault Integration", href: "/integrations/hashicorp-vault" },
    { label: "Local Mode Integration", href: "/integrations/local-mode" },
    { label: "Getting Started Guide", href: "/docs/guide/getting-started" },
  ],
};
