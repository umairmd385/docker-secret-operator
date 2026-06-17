# PostgreSQL Credential Rotation with DSO

**Zero-downtime PostgreSQL password rotation using Docker Secret Operator**

This is a **production-grade example** demonstrating how to safely rotate PostgreSQL credentials without interrupting service.

---

## What You'll Learn

✅ **Zero-downtime rotation** — Credentials change without downtime  
✅ **Automatic recovery** — Failed rotations handled gracefully  
✅ **Real architecture** — PostgreSQL, application, DSO working together  
✅ **Failure handling** — See how DSO recovers from problems  
✅ **Verification** — Exact commands to test the rotation  

---

## Before You Start

**Requirements**:
- Docker and Docker Compose installed
- DSO installed and working
- Basic familiarity with Docker and PostgreSQL

**Time**: ~30 minutes to run through the full example

---

## Quick Start (5 minutes)

### 1. Copy the example

```bash
cd examples/postgres
```

### 2. Start the services

```bash
docker compose up -d
docker compose logs -f
```

Wait for:
- ✅ PostgreSQL: "database system is ready to accept connections"
- ✅ App: "Server running on http://localhost:3000"

### 3. Verify it's working

```bash
# Health check
curl http://localhost:3000/health
# Expected: {"status":"healthy","database":"connected"}

# Database connection
curl http://localhost:3000/status
# Expected: {"status":"connected","database_user":"appuser"}

# Test database write
curl -X POST http://localhost:3000/test
# Expected: {"success":true,"id":1}
```

✅ **Done!** Now let's rotate credentials.

---

## Trigger a Rotation (5 minutes)

### 1. Set up secret management

Choose one:

**For local development (easiest)**:
```bash
docker dso init
docker dso secret set postgres/password "initial_secure_password_123"
```

**For AWS Secrets Manager**:
```bash
# Update dso.yaml provider to "aws"
aws secretsmanager create-secret \
  --name postgres/password \
  --secret-string "initial_secure_password_123"
```

**For Vault**:
```bash
# Update dso.yaml provider to "vault"
vault write secret/data/postgres/password value="initial_secure_password_123"
```

### 2. Start DSO agent

```bash
# Local mode
docker dso agent start

# Production mode (systemd)
sudo systemctl start dso-agent
```

### 3. Monitor what happens (open 3 terminals)

**Terminal 1: Watch logs**
```bash
docker compose logs -f
```

**Terminal 2: Health check loop**
```bash
watch curl -s http://localhost:3000/health | jq .
```

**Terminal 3: Change the password**
```bash
# Change the secret
docker dso secret set postgres/password "new_secure_password_456"

# Watch logs show rotation happening
```

### 4. Observe

Watch all three terminals simultaneously. You should see:
- ✅ Rotation starts automatically
- ✅ New container created with new password
- ✅ Health checks never fail
- ✅ Atomic container swap
- ✅ Old container removed
- ✅ Zero interruption to service

**Total rotation time**: ~5 seconds  
**Downtime**: 0 seconds

---

## File Structure

```
postgres/
├── README.md                 ← You are here
├── docker-compose.yml        ← PostgreSQL + App stack
├── dso.yaml                  ← DSO configuration
├── app.js                    ← Sample Node.js application
├── .env.example              ← Environment variables
├── expected-behavior.md      ← What to expect (detailed)
├── verification.md           ← How to test the rotation
├── failure-scenarios.md      ← What happens when things break
└── troubleshooting.md        ← How to fix problems
```

---

## Understanding the Architecture

```
Secret Backend (Local / AWS / Azure / Vault)
              ↓
           DSO Agent
              ↓
   (detects secret changes)
              ↓
    PostgreSQL Container
    +   App Container
              ↓
    Blue-Green Swap
    (atomic replacement)
              ↓
   Zero-Downtime Rotation
```

---

## Key Components

### Docker Compose

- **postgres_db**: PostgreSQL 15 with password-based auth
- **app_server**: Node.js application that connects to database
- Health checks on both services

### DSO Configuration (dso.yaml)

- Watches for changes to `postgres/password`
- Rotates both PostgreSQL and app containers
- Uses blue-green swap strategy (zero-downtime)
- Validates health before committing rotation

### Application (app.js)

- Reads password from `/run/secrets/db_password`
- Has `/health` endpoint (DSO uses this for validation)
- Has `/status` endpoint (verify current connection)
- Has `/test` endpoint (verify database writes work)

