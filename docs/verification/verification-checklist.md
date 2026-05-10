# DSO Documentation Verification Checklist

**Purpose**: Ensure every documented feature is technically verified, reproducible, and operationally accurate.

**Standard**: Only claims backed by code, tested behavior, or official documentation are documented.

---

## UNIVERSAL VERIFICATION REQUIREMENTS

### For Every CLI Command
- [ ] Command syntax verified against actual CLI source/docs
- [ ] All flags/options tested and working
- [ ] Example output shown with actual output
- [ ] Error cases documented
- [ ] Version compatibility noted (DSO vX.X, Docker vX)

### For Every Configuration
- [ ] YAML structure validated against schema
- [ ] All required fields documented
- [ ] Optional fields clearly marked
- [ ] Default values explicitly stated
- [ ] Type requirements specified

### For Every Code Example
- [ ] Runnable as-is (no pseudo-code)
- [ ] Tested in actual environment
- [ ] Expected output documented
- [ ] Common failure modes noted
- [ ] Prerequisites listed

### For Every Feature Claim
- [ ] Evidence provided (code, docs, tested behavior)
- [ ] Limitations explicitly stated
- [ ] Caveats included
- [ ] Version availability noted
- [ ] Tested reproducibility confirmed

### For Every Security Guarantee
- [ ] Specific mechanism explained
- [ ] Threat model defined
- [ ] Limitations acknowledged
- [ ] Assumptions documented
- [ ] No overstated promises

---

## PROVIDER-SPECIFIC VERIFICATION

### Authentication Methods
**For each auth method (IAM, Managed Identity, AppRole, tokens):**
- [ ] Exact credential chain documented
- [ ] Environment variables or config fields specified
- [ ] Credential storage model explained
- [ ] Rotation/refresh mechanism documented
- [ ] Credential exposure risks acknowledged
- [ ] Example working with real provider
- [ ] Error handling documented

### Secret Retrieval Behavior
**Verify actual runtime behavior:**
- [ ] Initial fetch timing (at container start)
- [ ] Polling interval documented (with default and configurable range)
- [ ] Refresh trigger mechanism (polling, not event-driven)
- [ ] Caching behavior (if any)
- [ ] Network dependency impact
- [ ] Failure handling (container behavior if provider unavailable)
- [ ] Retry logic documented

### Rotation Mechanism
**Critical for accurate documentation:**
- [ ] Polling-based (not event-driven unless actually implemented)
- [ ] Default polling interval (e.g., 2m)
- [ ] Configurable? Min/max values?
- [ ] Rotation trigger workflow
- [ ] Container restart requirements
- [ ] reload_strategy options:
  - [ ] `restart` behavior documented
  - [ ] `signal` (SIGHUP) requirements documented
  - [ ] `rolling` behavior and healthcheck requirements
- [ ] Zero-downtime capability and limitations
- [ ] Timing guarantees (or lack thereof)

### Injection Behavior
**Verify actual injection mechanism:**
- [ ] Only `env` injection documented if that's all that's supported
- [ ] Environment variable injection lifecycle
- [ ] When variables are populated (at startup)
- [ ] When variables are cleared (at shutdown)
- [ ] Memory footprint
- [ ] No file-based injection claims if unsupported
- [ ] Container access method documented

### Security Guarantees
**Every claim must be precisely stated:**
- [ ] Zero-persistence definition (when/where does it apply)
- [ ] Memory-only storage lifecycle
- [ ] Disk avoidance scope (what about logs, history, swap)
- [ ] Cleanup timing at container stop
- [ ] Token/credential handling in memory
- [ ] No promises about application-level leaks
- [ ] Host security dependencies acknowledged

### Deployment Workflow
**Step-by-step verification:**
- [ ] Prerequisites listed and verified
- [ ] Each CLI command tested and syntax verified
- [ ] dso.yaml structure shown with working example
- [ ] Docker Compose integration syntax verified
- [ ] Healthcheck requirement documented
- [ ] Expected behavior at each step
- [ ] Error conditions and troubleshooting

---

## AWS SECRETS MANAGER VERIFICATION

### Authentication
- [ ] IAM role assumption flow documented
- [ ] EC2 instance profile mechanism explained
- [ ] ECS task role mechanism explained
- [ ] Environment variable credentials supported
- [ ] AWS_PROFILE support verified
- [ ] Region configuration
- [ ] MFA/STS token handling (if applicable)

### Secret Retrieval
- [ ] GetSecretValue API call verified
- [ ] DescribeSecret requirements (if any)
- [ ] Polling interval default (should be 2m)
- [ ] Provider unavailability handling
- [ ] Rate limiting handling
- [ ] Tag retrieval and injection (if supported)

### Rotation
- [ ] Polling-based confirmation
- [ ] 2-minute default interval documented
- [ ] Reload strategy options documented
- [ ] Rolling restart healthcheck requirements
- [ ] SIGHUP signal handling (application must support)
- [ ] Container restart behavior

### IAM Permissions
- [ ] Minimum required permissions listed
- [ ] Resource ARN patterns shown
- [ ] Optional permissions documented
- [ ] Example policy provided

### Troubleshooting
- [ ] Common errors documented
- [ ] Debug commands provided
- [ ] CloudTrail audit verification

---

## AZURE KEY VAULT VERIFICATION

### Authentication
- [ ] Managed Identity mechanism
- [ ] System-assigned vs user-assigned
- [ ] Service Principal auth (if supported)
- [ ] Environment variable support
- [ ] AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET (if used)
- [ ] Key Vault authentication flow

