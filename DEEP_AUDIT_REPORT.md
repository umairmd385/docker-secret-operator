# DEEP AUDIT REPORT — DSO Website Final Review

**Date**: June 18, 2026  
**Methodology**: Manual navigation + code verification + skeptical evaluation  
**Persona**: Principal Designer + Senior Engineer + Skeptical DevOps Engineer  

---

## CRITICAL ISSUES (Must Fix)

### 🚨 ISSUE #1: DASHBOARD CLAIM (CRITICAL)

**Location**: Homepage → "Real product. Real visibility" section

**Claim**: "Everything you need to manage rotations. Dashboard and CLI."

Shows mock dashboard with:
- Rotation history
- Total rotations
- Failed rotations
- Recent rotations list

**Reality**: DSO is **CLI-only**. No dashboard exists.

**Evidence**: 
- ROADMAP.md lists "GUI Dashboard" as "Low priority, community contribution welcome"
- No GUI code in `/cmd` or `/internal`
- Website explicitly claims unsupported features, but homepage shows mock dashboard as if it exists

**Severity**: 🔴 **CRITICAL** — Misleading users about existing functionality

**Fix**: 
- Option A: Remove dashboard mockup entirely
- Option B: Add label: "Coming in v4.0 (planned)"
- Option C: Show actual CLI output instead of dashboard

**Impact on Adoption**: High — User expects dashboard, discovers only CLI, feels disappointed

---

### 🚨 ISSUE #2: ROTATION PROCESS DIAGRAM (CRITICAL)

**Location**: Homepage → "Rotation Process" section

Shows: "Detect change → Spawn container → Validate health → Swap traffic → Cleanup"

**Reality Check**: 
- Missing crucial step: "Acquire distributed lock" (prevents concurrent rotations)
- Missing step: "Write checkpoint to disk" (recovery mechanism)
- Oversimplifies the actual process

**Evidence**: 
- `/internal/agent/recovery.go` implements checkpointing
- `/internal/watcher/controller.go` implements locking
- ROADMAP.md explicitly lists "Distributed lock" as completed feature

**Severity**: 🟡 **HIGH** — Users don't understand the actual process

**Fix**: Update diagram to show:
```
Detect change
↓
Acquire lock (prevent concurrent)
↓
Spawn container
↓
Validate health
↓
Write checkpoint
↓
Swap traffic (atomic)
↓
Release lock
↓
Cleanup
```

---

### 🚨 ISSUE #3: "DASHBOARD AND CLI" REPEATED (CRITICAL)

**Location 1**: Homepage → "Real product" section  
**Location 2**: Product page → capabilities

**Claim**: "Dashboard and CLI" in multiple places

**Reality**: No dashboard. Worse: website contradicts itself by saying "CLI-only" in Deploy page but showing dashboard in Homepage.

**Severity**: 🔴 **CRITICAL** — Internal contradiction in website

**Fix**: Remove all dashboard references from Homepage and Product pages

---

### 🚨 ISSUE #4: ROTATION TIME CLAIM (HIGH)

**Location**: Homepage → Terminal demo section

**Claim**: "2.3 seconds. Zero downtime."

**Reality**: Actual rotation time is ~5-10 seconds based on:
- Container creation: ~2-3 seconds
- Health checks: ~3-5 seconds  
- Atomic swap: <1 second
- Cleanup: ~1 second

**Evidence**: 
- failure-scenarios.md shows realistic timeline
- Expected-behavior.md shows "Total rotation time: ~5-10 seconds"

**Severity**: 🟡 **HIGH** — Misleading performance claim

**Fix**: Change to "~5-10 seconds" with note "varies by container and health check complexity"

---

### 🚨 ISSUE #5: INSTALL URL (HIGH)

**Location**: Homepage → CTA button

**Claim**: `curl -fsSL https://dso.sh/install | bash`

**Problem**: No verification that `dso.sh/install` actually exists or is verified

**Evidence**: 
- Deploy page correctly shows 3 installation methods (Recommended, Quick, Manual)
- Homepage shows only Quick install (`curl | bash`)
- No checksum verification option on homepage

**Severity**: 🟡 **HIGH** — Security best practices violated on high-visibility CTA

**Fix**: 
- Link to Deploy page instead of inline curl command
- Or show "Quick Install" with warning about verification
- Or show 3 options: Recommended (with checksums), Quick (curl), Manual

---

## MAJOR ISSUES (Should Fix)

### 🔴 ISSUE #6: "REAL-TIME MONITORING" MOCKUP

**Location**: Homepage → Features grid

Shows fake dashboard with mock data, but DSO doesn't have this feature.

**Fix**: 
- Remove mockup dashboard
- Show actual CLI output: `dso status` and `dso logs`
- Or: Remove this card entirely

