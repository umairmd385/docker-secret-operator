# HashiCorp Vault Provider Validation Report
**Status**: UNDER VERIFICATION  
**Started**: 2026-05-10  
**Target Completion**: 2026-05-12  

---

## CRITICAL ERRORS FOUND IN SEO CONTENT

### ❌ ERROR #1: INCORRECT CLI INITIALIZATION SYNTAX

**Claimed in SEO Content** (Line 158-172):
```bash
docker dso init --mode cloud \
  --provider vault \
  --vault-address https://vault.example.com:8200 \
  --vault-auth-method approle \
  --vault-role-id a1b2c3d4-... \
  --vault-secret-id e5f6g7h8-...
```

**Official Documentation** (`/docs/guide/providers/vault.md` Line 12-18):
```yaml
provider: vault
config:
  address: "http://vault.example.com:8200"
  mount: "secret"
  token: "s.xxxxxxx"
```

**Reality**: 
- No `docker dso init --mode cloud` command exists
- Configuration is via `dso.yaml`, not CLI flags
- Cloud Mode is auto-detected from dso.yaml content

**Status**: ❌ COMPLETELY WRONG - Must be rewritten

---

### ❌ ERROR #2: FALSE TMPFS INJECTION CLAIM

**Claimed in SEO Content** (Line 62):
> "When container starts, DSO fetches secrets from Vault and injects via tmpfs"

**Official Documentation** (`/docs/guide/configuration.md`):
> "DSO currently supports one primary injection mode: **`env`**: Secrets are held in the agent's memory and pushed into the container's environment space."

**Reality**:
- Only ENV injection is supported
- No tmpfs injection documented
- No "provides via file descriptor" mechanism

**Status**: ❌ INCORRECT - Overstates injection capabilities

---

### ❌ ERROR #3: OVERSTATED AUTOMATIC ROTATION

**Claimed in SEO Content** (Line 66):
> "When Vault rotates dynamic secrets, DSO automatically refreshes in-memory copy without container restart"

**Official Documentation** (`/docs/guide/architecture.md`):
> "Provider Stream: Performs **periodic polling/long-polling** of cloud secret managers"

**Official Documentation** (`/docs/guide/providers/vault.md` Line 43):
> "DSO will automatically renew short-lived Vault tokens before they expire mid-rotation cycle"

**Reality**:
- Rotation is polling-based (default 2 minutes), NOT event-driven
- Token renewal is automatic, but SECRET rotation requires reload_strategy
- Container may need restart depending on reload_strategy (not "without restart")
- Dynamic secrets require Vault configuration and have different TTL semantics than static secrets

**Status**: ❌ FUNDAMENTALLY MISREPRESENTS BEHAVIOR

---

### ❌ ERROR #4: UNSUPPORTED CLI FLAGS

**Claimed in SEO Content** (Line 158-163):
```
--vault-address https://vault.example.com:8200
--vault-auth-method approle
--vault-role-id a1b2c3d4-...
--vault-secret-id e5f6g7h8-...
```

**Official Docs** (`/docs/guide/cli-system.md`):
- Only supports: `--providers`, `--all`, `--no-verify`
- No Vault-specific flags documented

**Reality**: These flags don't exist in `docker dso system setup`

**Status**: ❌ INVALID SYNTAX - Will fail if user runs this command

---

### ⚠️ ERROR #5: INCOMPLETE ROTATION CONFIGURATION

**Claimed in SEO Content**: No examples shown of `reload_strategy`

**Official Docs** (`/docs/guide/examples.md`):
```yaml
rotation: true
reload_strategy:
  type: signal
  signal: SIGHUP
```

**Missing from Content**:
- NO reload_strategy defined in examples
- NO explanation of restart vs rolling vs signal
- NO mention of what happens during dynamic secret rotation

**Status**: ⚠️ DANGEROUSLY INCOMPLETE

---

### ⚠️ ERROR #6: OVERSTATED DYNAMIC SECRETS SUPPORT

**Claimed in SEO Content** (Line 57-58, 65-66):
> "DSO supports both. Dynamic secrets are short-lived (generated on-demand); static secrets are user-managed."
> "When Vault rotates dynamic secrets, DSO automatically refreshes..."

**Official Docs** (`/docs/guide/providers/vault.md`):
> "DSO will automatically renew short-lived Vault tokens before they expire"

