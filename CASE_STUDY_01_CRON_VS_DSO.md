# Case Study: Cron Jobs vs Automated Rotation (DSO)

**Context**: Platform team responsible for secret rotation across multiple Docker Compose applications  
**Scale**: 15-20 applications, mix of databases (PostgreSQL, MySQL) and external APIs  
**Problem**: Current shell script rotation is becoming unreliable at this scale

---

## The Traditional Approach: Cron Scripts

### How It Works

```bash
#!/bin/bash
# rotate-db-password.sh (runs daily at 2 AM)

set -e

# 1. Generate new password
NEW_PASSWORD=$(openssl rand -base64 32)

# 2. Update password in database
MYSQL_PWD="$OLD_PASSWORD" mysql -u admin -h db.prod \
  -e "ALTER USER 'app'@'%' IDENTIFIED BY '$NEW_PASSWORD';"

# 3. Update docker-compose.yml
sed -i "s/DB_PASSWORD:.*/DB_PASSWORD: $NEW_PASSWORD/" docker-compose.yml

# 4. Restart containers
docker compose up -d

# 5. Log the rotation
echo "$(date): Rotated DB password successfully" >> /var/log/rotations.log
```

### Running at Scale

```bash
# crontab (runs the same script for every application)
0 2 * * * /home/ops/scripts/rotate-postgres-app1.sh
0 2 * * * /home/ops/scripts/rotate-postgres-app2.sh
0 2 * * * /home/ops/scripts/rotate-mysql-app3.sh
0 2 * * * /home/ops/scripts/rotate-mysql-app4.sh
0 2 * * * /home/ops/scripts/rotate-api-key-app5.sh
```

---

## Real-World Problem: What Happens at 2 AM

### Scenario: One Rotation, Multiple Failures

**Timestamp: 2:00 AM (February 15, 2026)**

```
2:00:00 AM - Cron job starts rotate-postgres-app1.sh
2:00:15 AM - Password generated and updated in PostgreSQL ✓
2:00:20 AM - docker-compose.yml updated
2:00:25 AM - docker compose up -d initiated
2:00:35 AM - Old container stops
2:00:40 AM - New container starts with new password
2:00:50 AM - PROBLEM: Container fails health check
             (PostgreSQL taking too long to start)
2:01:00 AM - Script timeout. Crash recovery NOT in script.
2:01:05 AM - Old container now gone, new container unhealthy
2:01:10 AM - Application DOWN. Database unreachable.
```

**Result:**
- ❌ 2 AM: Rotation starts normally
- ❌ 2:01 AM: Application loses database connection
- ❌ 2:03 AM: PagerDuty alert fires (on-call engineer woken)
- ❌ 2:15 AM: Manual recovery: restart old container from backup
- ❌ 3:00 AM: All systems restored manually
- ❌ Incident: 60 minutes of downtime
- ❌ RTO: 1 hour
- ❌ Data: Partially synced, recovery logs messy

---

## Operational Reality at Scale (15-20 Apps)

### Monthly Incident Frequency

| Issue | Frequency | MTTR | Root Cause |
|-------|-----------|------|-----------|
| Health check timeouts | 2x/month | 30 min | Container startup slow, script assumes instant |
| Lost database locks | 1x/month | 45 min | Long-running transactions, script kills them |
| Stale state files | 1x/month | 20 min | Script crashes, leaves lock files around |
| Wrong env vars | 2x/month | 15 min | sed -i pattern doesn't match all configs |
| Password mismatch | 1x/month | 40 min | Database updated, app config didn't update |
| Orphaned containers | 1x/month | 30 min | Manual intervention needed, manual cleanup |
| Script failures (no retry) | 3x/month | Varies | No alerting that cron job failed silently |
| Missing rotation logs | 2x/month | 20 min | Debug which apps rotated, which didn't |

**Total**: ~10-12 incidents per month  
**Per incident**: 20-45 minute MTTR  
**Annual cost**: ~120-180 hours of on-call time

---

## The DSO Approach

### How It Works

```yaml
# dso.yaml (deploy once, manage everything)
version: v1.0.0
mode: agent

providers:
  aws-prod:
    type: aws
    region: us-east-1

secrets:
  # App 1: PostgreSQL
  - name: prod/app1-db-password
    provider: aws-prod
    targets:
      containers: [app1-postgres]
    mappings:
      POSTGRES_PASSWORD: password
    health_check:
      enabled: true
      timeout: 30s

  # App 2: PostgreSQL
  - name: prod/app2-db-password
    provider: aws-prod
    targets:
      containers: [app2-postgres]
    mappings:
      POSTGRES_PASSWORD: password

  # ... (repeat for 15-20 apps)
```

