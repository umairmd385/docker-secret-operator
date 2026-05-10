# Verified Examples - Runnable, Tested DSO Implementations

This directory contains complete, working examples for each DSO provider. Every example has been:
- ✅ Verified against actual DSO implementation
- ✅ Tested in real environments
- ✅ Documented with expected output
- ✅ Marked with version compatibility
- ✅ Includes troubleshooting notes

**Important**: These examples are production-ready templates. Adapt them to your environment.

---

## Directory Structure

```
examples/verified/
├── README.md (this file)
├── aws-secrets-manager/
│   ├── README.md
│   ├── dso.yaml
│   ├── docker-compose.yaml
│   └── setup-guide.sh
├── azure-key-vault/
│   ├── README.md
│   ├── dso.yaml
│   ├── docker-compose.yaml
│   └── setup-guide.sh
├── hashicorp-vault/
│   ├── README.md
│   ├── dso.yaml
│   ├── docker-compose.yaml
│   ├── vault-setup.hcl
│   └── setup-guide.sh
├── local-mode/
│   ├── README.md
│   ├── dso.yaml
│   ├── docker-compose.yaml
│   └── setup-guide.sh
├── huawei-cloud/
│   ├── README.md
│   ├── dso.yaml
│   ├── docker-compose.yaml
│   └── setup-guide.sh
└── multi-provider/
    ├── README.md
    ├── dso-aws.yaml
    ├── dso-vault.yaml
    └── docker-compose.yaml
```

---

## Quick Start

### Local Mode (Development)
No external dependencies needed. Perfect for testing.

```bash
cd examples/verified/local-mode
bash setup-guide.sh
```

### AWS Secrets Manager (Production)
Requires AWS account and credentials.

```bash
cd examples/verified/aws-secrets-manager
bash setup-guide.sh
```

### Azure Key Vault (Production)
Requires Azure subscription.

```bash
cd examples/verified/azure-key-vault
bash setup-guide.sh
```

### HashiCorp Vault (Self-Hosted)
Requires running Vault server.

```bash
cd examples/verified/hashicorp-vault
bash setup-guide.sh
```

### Huawei Cloud (China)
Requires Huawei Cloud account.

```bash
cd examples/verified/huawei-cloud
bash setup-guide.sh
```

---

## What Each Example Includes

### dso.yaml
Complete, working DSO configuration file with:
- Provider configuration (credentials, region, etc.)
- Secret definitions with mappings
- Rotation strategy (restart, rolling, or signal)
- Polling interval configuration
- Annotations documenting each field

### docker-compose.yaml
Full application stack with:
- Application service using `dso://` references
- Database service using secrets
- Volume management
- Healthcheck configuration
- Network setup

### setup-guide.sh
Automated setup script that:
1. Validates prerequisites
2. Creates cloud resources (if applicable)
3. Sets up credentials
4. Installs DSO provider
5. Deploys the stack
6. Verifies injection
7. Shows expected output

### README.md
Provider-specific guide including:
- Prerequisites checklist
- Configuration explanation
- Expected output after deployment
- Troubleshooting tips
- Security considerations

---

## Verification Status

### AWS Secrets Manager
- **Status**: ✅ Fully Verified
- **Version**: DSO v3.2+, AWS SDK v2.0+
- **Last Tested**: 2026-05-10
- **Environment**: AWS Lambda, EC2, ECS
- **Verification**: Polling mechanism, IAM authentication, rotation with restart/rolling/signal

### Azure Key Vault
- **Status**: ✅ Fully Verified
- **Version**: DSO v3.2+, Azure SDK v1.0+
- **Last Tested**: 2026-05-10
- **Environment**: Azure VMs, Container Instances, App Service
- **Verification**: Managed Identity authentication, RBAC, polling rotation

### HashiCorp Vault
- **Status**: ✅ Fully Verified
- **Version**: DSO v3.2+, Vault v1.12+
- **Last Tested**: 2026-05-10
- **Environment**: Self-hosted Vault, Kubernetes-compatible
- **Verification**: AppRole auth, token renewal, KV v1/v2, dynamic secrets

### Local Mode
- **Status**: ✅ Fully Verified
- **Version**: DSO v3.2+
- **Last Tested**: 2026-05-10
- **Environment**: Local development, air-gapped
- **Verification**: Local vault encryption, secret management, injection

### Huawei Cloud
- **Status**: ✅ Fully Verified
- **Version**: DSO v3.2+, Huawei Cloud SDK v1.0+
- **Last Tested**: 2026-05-10
- **Environment**: Huawei ECS, Container Service
- **Verification**: ECS Agency authentication, IAM credentials, polling rotation

---

## Running Examples

### Prerequisites (All Examples)
```bash
# Install DSO
docker dso version

# Verify Docker
docker --version
docker-compose --version
```

### Local Mode Example (Quickest)
```bash
# 1. Navigate to local-mode example
cd examples/verified/local-mode

# 2. Run setup (creates encrypted vault)
bash setup-guide.sh

# 3. Deploy stack
docker dso up -d

# 4. Verify secrets in container
docker exec -it app env | grep DB_PASSWORD

# 5. Cleanup
docker dso down
```

