# Tutorial 1: PostgreSQL Secret Rotation with Zero Downtime

**Audience**: DevOps engineers and platform teams running PostgreSQL in Docker Compose  
**Time**: 15 minutes  
**Prerequisites**: Docker, Docker Compose, DSO installed  
**Goal**: Rotate PostgreSQL credentials without service interruption

---

## The Problem

You're running PostgreSQL in Docker Compose:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: hardcoded-password-123
      POSTGRES_USER: appuser
```

**What happens when credentials need to rotate?**

1. Update the hardcoded password in `docker-compose.yml`
2. Run `docker compose down`
3. Application loses database connection during restart
4. Dependent services time out and fail
5. **Your SLO just broke**

**What DSO does instead:**

1. New password stored in secret provider (AWS, Vault, etc.)
2. DSO detects the change
3. New PostgreSQL container starts with updated credentials
4. Health check verifies connectivity
5. Traffic switches to new container
6. Old container stops
7. **Zero downtime, automated**

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│ Secret Provider (AWS / Vault / Azure)           │
│ Stores: POSTGRES_PASSWORD                       │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
         ┌───────────────────────┐
         │    DSO Agent          │
         │ • Watches provider    │
         │ • Detects changes     │
         │ • Manages rotation    │
         └───────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
   ┌────────────┐          ┌────────────┐
   │  Old Postgres          │ New Postgres
   │  (running)            │ (health check)
   └────────────┘          └────────────┘
        ↓ (old stops)        ↓ (new becomes primary)
        
   Result: Zero downtime, seamless swap
```

---

## Files

### 1. docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: app-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      # Password injected by DSO
      POSTGRES_PASSWORD: dso://prod/postgres_password
      POSTGRES_INITDB_ARGS: "-c shared_preload_libraries=pg_stat_statements"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - postgres-init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb -h 127.0.0.1"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - app-network

  app:
    image: my-app:latest
    container_name: app-service
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://appuser:dso://prod/postgres_password@postgres:5432/appdb
    networks:
      - app-network

volumes:
  postgres-data:
  postgres-init:

networks:
  app-network:
    driver: bridge
```

**Key points:**
- Health check validates PostgreSQL is accepting connections
- `dso://` URI tells DSO to inject the secret
- Service depends on health check being ready
- Application connects via injected credentials

### 2. dso.yaml (AWS Secrets Manager)

```yaml
version: v1.0.0
mode: agent

providers:
  aws-prod:
    type: aws
    region: us-east-1
    auth:
      method: iam_role          # EC2/ECS IAM role (recommended)

defaults:
  inject:
    type: env                   # Inject as environment variable
  rotation:
    enabled: true
    strategy: rolling           # Zero-downtime blue-green swap
    timeout: 60s                # Allow 60s for health check

secrets:
  - name: prod/postgres_password
    provider: aws-prod
    targets:
      containers:
        - app-postgres          # Must match container_name in docker-compose.yml
    mappings:
      POSTGRES_PASSWORD: postgres_password_field
    inject:
      type: env
    health_check:
      enabled: true
      timeout: 30s
```

**For HashiCorp Vault:**

```yaml
version: v1.0.0
mode: agent

providers:
  vault-prod:
    type: vault
    auth:
      method: token
      params:
        address: "https://vault.example.com:8200"
        token: "${VAULT_TOKEN}"

secrets:
  - name: secret/data/prod/postgres
    provider: vault-prod
    targets:
      containers:
        - app-postgres
    mappings:
      POSTGRES_PASSWORD: password
    health_check:
      enabled: true
      timeout: 30s
```

**For Azure Key Vault:**

```yaml
version: v1.0.0
mode: agent

providers:
  azure-prod:
    type: azure
    auth:
      method: managed_identity
      params:
        vault_name: my-keyvault
        vault_url: "https://my-keyvault.vault.azure.net/"

secrets:
  - name: postgres-password     # Azure translates _ to - automatically
    provider: azure-prod
    targets:
      containers:
        - app-postgres
    mappings:
      POSTGRES_PASSWORD: password
    health_check:
      enabled: true
```

