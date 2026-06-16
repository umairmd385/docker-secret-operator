# Tutorial 2: Local Development Quick Start (5 Minutes)

**Audience**: Individual developers, small teams  
**Time**: 5 minutes to first rotation  
**Prerequisites**: Docker, Docker Compose installed  
**Goal**: Try DSO locally without cloud account or credentials

---

## Why Local Development Matters

**Problem with cloud credentials:**
- "I don't have AWS/Azure access on my laptop"
- "I don't want to test with production secrets"
- "Our team uses different cloud providers"

**DSO Local Mode solves this:**
- ✅ Encrypted local vault (`~/.dso/`)
- ✅ Works offline (no internet needed)
- ✅ Zero cloud credentials required
- ✅ Same behavior as production (zero-downtime rotation)
- ✅ Perfect for learning and testing

---

## Architecture

```
Your Laptop
│
├─ ~/.dso/
│  ├─ dso.yaml (config)
│  └─ vault/ (AES-256-GCM encrypted secrets)
│
├─ docker-compose.yml (your app)
│
└─ dso-agent (running locally)
   └─ Watches vault
   └─ Manages rotations
   └─ Injects secrets
```

**That's it.** No cloud accounts. No credentials. No setup complexity.

---

## Step-by-Step (5 Minutes)

### 1. Install DSO (1 minute)

```bash
curl -fsSL https://raw.githubusercontent.com/docker-secret-operator/dso/main/scripts/install.sh | bash
```

Verify:
```bash
docker dso version
# Output: DSO version v3.5.20
```

### 2. Initialize Local Mode (1 minute)

```bash
docker dso setup --mode local
```

This creates:
- `~/.dso/dso.yaml` (configuration)
- `~/.dso/vault/` (encrypted secret storage)

Verify:
```bash
ls -la ~/.dso/
# drwx------  dso.yaml
# drwx------  vault/
```

### 3. Create Your First Secret (1 minute)

```bash
docker dso secret set myapp/db_password
```

DSO will prompt:
```
Enter secret value for 'myapp/db_password': [hidden input]
✓ Secret stored in encrypted vault
```

Type a password (e.g., `DevPassword123!`).

Verify:
```bash
docker dso secret list
# myapp/db_password (encrypted, 18 bytes)
```

### 4. Create docker-compose.yml (1 minute)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: dso://myapp/db_password
      POSTGRES_USER: devuser
      POSTGRES_DB: devdb
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    image: my-app:latest
    environment:
      DATABASE_URL: postgres://devuser:dso://myapp/db_password@postgres:5432/devdb
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
```

### 5. Bring It Up (1 minute)

```bash
docker dso up -d
```

Verify:
```bash
docker compose ps
# postgres   Running (healthy)
# app        Running

docker dso status
# Secret: myapp/db_password (injected)
# Containers: 2 running
```

**Done! Your app is running with DSO-managed secrets.**

---

## Trigger Your First Rotation (2 minutes)

Now rotate the secret to see zero-downtime rotation in action.

### Watch in Real-Time

Terminal 1 (watch status):
```bash
docker dso status --watch
```

Terminal 2 (follow logs):
```bash
docker dso system logs -f
```

Terminal 3 (change the secret):
```bash
docker dso secret set myapp/db_password
# Enter new value: NewPassword456!
```

### What You'll See

```
[Terminal 1: Status]
Secret myapp/db_password
  Last Rotation: 2 seconds ago
  Status: SUCCESS

[Terminal 2: Logs]
[INFO] Secret myapp/db_password changed
[INFO] Creating new container with updated secret
[INFO] Health check passed for new container
[INFO] Swapping traffic to new container
[INFO] Removing old container
[INFO] Rotation complete (2.3 seconds total)

[Terminal 3: App Remains Responsive]
curl http://localhost:8000/health
→ 200 OK (zero downtime during rotation)
```

---

## Files You Just Created

### ~/.dso/dso.yaml

```yaml
version: v1.0.0
mode: local

providers:
  file:
    type: file
    path: ~/.dso/vault

defaults:
  inject:
    type: env
  rotation:
    enabled: true
    strategy: rolling
    timeout: 30s

secrets:
  - name: myapp/db_password
    provider: file
    targets:
      containers:
        - postgres
    mappings:
      POSTGRES_PASSWORD: db_password
```

**Read from:** `~/.dso/dso.yaml`  
**Encrypted?** No (local development, plaintext in memory only)  
**Backed up?** In `~/.dso/vault/` (secured with file permissions)

### docker-compose.yml

**Key line:**
```yaml
POSTGRES_PASSWORD: dso://myapp/db_password
```

This tells DSO to:
1. Look up `myapp/db_password` in local vault
2. Decrypt it
3. Inject into this container as `POSTGRES_PASSWORD` env var

---

## Common Next Steps

### 1. Add More Secrets

```bash
# API key
docker dso secret set myapp/api_key
# Value: sk-abc123def456

# Database username (optional, can be hardcoded)
docker dso secret set myapp/db_user
# Value: devuser

# Update docker-compose.yml
environment:
  POSTGRES_USER: dso://myapp/db_user
  POSTGRES_PASSWORD: dso://myapp/db_password
```

### 2. Test Rotation Under Load

```bash
# Terminal 1: Start load
while true; do curl http://localhost:8000/health; sleep 0.1; done