**Reality**:
- DSO handles TOKEN renewal automatically
- But dynamic secret rotation is polling-based (not automatic immediate)
- Dynamic secrets have different semantics than static secrets
- Vault requires specific role configuration for dynamic secrets
- Not clearly explained in DSO docs what "support" means for dynamic secrets

**Status**: ⚠️ OVERSTATED - Actual dynamic secret behavior not well documented

---

## AUTHENTICATION VERIFICATION

### Token Authentication
**Claim to verify**: Token-based authentication works

**Official Source**: `/docs/guide/providers/vault.md` Line 34-35
```bash
export VAULT_TOKEN=s.xxxxxxxx
```

**Verification Tasks**:
- [ ] Test token authentication
- [ ] Verify token TTL handling
- [ ] Test token renewal mechanism
- [ ] Document error handling if token expired

**Test Results** (pending):
```
Token Auth: [PENDING]
Token TTL: [PENDING]
Token Renewal: [PENDING]
Expiration Handling: [PENDING]
```

---

### AppRole Authentication
**Claim to verify**: AppRole auth method works

**Official Source**: `/docs/guide/providers/vault.md` Line 37-39
```bash
export VAULT_ROLE_ID=...
export VAULT_SECRET_ID=...
```

**Verification Tasks**:
- [ ] Test AppRole authentication
- [ ] Verify Role ID and Secret ID loading
- [ ] Test Secret ID renewal
- [ ] Document Vault AppRole configuration requirements

**Test Results** (pending):
```
AppRole Auth: [PENDING]
Role ID Loading: [PENDING]
Secret ID Renewal: [PENDING]
Policy Requirements: [PENDING]
```

---

### Authentication Method Precedence
**Claim to verify**: Which auth method takes precedence

**Verification Tasks**:
- [ ] Test token vs AppRole precedence
- [ ] Verify environment variable loading order
- [ ] Document which method is tried first

**Test Results** (pending):
```
Auth Precedence: [PENDING]
Env Var Order: [PENDING]
Fallback Behavior: [PENDING]
```

---

## SECRET RETRIEVAL VERIFICATION

### KV Engine Support
**Claim to verify**: KV v1 vs KV v2 support

**Official Source**: `/docs/guide/providers/vault.md` Line 20, 25
```yaml
mount: "secret"  # KV mount path
name: my-app/db-password   # Path within the mount
name: my-app/api-key?version=3 # KV v2 version pinning
```

**Verification Tasks**:
- [ ] Test KV v1 secret retrieval
- [ ] Test KV v2 secret retrieval
- [ ] Test version pinning (KV v2)
- [ ] Verify metadata handling

**Test Results** (pending):
```
KV v1 Support: [PENDING]
KV v2 Support: [PENDING]
Version Pinning: [PENDING]
Metadata Handling: [PENDING]
```

---

### JSON Field Extraction
**Claim to verify**: Extracting JSON fields from secrets

**Official Source**: `/docs/guide/providers/vault.md` Line 22-23
```yaml
mappings:
  password: DB_PASSWORD    # Map JSON key 'password' -> Env Var
```

**Verification Tasks**:
- [ ] Test JSON secret retrieval
- [ ] Test field extraction (password, username, etc.)
- [ ] Test nested JSON handling
- [ ] Document required JSON structure

**Test Results** (pending):
```
JSON Parsing: [PENDING]
Field Extraction: [PENDING]
Nested Fields: [PENDING]
Error Handling: [PENDING]
```

---

### Polling Interval and Behavior
**Claim to verify**: Polling-based refresh (default 2m)

**Verification Tasks**:
- [ ] Confirm default is 2 minutes
- [ ] Test changing polling_interval
- [ ] Measure actual polling frequency
- [ ] Test with Vault unavailable

**Test Results** (pending):
```
Default interval: [PENDING - expected 2m]
Configurable: [PENDING]
Actual timing: [PENDING]
Unavailability behavior: [PENDING]
```

---

## TOKEN RENEWAL VERIFICATION

### Vault Token TTL Handling
**Claim to verify**: "DSO will automatically renew short-lived Vault tokens"

**Official Source**: `/docs/guide/providers/vault.md` Line 43
> "DSO will automatically renew short-lived Vault tokens before they expire mid-rotation cycle"