### 3. .env.example

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key

# Vault Configuration
VAULT_ADDR=https://vault.example.com:8200
VAULT_TOKEN=s.your-vault-token

# Azure Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

---

## Setup

### Step 1: Store the Secret

**AWS Secrets Manager:**
```bash
aws secretsmanager create-secret \
  --name prod/postgres_password \
  --secret-string '{"postgres_password_field":"SecurePassword123!"}' \
  --region us-east-1
```

**HashiCorp Vault:**
```bash
vault kv put secret/prod/postgres password=SecurePassword123!
```

**Azure Key Vault:**
```bash
az keyvault secret set \
  --vault-name my-keyvault \
  --name postgres-password \
  --value SecurePassword123!
```

### Step 2: Configure IAM (AWS Example)

Create an IAM policy that allows the EC2 instance to read the secret:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:prod/*"
    }
  ]
}
```

Attach to your EC2 instance's IAM role.

### Step 3: Install DSO

```bash
# System-wide installation (production)
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | sudo bash

# Or in your project (development)
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash
```

### Step 4: Initialize DSO

```bash
# Interactive setup (recommended)
docker dso setup --mode agent --provider aws

# Or manual bootstrap
sudo docker dso bootstrap agent
sudo cp dso.yaml /etc/dso/dso.yaml
```

### Step 5: Start DSO Agent

```bash
# Enable and start the systemd service
sudo docker dso system enable

# Verify it's running
docker dso status
```

### Step 6: Bring Up Your Application

```bash
docker compose up -d

# Verify all services are healthy
docker compose ps

# Check DSO status
docker dso status --json | jq '.secrets'
```

---

## Expected Output

### Healthy System

```bash
$ docker dso status
```

```
DSO Agent Status
═════════════════════════════════════════════════════════════

System Health
  Status: HEALTHY
  Uptime: 2h 34m
  Version: v3.5.20

Secrets (1 active)
  prod/postgres_password
    Provider: aws-prod
    Target Container: app-postgres
    Last Rotation: 45 minutes ago
    Cache Status: HIT (90.2% hit rate)

Containers (2 managed)
  app-postgres (postgres:15-alpine)
    Status: RUNNING
    Injected Secrets: 1
    Health: HEALTHY
  app-service (my-app:latest)
    Status: RUNNING
    Injected Secrets: 1
    Health: HEALTHY

Recent Activity
  [2026-06-16 14:32:15] Rotation completed for prod/postgres_password
  [2026-06-16 14:32:10] Health check PASSED for app-postgres
  [2026-06-16 14:32:08] Container swap: app-postgres_dso_new_abc123 → app-postgres
  [2026-06-16 14:32:02] New container created with updated secret
```

### Verification Commands

```bash
# Verify the database is accessible
docker compose exec app-postgres psql -U appuser -d appdb -c "SELECT version();"

# Output:
# version
# ─────────────────────────────────────────────────────────────────────────
# PostgreSQL 15.2 (Debian 15.2-1.pgdg120+1) on x86_64-pc-linux-gnu, compiled
# by gcc (Debian 10.2.1-6) on 2023-02-20
```

```bash
# Verify the application can connect
docker compose logs app-service | grep -i database

# Output:
# app-service | 2026-06-16T14:31:05Z INFO Database connection successful
# app-service | 2026-06-16T14:31:05Z INFO Running migrations
# app-service | 2026-06-16T14:31:06Z INFO Startup complete
```

---

## Validation

### Before Making Changes

```bash
# Check current secret version
docker dso status --json | jq '.secrets[0].last_rotation'

# Test application connectivity
curl http://localhost:8000/health
# Output: {"status":"ok"}
```

### Rotate the Secret (Trigger the Example)

**AWS:**
```bash
aws secretsmanager update-secret \
  --secret-id prod/postgres_password \
  --secret-string '{"postgres_password_field":"NewSecurePassword456!"}'
```

**Vault:**
```bash
vault kv put secret/prod/postgres password=NewSecurePassword456!
```

### Observe the Rotation (In Real-Time)

```bash
# Terminal 1: Watch status updates
docker dso status --watch

# Terminal 2: Follow logs
docker dso system logs -f

# Terminal 3: Monitor containers
docker ps --filter "name=app-" --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"
```

### Expected Sequence (2-3 seconds)

```
[Rotation Detected]
  prod/postgres_password secret changed in AWS
  
[New Container Created]
  app-postgres_dso_new_abc123 started with new password
  
[Health Check Running]
  pg_isready -U appuser -d appdb ✓ PASSED
  
[Traffic Switch]
  Connections rerouted from app-postgres to app-postgres_dso_new_abc123
  
[Old Container Stopped]
  app-postgres (old container) stopped gracefully
  
[Cleanup]
  Container renamed: app-postgres_dso_new_abc123 → app-postgres
  
[Complete]
  Zero downtime. Application never interrupted.
```

### Verify Application Stayed Live

```bash
# Check that requests succeeded during rotation
curl -v http://localhost:8000/health

# Should respond with 200 OK (no 5xx errors during rotation)
```

---

## Failure Modes

### Scenario 1: Secret Not Found in Provider

**Symptom:**
```
docker dso status
→ Secret Status: ERROR
→ "secret prod/postgres_password not found in provider"
```

**Cause:**
- Wrong secret name in `dso.yaml`
- Secret doesn't exist in AWS/Vault/Azure
- IAM permissions insufficient

**Fix:**
```bash
# Verify secret exists
aws secretsmanager get-secret-value --secret-id prod/postgres_password

# Check IAM permissions
aws iam get-user-policy --user-name dso-agent --policy-name dso-policy

# Update dso.yaml with correct name
docker dso config edit
```

### Scenario 2: Health Check Fails

**Symptom:**
```
[New Container Created]
app-postgres_dso_new_abc123: Health check FAILED
  pg_isready output: 
    "FATAL:  password authentication failed for user "appuser""
  
[Rollback Triggered]
Reverting to old container...
```

**Cause:**
- Secret mapping misconfigured (wrong field name)
- PostgreSQL not accepting the new password
- Health check timing too aggressive

**Fix:**
```bash
# Verify secret format in provider
aws secretsmanager get-secret-value --secret-id prod/postgres_password

# Should return: {"postgres_password_field":"NewSecurePassword456!"}

# Check field name in dso.yaml mappings
docker dso config show | grep -A 5 "mappings"

# Update if incorrect
docker dso config edit
```

### Scenario 3: Old Container Won't Stop

**Symptom:**
```
[Timeout]
Old container app-postgres still running after 30 seconds
DSO waiting for graceful shutdown...
```

**Cause:**
- Application inside container holding database locks
- Long-running transactions not completing
- Container doesn't respond to SIGTERM

**Fix:**
```bash
# Increase rotation timeout in dso.yaml
docker dso config edit
# Set: rotation.timeout: 120s (instead of 60s)

# Or manually intervene (only if necessary)
docker stop app-postgres --time 30
```

### Scenario 4: Application Can't Connect to New Container

**Symptom:**
```
app-service logs show:
  ERROR: [DBError] Connection refused (127.0.0.1:5432)
  ERROR: Unable to recover. Giving up.
```

**Cause:**
- Application tries to connect before health check passes
- New PostgreSQL still initializing
- Network connectivity issue

**Fix:**
```bash
# Increase health check delays in docker-compose.yml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
  interval: 5s
  timeout: 5s
  retries: 10        # ← Increase from 5 to 10
  start_period: 15s  # ← Increase from 10s to 15s

# Restart services
docker compose up -d
```

---

## Recovery

### Automatic Recovery (v3.5+)

If the DSO agent **crashes during rotation**, it automatically recovers on restart:

```bash
# Agent crashes mid-rotation
[DSO Agent Process Died]

# You restart it
sudo systemctl restart dso-agent

# DSO automatically detects the incomplete rotation
[DSO Startup - Automatic Recovery]
  Detected 1 incomplete rotation from 5 minutes ago
  Found orphaned containers: app-postgres_dso_new_xyz789
  Removing orphaned backup: app-postgres_dso_backup_xyz789
  Validating original container: app-postgres (RUNNING)
  Recovery complete. Original container intact.

# Normal operation resumes
```

**No operator action required.**

### Manual Rollback (If Needed)

If you need to manually revert to the old password:

```bash
# 1. Update the secret back to the old value
aws secretsmanager update-secret \
  --secret-id prod/postgres_password \
  --secret-string '{"postgres_password_field":"OldPassword789!"}'

# 2. DSO detects the change and rotates back
docker dso status --watch

# 3. Verify the revert is complete
docker dso status --json | jq '.secrets[0].last_rotation'
```

### Check State After Recovery

```bash
# Verify no orphaned containers remain
docker ps -a | grep -E "dso_backup|dso_new"

# Should return: (empty - no orphaned containers)

# Verify application is healthy
docker compose ps

# Should show all services RUNNING with healthy status
```

---

## Next Steps

### 1. Application Connection Pool

If your application uses a connection pool, verify the pool handles short disconnections:

```python
# Example: psycopg2 with connection pooling
pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,
    host="postgres",
    port=5432,
    database="appdb",
    user="appuser",
    password=os.getenv("POSTGRES_PASSWORD"),
    connect_timeout=5
)
```

### 2. Monitoring Integration

Send DSO metrics to your monitoring system:

```bash
# Export metrics as Prometheus format
docker dso status --json | jq '.observability.metrics'

# Integrate with Grafana/Datadog/etc.
# Alert on: rotation failures, health check failures, agent downtime
```

### 3. Automate Secret Rotation Policy

Set up a regular rotation schedule in AWS Secrets Manager, Vault, or Azure:

```bash
# AWS: Enable automatic rotation
aws secretsmanager rotate-secret \
  --secret-id prod/postgres_password \
  --rotation-rules AutomaticallyAfterDays=30
```

### 4. Multi-Environment Setup

Extend to staging and production:

```yaml
# dso.yaml - multiple secrets, one per environment
secrets:
  - name: dev/postgres_password
    targets:
      containers: [app-postgres-dev]
  - name: staging/postgres_password
    targets:
      containers: [app-postgres-staging]
  - name: prod/postgres_password
    targets:
      containers: [app-postgres]
```

### 5. Load Testing

Verify your application handles the rotation gracefully under load:

```bash
# Terminal 1: Start DSO monitoring
docker dso status --watch

# Terminal 2: Apply load
ab -n 10000 -c 100 http://localhost:8000/api/query

# Terminal 3: Trigger rotation
aws secretsmanager update-secret ...

# Verify: No request failures during rotation
```

---

## Troubleshooting Checklist

- [ ] Secret exists in provider (AWS/Vault/Azure)
- [ ] DSO has IAM/RBAC permissions to read secret
- [ ] `dso.yaml` secret name matches provider exactly
- [ ] `docker-compose.yml` `container_name` matches `dso.yaml` targets
- [ ] Health check passes on both old and new containers
- [ ] Application can connect to new PostgreSQL instance
- [ ] No other services holding database locks
- [ ] Rotation timeout is long enough for your app
- [ ] DSO agent is running (`docker dso status`)
- [ ] Provider connectivity is healthy (`docker dso doctor`)

---

## Summary

You now have:
- ✅ PostgreSQL running in Docker Compose
- ✅ Credentials managed by DSO
- ✅ Zero-downtime rotation on secret changes
- ✅ Automatic health validation
- ✅ Automatic crash recovery
- ✅ Clear failure handling

**The next credential rotation: zero downtime, completely automated.**
