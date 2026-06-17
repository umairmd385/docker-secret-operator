# Troubleshooting — Common Issues and Solutions

This guide helps you diagnose and fix problems when running the PostgreSQL example.

---

## Issue 1: "Connection refused" to PostgreSQL

**Problem**: Application can't connect to database

### Error Message
```
ERROR: connection refused
postgres connection failed: connect ECONNREFUSED 127.0.0.1:5432
```

### Diagnosis

```bash
# Check if PostgreSQL container is running
docker compose ps postgres_db
# Should show: Up (healthy)

# Check if service is listening
docker compose exec postgres_db pg_isready
# Should show: accepting connections

# Check environment variables
docker compose exec app_server env | grep DB_
# Should show: DB_HOST=postgres, DB_PORT=5432, etc.
```

### Solutions

**1. PostgreSQL not started**
```bash
# Start the service
docker compose up -d postgres_db

# Wait for health check
docker compose logs postgres_db
# Look for: "database system is ready to accept connections"
```

**2. Wrong hostname**
```bash
# Verify DNS resolution
docker compose exec app_server getent hosts postgres
# Should return: postgres service IP

# Verify dso.yaml has correct host
grep "DB_HOST" dso.yaml
```

**3. Port mismatch**
```bash
# Check PostgreSQL port
docker compose exec postgres_db pg_isready -h localhost -p 5432
# Port should be 5432 (internal) or 5432 (exposed)

# Verify in dso.yaml
grep "DB_PORT" dso.yaml
```

---

## Issue 2: Authentication Failed

**Problem**: Connection refused, authentication failed

### Error Message
```
FATAL: password authentication failed for user "appuser"
psql: error: FATAL: password authentication failed
```

### Diagnosis

```bash
# Verify secret exists
docker dso secret get postgres/password
# Should return the password

# Verify secret file was created
docker compose exec app_server cat /run/secrets/db_password
# Should show the current password

# Check PostgreSQL credentials in dso.yaml
grep "POSTGRES_USER\|POSTGRES_PASSWORD" dso.yaml
```

### Solutions

**1. Secret not initialized**
```bash
# Initialize secret
docker dso secret set postgres/password "my_secure_password"

# Verify
docker dso secret get postgres/password
```

**2. Secret file missing or empty**
```bash
# Check file content
docker compose exec app_server ls -la /run/secrets/db_password
docker compose exec app_server wc -c /run/secrets/db_password

# File should have content and not be empty
# If empty, restart containers
docker compose restart
```

**3. Password mismatch**
```bash
# Verify password in secret
docker dso secret get postgres/password

# Verify password used by app
docker compose exec app_server env | grep DB_PASSWORD_FILE

# If mismatch, update secret
docker dso secret set postgres/password "correct_password"
```

---

## Issue 3: Rotation Never Starts

**Problem**: DSO running but rotation not happening

### Diagnosis

```bash
# Check DSO status
docker dso status
# Should show: agent running, watching for changes

# Check if DSO is actually monitoring
docker dso logs | grep "polling\|watching"

# Check dso.yaml polling interval
grep -A 2 "polling:" dso.yaml
# Default is 1 minute (60s)

# Manually check for secret change
docker dso diff
# Shows pending changes
```

### Solutions

**1. DSO not running**
```bash
# Check if agent is alive
docker dso status
# If not running, start it
docker dso agent start

# Or via systemd (production)
sudo systemctl status dso-agent
sudo systemctl start dso-agent
```

**2. Secret hasn't changed**
```bash
# Manually trigger rotation
docker dso rotate --secret postgres/password

# If that works, DSO is fine
# You just need to change the secret to trigger auto-rotation
docker dso secret set postgres/password "new_password_$(date +%s)"
```

**3. Polling interval too long**
```bash
# Current interval
grep "interval:" dso.yaml

# To make testing faster, set to 10 seconds:
# polling:
#   interval: "10s"

# Restart DSO for changes to take effect
docker dso restart
```

**4. Wrong secret name**
```bash
# List available secrets
docker dso secret list

# Verify dso.yaml references correct secret
grep "name:" dso.yaml | grep secret

# Should match exactly
```

---

## Issue 4: Health Check Failing

**Problem**: Rotation starts but health check fails

### Error Message
```
Health check failed: connection timeout
Health check attempt 3/3 failed
Rollback to old state
```

### Diagnosis

```bash
# Manual health check
curl http://localhost:3000/health
# Should return 200 with healthy status

# Check application logs
docker compose logs app_server
# Look for error messages

# Check if app is responding
docker compose exec app_server ps aux | grep node
# Should show running node process

# Test specific endpoint
docker compose exec app_server curl localhost:3000/health
```

### Solutions

**1. Application crashed**
```bash
# Check app logs
docker compose logs app_server --tail 50

# Restart application
docker compose restart app_server

# Verify it's healthy
curl http://localhost:3000/health
```

**2. Health check endpoint misconfigured**
```bash
# Check dso.yaml health check endpoint
grep -A 3 "health_check:" dso.yaml

# Should be: http://localhost:3000/health

# If wrong, update dso.yaml and restart DSO
```

**3. Health check timeout too short**
```bash
# Current timeout
grep "timeout:" dso.yaml

# Increase if app is slow to respond
# health_check:
#   timeout: "60s"  (increase from 30s)

# Restart DSO
docker dso restart
```

**4. PostgreSQL connection issue**
```bash
# App needs database to be healthy
# Check PostgreSQL
docker compose exec postgres_db pg_isready
# Should show: accepting connections

# If not, restart PostgreSQL
docker compose restart postgres_db
```