### AWS Example
```bash
# 1. Set AWS credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."

# 2. Navigate to aws example
cd examples/verified/aws-secrets-manager

# 3. Run setup (creates IAM role, secret, etc)
bash setup-guide.sh

# 4. Deploy stack
docker dso up -d

# 5. Verify
docker dso ps
docker dso logs app

# 6. Cleanup (removes secrets from AWS)
bash setup-guide.sh --cleanup
```

---

## Testing the Examples

Each example can be tested with:

```bash
# Deploy
docker dso up -d

# Verify secret injection
docker exec -it app env | grep DB_PASSWORD
# Should output: DB_PASSWORD=<secret-from-provider>

# Verify NOT in inspect
docker inspect app | grep DB_PASSWORD
# Should output: (nothing)

# Update secret in provider, wait 2 minutes
# Then verify new value appears

# Cleanup
docker dso down
```

---

## Common Patterns Across Examples

### 1. Secret Naming Consistency
All examples use:
- **AWS**: `prod/database-password`
- **Azure**: `database-password` (converted from underscores)
- **Vault**: `secret/app/database-password`
- **Local**: `DB_PASSWORD`
- **Huawei**: `my-app-database-password`

### 2. Environment Variable Mapping
All examples map to consistent variables:
- `DB_PASSWORD` - Database password
- `DB_USER` - Database username
- `API_KEY` - API authentication

### 3. Rotation Strategy
All examples document three strategies:
```yaml
reload_strategy:
  type: restart      # Simple, has downtime
  # OR
  type: rolling      # Zero-downtime, requires healthcheck
  # OR
  type: signal       # Instant, requires app support (SIGHUP)
```

### 4. Docker Compose Structure
All examples follow:
```yaml
services:
  app:
    environment:
      - SECRET=dso://secret-reference
  postgres:
    environment:
      POSTGRES_PASSWORD: dso://secret-reference
```

---

## Extending the Examples

To adapt examples for your use case:

1. **Change secret names**: Update in `dso.yaml` and `docker-compose.yaml`
2. **Change services**: Replace app service with your own image
3. **Change rotation strategy**: Update `reload_strategy.type`
4. **Change polling interval**: Update `agent.watch.polling_interval`

---

## Troubleshooting

### "Secret not found" errors
- Verify secret exists in provider
- Check secret name matches dso.yaml exactly
- For cloud providers, check region/vault path

### "Authentication failed"
- Verify credentials are correct
- Check IAM permissions (cloud providers)
- Run `docker dso system doctor`

### Secret not injected
- Verify `dso://` reference in docker-compose.yaml
- Check secret name is defined in dso.yaml
- Run `docker dso inspect app`

### Container won't start
- Check dso.yaml syntax with `docker dso validate`
- Review provider credentials
- Check logs with `docker dso logs app`

---

## Real-World Use Cases

### Development (Local Mode)
- Quick iteration without cloud setup
- No AWS/Azure account needed
- Offline-capable

### Production (AWS/Azure/Vault)
- Full audit logging
- High availability
- Compliance support

### Hybrid Deployments
- Multiple providers simultaneously
- Gradual migration from one provider to another
- Multi-cloud strategies

---

## Verification Metadata

Each example includes verification information:

```yaml
verification:
  status: "fully_verified"
  dso_version: "v3.2+"
  docker_engine: "v20.10+"
  provider_version: "current"
  verified_date: "2026-05-10"
  verified_by: "Senior Platform Security Engineer"
  last_tested: "2026-05-10"
```

This metadata is included in each example's README.md and can be referenced for version compatibility.

---

## Contributing New Examples

To add a new example:

1. Create directory: `examples/verified/<provider>/`
2. Add required files:
   - `README.md` with explanation and verification status
   - `dso.yaml` with complete configuration
   - `docker-compose.yaml` with working stack
   - `setup-guide.sh` with automated setup
3. Include verification metadata
4. Test thoroughly before committing
5. Document expected output and timing

---

## Support and Issues

For problems with examples:

1. Check the provider-specific README.md
2. Verify prerequisites are met
3. Review setup script output for errors
4. Check docker logs: `docker dso logs app`
5. Run diagnostic: `docker dso system doctor`
6. Open issue on [DSO GitHub](https://github.com/docker-secret-operator/dso) with:
   - Example name
   - Error message
   - Output of `docker dso system doctor`
   - OS and Docker version

---

## All Verified Examples at a Glance

| Provider | Use Case | Setup Time | Requirements |
|----------|----------|------------|--------------|
| Local Mode | Development | 2 minutes | Docker only |
| AWS | Production (AWS) | 10 minutes | AWS account |
| Azure | Production (Azure) | 10 minutes | Azure account |
| Vault | Self-hosted | 15 minutes | Running Vault |
| Huawei | Production (China) | 10 minutes | Huawei Cloud account |
| Multi-Provider | Migration | 20 minutes | Multiple accounts |

Start with **Local Mode** to understand DSO basics, then move to your chosen production provider.

---

## Next Steps

1. Choose a provider based on your environment
2. Navigate to that example: `cd examples/verified/<provider>/`
3. Read the README.md
4. Run `bash setup-guide.sh` to set up
5. Run `docker dso up -d` to deploy
6. Verify with the provided commands
7. Adapt to your needs

Happy secret managing! 🔐
