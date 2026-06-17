# Priority 4 — Installation Trust & Security Audit

**Status**: Identified curl|bash patterns requiring security context

## Curl|Bash Pattern Analysis

### Issue 1: Homepage InstallationSimple - No Security Context
**File**: `src/components/sections/InstallationSimple.tsx:25`
**Current**: Shows quick install as first option
```
curl -fsSL https://dso.sh/install | bash
```
**Problem**:
- No mention of verification options
- No link to Deploy page with safer alternatives
- Position implies this is the "easy/recommended" path
- No security guidance before copy-to-clipboard

**Context**: 
- Homepage should funnel to Deploy page
- Deploy page SHOULD have verification/checksum options
- User reads "first command" without understanding trust implications

**Fix Strategy**:
1. Keep the quick path but ADD context: "Quick (not recommended for production)"
2. Link text to Deploy page for "Secure Installation"
3. Reorder to show "Recommended" first
4. Add security note below command

---

### Issue 2: Deploy Page Expected Behavior
**What should happen**:
- Deploy page should show 3 installation paths:
  1. **Recommended**: Checksum verification
  2. **Quick**: curl|bash (for local dev)
  3. **Manual**: Download, inspect, run

**What we need to verify**:
- Does Deploy page have these options?
- Are they clearly labeled?
- Is checksum verification documented?

---

## CTA Audit

### ✅ Hero Section
**File**: `src/components/sections/Hero.tsx:112`
**Current**: "Deploy DSO" button → links to Deploy page
**Status**: CORRECT ✅
- Not directly showing curl|bash
- Funnels to proper installation page

### ⚠️ InstallationSimple Section  
**File**: `src/components/sections/InstallationSimple.tsx`
**Current**: Shows quick commands with copy-to-clipboard
**Status**: NEEDS SECURITY LABEL
**Fix**:
- Add label: "⚠️ Quick install (local development)"
- Add secondary CTA: "Production? See Deploy page for verified install"
- Reorder paths

### ✅ Footer & Navbar Links
**Status**: Links go to Deploy page or Docs
**No fix needed**

---

## Installation Path Verification

### Expected Pattern (from CLAUDE.md rules)
```
Homepage
  ↓
Deploy Page
  ↓
Recommended Install (with checksums)
  ↓
Verify + Install
  ↓
DSO Running
```

### Current Pattern
```
Homepage (InstallationSimple)
  ├─ Shows quick curl|bash
  ├─ No security context
  └─ "View Full Documentation" → GitHub

Hero Button
  └─ "Deploy DSO" → Deploy Page
```

---

## Documentation Curl|Bash References

### Status: ACCEPTABLE
These are in documentation pages where context is clear:
- `src/app/docs/guide/docker-plugin/page.tsx` - In plugin install guide (context-specific)
- `src/app/docs/guide/quick-start/page.tsx` - In quick start (clearly marked)
- `src/app/docs/guide/getting-started/page.tsx` - In getting started (context provided)

**Why acceptable**: These pages assume reader is reading sequentially and has context

---

## Remediation Plan

### MUST FIX (Priority 4)
1. Add security label to InstallationSimple quick install
2. Add link: "Production? Use Deploy page for secure install"
3. Reorder installation paths: Recommended first, Quick second

### VERIFY (Pre-deploy)
1. Check that Deploy page has checksum verification option
2. Check that Deploy page recommends it for production
3. Ensure no production guidance points to curl|bash without verification

### NO CHANGES NEEDED
- Hero CTA (correct)
- Documentation pages (context-appropriate)
- Footer/Navbar links (correct)

---

## Security Principles Applied

✅ Defense in depth: Multiple CTAs, each with safety level
✅ Default secure: Homepage recommends Deploy page approach  
✅ Explicit warnings: Quick path clearly marked as development-only
✅ User choice: Fast path available but must be conscious choice

---

## Impact

**Risk level**: MEDIUM (curl|bash shown without security context on homepage)
**Fixes required**: 3 UI updates + verification
**Build impact**: Minor (text changes + reordering)
**Trust impact**: HIGH — shows DSO takes security seriously
