/**
 * HashiCorp Vault Integration Content
 *
 * Comprehensive guide for integrating DSO with HashiCorp Vault.
 * Targets: "Vault Docker integration" (160 mo/searches)
 */

export const hashicorpVaultIntegration = {
  slug: "hashicorp-vault",
  title: "HashiCorp Vault Docker Integration with Docker Secret Operator",
  description: "Deploy Docker Secret Operator with HashiCorp Vault as the backend. Zero-persistence secret injection using Vault's dynamic secrets and authentication methods.",
  keywords: [
    "vault docker integration",
    "docker secret injection vault",
    "hashicorp vault docker",
    "dso vault",
    "vault dynamic secrets docker",
  ],
  provider: {
    name: "HashiCorp Vault",
    logo: "https://cdn.simpleicons.org/vault/ffffff",
    url: "https://www.vaultproject.io",
  },

  problemOverview: `
HashiCorp Vault is a mature secret management platform, but integrating it with Docker containers requires bridging authentication, dynamic secret workflows, and secret injection orchestration. Organizations face challenges:

Vault + Docker Integration Problems:
- Vault agents require container memory/CPU overhead
- Complex authentication workflows (AppRole, JWT, certificates)
- Secrets persisted in application memory (vulnerability surface)
- Dynamic secrets rotation requires application awareness
- Difficult to implement zero-persistence architecture
- Vault learning curve for container teams

Why DSO + Vault Integration Matters:
DSO acts as a lightweight bridge between Vault and containers, using Vault's dynamic secrets infrastructure while providing zero-persistence injection. Leverage Vault's power without operational complexity.
  `,

  architecture: {
    overview: `
DSO + HashiCorp Vault enables automated secret rotation with Vault's robust backend:

1. Authentication: DSO authenticates to Vault using AppRole, JWT, or TLS certificates
2. Secret Retrieval: Fetches static OR dynamic secrets from Vault at runtime
3. Injection: Injects secrets directly into container memory without persistence
4. Rotation: Automatic refresh when Vault rotates dynamic secrets or on-demand
5. Audit Trail: Vault audit logs show every secret request with context
    `,

    steps: [
      {
        title: "Vault Authentication",
        description: "DSO authenticates to Vault using AppRole (application-friendly) or JWT. No container credentials needed.",
      },
      {
        title: "Dynamic vs Static Secrets",
        description: "DSO supports both. Dynamic secrets are short-lived (generated on-demand); static secrets are user-managed.",
      },
      {
        title: "Runtime Injection",
        description: "When container starts, DSO fetches secrets from Vault and injects via tmpfs. Container never sees Vault directly.",
      },
      {
        title: "Rotation Workflow",
        description: "When Vault rotates dynamic secrets, DSO automatically refreshes in-memory copy without container restart.",
      },
    ],
  },

  setupGuide: {
    prerequisites: [
      "HashiCorp Vault server running (v1.12+)",
      "Vault unsealed and accessible to Docker",
      "Vault authentication method enabled (AppRole recommended for containers)",
      "Docker 20.10+ installed",
      "DSO v3.2+ installed",
      "Vault CLI or UI access for setup",
    ],

    steps: [
      {
        number: 1,
        title: "Enable AppRole Authentication in Vault",
        description: "Configure Vault AppRole for DSO container authentication.",
        code: `
# Enable AppRole auth method
vault auth enable approle

# Create AppRole for DSO
vault write auth/approle/role/dso-role \\
  token_ttl=1h \\
  token_max_ttl=4h \\
  secret_id_ttl=30m \\
  policies="dso-policy"

# Get Role ID
vault read auth/approle/role/dso-role/role-id
# Output: role_id = a1b2c3d4-...

# Generate Secret ID (one-time use)
vault write -f auth/approle/role/dso-role/secret-id
# Output: secret_id = e5f6g7h8-...
        `,
      },
      {
        number: 2,
        title: "Create Vault Policy for DSO",
        description: "Grant DSO permissions to read secrets from Vault.",
        code: `
# Create policy file: dso-policy.hcl
path "secret/data/app/*" {
  capabilities = ["read", "list"]
}

path "database/creds/*" {
  capabilities = ["read"]
}

path "auth/token/renew-self" {
  capabilities = ["update"]
}

# Write policy to Vault
vault policy write dso-policy @dso-policy.hcl
        `,
      },
      {
        number: 3,
        title: "Create Vault Secrets",
        description: "Store your secrets in Vault (KV v2 engine).",
        code: `
# Create static secret
vault kv put secret/app/database-password \\
  password="my-secure-password"

# Create dynamic secret (requires database config)
# For this example, assuming PostgreSQL dynamic secrets configured

# Create database role
vault write database/roles/app \\
  db_name=postgres \\
  creation_statements="CREATE USER \\\"{{name}}\\\" WITH PASSWORD '{{password}}';" \\
  default_ttl="1h" \\
  max_ttl="24h"

# Verify secrets exist
vault kv get secret/app/database-password
vault read database/creds/app
        `,
      },
      {
        number: 4,
        title: "Configure DSO for Vault Cloud Mode",
        description: "Initialize DSO to use HashiCorp Vault as the provider.",
        code: `
# Initialize DSO Cloud Mode with Vault
docker dso init --mode cloud \\
  --provider vault \\
  --vault-address https://vault.example.com:8200 \\
  --vault-auth-method approle \\
  --vault-role-id a1b2c3d4-... \\
  --vault-secret-id e5f6g7h8-...

# Verify configuration
docker dso system info
# Output:
# Mode: Cloud
# Provider: HashiCorp Vault
# Vault Address: https://vault.example.com:8200
# Auth Method: AppRole
        `,
      },
      {
        number: 5,
        title: "Create Docker Compose with DSO",
        description: "Configure Docker Compose to use DSO for Vault secret injection.",
        code: `
version: "3.9"

services:
  app:
    image: myapp:latest
    environment:
      # Static secrets from Vault
      - DB_PASSWORD=dso://secret/data/app/database-password#password
      - API_KEY=dso://secret/data/app/api-key#key
      # Dynamic secrets from Vault
      - DB_USER=dso://database/creds/app#username
      - DB_PASS=dso://database/creds/app#password
    networks:
      - default
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dso://secret/data/app/database-password#password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
        `,
      },
      {
        number: 6,
        title: "Deploy with DSO",
        description: "Use docker dso up to deploy with Vault secret injection.",
        code: `
# Deploy with secret injection from Vault
docker dso up -d

# Behind the scenes, DSO:
# 1. Authenticates to Vault using AppRole
# 2. Fetches static secrets from KV engine
# 3. Fetches/generates dynamic secrets from database engine
# 4. Injects all secrets into containers
# 5. Manages token renewal and secret rotation

# Check deployment
docker dso inspect app
# Output: Secret injection status: ACTIVE
        `,
      },
      {
        number: 7,
        title: "Test Vault Integration",
        description: "Verify secrets from Vault are injected and accessible.",
        code: `
# Check application can access injected secrets
docker exec app env | grep DB_PASSWORD
# Shows: DB_PASSWORD=<secret-from-vault>

# Verify connection to database (using dynamic secret)
docker exec app psql -h postgres -U {{DB_USER}} -c "SELECT version();"
# Should connect successfully with dynamic credentials

# Check Vault audit logs
vault audit list
vault read sys/audit/file-1

# See request logs in Vault
# Should show:
# - auth/approle/login (DSO authentication)
# - secret/data/app/* (secret read)
# - database/creds/* (dynamic secret generation)
        `,
      },
    ],
  },

  securityBenefits: [
    "Zero Persistence: Secrets never written to disk, environment, or logs",
    "Dynamic Secrets: Vault auto-generates short-lived credentials on-demand",
    "AppRole Auth: Application-friendly authentication without human credentials",
    "Token Renewal: DSO automatically renews Vault tokens before expiration",
    "Audit Logging: Vault audit backend records every secret access with full context",
    "Encryption: Vault encrypts secrets at rest and in transit (TLS)",
    "Automatic Rotation: Dynamic secrets automatically rotated; DSO refreshes in-memory copies",
    "Secret Versioning: Vault maintains secret history; easy rollback if needed",
    "Lease Management: Vault manages secret TTLs and revocation automatically",
    "Multi-Secret Support: Single Vault instance serves secrets to many containers",
  ],

  troubleshooting: [
    {
      problem: "AppRole authentication fails with 'invalid role ID or secret ID'",
      solution: `
Role ID or Secret ID may be incorrect or expired.

Verify Role ID:
  vault read auth/approle/role/dso-role/role-id

Generate new Secret ID (old ones are one-time use):
  vault write -f auth/approle/role/dso-role/secret-id

Update DSO configuration:
  docker dso init --mode cloud \\
    --provider vault \\
    --vault-role-id <correct-role-id> \\
    --vault-secret-id <new-secret-id>

Test authentication:
  docker exec dso-container dso system test-vault
      `,
    },
    {
      problem: "Permission denied: 'policy does not allow this action'",
      solution: `
Vault policy may not grant required permissions.

Check policy:
  vault policy read dso-policy

Policy must include:
  path "secret/data/app/*" {
    capabilities = ["read", "list"]
  }

  path "database/creds/*" {
    capabilities = ["read"]
  }

Update policy if needed:
  vault policy write dso-policy @dso-policy.hcl

Verify policy is attached to role:
  vault read auth/approle/role/dso-role
      `,
    },
    {
      problem: "Dynamic secret generation fails: 'database connection failed'",
      solution: `
Vault's database backend may not be configured correctly.

Verify database backend is enabled:
  vault secrets list
  # Should show: database/

Configure database connection:
  vault write database/config/postgres \\
    plugin_name=postgresql-database-plugin \\
    allowed_roles="app" \\
    connection_url="postgresql://{{username}}:{{password}}@postgres:5432/postgres" \\
    username="vault-admin" \\
    password="vault-admin-password"

Test connection:
  vault read database/config/postgres

Verify role exists:
  vault read database/roles/app
      `,
    },
    {
      problem: "Vault token renewal fails: 'orphan token or TTL exceeded'",
      solution: `
Token lifecycle may be misconfigured.

Check AppRole token settings:
  vault read auth/approle/role/dso-role

Should have reasonable TTLs:
  token_ttl=1h (or longer)
  token_max_ttl=4h (or longer)

Update if needed:
  vault write auth/approle/role/dso-role \\
    token_ttl=2h \\
    token_max_ttl=8h

DSO automatically renews tokens. If renewal fails, check:
  docker logs dso-container | grep 'token renewal'
      `,
    },
  ],

  faqItems: [
    {
      question: "How does DSO authenticate to Vault without storing credentials?",
      answer: `DSO uses AppRole authentication, which is designed for applications. Instead of username/password, AppRole uses a Role ID (non-secret identifier) and Secret ID (revocable credential). The Secret ID is a one-time use token that must be securely provisioned during deployment. After authentication, Vault issues a token that DSO uses for subsequent requests.`,
    },
    {
      question: "Can DSO use Vault's dynamic secrets?",
      answer: `Yes, absolutely. DSO supports any Vault secret engine (KV, Database, SSH, PKI, etc.). For dynamic secrets like database credentials, DSO calls Vault to generate them at container start time, then injects the credentials. When the credentials expire, Vault automatically revokes them, and DSO fetches new ones if the container is still running.`,
    },
    {
      question: "What happens if Vault becomes unreachable?",
      answer: `If Vault is unreachable during container startup, DSO will fail to fetch secrets and the container will not start. This is intentional - it's safer to fail fast than to start with missing or stale credentials. For high availability, configure Vault in an HA setup with multiple nodes, and DSO will retry across nodes.`,
    },
    {
      question: "Does DSO support Vault HA clusters?",
      answer: `Yes. You can configure multiple Vault addresses, and DSO will failover between them if the primary is unreachable. DSO also respects Vault's redirect responses, so it works with HA clusters using proxies or load balancers.`,
    },
    {
      question: "Can I use TLS certificates for DSO-to-Vault authentication?",
      answer: `Yes. DSO supports multiple Vault auth methods: AppRole (recommended for containers), TLS certificates (mutual TLS), JWT (Kubernetes-friendly), and others. Choose based on your infrastructure and security posture.`,
    },
    {
      question: "How does Vault audit logging work with DSO?",
      answer: `Vault records every API call in its audit log, including: timestamp, client identity (AppRole), action (read secret), path, and result. DSO's requests show up as your AppRole identity. You can filter audit logs by AppRole to see exactly what secrets each container accessed.`,
    },
    {
      question: "Is there overhead from fetching secrets from Vault at runtime?",
      answer: `Minimal. Initial fetch happens once at container start (<100ms typically). If using dynamic secrets, rotation happens periodically (or on-demand). Network latency is the primary factor. For sensitive workloads, Vault can be co-located with containers (same rack/zone) to minimize latency.`,
    },
    {
      question: "Can DSO cache secrets to handle Vault temporary unavailability?",
      answer: `Currently, DSO fetches secrets fresh at container startup. If you need resilience to Vault downtime, consider: 1) Running Vault in HA mode with multiple nodes, 2) Using Vault's local secret store for fallback, 3) Implementing container restarts that sync with Vault recovery.`,
    },
  ],

  relatedPages: [
    { label: "DSO vs Vault Comparison", href: "/comparisons/vault" },
    { label: "AWS Secrets Manager Integration", href: "/integrations/aws-secrets-manager" },
    { label: "Kubernetes Secret Injection", href: "/integrations/kubernetes" },
    { label: "Docker Compose Integration", href: "/integrations/docker-compose" },
  ],
};