### Secret Naming
- [ ] Underscore handling (Azure doesn't allow)
- [ ] Character restrictions
- [ ] Mapping to environment variables

### Rotation
- [ ] Polling mechanism (should be 2m default)
- [ ] Key Vault secret update detection
- [ ] Container update strategy

### RBAC Permissions
- [ ] Managed Identity RBAC roles
- [ ] Key Vault Secrets User role requirements
- [ ] Scope assignment

---

## HASHICORP VAULT VERIFICATION

### Authentication
- [ ] AppRole mechanism (Role ID, Secret ID)
- [ ] Token auth (TTL, renewal)
- [ ] Kubernetes auth (if supported)
- [ ] Response wrapping (if used)
- [ ] Auth method configuration

### Secret Retrieval
- [ ] KV v1 vs KV v2 support
- [ ] Path structure and versioning
- [ ] Token renewal timing
- [ ] Lease handling (if applicable)

### Rotation
- [ ] Polling interval
- [ ] Dynamic secret rotation (if supported)
- [ ] Static secret refresh

### Troubleshooting
- [ ] Auth method debugging
- [ ] Token expiration handling
- [ ] Connectivity issues

---

## LOCAL ENCRYPTED VAULT VERIFICATION

### Initialization
- [ ] Master password mechanism
- [ ] Vault location (~/.dso/vault.enc)
- [ ] AES-256-GCM encryption
- [ ] Key derivation process

### Secret Management
- [ ] docker dso secret set/get commands
- [ ] Secret listing
- [ ] Secret deletion
- [ ] Namespace/project structure

### Usage
- [ ] dso.yaml configuration
- [ ] No provider specification needed
- [ ] Local-only access model

---

## DOCKER COMPOSE INTEGRATION VERIFICATION

### dso:// Reference Syntax
- [ ] Correct format: `dso://secret-name`
- [ ] Provider-specific path handling
- [ ] Mapping to environment variables

### dso.yaml Configuration
- [ ] Required fields documented
- [ ] Provider specification
- [ ] Secrets mapping
- [ ] reload_strategy specification
- [ ] polling_interval configuration

### CLI Commands
- [ ] `docker dso up` (not `docker-compose up`)
- [ ] `docker dso down`
- [ ] `docker dso ps`
- [ ] `docker dso logs`
- [ ] `docker dso inspect`

### Integration Points
- [ ] When secrets are injected (before container start)
- [ ] How provider config is determined
- [ ] Interaction with docker-compose.yaml
- [ ] Volume mounting considerations
- [ ] Network considerations

---

## DOCUMENTATION VERIFICATION STATUS TEMPLATE

```yaml
verification:
  status: "fully_verified" | "partially_verified" | "experimental" | "documentation_only"
  dso_version: "v3.2+"
  docker_engine: "v20.10+"
  provider_version: "current"
  verified_date: "2026-05-XX"
  verified_by: "username"
  last_tested: "2026-05-XX"
  
authentication:
  verified: true
  methods:
    - iam_role: true
    - managed_identity: false  # not tested
    - tokens: true
    
rotation:
  mechanism: "polling"  # not event-driven
  default_interval: "2m"
  configurable: true
  min_interval: "30s"
  max_interval: "unlimited"
  verified: true
  
injection:
  supported_modes:
    - env: true
    - file: false  # not supported
    - socket: false  # not supported
  verified: true

security:
  zero_persistence: true
  memory_only: true
  cleanup_on_stop: true
  verified: true
  
known_limitations:
  - "rotation requires container restart or signal"
  - "polling is approximate, not real-time"
  - "only env injection supported"
```

---

## VERIFICATION WORKFLOW

### Before Publishing Any Guide:
1. **Create verification checklist** for specific provider
2. **Test every command** in actual environment
3. **Document actual behavior** (not assumed)
4. **List all caveats** and limitations
5. **Add verification metadata** with date and version
6. **Get second review** from someone unfamiliar with content
7. **Only then publish** with verification status visible

### Ongoing Maintenance:
- [ ] Re-verify when DSO version changes
- [ ] Re-verify when Docker Engine version changes
- [ ] Re-verify provider behavior changes
- [ ] Update verification date in documentation
- [ ] Flag content as stale if unverified for 6+ months

---

## CRITICAL: DO NOT DOCUMENT UNVERIFIED BEHAVIOR

**Examples of unverified claims to REMOVE:**
- ❌ "Automatic event-driven rotation" (actually polling)
- ❌ "Injects via tmpfs file mount" (only env injection)
- ❌ "Real-time secret updates" (2-minute default polling)
- ❌ "Seamless multi-cloud" (requires dso.yaml changes)
- ❌ "Zero-downtime rotation" (requires rolling strategy + healthcheck)

**Replace with verified claims:**
- ✅ "Polling-based refresh (default 2m, configurable 30s-5m)"
- ✅ "Environment variable injection at container startup"
- ✅ "Refresh detection via hash comparison, not events"
- ✅ "Switch providers by changing dso.yaml and re-deploying"
- ✅ "Rolling updates available with healthcheck, standard restart also supported"

---

## VERIFICATION SUCCESS CRITERIA

Documentation is ready for publication when:
- ✅ Every CLI command tested and syntax verified
- ✅ Every configuration example functional
- ✅ Every code example runnable
- ✅ Every feature claim backed by evidence
- ✅ Every limitation documented
- ✅ Every caveats stated explicitly
- ✅ Verification metadata visible
- ✅ Second reviewer approved
- ✅ Version compatibility clear