---

## Issue 5: Container Swap Never Completes

**Problem**: Rotation appears stuck

### Diagnosis

```bash
# Check running containers
docker compose ps
# Should show both old and new containers during rotation

# Check logs for errors
docker compose logs -f

# Check DSO status
docker dso status

# Look for specific error
docker dso logs | tail -20
```

### Solutions

**1. Lock not released**
```bash
# DSO uses distributed locking
# Check lock status
docker dso status | grep lock

# If stuck, restart DSO
docker dso restart

# Try rotation again
docker dso rotate --secret postgres/password
```

**2. Cleanup stuck**
```bash
# Manually remove old containers
docker ps -a | grep postgres
# Find the old one

docker rm <container-id>

# Restart DSO
docker dso restart
```

**3. Resource constraints**
```bash
# Check system resources
docker stats

# If CPU/memory maxed, free up resources
docker system prune
docker image prune
```

---

## Issue 6: "No such file or directory" - Secret

**Problem**: Can't read secret file

### Error Message
```
ERROR: /run/secrets/db_password: No such file or directory
```

### Diagnosis

```bash
# Check if file exists
docker compose exec app_server ls -la /run/secrets/

# Check if readable
docker compose exec app_server cat /run/secrets/db_password

# Check permissions
docker compose exec app_server stat /run/secrets/db_password
```

### Solutions

**1. Containers not restarted after DSO setup**
```bash
# Restart to mount secrets
docker compose restart
```

**2. Secret path wrong in dso.yaml**
```bash
# Check path in dso.yaml
grep "path:" dso.yaml
# Should be: /run/secrets/db_password

# Verify it matches docker-compose.yml
```

**3. File system issue**
```bash
# Rebuild container
docker compose down
docker compose up -d

# Check again
docker compose exec app_server cat /run/secrets/db_password
```

---

## Issue 7: "Rotation failed" in logs

**Problem**: DSO reports rotation failure

### Diagnosis

```bash
# Get full error message
docker dso logs | grep -A 5 "failed\|error"

# Check all containers
docker compose ps

# Check application state
curl http://localhost:3000/health
```

### Solutions

Depends on the specific error:

**If health check failed**:
- See "Issue 4: Health Check Failing"

**If spawn failed**:
- See "Scenario 3: Container Startup Failure" in failure-scenarios.md

**If provider failed**:
- See "Scenario 1: Provider Unavailable" in failure-scenarios.md

---

## Issue 8: Old Password Still Works After Rotation

**Problem**: Password wasn't actually updated

### Diagnosis

```bash
# Check current secret in backend
docker dso secret get postgres/password

# Verify it was actually updated
echo "Expected new password"

# Try to connect with old password (should fail)
docker exec postgres_db \
  PGPASSWORD=old_password \
  psql -U appuser -d appdb -c "SELECT 1;"
```

### Solutions

**1. Secret wasn't actually changed**
```bash
# Update the secret
docker dso secret set postgres/password "truly_new_password_$(date +%s)"

# Verify change
docker dso secret get postgres/password

# Trigger rotation
docker dso rotate --secret postgres/password
```

**2. DSO didn't detect change**
```bash
# Check DSO is watching
docker dso status

# Force refresh
docker dso sync

# Retry
docker dso rotate --secret postgres/password
```

**3. Old password still in memory**
```bash
# Application connection pool may cache password
# Force pool reset:
docker compose restart app_server

# Try old password again
```

---

## Issue 9: PostgreSQL Disk Usage Growing

**Problem**: Database storage growing unexpectedly

### Diagnosis

```bash
# Check container size
docker inspect postgres_db | grep Size

# Check database size from inside
docker compose exec postgres_db \
  psql -U appuser -d appdb -c \
  "SELECT pg_size_pretty(pg_database_size('appdb'));"

# Check for large tables
docker compose exec postgres_db \
  psql -U appuser -d appdb -c \
  "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
   FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### Solutions

**1. Test table growing**
```bash
# Clear test records if needed
docker compose exec postgres_db \
  psql -U appuser -d appdb -c "DELETE FROM test_table;"

# Vacuum to reclaim space
docker compose exec postgres_db \
  psql -U appuser -d appdb -c "VACUUM FULL;"
```

**2. WAL (Write Ahead Log) growing**
```bash
# Check WAL size
du -h /var/lib/postgresql/data/pg_wal

# WAL is normal, but if excessive, check replication
```

---

## Quick Diagnosis Script

Run this to check overall health:

```bash
#!/bin/bash

echo "=== PostgreSQL Example Health Check ==="
echo

echo "Containers:"
docker compose ps
echo

echo "Health:"
curl -s http://localhost:3000/health | jq .
echo

echo "Database:"
curl -s http://localhost:3000/status | jq .
echo

echo "DSO Status:"
docker dso status
echo

echo "Recent logs:"
docker compose logs --tail 10
```

---

## Still Stuck?

If you can't find the answer here:

1. **Check logs**: `docker compose logs -f`
2. **Check DSO logs**: `docker dso logs`
3. **Try restarting**: `docker compose restart`
4. **Check examples**: See expected-behavior.md
5. **Read recovery**: See failure-scenarios.md
6. **Reset everything**: `docker compose down -v && docker compose up -d`

---

## Success Indicators

✅ Healthy if:
- `docker compose ps` shows all containers Up (healthy)
- `curl http://localhost:3000/health` returns 200
- `docker dso status` shows "agent running"
- Rotation completes without errors

If all these are true, DSO is working correctly!
