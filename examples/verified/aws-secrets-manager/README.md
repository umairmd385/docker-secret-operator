# AWS Secrets Manager Example - Production with Polling-Based Rotation

**Verification Status**: ✅ Fully Verified  
**DSO Version**: v3.2+  
**Docker Engine**: v20.10+  
**AWS**: Secrets Manager, EC2/ECS IAM Roles  
**Setup Time**: 10-15 minutes  
**Complexity**: Intermediate  
**Last Verified**: 2026-05-10  

---

## What This Example Demonstrates

This example shows how to:
- ✅ Set up AWS Secrets Manager with a test secret
- ✅ Configure IAM role with minimal permissions (GetSecretValue only)
- ✅ Use DSO with polling-based rotation (default: 2 minutes)
- ✅ Choose rotation strategy: restart, rolling, or SIGHUP signal
- ✅ Verify secrets are injected and zero-persisted
- ✅ Update secrets in AWS and trigger container refresh

**Perfect for**: Production deployments on AWS, EC2 to ECS migrations, enterprise secret management.

---

## Prerequisites

- Docker 20.10+ (`docker --version`)
- Docker Compose (`docker-compose --version`)
- DSO v3.2+ installed (`docker dso version`)
- AWS Account with Secrets Manager enabled
- AWS CLI v2 (`aws --version`) - for setup script
- AWS credentials configured (`aws configure`)

**IAM Permissions Needed**:
- `secretsmanager:CreateSecret`
- `secretsmanager:GetSecretValue`
- `iam:CreateRole`
- `iam:PutRolePolicy`

---

## Step 1: Set Up AWS Resources

The `setup-guide.sh` script automates this, but here's what happens:

### Create IAM Role
```bash
# Create role with trust relationship to current AWS account
aws iam create-role \
  --role-name dso-container-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[...]}'
```

### Create IAM Policy (Minimal Permissions)
```bash
# Policy granting ONLY GetSecretValue permission
aws iam put-role-policy \
  --role-name dso-container-role \
  --policy-name dso-secrets-access \
  --policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Action":["secretsmanager:GetSecretValue"],
      "Resource":"arn:aws:secretsmanager:*:*:secret:prod/*"
    }]
  }'
```

### Create Secret in AWS Secrets Manager
```bash
aws secretsmanager create-secret \
  --name prod/database-password \
  --secret-string "your-secure-password" \
  --region us-east-1
```

---

## Step 2: Configure DSO

Create `dso.yaml` with AWS provider configuration.

```yaml
provider: aws

config:
  # AWS region where secret is stored
  region: us-east-1

# Define which secrets to inject
secrets:
  - name: prod/database-password
    inject: env
    rotation: true
    
    # Choose one rotation strategy:
    reload_strategy:
      type: restart
      # OR: type: rolling (zero-downtime, requires healthcheck)
      # OR: type: signal with signal: SIGHUP (requires app support)
    
    # Map the secret value to env variable
    mappings:
      password: DB_PASSWORD

# Optional: configure polling
agent:
  watch:
    polling_interval: 2m  # Default: check AWS every 2 minutes
```

---

## Step 3: Deploy Stack

Use the provided `setup-guide.sh` to automate AWS setup:

```bash
# Run automated setup
bash setup-guide.sh

# This will:
# 1. Create IAM role
# 2. Create secret in AWS Secrets Manager
# 3. Install DSO AWS provider
# 4. Deploy stack with Docker Compose

# Then deploy with DSO
docker dso up -d

# Verify
docker dso ps
docker logs app
```

---

## Step 4: Verify Secrets Are Injected

```bash
# Verify secret in container environment
docker exec -it app env | grep DB_PASSWORD
# Output: DB_PASSWORD=your-secure-password

# Verify NOT in docker inspect
docker inspect app | grep DB_PASSWORD
# Output: (nothing)

# Verify NOT in logs
docker logs app | grep DB_PASSWORD
# Output: (nothing)
```

---

## Step 5: Test Rotation

Update secret in AWS and trigger container refresh.

```bash
# 1. Update secret in AWS
aws secretsmanager update-secret \
  --secret-id prod/database-password \
  --secret-string "new-secure-password" \
  --region us-east-1

# 2. Wait for polling to detect (default: up to 2 minutes)
# DSO checks AWS Secrets Manager every 2 minutes

# 3. After detection, reload_strategy is applied:
#    - restart: Container stops/restarts (5-10s downtime)
#    - rolling: New container started, old removed (zero downtime)
#    - signal: SIGHUP sent to container (instant, requires app support)

# 4. Verify new secret in container
docker exec -it app env | grep DB_PASSWORD
# Output: DB_PASSWORD=new-secure-password
```

---

## Rotation Strategies Explained

