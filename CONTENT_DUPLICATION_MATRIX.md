# Content Duplication Matrix

**Analysis Date**: 2026-06-18  
**Goal**: Identify repeated content across pages to enable homepage reduction

---

## Current Page Structure

### Homepage (10 sections)
1. Hero — Value proposition
2. ProblemSection — The pain
3. TerminalDemo — Visual proof
4. ProductPreview — CLI-first control
5. TargetAudience — Who should use DSO
6. FailureHandling — Recovery approach
7. **WhyDSO** — Comparison table
8. FAQSection — Common questions
9. InstallationSimple — Quick start paths
10. TrustAndCTA — Final CTA

### Product Page (1 section)
- **WhyDSO** — Comparison table

### Architecture Page (5 sections)
- ArchitectureOverview — System design
- CrashRecoveryStory — Checkpoint-based recovery
- FailureScenarios — 6+ failure modes
- SystemBoundaries — What DSO does/doesn't do
- OperationalPhilosophy — Design principles

### Deploy Page (2 sections)
- InstallationTrust — Verified installation
- DeploymentPaths — Provider selection

### Community Page (4 sections)
- ProjectActivity — Contribution activity
- ReleaseTimeline — 31 releases
- MaintainerPhilosophy — Team approach
- EcosystemConnections — Integrations

### Docs
- Guides, CLI reference, examples
- No marketing or comparisons

---

## Direct Duplications

### 1. ⚠️ WhyDSO (CRITICAL)
| Appears On | Purpose | Status |
|-----------|---------|--------|
| Homepage | Comparison, why choose DSO | Primary |
| Product | Comparison, why choose DSO | **DUPLICATE** |
| | | |
**Analysis**: Same component, same content, same purpose  
**Recommendation**: **REMOVE from Product page** — Homepage already covers this  
**Impact**: -1 section from Product page  

---

## Conceptual Duplications (Similar Content, Different Format)

### 2. ⚠️ Failure Handling
| Content | Homepage | Architecture |
|---------|----------|--------------|
| FailureHandling (6 scenarios) | ✓ Shows failure modes | |
| FailureScenarios | | ✓ Detailed scenarios |
| CrashRecoveryStory | | ✓ Specific recovery |
| OperationalPhilosophy | ✓ Philosophy | ✓ Philosophy |
| | | |
**Analysis**: Homepage shows failures as quick scenarios (clickable). Architecture shows them with detailed implementation.  
**Recommendation**: **KEEP on both pages** (different depth/format) OR **MOVE from Homepage to Architecture** (keep high-level mention only)  
**Impact**: -1 major section from Homepage if moved

### 3. ⚠️ Target Audience (Homepage) vs Product Page Use Cases
| Content | Homepage | Product |
|---------|----------|---------|
| TargetAudience | ✓ "Is DSO right for you?" | |
| Product Page | | ✓ Use cases (database, API keys, etc.) |
| | | |
**Analysis**: TargetAudience filters who should use DSO (scope check). Product page shows concrete use cases.  
**Recommendation**: **CONSOLIDATE** — Keep use cases on Product, remove TargetAudience from Homepage  
**Impact**: -1 section from Homepage

### 4. ⚠️ ProductPreview (Homepage) vs Product Page
| Content | Homepage | Product |
|---------|----------|---------|
| ProductPreview | ✓ CLI-first control demo | |
| Product Page | | ✓ Capabilities + use cases |
| | | |
**Analysis**: ProductPreview shows CLI output example. Product shows full capability list.  
**Recommendation**: **KEEP on Homepage** (proof-of-concept), **EXPAND on Product** (full capabilities)  
**Impact**: No change (complementary, not duplicate)

### 5. ⚠️ WhyDSO (Homepage) vs Product Page
| Content | Homepage | Product |
|---------|----------|---------|
| Comparison table | ✓ vs Manual/Vault/Infisical | |
| Product intro | | ✓ "What You Can Do" |
| | | |
**Analysis**: Homepage compares DSO to alternatives. Product explains use cases.  
**Recommendation**: **REMOVE comparison from Homepage** → **EXPAND on Product page**  
**Impact**: -1 section from Homepage

---

## Potential Removals from Homepage

### High Priority (Clear Duplicates)
1. **WhyDSO** (comparison table)  
   - Reason: Product page handles this  
   - Complexity: HIGH (section is substantial)
   
2. **TargetAudience** (is DSO right for you?)  
   - Reason: Product page answers this with use cases  
   - Complexity: MEDIUM

### Medium Priority (Can Move)
3. **FAQSection** (8 Q&A)  
   - Reason: Docs cover these questions  
   - Complexity: MEDIUM  
   - Alternative: Keep 1-2 critical questions, move rest to Docs