---

### 🔴 ISSUE #7: COMPARISON TABLE ACCURACY

**Location**: Homepage → "Why DSO Over Alternatives?"

Table compares DSO vs Manual Scripts vs Vault vs Infisical

**Issues**:
- "Learning Curve" for DSO: Claims "1 hour - just Docker knowledge" (unverified)
- "Cost": Claims "Free (open source)" (true, but incomplete - requires time investment)
- "Scope" column: "Rotation only" is good, but doesn't mention it's rotation-specific

**Reality**: No user studies to back up learning curve claims

**Fix**: 
- Keep factual claims only (Free, Open Source, Rotation-only)
- Remove subjective claims (Learning Curve hours, Cost estimates)
- Or add disclaimer: "Based on typical deployments"

---

### 🔴 ISSUE #8: FAQ CLAIMS NOT VERIFIED

**Location**: Homepage → FAQ section

Questions like:
- "How much CPU and memory overhead?" → Answers "<50MB RAM, <5% CPU"
- "Can I use it in production?" → Answers "Yes"

**Problem**: No benchmarks in repository, no production usage data

**Fix**: 
- Remove specific numbers or link to benchmarks
- Change to: "Minimal overhead - see documentation for details"
- Keep yes/no answers but add "See deployment guide for details"

---

## DUPLICATE CONTENT ISSUES

### 🟡 ISSUE #9: FAILURE HANDLING (Homepage vs Architecture)

**Homepage**: Shows 6 failure scenarios with one expanded detail  
**Architecture**: Shows 6 failure scenarios with detailed explanations

Both pages explain the same content. Users don't need this twice.

**Fix**: 
- Homepage: Keep brief overview
- Architecture: Keep detailed version
- Homepage should link to Architecture for full details

---

### 🟡 ISSUE #10: ROTATION PROCESS

**Homepage**: Shows "Rotation Process" diagram  
**Architecture**: Shows detailed rotation timeline

**Fix**: 
- Homepage should have simplified diagram
- Link to Architecture for details

---

## BROKEN OR UNVERIFIED LINKS

### 🟠 ISSUE #11: GITHUB LINKS

Checking all GitHub links from homepage...

- GitHub: ✅ Working (points to main repo)
- Documentation links: ✅ Working
- Deploy page links: ✅ Working

**Status**: All navigation links working

---

### 🟠 ISSUE #12: CTA BUTTON DESTINATIONS

Homepage CTAs:
- "Deploy DSO" → ✅ Goes to `/deploy`
- "Documentation" → ✅ Goes to `/docs`
- "Install DSO" → ✅ Goes to `/deploy`
- "View on GitHub" → ✅ Goes to GitHub

**Status**: All CTAs verified

---

## CONTENT QUALITY ISSUES

### 🟡 ISSUE #13: TONE INCONSISTENCY

**Homepage tone**: Emotional, narrative-heavy, conversational

**Architecture tone**: Technical, precise, mechanical

**Product tone**: Professional, comparison-focused

**Fix**: This is actually good design - different pages have appropriate tones. No fix needed.

---

### 🟡 ISSUE #14: REPETITIVE CLAIMS

"Zero downtime" appears:
- Hero headline ✅
- Subheading ✅
- Problem statement ✅
- Rotation process ✅
- Failure handling ✅
- Comparison table ✅

**Fix**: Reduce repetition. "Zero downtime" in hero and one other place is enough.

---

### 🟡 ISSUE #15: "SECRET ROTATION SHOULDN'T BRING PRODUCTION DOWN"

**Location**: Homepage problem statement

**Problem**: This statement is vague. DSO doesn't bring down production, but other tools don't either if configured correctly.

**Better framing**: "Most teams skip secret rotation to avoid downtime risk. DSO eliminates that tradeoff."

---

## UI/UX ISSUES

### 🟠 ISSUE #16: MOBILE RESPONSIVENESS

Testing on mobile (via responsive inspection):
- Layout: ✅ Responsive
- Text: ✅ Readable  
- Buttons: ✅ Tappable
- Tables: ✅ Scrollable

**Status**: Mobile layout appears solid

---

### 🟠 ISSUE #17: DARK MODE

Verified dark mode works:
- ✅ Text readable
- ✅ Contrast acceptable
- ✅ Cards visible
- ✅ Code blocks readable

**Status**: Dark mode working

---

### 🟠 ISSUE #18: TYPOGRAPHY CONSISTENCY

Checked:
- Heading sizes: ✅ Consistent
- Font weights: ✅ Consistent
- Line heights: ✅ Appropriate
- Spacing: ✅ Grid-aligned

**Status**: Typography is clean and consistent

---

## ARCHITECTURE PAGE AUDIT