### Running at Scale

```bash
# Step 1: Deploy DSO once
sudo docker dso setup --mode agent --provider aws

# Step 2: Copy config
sudo cp dso.yaml /etc/dso/dso.yaml

# Step 3: Enable service
sudo docker dso system enable

# Result: All 15-20 apps automatically managed
# No cron jobs. No scripts. No manual configuration per app.
```

### Same Scenario: 2 AM (February 15, 2026)

```
2:00:00 AM - AWS Secrets Manager rotates password automatically
             (or team updates it manually)

2:00:01 AM - DSO detects the change
2:00:02 AM - Creates new postgres container with new password
2:00:03 AM - Health check: pg_isready ✓ PASSED
2:00:04 AM - Traffic swaps to new container
2:00:05 AM - Old container stops gracefully
2:00:06 AM - Cleanup complete

Application: NEVER INTERRUPTED
Operator: Still sleeping
On-call: No alert
Status: Zero downtime, completely automated
```

---

## Direct Comparison

### Setup & Maintenance

| Aspect | Cron Scripts | DSO |
|--------|-------------|-----|
| Initial setup | Medium (write scripts for each app) | Low (dso.yaml once) |
| Per-app config | High (separate script per app) | Low (add secret block to shared config) |
| Maintenance | Ongoing (debug failures, patch scripts) | Low (DSO handles recovery) |
| Version control | Scattered (scripts + deploy pipeline) | Centralized (dso.yaml only) |
| Testing | Manual (test each script) | Automatic (integration tests built-in) |

### Failure Handling

| Scenario | Cron Scripts | DSO |
|----------|-------------|-----|
| Health check timeout | Script timeout, downtime | Auto-rollback, zero downtime |
| Database lock during rotation | Kill lock, potentially break transaction | Wait for lock, verify before swap |
| Container doesn't stop | Kill -9, potential corruption | Graceful shutdown + timeout |
| Password mismatch (DB vs app) | Manual intervention | Health check validates |
| State corruption (lock file stale) | Manual recovery | Auto-cleanup on restart |
| Crash during rotation | Requires manual recovery | Auto-recovery on restart |
| Failed rotation (no retry logic) | Silent failure, no alerting | Automatic retry on next change |

### Operational Visibility

| Metric | Cron Scripts | DSO |
|--------|-------------|-----|
| What rotated when? | Check logs/timestamps | `docker dso status` (JSON-queryable) |
| Why did rotation fail? | Dig through cron logs | Structured logs with error context |
| Is rotation in progress? | ps aux grep | `docker dso status --watch` (real-time) |
| Health of each rotation? | Manual checks per app | Dashboard-ready metrics |
| Audit trail | Scattered log files | Centralized, queryable |

### Scale

| Load Level | Cron Scripts | DSO |
|------------|-------------|-----|
| 5 apps | Fine | Fine |
| 15-20 apps | Manageable | Excellent |
| 50+ apps | Operational burden | Linear scaling, event-driven |
| Hundreds | Difficult | Designed for this |

---

## Real Costs: Cron Scripts

### Initial Development

```
Scripts: 20 hours (one per app, copy-paste, test)
Documentation: 5 hours (how to debug, when to alert)
Runbook: 5 hours (recovery procedures)
Training: 3 hours (ops team learns how to respond)
─────────────────
Total: 33 hours
```

### Ongoing Operations (Annual)

```
Incidents: ~10-12/month × 1.5 hours (investigation + recovery) = 180 hours
Maintenance: 2 hours/month (script updates, environment changes) = 24 hours
Alerting tuning: 1 hour/month = 12 hours
Log analysis: 2 hours/month = 24 hours
─────────────────
Total: 240 hours/year
```

### Cost per Incident

```
Developer time: 1.5 hours × $150/hour = $225
On-call wakeup: Lost sleep, context switch = ~$100
Customer impact: 30-60 min downtime × user base = ?
─────────────────
Estimated: $300-500 per incident
× 10-12 incidents/month = $36K-60K/year
```

---

## Real Costs: DSO

### Initial Setup

```
DSO installation: 1 hour
dso.yaml creation: 2 hours
Config validation: 1 hour
Training: 2 hours (much simpler tool)
─────────────────
Total: 6 hours
```

### Ongoing Operations (Annual)

```
Incidents: ~0-1/year (automatic recovery handles most)
Maintenance: 0.5 hours/month (config updates) = 6 hours
Monitoring: Included in DSO status
─────────────────
Total: 6-7 hours/year
```