**Verification Tasks**:
- [ ] Test token renewal at TTL threshold
- [ ] Verify renewal happens before expiration
- [ ] Test error if renewal fails
- [ ] Document renewal timing

**Test Results** (pending):
```
Token Renewal: [PENDING]
Renewal Timing: [PENDING]
Failure Handling: [PENDING]
Mid-Cycle Behavior: [PENDING]
```

---

## ROTATION VERIFICATION

### Rotation Mechanism
**Claim to verify**: Polling-based, not event-driven

**What to test**:
- [ ] Update static secret in Vault
- [ ] Measure detection timing
- [ ] Verify no webhook/event dependency
- [ ] Test reload_strategy execution

**Test Results** (pending):
```
Polling confirmed: [PENDING]
Event-driven used: [PENDING - expected NO]
Detection timing: [PENDING - expected ~2m+]
Reload strategy: [PENDING]
```

---

### Dynamic Secrets Rotation
**Claim to verify**: How dynamic secrets are handled

**What to test**:
- [ ] Configure dynamic database role
- [ ] Test dynamic credential retrieval
- [ ] Test rotation/refresh behavior
- [ ] Document TTL handling

**Test Results** (pending):
```
Dynamic Secret Retrieval: [PENDING]
Credential Rotation: [PENDING]
TTL Handling: [PENDING]
Lease Renewal: [PENDING]
```

---

## INJECTION BEHAVIOR VERIFICATION

### Environment Variable Injection
**Claim to verify**: Only environment variable injection supported

**Official Source**: `/docs/guide/configuration.md`
> "DSO currently supports one primary injection mode: **`env`**"

**Verification Tasks**:
- [ ] Confirm only `env` mode exists
- [ ] Test environment variable creation
- [ ] Verify variable names match mappings
- [ ] Test JSON field mapping

**Test Results** (pending):
```
Env injection only: [PENDING]
Variable creation: [PENDING]
Mapping accuracy: [PENDING]
JSON field mapping: [PENDING]
```

---

## SECURITY VERIFICATION

### Zero-Persistence Claim
**Claim to verify**: Secrets never written to disk

**Specific to test**:
- [ ] No .env files created
- [ ] No logs contain secrets
- [ ] No Docker image layers contain secrets
- [ ] Tokens not persisted

**Test Results** (pending):
```
Disk persistence: [PENDING - expected ZERO]
Logs contain secrets: [PENDING - expected NO]
Image layers: [PENDING - expected ZERO]
Token persistence: [PENDING - expected NO]
```

---

### Vault Audit Log
**Claim to verify**: Vault audit logs record all secret access

**Test Results** (pending):
```
GetSecret logged: [PENDING]
Caller identity: [PENDING]
Timestamp accuracy: [PENDING]
```

---

## CODE EXAMPLE VALIDATION

### Example 1: AppRole Configuration
**Test Status**: [PENDING]
```bash
vault auth enable approle
vault write auth/approle/role/dso-role \
  token_ttl=1h \
  token_max_ttl=4h
```

### Example 2: Vault Policy
**Test Status**: [PENDING]
```hcl
path "secret/data/app/*" {
  capabilities = ["read", "list"]
}
```

### Example 3: DSO Configuration
**Test Status**: [PENDING]
```yaml
provider: vault
config:
  address: "http://vault.example.com:8200"
  mount: "secret"

secrets:
  - name: my-app/database-password
    inject: env
    rotation: true
    reload_strategy:
      type: restart
    mappings:
      password: DB_PASSWORD
```

Expected: Works as documented

---

## DOCUMENTATION ISSUES FOUND

### Critical Issues Requiring Correction
1. **CLI Syntax** - Current guides claim `docker dso init --mode cloud --provider vault`
   - Reality: Configuration via dso.yaml only
   - Status: NEEDS FIX

2. **Injection Method** - Current guides mention "tmpfs injection"
   - Reality: Environment variable only
   - Status: NEEDS FIX

3. **Rotation Behavior** - Current guides claim "without container restart"
   - Reality: Depends on reload_strategy
   - Status: NEEDS FIX

4. **Dynamic Secrets** - Unclear what "support" means
   - Status: NEEDS CLARIFICATION

---

## NEXT STEPS

1. Complete all PENDING tests
2. Document actual behavior observed
3. Identify all corrections needed for Vault guide
4. Rewrite Vault guide with verified information