### ✅ VERIFIED:
- ✅ System layers accurately described
- ✅ Crash recovery correctly explained
- ✅ Failure scenarios match code
- ✅ Boundaries clearly stated
- ✅ "What Happens Next?" navigation added

### ⚠️ MINOR:
- Recovery flow diagram could be more visual
- Some sections are dense (but accurate)

---

## DEPLOY PAGE AUDIT

### ✅ VERIFIED:
- ✅ Installation trust section excellent
- ✅ Three installation paths provided
- ✅ Checksum verification shown
- ✅ Provider consolidation done well
- ✅ "What Happens Next?" navigation clear

### ⚠️ ISSUES:
- URLs shown in examples should be verified to exist
- Release artifact links should be tested

---

## COMMUNITY PAGE AUDIT

### ✅ VERIFIED:
- ✅ Metrics are real (12 stars, 2 maintainers, 29 releases)
- ✅ Release timeline accurate
- ✅ Roadmap realistic
- ✅ No fake testimonials
- ✅ Authentic tone

### ⚠️ MINOR:
- "5 providers" claims need verification against code
- Release count shows "31 tags" but website says "29" (minor discrepancy)

---

## SUMMARY: CRITICAL VS FIXABLE

### Top 5 Critical Issues (Stop Adoption):

1. **Dashboard claim** — Users expect feature that doesn't exist
2. **Homepage misleads on "Dashboard and CLI"** — Internal contradiction
3. **Installation URL unverified** — No checksum on main CTA
4. **Rotation time inflated** — Claims 2.3s, actually ~5-10s
5. **Comparison table unverified** — Learning curve claims not backed up

### Top 5 Medium Issues (Reduce Trust):

6. **Fake dashboard mockup** — Shows non-existent feature
7. **FAQ performance claims unverified** — No benchmarks in repo
8. **Duplicate failure content** — Homepage and Architecture repeat
9. **Rotation process diagram missing steps** — Hides locking and checkpoints
10. **Repetitive "zero downtime" messaging** — Weakens impact

---

## RECOMMENDATIONS: PRIORITY ORDER

### 🔴 DO IMMEDIATELY:

1. Remove dashboard mockup from homepage (fake feature)
2. Update "Dashboard and CLI" claim to "CLI-only"
3. Update rotation time: 2.3s → ~5-10s
4. Update installation CTA to link to Deploy page (proper security)
5. Remove unverified performance claims from FAQ

### 🟡 DO SOON:

6. Verify all GitHub/download URLs are live
7. Remove fake "Real-time Monitoring" dashboard mockup
8. Update rotation process diagram to show locking and checkpoints
9. Reduce "zero downtime" repetition
10. Add disclaimer to comparison table

### 🟢 NICE TO HAVE:

11. Consolidate failure handling content (don't repeat)
12. Make rotation timeline more visual
13. Add production deployment checklist
14. Add security hardening guide
15. Update release count (31 tags vs 29 claimed)

---

## WOULD I ADOPT DSO AFTER THIS REVIEW?

### Hesitations:
❌ Dashboard exists but isn't shown  
❌ Rotation time claims seem inflated  
❌ Main CTA doesn't follow security best practices  
❌ Some claims unverified  

### Confidence Restored:
✅ Failure handling is real  
✅ Recovery is checkpoint-based  
✅ Code is well-tested  
✅ Team is honest about scope  
✅ CNCF Sandbox credibility  

### Final Verdict:

**QUALIFIED YES** — After fix:

- Remove fake dashboard claim
- Fix rotation time claim
- Update installation security
- Verify performance claims

The **product is solid**. The **website has credibility issues**.

Fix the 5 critical issues, then:
- ✅ Yes, I'd adopt DSO
- ✅ Yes, I'd star the repo
- ✅ Yes, I'd recommend it
- ✅ Yes, I'd trust production use

---

## FINAL SCORE

| Dimension | Score | Notes |
|-----------|-------|-------|
| Product Quality | 9/10 | Code is solid, recovery is real |
| Website Accuracy | 5/10 | Multiple false claims |
| Installation Safety | 6/10 | Main CTA bypasses security |
| Trust | 6/10 | Fixed by addressing 5 critical issues |
| **Overall** | **6.5/10** | **Website hurts product credibility** |

**After fixes**: Would be 8.5/10

---

## NEXT ACTIONS

1. **Immediate** (this week): Fix 5 critical issues
2. **Short-term** (next week): Verify all URLs and claims
3. **Medium-term** (2 weeks): Remove fake features
4. **Retest**: Run this audit again after fixes

---

**Root Cause Analysis**:

The product is trustworthy. The website isn't.

Fixing requires:
- Remove aspirational claims
- Test all URLs
- Remove fake mockups
- Verify performance numbers
- Fix security CTA

Not changing the product. Just being honest about what it does.

