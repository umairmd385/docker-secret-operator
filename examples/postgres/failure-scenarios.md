# Failure Scenarios — How DSO Handles Issues

This document shows what happens when things go wrong and how DSO recovers.

## Scenario 1: Provider Temporarily Unavailable

**Setup**: Secret provider becomes unreachable during rotation

**What Happens**:

1. DSO detects change
2. Attempts to fetch new secret from provider
3. Provider returns error (network timeout, service down)
4. DSO retries with exponential backoff
5. Old password remains active
6. Application continues working
7. Provider comes back online
8. Rotation resumes on next polling interval

**Timeline**:

```
T+0s    Secret change detected
T+5s    Provider fetch attempt → TIMEOUT
T+10s   Retry 1 (backoff 2s)
T+12s   Retry 2 (backoff 4s)
T+16s   Retry 3 (backoff 8s)
T+24s   Provider back online
T+25s   Rotation succeeds
        → Zero downtime, application never affected
```

**Verification**:

```bash
# Simulate provider timeout
# (network partition, for example)

# Application continues working
curl http://localhost:3000/health
# Expected: Still healthy

# Logs show retry attempts
docker compose logs -f dso
# Expected: "Retrying secret fetch" messages

# Once provider recovers, rotation completes automatically
```

**Recovery**: Automatic — no manual intervention needed

---

## Scenario 2: Container Health Check Fails

**Setup**: New container fails health checks during rotation

**What Happens**:

1. New container created with new password
2. Health check fails (application error, timeout, etc.)
3. DSO detects failure
4. New container is terminated
5. Old container continues serving traffic
6. Old password remains active
7. Rotation marked as failed
8. Retry on next polling interval

**Timeline**:

```
T+0s    Rotation starts
T+3s    New container created
T+5s    Health check attempt 1 → FAILED
T+7s    Health check attempt 2 → FAILED
T+9s    Health check attempt 3 → FAILED
T+10s   Max retries exceeded
T+11s   Rollback to old container
T+12s   Application continues normally
        → Zero downtime, automatic rollback
```

**Verification**:

```bash
# Make app unhealthy (simulate bad code)
docker exec app_server kill -9 1  # Kill app process

# Or update dso.yaml health check to fail:
# health_check:
#   endpoint: "http://localhost:3000/nonexistent"

# Trigger rotation
docker dso secret set postgres/password "new_pass_xyz"

# Watch logs - rotation fails and rolls back
docker compose logs -f

# Old container continues (verified by health check)
curl http://localhost:3000/health
# Expected: Still returns 200 (old container still running)

# Fix the application
# Then retry rotation
```

**Recovery Options**:

1. **Automatic retry**: DSO retries on next polling interval
2. **Manual retry**: `docker dso rotate --secret postgres/password`
3. **Check application logs**: Identify why health check failed

---

## Scenario 3: Container Startup Failure

**Setup**: Docker daemon fails to create new container

**What Happens**:

1. DSO attempts to spawn new container
2. Docker returns error (insufficient resources, image not found, etc.)
3. No new container created
4. Old container continues running
5. Zero interruption

**Timeline**:

```
T+0s    Rotation starts
T+2s    Spawn new container → FAILED (error: insufficient memory)
T+3s    DSO detects spawn failure
T+4s    Cleanup (no orphaned container)
T+5s    Old container still running and healthy
        → Zero downtime, automatic handling
```

**Verification**:

```bash
# Simulate container failure
# Update docker-compose.yml with invalid image:
# image: "postgres:99-nonexistent"

# Trigger rotation
docker dso secret set postgres/password "new_pass_xyz"

# Watch logs show spawn failure
docker compose logs -f

# Old container still running
docker compose ps | grep postgres_db
# Expected: Shows old container (postgres_db) still Up

# Fix the issue
# Update image back to valid version
# Retry rotation
```

**Recovery Options**:

1. **Fix root cause**: (e.g., free up disk space, update image)
2. **Automatic retry**: DSO retries on next interval
3. **Manual retry**: `docker dso rotate --secret postgres/password`

---

## Scenario 4: DSO Agent Crash

**Setup**: DSO agent process crashes mid-rotation

**What Happens**:

1. DSO crashes (e.g., panic, out of memory, killed)
2. Checkpoint file persists state on disk
3. Agent restarts (systemd/docker restart policy)
4. Reads checkpoint on startup
5. Evaluates state: was rotation complete?
6. Either completes the rotation or rolls back
7. State guaranteed consistent

**Timeline**:

```
T+0s    Rotation in progress
T+5s    DSO agent crashes
        → Containers remain in current state
T+6s    Agent restarts (automatic)
T+7s    Reads checkpoint from disk
T+8s    Evaluates state
T+9s    Either completes or rolls back
T+10s   Consistent state restored
        → No orphaned containers, no data loss
```

**Verification**:

```bash
# Force DSO to crash (for testing)
# Kill the agent process:
pkill -9 dso

# Application continues (containers still running)
curl http://localhost:3000/health
# Expected: Still healthy

# Restart DSO
dso agent

# Logs show recovery
dso logs
# Expected: "Recovering from checkpoint" messages

# State is consistent, rotation either completed or rolled back
```

**Recovery**: Automatic via checkpoint file — no manual intervention needed

---

## Scenario 5: Network Partition During Rotation

**Setup**: Host loses network connectivity mid-rotation

**What Happens**:

1. Rotation in progress
2. Network partition occurs
3. Old container remains active (serving traffic)
4. New container may be orphaned (unreachable)
5. DSO waits for network recovery
6. On reconnection, proceeds with rotation or rollback

**Timeline**:

```
T+0s    Rotation starts
T+3s    New container created
T+5s    Network partition
        → Old container still running locally
T+10s   Network restored
T+11s   DSO recovers and completes/rolls back
        → Consistent state restored
```

**Verification**:

```bash
# Simulate network partition
# (take network interface down)
sudo ifconfig en0 down

# Application still works (containers local)
curl http://localhost:3000/health
# Expected: Still responds

# Restore network
sudo ifconfig en0 up

# DSO recovers automatically
dso status
# Expected: Shows recovery

# Rotation completes or rolls back safely
```

**Recovery**: Automatic on network restoration

---

## Scenario 6: Disk Full (Out of Space)

**Setup**: Host runs out of disk space during rotation

**What Happens**:

1. New container may fail to start
2. DSO detects failure
3. Cleanup is attempted
4. Old container continues serving traffic
5. No data loss

**Timeline**:

```
T+0s    Rotation starts
T+5s    Spawn new container → FAILED (disk full)
T+6s    DSO detects failure
T+7s    Cleanup attempted
T+8s    Old container continues
        → Zero downtime
```

**Verification**:

```bash
# Check disk space
df -h

# Clear space if needed
docker system prune -a

# Retry rotation
docker dso rotate --secret postgres/password
```

**Recovery**:

1. Free up disk space
2. Retry rotation manually or wait for next interval

---

## Scenario 7: PostgreSQL Becomes Unhealthy

**Setup**: PostgreSQL container crashes or becomes unresponsive

**What Happens**:

1. Health check fails
2. DSO detects PostgreSQL is unhealthy
3. Does NOT rotate while database is down
4. Waits for database to recover
5. Retries rotation once healthy

**Timeline**:

```
T+0s    Rotation starts
T+3s    New container created
T+5s    Health check includes PostgreSQL
T+6s    PostgreSQL is down → Health check FAILED
T+10s   DSO detects PostgreSQL is down
T+11s   Rollback to old state (PostgreSQL still unavailable)
T+30s   PostgreSQL comes back online
T+31s   Retry rotation
        → No data loss, safe handling
```

**Verification**:

```bash
# Stop PostgreSQL
docker stop postgres_db

# Application detects database is down
curl http://localhost:3000/health
# Expected: 503 (Service Unavailable)

# DSO does NOT rotate while DB is down
docker dso status
# Expected: Shows "waiting for database"

# Restart PostgreSQL
docker start postgres_db

# Health check recovers
curl http://localhost:3000/health
# Expected: 200 (Healthy)

# Rotation retries automatically
```

**Recovery**: Automatic once database recovers

---

## Scenario 8: Concurrent Rotation Attempts

**Setup**: Multiple rotation requests happen simultaneously

**What Happens**:

1. First rotation acquires lock
2. Second rotation attempts to acquire lock
3. Second rotation waits (blocked)
4. First rotation completes
5. Lock released
6. Second rotation proceeds
7. Prevents concurrent corruption

**Verification**:

```bash
# Scenario: Two different secrets rotating
# DSO ensures one completes before the next starts

docker dso secret set postgres/password "new_pass_1"
docker dso secret set postgres/password "new_pass_2"

# Logs show lock acquisition/release
dso logs
# Expected: Shows locking and sequential completion
```

**Recovery**: Automatic via distributed locking

---

## Summary: Failure Handling

| Scenario | DSO Response | Downtime | Data Loss | Recovery |
|----------|--------------|----------|-----------|----------|
| Provider unavailable | Retry with backoff | 0 seconds | None | Automatic |
| Health check fails | Rollback | 0 seconds | None | Automatic/Manual |
| Spawn failure | Skip rotation | 0 seconds | None | Automatic |
| Agent crash | Checkpoint recovery | 0 seconds | None | Automatic |
| Network partition | Wait & recover | 0 seconds | None | Automatic |
| Disk full | Fail safely | 0 seconds | None | Manual fix |
| PostgreSQL down | Don't rotate | N/A | None | Automatic |
| Concurrent attempts | Queue with lock | 0 seconds | None | Automatic |

---

## Key Principles

1. **Safety First**: Rather fail than corrupt state
2. **Automatic Recovery**: Checkpoint-based recovery for all scenarios
3. **Zero Downtime**: Old state always remains valid
4. **No Data Loss**: Persistent state ensures consistency
5. **Transparent Logging**: All failures logged for debugging

---

## Testing All Scenarios

To thoroughly test DSO, simulate each scenario:

```bash
# 1. Provider timeout
# (disconnect from provider temporarily)

# 2. Health check failure
# (make app unhealthy)

# 3. Container spawn failure
# (remove Docker socket or image)

# 4. Agent crash
# (kill dso process)

# 5. Network partition
# (disconnect network)

# 6. Disk full
# (fill up disk space)

# 7. PostgreSQL down
# (stop postgres_db)

# 8. Concurrent rotations
# (trigger multiple at once)
```

---

## Next Steps

- ✅ **Read this**: Understand failure modes
- ✅ **Test each**: Simulate scenarios and observe recovery
- ✅ **Trust DSO**: It's designed to handle failures gracefully
- ✅ **Monitor**: Use logs to understand what's happening
- ✅ **Move forward**: DSO has you covered

**Bottom line**: DSO is built for real-world failures. It prioritizes safety and consistency over speed. Your data and your running services are always protected.
