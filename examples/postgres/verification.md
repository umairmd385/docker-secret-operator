# Verification — How to Test PostgreSQL Rotation

This guide shows exactly how to verify that DSO credential rotation is working.

## Prerequisites

- ✅ Example running: `docker compose up -d`
- ✅ Containers healthy: `docker compose ps`
- ✅ DSO installed and working

---

## Step 1: Verify Initial Setup (3 minutes)

### 1.1 Check Container Health

```bash
# See all containers
docker compose ps

# Expected output:
# NAME           STATUS
# postgres_db    Up (healthy)
# app_server     Up (healthy)
```

### 1.2 Test Application Connectivity

```bash
# Check application health
curl http://localhost:3000/health
# Expected: {"status":"healthy","database":"connected"}

# Check database connection
curl http://localhost:3000/status
# Expected: {"status":"connected","database_user":"appuser"}

# Test database write
curl -X POST http://localhost:3000/test
# Expected: {"success":true,"id":1,"created_at":"2026-06-18T..."}
```

### 1.3 Verify PostgreSQL Directly

```bash
# Connect to PostgreSQL as appuser
docker exec -it postgres_db psql -U appuser -d appdb -c "SELECT current_user, NOW();"

# Expected: Shows appuser and current timestamp
```

---

## Step 2: Set Up Secret Rotation (5 minutes)

### 2.1 For Local Mode (Development)

```bash
# Initialize local encrypted vault
docker dso init

# Store initial password
docker dso secret set postgres/password "initial_password_12345"

# Verify secret is stored
docker dso status
```

### 2.2 For AWS Secrets Manager (Production)

```bash
# Update dso.yaml provider section
# provider:
#   type: "aws"
#   region: "us-east-1"

# Create secret in AWS
aws secretsmanager create-secret \
  --name postgres/password \
  --secret-string "initial_password_12345" \
  --region us-east-1

# Verify
aws secretsmanager get-secret-value --secret-id postgres/password
```

### 2.3 For Vault (Production)

```bash
# Update dso.yaml provider section
# provider:
#   type: "vault"
#   address: "http://vault:8200"

# Create secret in Vault
vault write secret/data/postgres/password value="initial_password_12345"

# Verify
vault read secret/data/postgres/password
```

---

## Step 3: Monitor Before Rotation (1 minute)

Open multiple terminals:

**Terminal 1: Watch logs**
```bash
docker compose logs -f app_server
```

**Terminal 2: Monitor health**
```bash
watch curl -s http://localhost:3000/health | jq .
```

**Terminal 3: Monitor status**
```bash
watch curl -s http://localhost:3000/status | jq .
```

**Terminal 4: (Ready to trigger rotation)**
```bash
# Leave this ready for next step
```

---

## Step 4: Trigger Password Rotation (30 seconds)

In Terminal 4, update the secret in your backend:

### For Local Mode

```bash
# Change the password in local vault
docker dso secret set postgres/password "new_password_67890"

# Verify it changed
docker dso secret get postgres/password
# Expected: Shows "new_password_67890"
```

### For AWS Secrets Manager

```bash
# Update the secret
aws secretsmanager update-secret \
  --secret-id postgres/password \
  --secret-string "new_password_67890" \
  --region us-east-1

# Verify
aws secretsmanager get-secret-value --secret-id postgres/password
```

### For Vault

```bash
# Update the secret
vault write secret/data/postgres/password value="new_password_67890"

# Verify
vault read secret/data/postgres/password
```

---

## Step 5: Observe Rotation Happening

Watch all three terminals simultaneously:

### Expected Timeline

```
T+0s    Secret updated in backend
        ↓
        DSO detects change (usually within polling interval)

T+~60s  DSO starts rotation
        - Logs: "Rotation started"
        - New container spawning

T+~65s  Health checks passing
        - New container ready
        - Logs: "Health check passed"

T+~70s  Atomic swap happens
        - Traffic switches to new container
        - Old container stops
        - Logs: "Rotation complete"

T+~75s  Status returns to normal
        - All health checks passing
        - No interruption observed
```

### What You'll See in Logs

