/**
 * Azure Key Vault Integration Content
 *
 * Comprehensive guide for integrating DSO with Azure Key Vault.
 * Targets: "Azure Key Vault Docker" (140 mo/searches)
 */

export const azureKeyVaultIntegration = {
  slug: "azure-key-vault",
  title: "Azure Key Vault Secret Injection for Docker",
  description: "Step-by-step guide to integrate Docker Secret Operator with Azure Key Vault. Zero-persistence secret injection for Docker and Kubernetes with Azure cloud backend.",
  keywords: [
    "azure key vault docker",
    "docker secret injection azure",
    "azure key vault integration",
    "dso azure",
    "secret injection azure containers",
  ],
  provider: {
    name: "Azure Key Vault",
    logo: "https://img.icons8.com/?size=100&id=81727&format=png&color=ffffff",
    url: "https://learn.microsoft.com/en-us/azure/key-vault/",
  },

  problemOverview: `
Azure Key Vault is Azure's enterprise secret management service, but connecting it to Docker containers requires careful orchestration of authentication, permissions, and secret injection workflows. Organizations face challenges:

Traditional Azure + Docker Problems:
- Secrets in Docker image environment variables (exposed via docker inspect, image scanning)
- Secrets in source code/config files (git history, accidental commits)
- Complex authentication flows (managed identities, service principals)
- Manual secret refresh requiring container restarts
- No unified secret management across Docker and Kubernetes
- Difficulty implementing zero-persistence architecture

Why This Integration Matters:
DSO integrates natively with Azure Managed Identities, eliminating credential management while providing zero-persistence secret injection. Your containers inherit Azure security posture without managing keys.
  `,

  architecture: {
    overview: `
DSO + Azure Key Vault creates a secure, identity-based secret system:

1. Trust Boundary: Azure Managed Identity grants container permission to Key Vault
2. Secret Lifecycle: Container authenticates via Managed Identity → Fetches secret at runtime → Injection into memory
3. Persistence: Zero - secrets never written to disk, environment, or logs
4. Rotation: Automatic refresh when Key Vault secret is updated
5. Audit Trail: Azure Activity Log tracks all secret access with full context
    `,

    steps: [
      {
        title: "Managed Identity Flow",
        description: "Container uses Azure Managed Identity (user or system-assigned) to authenticate without managing credentials or connection strings.",
      },
      {
        title: "Key Vault Access",
        description: "Managed Identity authenticates to Key Vault, fetches secret policy allows container to access specific secrets.",
      },
      {
        title: "Memory Injection",
        description: "DSO receives secret from Key Vault, injects into tmpfs (in-memory), provides secure access path to container.",
      },
      {
        title: "Lifecycle Management",
        description: "Container lifetime = secret lifetime. Container stops → secrets cleared from memory. No persistent residue.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "Azure subscription with Key Vault resource",
      "Azure Container Instances or App Service or AKS cluster",
      "Docker 20.10+ installed locally (for development)",
      "Azure CLI configured (az login)",
      "DSO v3.2+ installed",
      "Managed Identity enabled on container runtime",
    ],

    steps: [
      {
        number: 1,
        title: "Create Azure Key Vault",
        description: "Create a Key Vault resource in Azure (if not already exists).",
        code: `
# Using Azure CLI
az keyvault create \\
  --resource-group myResourceGroup \\
  --name myKeyVault \\
  --location eastus

# Add a secret
az keyvault secret set \\
  --vault-name myKeyVault \\
  --name "database-password" \\
  --value "my-secure-password"

# Verify secret exists
az keyvault secret show \\
  --vault-name myKeyVault \\
  --name "database-password"
        `,
      },
      {
        number: 2,
        title: "Create Managed Identity",
        description: "Create a user-assigned Managed Identity for your container.",
        code: `
# Create user-assigned managed identity
az identity create \\
  --name myContainerIdentity \\
  --resource-group myResourceGroup

# Get the identity ID (you'll need this)
az identity show \\
  --name myContainerIdentity \\
  --resource-group myResourceGroup \\
  --query id --output tsv
# Output: /subscriptions/.../resourcegroups/.../providers/Microsoft.ManagedIdentity/.../userAssignedIdentities/myContainerIdentity
        `,
      },
      {
        number: 3,
        title: "Grant Key Vault Access",
        description: "Grant the Managed Identity permission to read secrets from Key Vault.",
        code: `
# Get the identity principal ID
IDENTITY_ID=$(az identity show \\
  --name myContainerIdentity \\
  --resource-group myResourceGroup \\
  --query principalId --output tsv)

# Grant secret read permissions
az keyvault set-policy \\
  --name myKeyVault \\
  --object-id $IDENTITY_ID \\
  --secret-permissions get list \\
  --key-permissions decrypt \\
  --certificate-permissions get list

# Verify permissions
az keyvault show-deleted-vault --name myKeyVault
        `,
      },
      {
        number: 4,
        title: "Configure DSO for Azure Cloud Mode",
        description: "Initialize DSO to use Azure Key Vault as the secret provider.",
        code: `
# Initialize DSO Cloud Mode with Azure
docker dso init --mode cloud \\
  --provider azure \\
  --azure-vault-name myKeyVault \\
  --azure-managed-identity myContainerIdentity \\
  --azure-tenant-id <your-tenant-id>

# Get tenant ID if needed:
# az account show --query tenantId --output tsv

# Verify configuration
docker dso system info
# Output should show:
# Mode: Cloud
# Provider: Azure Key Vault
# Vault: myKeyVault
        `,
      },
      {
        number: 5,
        title: "Create Docker Compose with DSO",
        description: "Configure Docker Compose to use DSO for Azure Key Vault secret injection.",
        code: `
version: "3.9"

services:
  app:
    image: myapp:latest
    environment:
      # Reference secrets from Azure Key Vault
      - DATABASE_PASSWORD=dso://database-password
      - API_KEY=dso://api-key
      - CONNECTION_STRING=dso://db-connection-string
    networks:
      - default

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://database-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
        `,
      },
      {
        number: 6,
        title: "Deploy with DSO",
        description: "Use docker dso up to deploy with automatic Azure Key Vault secret injection.",
        code: `
# Deploy with secret injection from Azure Key Vault
docker dso up -d

# DSO handles:
# 1. Azure Managed Identity authentication
# 2. Key Vault secret retrieval
# 3. In-memory injection into containers
# 4. Secure file descriptor setup

# Check deployment status
docker dso inspect app
# Output: Secret injection status: ACTIVE
# Secrets retrieved: 3
        `,
      },
      {
        number: 7,
        title: "Verify Secrets in Container",
        description: "Test that secrets are accessible and not persisted.",
        code: `
# Access container and verify secret is available
docker exec app env | grep DATABASE_PASSWORD
# Shows: DATABASE_PASSWORD=<secret-from-azure>

# Confirm secret NOT in Docker inspect output
docker inspect app | grep DATABASE_PASSWORD
# Should show NOTHING

# Check container logs don't expose secrets
docker logs app | grep DATABASE_PASSWORD
# Should show NOTHING (secrets never logged)

# Verify secret NOT in image
docker history myapp:latest | grep DATABASE_PASSWORD
# Should show NOTHING
        `,
      },
    ],
  },

  securityBenefits: [
    "Zero Persistence: Secrets exist only in RAM, never on disk or in logs",
    "Managed Identity: No credentials to store or rotate; Azure handles it",
    "Azure RBAC: Fine-grained Azure role-based access control per secret",
    "Activity Log Auditing: All secret access visible in Azure Activity Logs with full context",
    "Azure Policy: Enforce secret access policies across all containers",
    "Encryption at Rest: Key Vault secrets encrypted with Azure Storage Service Encryption (SSE)",
    "Encryption in Transit: TLS 1.2+ for all communication with Key Vault",
    "Network Isolation: Optional Azure Private Link for Key Vault access",
    "Compliance: Meets Azure compliance standards (SOC 2, PCI-DSS, HIPAA)",
    "Automatic Credential Refresh: Managed Identity tokens auto-renewed without app involvement",
  ],

  troubleshooting: [
    {
      problem: "Error: 'Managed Identity not available' or 'Authentication failed'",
      solution: `
Managed Identity may not be properly configured on the container runtime.

For Azure Container Instances:
  az container create \\
    --assign-identity /subscriptions/.../myContainerIdentity \\
    ...

For App Service:
  az webapp identity assign \\
    --resource-group myResourceGroup \\
    --name myAppService \\
    --identities /subscriptions/.../myContainerIdentity

For AKS:
  az aks update-credentials \\
    --resource-group myResourceGroup \\
    --name myAKSCluster \\
    --reset-aad \\
    --aad-admin-group-object-ids <object-id>
      `,
    },
    {
      problem: "KeyError: 'Forbidden: User does not have access to the secret'",
      solution: `
Managed Identity doesn't have permissions to access the secret.

Check permissions:
  az keyvault set-policy \\
    --name myKeyVault \\
    --object-id $IDENTITY_ID \\
    --secret-permissions get list

Verify object ID matches:
  # Get identity object ID
  az identity show \\
    --name myContainerIdentity \\
    --query principalId --output tsv

  # Check Key Vault access policies
  az keyvault show-deleted-vault \\
    --name myKeyVault \\
    --query 'properties.accessPolicies'
      `,
    },
    {
      problem: "Timeout connecting to Azure Key Vault",
      solution: `
Network connectivity issue between container and Key Vault.

Check network configuration:
  1. Verify container can reach Key Vault endpoint:
     docker exec app curl https://myKeyVault.vault.azure.net/

  2. If using Private Link, verify private endpoint is configured:
     az keyvault private-endpoint-connection list \\
       --vault-name myKeyVault

  3. Check firewall rules on Key Vault:
     az keyvault network-rule list \\
       --name myKeyVault

  4. For local development, allow your IP:
     az keyvault network-rule add \\
       --name myKeyVault \\
       --ip-address <your-ip>
      `,
    },
    {
      problem: "Secret shows old value after Azure Key Vault update",
      solution: `
DSO caches secrets during container runtime. To refresh:

Option 1: Refresh specific secret
  docker dso secret refresh database-password
  docker dso restart app

Option 2: Force pull latest version
  # In docker-compose.yaml, update the service
  docker dso up -d

Option 3: Delete and redeploy
  docker dso down
  docker dso up -d
      `,
    },
  ],

  faqItems: [
    {
      question: "Does DSO store Azure Key Vault credentials locally?",
      answer: `No. DSO uses Managed Identity authentication, which means Azure provides temporary tokens via the Azure Instance Metadata Service. These tokens are never stored on disk. DSO fetches the token, uses it once to retrieve the secret, then discards it. The secret itself is only held in container memory.`,
    },
    {
      question: "How does Managed Identity authentication work without passwords?",
      answer: `Azure Managed Identity is built into the Azure runtime. When you assign a Managed Identity to a container, Azure automatically provides authentication tokens via a local endpoint (http://169.254.169.254 on AKS). DSO calls this endpoint to get a token, authenticates to Key Vault, and fetches the secret. No credentials are involved.`,
    },
    {
      question: "Can I use DSO with Azure Key Vault on-premises?",
      answer: `No, DSO requires the container to have network access to Azure Key Vault's public endpoint or via Azure Private Link. On-premises deployments would need Azure connectivity or should use Vault as the provider instead.`,
    },
    {
      question: "What happens if the container's Managed Identity is revoked?",
      answer: `If the Managed Identity loses Key Vault access permissions, the next secret fetch will fail. The container continues running but cannot access new secrets. This is safe - it fails fast rather than silently using stale secrets. Re-grant permissions to resume.`,
    },
    {
      question: "Does DSO support Azure Key Vault rotation?",
      answer: `Yes. When you rotate a secret in Azure Key Vault, DSO automatically detects the change and refreshes the in-memory copy. No container restart is needed. The new secret is available immediately on next container access.`,
    },
    {
      question: "Can I audit who accessed which Azure Key Vault secrets from which container?",
      answer: `Yes. Azure Activity Log records every secretsmanager:GetSecretValue call with: timestamp, Managed Identity used, secret ARN, request ID, and result. You can query Azure Activity Log or stream it to Log Analytics for full audit trails.`,
    },
    {
      question: "Is there a cost for using DSO with Azure Key Vault?",
      answer: `DSO itself is free (open source). Azure charges for Key Vault operations: $0.03 per 10,000 secret operations. For typical containers rotating secrets once per day, the monthly cost is negligible. Azure Monitor logs have separate costs if auditing is enabled.`,
    },
    {
      question: "Can multiple containers share the same Azure Key Vault?",
      answer: `Yes. Multiple containers can reference the same secret path. Azure RBAC controls which Managed Identities can access which secrets. Different identities can have different permissions for fine-grained access control.`,
    },
  ],

  relatedPages: [
    { label: "AWS Secrets Manager Integration", href: "/integrations/aws-secrets-manager" },
    { label: "Compare DSO vs Vault", href: "/comparisons/vault" },
    { label: "Kubernetes Secret Injection", href: "/integrations/kubernetes" },
    { label: "Secret Rotation Guide", href: "/docs/cli/secret" },
  ],
};
