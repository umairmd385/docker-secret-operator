# Conviction Audit — Browser-Based Review

**Method**: For each section, ask: **"If I delete this section, does the user become less convinced?"**

**Principle**: Optimize for persuasion and trust, not scroll length.

**Date**: 2026-06-18

---

## HOMEPAGE CONVICTION AUDIT

### Section 1: Hero
**What it says**:
- "Rotate Secrets Without Downtime"
- Badges: Docker Native, Open Source, CNCF Sandbox, 5+ Providers
- CTA: "Deploy DSO"

**Conviction test**:
- **Delete it?** NO. Absolute essential.
- **Why**: This is the first impression. Establishes the value proposition immediately.
- **Conviction level**: ⭐⭐⭐⭐⭐ CRITICAL

**Verdict**: ✅ KEEP — Essential entry point

---

### Section 2: Problem Section
**What it says**:
- Secret rotation causes: manual restarts, downtime risk, connection drops, on-call panic
- Current approach is broken

**Conviction test**:
- **Delete it?** YES, but only if you replace with something.
- **Why**: Users need context on WHY this matters.
- **Risk if deleted**: User jumps to Product page without understanding the pain.
- **Current copy**: Slightly verbose (can be ~30% shorter)
- **Conviction level**: ⭐⭐⭐⭐ IMPORTANT

**Verdict**: ✅ KEEP but TIGHTEN — Remove adjectives, keep pain points

---

### Section 3: Terminal Demo
**What it says**:
- Animated CLI showing rotation lifecycle
- "Watch it work"
- Shows: detection → fetch → checkpoint → create → validate → swap → cleanup

**Conviction test**:
- **Delete it?** ABSOLUTELY NO.
- **Why**: This is the strongest section. Shows proof immediately.
- **If deleted**: Users have no visual proof DSO exists or works.
- **Conviction level**: ⭐⭐⭐⭐⭐ CRITICAL

**Verdict**: ✅ KEEP UNCHANGED — One of your best sections

---

### Section 4: Product Preview (CLI-First Control)
**What it says**:
- Real CLI output: `dso status`, `dso logs`
- "Full visibility and control from the command line"

**Conviction test**:
- **Delete it?** NO.
- **Why**: Proves "CLI-first" is real, not marketing speak.
- **If deleted**: Users doubt the CLI claim.
- **Conviction level**: ⭐⭐⭐⭐ IMPORTANT

**Verdict**: ✅ KEEP — Real proof of CLI-first positioning

---

### Section 5: Is DSO Right for You? (TargetAudience)
**What it says**:
- Docker Compose teams
- Production Docker workloads
- Docker users (not Kubernetes)
- Wants rotation, not secret manager

**Conviction test**:
- **Delete it?** YES.
- **Why**: Product page use cases answer this better with concrete examples.
- **If deleted**: Does user become less convinced? NO — they understand from Product page instead.
- **Conviction level**: ⭐⭐ WEAK (filtering question, not persuasion)

**Verdict**: ❌ DELETE — Product page handles this better

---

### Section 6: Failure Handling (Interactive Scenarios)
**What it says**:
- 6 interactive failure scenarios (Host Crash, Provider Timeout, etc.)
- "Failures are expected. DSO survives..."

**Conviction test**:
- **Delete it?** PARTIALLY.
- **Why**: Full interactive scenarios teach architecture (belongs on Architecture page).
- **What to keep**: 1 sentence proof: "Designed for failures. Automatic recovery handles crashes, timeouts, and network interruptions."
- **If full section deleted**: User loses confidence in recovery. BAD.
- **If reduced to 1 line**: User still sees safety promise. GOOD.
- **Conviction level**: ⭐⭐⭐⭐ IMPORTANT (concept) but ⭐⭐ for detailed scenarios (wrong page)

**Verdict**: ✅ KEEP as 1-LINE MENTION (not 6 interactive boxes)

---

### Section 7: Why DSO Over Alternatives? (Comparison Table)
**What it says**:
- Comparison: DSO vs Manual Scripts vs Vault vs Infisical
- Rows: Setup time, overhead, learning curve, cost, scope, etc.

**Conviction test**:
- **Delete from Homepage?** YES (but move to Product page).
- **Why**: This is a "why choose DSO" question, not "why care about DSO."
- **Different audiences**:
  - Homepage: Why do I care? (Problem → Solution narrative)
  - Product page: Why choose this solution? (Comparison/evaluation)
- **If deleted from Homepage**: User doesn't lose conviction about DSO's value. They get it from the narrative.
- **Conviction level on Homepage**: ⭐⭐⭐ MEDIUM (useful but not critical for first impression)

**Verdict**: ❌ DELETE from Homepage / ✅ MOVE to Product page

---

### Section 8: FAQ Section
**What it says**:
- 6 operational questions
- "How much CPU/memory?"
- "How are rotations monitored?"
- "Does DSO support my provider?"
- Etc.

**Conviction test**:
- **Delete from Homepage?** YES.
- **Why**: These are operational questions, not persuasion questions.
- **Better home**: Docs/FAQ page.
- **If deleted from Homepage**: User still convinced, just needs to find Docs for details.
- **Conviction level on Homepage**: ⭐ VERY WEAK (operational, not narrative)

**Verdict**: ❌ DELETE from Homepage / ✅ MOVE to Docs

---

### Section 9: Installation Made Simple
**What it says**:
- 4 installation paths (Docker Compose, AWS, Vault, Local)
- Links to Deploy page for details