**App logs (Terminal 1)**:
```
[APP] Health check passed
[APP] Connection pool reinitializing
[APP] Database connection pool initialized
[APP] Status: Connected as appuser
```

**Health monitoring (Terminal 2)**:
```
{"status":"healthy","database":"connected","timestamp":"..."}
{"status":"healthy","database":"connected","timestamp":"..."}
(never goes down)
```

**Status monitoring (Terminal 3)**:
```
{"status":"connected","database_user":"appuser","server_time":"..."}
{"status":"connected","database_user":"appuser","server_time":"..."}
(continuous connection)
```

---

## Step 6: Verify New Password Is Active (1 minute)

### 6.1 Test with New Password

```bash
# Application still works
curl http://localhost:3000/health
# Expected: {"status":"healthy"}

# Insert test record
curl -X POST http://localhost:3000/test
# Expected: {"success":true,"id":2}

# Check database user
curl http://localhost:3000/status
# Expected: Connected and working
```

### 6.2 Verify Old Password No Longer Works

```bash
# Try to connect with old password (should fail)
docker exec -it postgres_db \
  PGPASSWORD=initial_password_12345 \
  psql -U appuser -d appdb -c "SELECT 1;" 2>&1

# Expected error: "password authentication failed"
```

### 6.3 Verify New Password Works

```bash
# Connect with new password (should succeed)
docker exec -it postgres_db \
  PGPASSWORD=new_password_67890 \
  psql -U appuser -d appdb -c "SELECT current_user, NOW();"

# Expected: Shows appuser and timestamp
```

---

## Step 7: Measure Downtime (Optional)

Create a script to measure actual downtime:

```bash
#!/bin/bash

echo "Starting continuous health checks..."
start_time=$(date +%s)
failed=0
total=0

while true; do
  total=$((total + 1))
  if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
    failed=$((failed + 1))
    echo "❌ Check $total FAILED"
  else
    echo "✅ Check $total passed"
  fi
  sleep 0.5
done
```

Run this, then trigger rotation. You should see:
- ✅ Zero failed checks (even during rotation)
- ✅ No interruption in the stream
- ✅ Continuous "passed" status

---

## Step 8: Complete Verification Checklist

- [ ] Containers started successfully
- [ ] Application health check passes
- [ ] Database write operations work
- [ ] Secret updated in backend
- [ ] DSO detected the change
- [ ] Rotation completed without errors
- [ ] Health checks never failed
- [ ] No request errors during rotation
- [ ] New password is active
- [ ] Old password no longer works
- [ ] Zero downtime observed

---

## Troubleshooting Verification Issues

### Health check fails during rotation

**Problem**: `curl` returns error during rotation

**Solutions**:
1. Increase health check timeout in dso.yaml
2. Check app logs for connection errors
3. Verify DSO is running: `docker dso status`

### Old password still works

**Problem**: Old password still connects to PostgreSQL

**Solutions**:
1. Verify secret was actually updated in backend
2. Check dso.yaml is watching the right secret path
3. Restart DSO agent: `docker dso restart`

### Application never reconnects

**Problem**: App remains disconnected after rotation

**Solutions**:
1. Check app connection pool settings
2. Verify PostgreSQL is healthy: `docker compose ps`
3. Check app logs for specific errors
4. See failure-scenarios.md for recovery steps

---

## Success Criteria

✅ **Rotation is working if:**

1. ✅ Health checks never fail during rotation
2. ✅ Application stays responsive
3. ✅ Database operations succeed before/during/after rotation
4. ✅ New password is confirmed as active
5. ✅ Old password is confirmed as inactive
6. ✅ Zero downtime observed
7. ✅ All tests pass without manual intervention

---

## Next Steps

- ✅ **Verify**: Run through this guide once
- ✅ **Observe**: Watch the rotation happen in real-time
- ✅ **Understand**: See expected-behavior.md for what should happen
- ✅ **Test failures**: See failure-scenarios.md for edge cases
- ✅ **Learn recovery**: See troubleshooting.md for fixing issues

If all verification steps pass, congratulations! DSO is working correctly for PostgreSQL credential rotation.