# Terminal 2: Rotate the secret
docker dso secret set myapp/db_password
# (app never experiences downtime)
```

### 3. Multiple Environments

```bash
# Switch to staging secrets without changing app code
docker dso config show
# mode: local (same code, different secrets)

# Different laptop? Copy the vault directory
cp -r ~/.dso ~/backup-dso
# Restore on other machine
cp -r ~/backup-dso ~/.dso
```

### 4. Multi-Service Setup

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: dso://myapp/db_password
  
  redis:
    environment:
      REDIS_PASSWORD: dso://myapp/redis_password
  
  app:
    environment:
      DB_PASSWORD: dso://myapp/db_password
      REDIS_PASSWORD: dso://myapp/redis_password
      API_KEY: dso://myapp/api_key
```

### 5. Share Secrets With Team

```bash
# Export secrets in plaintext (be careful!)
docker dso secret export > /tmp/dev-secrets.json

# Share via secure channel (encrypted Slack, 1Password, etc.)
# Team member imports:
docker dso secret import /tmp/dev-secrets.json
```

---

## What Happens Under the Hood

### When You Run `docker dso secret set`

1. ✅ You enter the secret value
2. ✅ DSO encrypts it with AES-256-GCM
3. ✅ Stores in `~/.dso/vault/myapp_db_password.enc`
4. ✅ Only accessible to your user (file permissions: 0600)

### When You Run `docker dso up`

1. ✅ DSO reads `docker-compose.yml`
2. ✅ Finds `dso://` URIs
3. ✅ Decrypts matching secrets from vault
4. ✅ Injects into container environment
5. ✅ Starts container with secret in memory
6. ✅ Watches for secret changes

### When You Update a Secret

1. ✅ DSO detects the change
2. ✅ Creates new container with updated secret
3. ✅ Runs health check
4. ✅ Swaps traffic
5. ✅ Stops old container
6. ✅ **Zero downtime**

---

## Failure Modes

### Secret Doesn't Get Injected

**Symptom:**
```
docker compose logs app
ERROR: DATABASE_URL not set
```

**Cause:**
- `dso://` URI not in `docker-compose.yml`
- Secret name doesn't match `docker dso secret set` name

**Fix:**
```bash
# Verify secret exists
docker dso secret list

# Check docker-compose.yml uses exact same name
# Example: dso://myapp/db_password

# Restart
docker compose up -d
```

### "Can't find dso socket"

**Symptom:**
```
Error: Cannot connect to DSO agent (/run/dso/dso.sock)
```

**Cause:**
- DSO agent not running
- Wrong mode (you're in agent mode, should be local)

**Fix:**
```bash
# Check config
docker dso config show | grep mode
# Should show: mode: local

# If agent mode:
docker dso config edit
# Change: mode: agent → mode: local

# Restart
docker compose restart
```

### Old Container Won't Stop

**Symptom:**
```
Rotation in progress...
[Timeout] Old container still running after 30 seconds
```

**Cause:**
- Health check too slow
- Container holding locks

**Fix:**
```yaml
# In docker-compose.yml, increase health check delays
healthcheck:
  start_period: 15s  # Give more time to start
  timeout: 10s       # More time to respond
```

---

## Moving to Production

When you're ready to use cloud credentials:

### Option 1: Migrate to AWS

```bash
# Stop local mode
docker compose down

# Switch to AWS (will prompt for configuration)
docker dso setup --mode agent --provider aws

# Create secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name myapp/db_password \
  --secret-string 'DevPassword123!'

# Start with production config
docker compose up -d
```

### Option 2: Use Same Code, Different Secrets

```bash
# Local development
docker dso config show  # mode: local

# On production server
docker dso config show  # mode: agent, provider: aws
# (Same docker-compose.yml, different secrets)
```

---

## Security Notes

### Local Development (This Setup)

- ✅ Secrets encrypted in `~/.dso/vault/`
- ✅ Secured with file permissions (owner only)
- ✅ Good for: laptops, learning, testing

### Never in Local Mode

- ❌ Don't store actual passwords in plaintext in docker-compose.yml
- ❌ Don't commit `.dso/` to git (add to `.gitignore`)
- ❌ Don't share vault directory over unencrypted channels

### Add to .gitignore

```bash
cat >> .gitignore << EOF
.dso/
.env
.env.local
EOF
```

---

## Verification Commands

### Everything Working?

```bash
docker dso doctor
# Output:
# Environment: HEALTHY
# Configuration: VALID
# Local Vault: READABLE (3 secrets)
# Containers: 2 running, 2 healthy
```

### Real Rotation?

```bash
# Watch rotation happen
docker dso status --watch

# In another terminal:
docker dso secret set myapp/db_password

# Type new value and watch:
# - New container created
# - Health check runs
# - Traffic swaps
# - Old container stops
# Total time: 2-3 seconds
```

### Zero Downtime Proof

```bash
# Terminal 1: Continuous requests
watch -n 0.5 'curl -s http://localhost:8000/health || echo FAILED'

# Terminal 2: Rotate secret
docker dso secret set myapp/db_password

# Observe: 0 FAILED responses during rotation
```

---

## Summary

You now have:
- ✅ DSO installed and running locally
- ✅ Encrypted local vault (`~/.dso/`)
- ✅ docker-compose.yml using DSO secrets
- ✅ Zero-downtime secret rotation working
- ✅ No cloud account needed
- ✅ Understanding of how DSO works before production

**Next: Try the PostgreSQL tutorial or test with your own application.**