**Conviction test**:
- **Delete it?** NO, but REDUCE significantly.
- **Why**: Homepage needs to point to Deploy for installation. But should show options exist.
- **If deleted**: User has to search to find how to install. Lower conviction.
- **Current state**: Too detailed (shows steps inline).
- **Better approach**: Show as 4 cards/buttons that link to Deploy page.
- **Conviction level**: ⭐⭐⭐ MEDIUM (shows options exist, but shouldn't teach)

**Verdict**: ✅ KEEP but SIMPLIFY — Cards only, link to Deploy for details

---

### Section 10: Trust and CTA
**What it says**:
- "What Happens Next?" section
- Links to docs
- Deploy button

**Conviction test**:
- **Delete it?** NO.
- **Why**: Closing moment. Builds confidence before action.
- **If deleted**: User scrolls off page unsure if DSO is trustworthy.
- **Current weakness**: Lacks trust signals (no metrics, no team info).
- **Should add**: 31 releases, Apache 2.0, CNCF Sandbox, small team, recovery mention.
- **Conviction level**: ⭐⭐⭐ MEDIUM (needs enhancement)

**Verdict**: ✅ KEEP and ENHANCE — Add trust signals (metrics, team, license)

---

## HOMEPAGE CONVICTION SUMMARY

### Sections that Build Conviction (KEEP):
1. ✅ Hero — Entry point
2. ✅ Problem — Context
3. ✅ Terminal Demo — Proof
4. ✅ CLI Preview — Proof
5. ✅ Failure recovery (1-line) — Safety
6. ✅ Installation options — Next steps
7. ✅ Trust & CTA — Confidence + action

### Sections that Don't Build Conviction (DELETE/MOVE):
1. ❌ TargetAudience (→ Product page)
2. ❌ Full Failure Scenarios (→ 1-line mention, detailed in Architecture)
3. ❌ Comparison Table (→ Product page)
4. ❌ FAQ (→ Docs)

### New Section to Add:
5. ➕ "Why DSO Exists" (3 positioning statements, NOT comparison)

---

## OTHER PAGES CONVICTION AUDIT

### Product Page
**Current**: Use cases + capabilities  
**Should become**:
1. Use cases (Database, API Keys, TLS)
2. Capabilities (10+ features)
3. Comparison table (moved from Homepage)
4. Tradeoffs/boundaries
5. CTA to Deploy

**Conviction test**: ✅ Answers "Why choose DSO?" comprehensively

---

### Architecture Page
**Current**: Design, recovery, failures, boundaries, philosophy  
**Assessment**: Perfect. Clear responsibility.

**Conviction test**: ✅ Answers "How does it work?" completely

**No changes needed.**

---

### Deploy Page
**Current**: Installation, verification, providers, next steps  
**Assessment**: Excellent funnel from Homepage.

**Conviction test**: ✅ Answers "How do I start safely?"

**No changes needed.**

---

### Community Page
**Current**: Activity, releases, team, ecosystem  
**Assessment**: Humble, trustworthy tone.

**Conviction test**: ✅ Answers "Can I trust this team?"

**Keep humble tone. Don't add vanity metrics.**

---

### Docs
**Current**: CLI, guides, troubleshooting, examples  
**Should add**:
- FAQ page (moved from Homepage)

**Conviction test**: ✅ Answers "How do I operate this?"

---

## HOMEPAGE AFTER CONVICTION AUDIT

### New Flow (7 sections):

1. **Hero**
   - "Rotate Secrets Without Downtime"
   - Badges
   - Deploy CTA
   - ~600px

2. **The Problem** (Tightened)
   - Remove 1-2 pain points (keep 3 core)
   - Reduce adjectives
   - ~300px (down from 400px)

3. **Terminal Demo**
   - Animated CLI proof
   - "Watch it work"
   - ~600px (unchanged)

4. **CLI-First Control**
   - Real output proof
   - ~500px (unchanged)

5. **Why DSO Exists** (NEW - SIMPLE)
   - NOT a comparison
   - 3 statements only:
     * "DSO is not a secret manager"
     * "DSO focuses on rotation"
     * "DSO stays Docker-native"
   - ~300px

6. **Installation Paths** (Simplified)
   - 4 cards (Docker Compose, AWS, Vault, Local)
   - Each links to Deploy page
   - No inline steps
   - ~400px (down from 600px)

7. **Trust & Confidence** (Enhanced)
   - 31 releases (active)
   - Apache 2.0 (open source)
   - CNCF Sandbox (credible)
   - Small focused team (trustworthy)
   - Recovery mention (safe)
   - Deploy CTA (action)
   - ~600px (up from 400px)

### Total Height Projection:
- Current: ~11,000px
- After: ~3,300px (deletions) + ~3,300px (consolidation) = **~5,200px**
- **Target range**: 5,000-6,000px ✅

---

## FINAL VERDICT

### Homepage Conviction: Strong ✅
- Opens with clear value prop
- Proves concept with real output
- Builds safety confidence
- Clear next steps
- Trust signals at end
- Balanced narrative (not empty, not overwhelming)

### Ready to Implement: YES ✅

**Recommended deletion order**:
1. TargetAudience
2. Full Failure Scenarios (→ 1-line)
3. Comparison Table (→ Product)
4. FAQ (→ Docs)

**Recommended enhancement order**:
1. Tighten Problem section
2. Create Why DSO Exists section
3. Simplify Installation paths
4. Enhance Trust section

**Timeline**: 2-3 days