---

## Documentation

### 📖 expected-behavior.md
**What happens during rotation**
- Startup phase
- Rotation phase
- Post-rotation phase
- Performance expectations

### ✅ verification.md
**How to test the rotation**
- Initial setup checks
- Step-by-step rotation testing
- Exact commands to run
- Success criteria

### ⚠️ failure-scenarios.md
**What happens when things go wrong**
- Provider unavailable
- Health check failures
- Container startup failures
- Agent crashes
- Network issues
- Automatic recovery

### 🔧 troubleshooting.md
**How to fix problems**
- Connection refused
- Authentication failed
- Rotation not starting
- Health check failing
- Quick diagnosis script

---

## Common Questions

### Q: Do we need to restart the application?
**A**: No. Application picks up new password automatically through connection pool refresh.

### Q: What if rotation fails?
**A**: Old password stays active. Application continues working. Rotation retries on next interval.

### Q: How long does rotation take?
**A**: ~5 seconds. Zero downtime during the swap.

### Q: Can we rotate multiple secrets at once?
**A**: Yes. DSO queues them with distributed locking to prevent corruption.

### Q: What if PostgreSQL goes down during rotation?
**A**: DSO detects this and doesn't rotate. Waits for database to recover.

### Q: How do we monitor rotation?
**A**: DSO logs all rotations. See `docker dso logs`. Also watch application health checks.

---

## Testing Scenarios

### Happy Path (5 minutes)
1. Follow Quick Start
2. Trigger rotation
3. Observe zero-downtime swap

### Failure Recovery (10 minutes)
See `failure-scenarios.md`:
- Stop PostgreSQL mid-rotation (recovery)
- Kill DSO agent mid-rotation (checkpoint recovery)
- Disable health endpoint (automatic rollback)

### Troubleshooting (10 minutes)
Intentionally cause issues:
- Wrong password (see how app recovers)
- Provider timeout (see retry logic)
- Invalid health endpoint (see rollback)

---

## Production Deployment

### Configuration Changes

1. **Provider**: Change from `local` to `aws`, `azure`, or `vault`
2. **Polling interval**: Adjust based on security requirements
3. **Health checks**: Customize endpoints for your application
4. **Restart policy**: Use `systemd` instead of manual docker commands

### Security Considerations

- ✅ Passwords never in logs (automatic redaction)
- ✅ Passwords never on disk (encrypted local vault or provider)
- ✅ Database connection timeout (prevent hang attacks)
- ✅ Health check validation (prevent bad rotations)

### Monitoring

- Watch DSO logs: `docker dso logs`
- Export metrics to Prometheus (configure in dso.yaml)
- Alert on failed rotations
- Alert on provider connectivity issues

---

## Next Steps

1. **Try it**: Follow Quick Start above
2. **Watch it**: Monitor rotation in real-time
3. **Break it**: Test failure scenarios (failure-scenarios.md)
4. **Verify it**: Run all verification steps (verification.md)
5. **Deploy it**: Use as template for production

---

## Success Test

After completing this example, you should be able to:

✅ Clone the example  
✅ `docker compose up` successfully  
✅ Trigger credential rotation  
✅ Observe zero-downtime swap  
✅ Verify new credentials active  
✅ Understand failure recovery  
✅ Troubleshoot problems independently  

**If all of these work**, you understand DSO and are ready to deploy it.

---

## Support

**Something not working?**

1. Check `troubleshooting.md` for common issues
2. Review `failure-scenarios.md` to understand recovery
3. Check logs: `docker compose logs` + `docker dso logs`
4. Verify setup: See verification.md

---

## Summary

This example demonstrates:

- ✅ **Production-ready architecture** — Real PostgreSQL + app
- ✅ **Zero-downtime rotation** — Credentials change safely
- ✅ **Automatic recovery** — Failures handled gracefully
- ✅ **Verification** — Exact commands to test everything
- ✅ **Documentation** — Detailed guides for all scenarios

**The goal**: Help you understand DSO well enough to trust it in production.

---

**Ready?** Start with Quick Start above. You'll have zero-downtime credential rotation running in under 5 minutes.

**Questions?** See the documentation files:
- 📖 expected-behavior.md
- ✅ verification.md
- ⚠️ failure-scenarios.md
- 🔧 troubleshooting.md