### restart (Default - Simplest)
```yaml
reload_strategy:
  type: restart
```
- DSO detects secret change in AWS
- Container is stopped and restarted
- New container starts with new secret
- **Downtime**: 5-10 seconds
- **Good for**: Applications that can tolerate brief restarts

### rolling (Zero-Downtime)
```yaml
reload_strategy:
  type: rolling
  healthcheck_timeout: 30s
```
- DSO starts new container with new secret
- Old container continues serving requests
- After healthcheck passes, old container is removed
- **Downtime**: Zero (seamless for users)
- **Requirement**: Must define healthcheck in docker-compose.yaml
- **Good for**: High-availability production applications

### signal (Instant - Application-Dependent)
```yaml
reload_strategy:
  type: signal
  signal: SIGHUP
```
- SIGHUP signal sent to container PID 1
- Application must handle signal and reload secrets
- **Downtime**: None (instant if app supports)
- **Requirement**: Application must handle SIGHUP gracefully
- **Good for**: Applications like nginx, Varnish, or custom apps with signal handlers

---

## Polling Mechanism (What Actually Happens)

### Timeline for AWS Secret Rotation
1. **T+0m**: You update secret in AWS Secrets Manager
2. **T+0-2m**: DSO polling interval (configurable, default 2m)
3. **T+2m**: DSO polls AWS, detects change via hash comparison
4. **T+2m**: reload_strategy is applied (restart/rolling/signal)
5. **T+2-3m**: Container has new secret

**Key Points**:
- NOT event-driven (no SNS/SQS)
- NOT real-time (up to 2-minute detection delay)
- Polling is configurable (30s to 5m range)
- Detection is via hash comparison, not webhooks

---

## Files in This Example

```
aws-secrets-manager/
├── README.md                    # This file
├── dso.yaml                     # DSO configuration with AWS settings
├── docker-compose.yaml          # Application stack
└── setup-guide.sh              # Automated AWS setup script
```

---

## Troubleshooting

### Problem: "Access Denied" or permission error

```bash
# Verify IAM role has GetSecretValue permission
aws iam get-role-policy \
  --role-name dso-container-role \
  --policy-name dso-secrets-access

# Policy should grant:
# "secretsmanager:GetSecretValue" on your secret ARN
```

### Problem: "Secret not found"

```bash
# List secrets in AWS
aws secretsmanager list-secrets --region us-east-1

# Verify secret name matches dso.yaml
grep "name:" dso.yaml

# Secret name must match exactly
```

### Problem: Old secret still in container after rotation

```bash
# Check polling interval
grep polling_interval dso.yaml

# Wait for interval (default 2 minutes) then check
docker exec -it app env | grep DB_PASSWORD

# Or force update with redeploy
docker dso down && docker dso up -d
```

---

## Security Notes

✅ **Zero-Persistence**: Secrets not on disk (checked via docker inspect, logs, history)  
✅ **IAM-Based**: Uses AWS IAM for authentication (no API keys in dso.yaml)  
✅ **Audit Logging**: All secret access logged in CloudTrail  
✅ **Encrypted in Transit**: TLS 1.2+ to AWS Secrets Manager  

⚠️ **Polling Delay**: Up to 2-minute detection delay (not real-time)  
⚠️ **Restart Downtime**: If using restart strategy, container restarts (~10s)  

---

## Cost Considerations

- **AWS Secrets Manager**: $0.40/secret/month + $0.06/10k API calls
- **DSO Polling**: Default 2 minutes = ~21,600 requests/month
- **Monthly Cost**: ~$0.40 + $0.13 = ~$0.53 per secret

Negligible for most applications.

---

## Next Steps

1. ✅ You've learned AWS Secrets Manager integration
2. 🔄 Need zero-downtime rotation? Use rolling strategy
3. 🔐 Need real-time updates? Consider HashiCorp Vault
4. 🌍 Multi-cloud? Check Multi-Provider example

---

## Complete Working Example

Copy and paste for quick start:

```bash
# Set up AWS resources
bash setup-guide.sh

# Deploy stack
docker dso up -d

# Verify injection
docker logs app

# Verify zero-persistence
docker inspect app | grep DB_PASSWORD

# Update secret in AWS
aws secretsmanager update-secret \
  --secret-id prod/database-password \
  --secret-string "newvalue" \
  --region us-east-1

# Wait 2 minutes, then check
sleep 120
docker exec -it app env | grep DB_PASSWORD

# Cleanup
bash setup-guide.sh --cleanup
docker dso down
```

---

**Status**: ✅ Verified and working  
**Last Updated**: 2026-05-10  
**Related**: [Local Mode](../local-mode/), [Azure Key Vault](../azure-key-vault/), [HashiCorp Vault](../hashicorp-vault/)