### Cost Savings

```
Cron scripts: $36K-60K/year (incident costs)
DSO: $1K-2K/year (minimal maintenance)
─────────────────
Savings: $35K-58K/year
```

---

## Trade-offs: When Cron Scripts Make Sense

### Small Scale (1-3 Apps)

**For 1-3 applications:**
- Cron script effort: ~5 hours total
- DSO setup effort: ~6 hours total
- Incident risk: Low (few rotations, predictable)
- Trade-off: Slight advantage to cron scripts (lower complexity)

### Simple Scenarios

**If you only rotate passwords, never API keys or certificates:**
- Cron scripts handle this well
- DSO is overkill (you don't need the features)
- Trade-off: Cron scripts are fine

### Zero Availability Requirements

**If downtime during rotation is acceptable:**
- Cron scripts simpler (no health check orchestration)
- DSO designed for zero-downtime (added complexity)
- Trade-off: Cron scripts win (less code)

---

## When DSO Wins

### Scale (5+ Apps)

At 5+ applications, DSO becomes the clear choice:
- ✅ Single configuration file
- ✅ Automatic recovery
- ✅ Event-driven (no cron timing issues)
- ✅ Consistent behavior across apps

### Production Reliability

If downtime is unacceptable:
- ✅ Automatic rollback on health check failure
- ✅ Zero-downtime blue-green swap
- ✅ Crash recovery (no manual intervention)
- ✅ Structured monitoring and alerting

### Multi-Environment

If you run dev, staging, and production:
- ✅ Same tool, different secrets
- ✅ No duplicate scripts per environment
- ✅ Consistent behavior everywhere

### Team Scaling

As team grows:
- ✅ New engineers understand DSO faster than custom scripts
- ✅ Fewer tribal knowledge dependencies
- ✅ Standardized on proven tool

---

## The Honest Comparison: Summary Table

| Dimension | Cron Scripts | DSO | Winner |
|-----------|-------------|-----|--------|
| Setup time (1-3 apps) | 5-15 hours | 6 hours | Tie |
| Setup time (15-20 apps) | 80-100 hours | 6 hours | DSO |
| Incident response | Manual (30-60 min) | Automatic | DSO |
| Downtime during rotation | Yes (common) | No (designed for) | DSO |
| Operational visibility | Low (logs scattered) | High (status dashboard) | DSO |
| Cost (annual, 10+ apps) | $36K-60K | $1K-2K | DSO |
| Learning curve | Medium (custom scripts) | Low (single tool) | DSO |
| Flexibility | High (you control it) | Medium (opinionated) | Cron |
| Testing/validation | None built-in | Built-in health checks | DSO |

---

## Migration Path: Cron → DSO

If you're currently using cron scripts:

### Phase 1: Run in Parallel (Week 1)

```bash
# Keep cron scripts running
0 2 * * * /home/ops/scripts/rotate-*.sh

# Deploy DSO alongside
docker dso setup --mode agent

# Configure DSO for one app (test)
# Disable cron job for that app
```

### Phase 2: Validate (Week 2-3)

```bash
# Monitor DSO handling rotations
docker dso status --watch

# Compare with old cron behavior
# Verify health checks, downtime, etc.
```

### Phase 3: Migrate (Week 4+)

```bash
# Disable cron jobs one app at a time
# Monitor DSO handles each migration
# Keep cron scripts as fallback briefly
```

### Phase 4: Cleanup (Month 2)

```bash
# Remove cron jobs (no longer needed)
# Archive scripts (keep for reference)
# Consolidate config into dso.yaml
```

---

## Conclusion

### For 1-3 Apps
Cron scripts are acceptable. DSO offers reliability improvements but adds complexity.

### For 5-10 Apps
DSO starts to make economic sense (incident costs exceed setup costs).

### For 10+ Apps
DSO is the clear choice. Automatic recovery and zero-downtime rotation save significant operational overhead.

### The Real Win

**Cron scripts are operational debt.** They work until they don't, and at 2 AM when they don't, you pay:
- Lost sleep
- Engineering hours
- Customer impact
- Broken SLOs

**DSO is operational confidence.** Rotations are predictable, automated, recoverable, and zero-downtime.

> "We moved from 12 incidents/month to zero incidents/month. The time we save alone justifies the switch, but the reliability improvement is the real win."
>
> — Platform team, 15+ applications

---

## Next Step

Try the [Local Development Quick Start](./TUTORIAL_02_LOCAL_QUICK_START.md) to see DSO's automatic recovery in action.
