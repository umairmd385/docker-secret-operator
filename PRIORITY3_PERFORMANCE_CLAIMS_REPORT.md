# Priority 3 — Performance Claims Audit

**Status**: Identified unverified claims requiring removal

## Unverified Claims (NO Evidence in Codebase)

### ❌ CRITICAL: "<50MB RAM, <5% CPU"
**File**: `src/components/sections/WhyDSO.tsx:32`
**Current**: "Infrastructure Overhead" row: "<50MB RAM, <5% CPU"
**Problem**: 
- No benchmarks in `/dso` main branch
- No performance documentation
- No test results proving these numbers
- Completely fabricated claim
**Action**: REMOVE entirely or replace with conservative wording
**Replacement**: "Lightweight runtime designed for Docker environments"
**Priority**: CRITICAL

### ❌ CRITICAL: "1 hour learning curve"
**File**: `src/components/sections/WhyDSO.tsx:46`
**Current**: "Learning Curve" row: "1 hour - just Docker knowledge"
**Problem**:
- Subjective and unverifiable
- No evidence for "1 hour" claim
- Different users have different curves
**Action**: REMOVE or make aspirational
**Replacement**: "Simple for Docker users; requires basic Docker knowledge"
**Priority**: CRITICAL

---

## Soft Claims (Acceptable with Context)

### ✅ "2-3 seconds" in OperationalPhilosophy
**File**: `src/components/sections/OperationalPhilosophy.tsx:34`
**Current**: "DSO prefers correct state over fast state. Rotation takes 2-3 seconds; that's acceptable."
**Status**: SOFT CLAIM (used to explain philosophy, not marketing)
**Evidence**: 
- `expected-behavior.md` shows actual timelines vary based on health checks
- `failure-scenarios.md` shows rotation timeline context
- Does not make speed claims, emphasizes safety tradeoff
**Action**: Keep but soften if needed
**Optional rewrite**: "Rotation timeline depends on health check duration; safety over speed is our philosophy."
**Priority**: MEDIUM (nice-to-have)

### ✅ "30+ seconds" manual vs DSO
**File**: `src/components/sections/WhyDSO.tsx:26`
**Current**: "Downtime Risk" row, manual: "30+ seconds per rotation"
**Status**: RELATIVE CLAIM (comparing to manual approach, not claiming DSO performance)
**Justification**: This is about manual process overhead (restart time), not a DSO claim
**Action**: Keep
**Priority**: LOW

---

## Documentation References (Correct Use)

These are actual documented timelines with context, not claims:

✅ `src/app/docs/guide/quick-start/page.tsx` - "~30-35 seconds of zero-downtime rotation" (with health check timeout context)
✅ `src/app/docs/guide/production-readiness/page.tsx` - "3–12 seconds" (with context about what varies)
✅ `src/app/docs/guide/LOCAL_MODE_GUIDE/page.tsx` - "~30 seconds" and "5-10 seconds" (with scenario context)

---

## Remediation Plan

### MUST FIX (Tonight)
1. Remove "<50MB RAM, <5% CPU" claim from WhyDSO.tsx
2. Remove "1 hour" learning curve claim from WhyDSO.tsx

### NICE-TO-HAVE (Polish)
3. Soften "2-3 seconds" in OperationalPhilosophy (optional)

### VERIFIED/CORRECT (No changes needed)
- All documentation timing references are accurate and contextualized

---

## Impact

**Removed claims**: 2 major marketing claims
**Build impact**: None
**Credibility impact**: HIGH — removes primary unverified performance claims
**Trust improvement**: Restores honesty about what DSO actually measures