4. **FailureHandling** (6 interactive scenarios)  
   - Reason: Architecture page covers in detail  
   - Complexity: MEDIUM  
   - Alternative: Remove interactive version, keep 1-line mention

### Low Priority (Likely Keep)
- **Hero**: Essential, unique to homepage
- **ProblemSection**: Sets up the narrative
- **TerminalDemo**: Visual proof (engaging)
- **ProductPreview**: CLI example (credibility)
- **InstallationSimple**: Direct CTA to Deploy page (good funnel)
- **TrustAndCTA**: Closing statement

---

## Homepage Content Reduction Scenario

### Current State
10 sections, ~11,000px height

### Target State (Inspired by Vercel/Supabase)
6-8 sections, ~4,500-6,000px height

### Proposed Homepage Structure
1. **Hero** (unique, essential)
2. **ProblemSection** (narrative)
3. **TerminalDemo** (proof)
4. **ProductPreview** (CLI control)
5. **Why DSO Exists** (1-3 sentence explanation, NOT comparison table)
6. **Trust** (metrics, team, open source)
7. **Deploy CTA** (button)

### Deletions
- ❌ WhyDSO (comparison table) → Move to Product page
- ❌ TargetAudience (filtering) → Product page use cases handle this
- ❌ FAQSection (most questions) → Keep top 2 questions OR delete entirely
- ❌ FailureHandling (scenarios) → Keep as 1-line mention only

---

## Page Responsibility After Consolidation

### Homepage (6-8 sections)
**Goal**: Create curiosity + confidence + drive action  
**NOT**: Teach architecture, compare alternatives, answer all questions

**Keep**:
- Hero
- Problem
- Terminal Demo
- CLI-First Control
- Why DSO Exists (1 sentence)
- Trust/Credibility
- Deploy CTA

**Delegate to**:
- Comparisons → Product page
- Use cases → Product page
- Deep architecture → Architecture page
- Failures/Recovery → Architecture page
- FAQ → Docs
- Operational guide → Docs

### Product Page
**Goal**: Answer "Why DSO?" with evidence  
**Contains**:
- Use cases (database, API keys, etc.)
- Capabilities
- Comparison (vs alternatives)
- CTA to Deploy

### Architecture Page
**Goal**: Answer "How DSO works?"  
**Contains**:
- System design
- Recovery mechanisms
- Failure scenarios (detailed)
- Boundaries
- Operational philosophy

### Deploy Page
**Goal**: Answer "How do I start?"  
**Contains**:
- Installation options
- Verification
- Provider selection
- Next steps

### Community Page
**Goal**: Answer "Can I trust this team?"  
**Contains**:
- Metrics
- Release history
- Team info
- Contribution path

### Docs
**Goal**: How do I operate DSO?  
**Contains**:
- Getting started
- Configuration
- CLI reference
- Troubleshooting
- Examples

---

## Quantitative Impact

| Change | Sections | Height Reduction | Impact |
|--------|----------|------------------|--------|
| Remove WhyDSO | -1 | ~1,200px | High (major section) |
| Remove TargetAudience | -1 | ~600px | Medium |
| Remove FAQSection (or reduce) | -1 to -0.5 | ~800px | Medium |
| Remove FailureHandling (keep 1-line) | -0.9 | ~1,000px | High |
| **Total** | **-3.9** | **~3,600px** | **Homepage: 11,000 → 7,400px** |

---

## Final Recommendation

### Phase 1: Immediate Removals
1. Move **WhyDSO** from Homepage to Product page
2. Remove **TargetAudience** from Homepage (replaced by "Why DSO Exists" + Deploy CTA)
3. Reduce **FAQSection** to 0 (move all questions to Docs or Product)
4. Replace **FailureHandling** section with 1-line mention in Trust section

### Phase 2: Simplify Copy
- Reduce all explanations by 30%
- Use short sentences
- Remove educational content (belongs in Docs)

### Phase 3: Verify Page Handoff
- Product page gains comparison + use cases
- Architecture page already has failure details
- Deploy page already standalone
- Docs already comprehensive

---

## Success Metrics

After consolidation, homepage should:
- ✅ Fit in viewport (no scroll needed on desktop)
- ✅ Answer "What is DSO?" in 3 seconds
- ✅ Drive to Deploy page (clear CTA)
- ✅ Build confidence (trust signals)
- ✅ Create curiosity (want to learn more)
- ✅ NOT explain architecture
- ✅ NOT compare alternatives
- ✅ NOT answer operational questions

