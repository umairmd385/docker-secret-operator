# PostgreSQL Credential Rotation — Expected Behavior

This document describes what you should observe when running this DSO example.

## Architecture

```
Secret Backend (Local Vault / AWS / Azure / Vault)
           ↓
        DSO Agent
           ↓
    detects change
           ↓
  PostgreSQL + App
  (Blue-Green Swap)
           ↓
  Zero Downtime
```

---

## Startup Phase (Seconds 0-10)

### What Happens

1. **Containers start**: PostgreSQL initializes, App connects
2. **DSO watches**: Agent starts monitoring for secret changes
3. **Initial connection**: App successfully connects to PostgreSQL with initial password

### What You'll See

```bash
$ docker compose up
...
postgres_db    | [1] LOG:  database system is ready to accept connections
app_server     | [APP] Database connection pool initialized
app_server     | [APP] Server running on http://localhost:3000
app_server     | [APP] Ready for database credential rotation
```

### Verify Initial State

```bash
# Health check passes
curl http://localhost:3000/health
# Response: {"status":"healthy","database":"connected","timestamp":"..."}

# Status shows current user
curl http://localhost:3000/status
# Response: {"status":"connected","database_user":"appuser","server_time":"..."}
```

---

## Rotation Phase (When Secret Changes)

### What Happens

1. **DSO detects change** (polling interval, ~60 seconds or manual trigger)
2. **New secret retrieved** from provider
3. **New password written** to `/run/secrets/db_password`
4. **PostgreSQL container swapped**:
   - New container spawned with new password
   - Health checks pass
   - Traffic atomically switches to new container
   - Old container stops
5. **App container health verified**
   - App still healthy (connection pool recovers)
   - No requests dropped
6. **Rotation complete** — new password now active

### Timeline (Total: ~5-10 seconds)

```
T+0s    Change detected
T+1s    New password available
T+2s    PostgreSQL rotates (new container healthy)
T+3s    App continues without interruption
T+4s    Cleanup complete
T+5s    Ready for next rotation
```

### What You'll See in Logs

```
# DSO Agent logs
[DSO] Secret change detected: postgres/password
[DSO] Acquiring rotation lock
[DSO] Starting rotation for postgres_db
[DSO] New container healthy (passed 3 health checks)
[DSO] Swapping containers (atomic)
[DSO] Cleaning up old container
[DSO] Rotation complete (5.2 seconds)

# App logs
[APP] Health check passed
[APP] Connection pool reinitializing
[APP] Database connection pool initialized
[APP] Status: Connected as appuser
```

### Verify During Rotation

The application continues responding even during credential rotation:

```bash
# In one terminal, continuously check health
watch curl http://localhost:3000/health

# In another terminal, trigger a rotation
# (see verification.md for how to manually trigger)
```

You should see:
- ✅ Health checks continue to pass
- ✅ No failed requests
- ✅ No "connection refused" errors
- ✅ New password is now active

---

## Post-Rotation Phase

### New Password Active

1. All containers using the new password
2. Old password no longer valid
3. DSO ready for next rotation

### Verify New Password

```bash
# Insert test record (verifies write access with new password)
curl -X POST http://localhost:3000/test

# Status shows successful connection
curl http://localhost:3000/status
```

---

## Key Observations

### ✅ What Should Work

| Behavior | Result |
|----------|--------|
| **Health checks** | Always pass (before, during, after) |
| **Requests** | Never dropped during rotation |
| **Connection pool** | Recovers automatically |
| **Database writes** | Work with new password |
| **Application restart** | Not required |
| **Downtime** | Zero (no interruption) |

### ⚠️ What You Might Observe

| Event | Normal? | Why? |
|-------|---------|------|
| Brief connection spike | Yes | App reconnects with new password |
| Container restart | Yes | Only old container removed |
| Health check delay | Yes | New container takes ~3 seconds to be ready |
| Log messages about reconnect | Yes | Connection pool reinitializes |

### ❌ What Should NOT Happen

| Problem | If It Happens | Solution |
|---------|---------------|----------|
| Application errors | No | Check failure scenarios |
| Dropped requests | No | Check health checks |
| Failed rotation | No | Check troubleshooting guide |
| Database unavailable | No | Verify PostgreSQL health |
| Connection refused | No | Check dso.yaml configuration |

---

## Real-World Scenario

### The Classic Problem (Without DSO)

```
1. Old password expires
2. Manual password rotation: database updated, config changed
3. Application crashes (using old password)
4. 5+ minutes of downtime
5. Monitoring alarms
6. Manual fix required
```

### With DSO (This Example)

```
1. Old password expires
2. Update secret in backend (5 seconds)
3. DSO detects change (~60 seconds)
4. Zero-downtime rotation (5 seconds)
5. No downtime, no alarms, no manual intervention
6. Application continues serving requests
```

---

## Performance Expectations

| Metric | Expected | Actual |
|--------|----------|--------|
| Rotation time | < 10 seconds | ~5 seconds |
| Request latency | < 100ms | Unchanged during rotation |
| Health check downtime | 0ms | 0ms (zero-downtime) |
| Database connection time | < 5s | ~2 seconds |

---

## Monitoring

Watch these in real-time during rotation:

```bash
# Terminal 1: Monitor logs
docker compose logs -f

# Terminal 2: Health checks
watch curl -s http://localhost:3000/health | jq .

# Terminal 3: Connection status
watch curl -s http://localhost:3000/status | jq .

# Terminal 4: Trigger rotation (when ready)
# (see verification.md)
```

---

## Next Steps

1. ✅ **Verify startup** (see verification.md)
2. ✅ **Trigger rotation** (see verification.md)
3. ✅ **Observe zero-downtime** (watch logs + health checks)
4. ✅ **Test failure scenarios** (see failure-scenarios.md)
5. ✅ **Understand recovery** (see troubleshooting.md)

---

## Summary

This example demonstrates:
- ✅ PostgreSQL credentials rotating without downtime
- ✅ Application continues serving requests
- ✅ Automatic connection pool recovery
- ✅ No manual intervention required
- ✅ Production-ready behavior

If all of the above works as expected, DSO is doing exactly what it should.
