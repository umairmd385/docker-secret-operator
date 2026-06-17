# Homepage Reduction Plan

**Current State**: 10 sections, ~11,000px height, heavy on education  
**Target State**: 6-8 sections, ~4,500-6,000px height, focused on curiosity + action  
**Inspiration**: Vercel, Supabase, Doppler, Linear, Infisical

---

## Phase 1: Identify What to Remove (Immediate)

### Remove: WhyDSO (Comparison Table)

**Current Location**: Homepage section 7  
**Current Purpose**: Compare DSO vs Manual/Vault/Infisical  
**Duplicate**: Yes, Product page will handle this

**Why Remove**:
- Product page exists for "why choose DSO"
- Comparison table is heavy (takes space)
- Clutters homepage narrative
- Users who care can visit Product page

**Move To**: Product page (expand existing section)

**Action**:
```
src/app/page.tsx:
  - Remove <WhyDSO /> import
  - Remove <WhyDSO /> component
  
src/app/product/page.tsx:
  - Keep existing WhyDSO component
  - Position after use cases
```

---

### Remove: TargetAudience

**Current Location**: Homepage section 5  
**Current Purpose**: "Is DSO right for you?"  
**Duplicate**: Conceptually yes, Product page answers with use cases

**Why Remove**:
- Can be replaced with 1-sentence value prop
- Product page use cases answer this better
- Filtering question belongs on Product page
- Homepage should welcome everyone initially

**Move To**: Product page (use cases section)

**Action**:
```
src/app/page.tsx:
  - Remove <TargetAudience /> import
  - Remove <TargetAudience /> component
```

---

### Remove/Reduce: FAQSection

**Current Location**: Homepage section 8  
**Current Questions**: 6 Q&A pairs  
**Duplicate**: Some overlap with Docs

**Why Remove**:
- Most questions belong in Docs/Guides
- FAQ on homepage suggests you missed something
- Lean homepage shouldn't have 6 Q&A

**Options**:
A) Delete entirely (recommended)
B) Keep 1 critical question (optional)

**Move To**: Docs (create FAQ guide)

**Action**:
```
src/app/page.tsx:
  - Remove <FAQSection /> import
  - Remove <FAQSection /> component
  
src/app/docs/guide/faq/page.tsx:
  - Create FAQ page with same questions
```

---

### Reduce: FailureHandling

**Current Location**: Homepage section 6  
**Current Purpose**: Interactive failure scenarios  
**Duplicate**: Architecture page has detailed version

**Why Reduce**:
- Takes ~1,000px of space
- Interactive widget for 6 scenarios is heavy
- Architecture page covers in detail
- Homepage should hint, not teach

**Replacement**: 1-line mention in Trust section

**New Message**:
> "Designed for failures. Automatic recovery handles crashes, timeouts, and network partitions without manual intervention."

**Action**:
```
src/app/page.tsx:
  - Remove <FailureHandling /> import
  - Remove <FailureHandling /> component
  - Add 1-line to TrustAndCTA or new section
```

---

## Phase 2: New Homepage Structure

### Proposed Flow (6 sections)

#### 1. Hero (KEEP)
**Purpose**: Value proposition + badges  
**Content**: "Rotate Secrets Without Downtime" + Docker Native / Open Source / CNCF / 5+ Providers  
**CTA**: Deploy DSO  
**Size**: ~800px

#### 2. ProblemSection (KEEP)
**Purpose**: Why this matters  
**Content**: Current pain (manual restarts, downtime, complexity)  
**Size**: ~400px

#### 3. TerminalDemo (KEEP)
**Purpose**: Visual proof  
**Content**: Animated CLI output showing rotation in action  
**Size**: ~600px

#### 4. ProductPreview (KEEP - ENHANCE)
**Purpose**: How DSO works  
**Current**: CLI output example  
**Change**: Expand with 2-3 core capabilities  
**New Title**: "CLI-First Rotation"  
**Size**: ~800px

#### 5. Why DSO Exists (NEW - CONSOLIDATION)
**Purpose**: Trust + differentiation (replaces WhyDSO + TargetAudience)  
**Content**: 
- Not a secret manager (leaves that to Vault/AWS/Azure)
- CLI-first (no UI complexity)
- Focused (one job, done right)
- Safe (automatic recovery)
**Size**: ~400px (3-4 sentences + list)

#### 6. Trust (KEEP - CONSOLIDATE)
**Purpose**: Build confidence  
**Current**: TrustAndCTA component  
**Expand With**:
- 31 releases (active)
- Apache 2.0 (open source)
- Small focused team
- CNCF Sandbox
- 1-line on failure recovery
**Size**: ~600px

#### 7. Deploy CTA (SIMPLIFY)
**Purpose**: Clear call-to-action  
**Content**: Single button "Deploy DSO" → Deploy page  
**Size**: ~200px

### Total Height Target
Sections 1-7: ~3,800px (vs current ~11,000px)  
**Reduction**: -65% (homepage becomes focused, inviting, not overwhelming)

---

## Phase 3: Component Changes

### Files to Modify

#### src/app/page.tsx
```diff
- Remove: WhyDSO import
- Remove: WhyDSO component
- Remove: TargetAudience import
- Remove: TargetAudience component
- Remove: FAQSection import
- Remove: FAQSection component
- Remove: FailureHandling import
- Remove: FailureHandling component

+ Add: "Why DSO Exists" section (new inline content or component)
+ Keep: Hero, ProblemSection, TerminalDemo, ProductPreview, TrustAndCTA
```

#### Create: src/components/sections/WhyDSOExists.tsx
```
Purpose: Replace both WhyDSO (comparison) and TargetAudience (filtering)
Content: 4 bullet points on DSO's positioning (not a manager, CLI-first, focused, safe)
Size: Minimal, text-only
```

#### src/components/sections/ProductPreview.tsx
```
Enhance current CLI output with:
+ Add 2-3 core capability callouts
+ Keep visual proof focus
+ Expand from ~500px to ~800px with better spacing
```

#### src/components/sections/TrustAndCTA.tsx
```
Expand to include:
+ 31 releases
+ Apache 2.0 license
+ CNCF Sandbox badge
+ Small team info
+ 1-line on automatic recovery
+ Deploy CTA button
```

---

## Phase 4: Page Structure After Changes

### Homepage (After Reduction)
**Sections**: 7  
**Height**: ~3,800px  
**Purpose**: Create curiosity + confidence + drive to Deploy  

### Product Page (After Expansion)
**Sections**: 3  
**New Content**:
- Use cases (existing)
- Comparison table (from homepage)
- Tradeoffs / positioning  

**Purpose**: Answer "Why DSO?"

### Architecture Page (No Changes)
**Purpose**: Answer "How DSO works?"  
**Unchanged**: System design, recovery, failures, boundaries, philosophy

### Deploy Page (No Changes)
**Purpose**: Answer "How do I start?"  
**Unchanged**: Installation, verification, providers

### Community Page (No Changes)
**Purpose**: Answer "Can I trust this team?"  
**Unchanged**: Activity, releases, maintainers

### Docs (No Changes)
**Purpose**: How to operate  
**Add**: FAQ guide (from homepage)

---

## Implementation Steps

### Step 1: Remove Components from Homepage (Day 1)
```bash
1. Remove WhyDSO import/component
2. Remove TargetAudience import/component
3. Remove FAQSection import/component
4. Remove FailureHandling import/component
5. Verify page.tsx compiles
```

### Step 2: Create WhyDSOExists Component (Day 1)
```bash
1. Create new component: src/components/sections/WhyDSOExists.tsx
2. Add 4 simple sections on positioning
3. Add to homepage after TerminalDemo
```

### Step 3: Enhance ProductPreview (Day 2)
```bash
1. Expand ProductPreview with capability callouts
2. Add visual hierarchy
3. Adjust spacing
```

### Step 4: Expand TrustAndCTA (Day 2)
```bash
1. Add metrics (31 releases)
2. Add badges (Apache 2.0, CNCF)
3. Add team info
4. Add recovery mention
5. Ensure Deploy CTA is prominent
```

### Step 5: Expand Product Page (Day 2)
```bash
1. Import WhyDSO component to Product page
2. Add title "Why Choose DSO?"
3. Position after use cases
```

### Step 6: Create FAQ Guide in Docs (Day 3)
```bash
1. Create src/app/docs/guide/faq/page.tsx
2. Add all questions from homepage FAQ
3. Add links from homepage to FAQ guide
```

### Step 7: Build + Test (Day 3)
```bash
1. Run: npm run build
2. Test homepage loads correctly
3. Verify all internal links work
4. Check responsive design
```

---

## Success Criteria

### Homepage After Reduction
- ✅ Fits in viewport (no scroll on desktop)
- ✅ Takes <5 seconds to understand DSO
- ✅ Clear path to Deploy page
- ✅ Builds trust (badges + team + open source)
- ✅ Creates curiosity (links to Product + Docs)
- ✅ No architecture explanation
- ✅ No comparison tables
- ✅ No technical deep dives
- ✅ ~3,800px height (was 11,000px)

### Product Page After Expansion
- ✅ Comprehensive "why DSO" answer
- ✅ Comparison table (from homepage)
- ✅ Use cases detailed
- ✅ Clear positioning vs alternatives

### Pages Remain Clear in Purpose
- ✅ Architecture = How
- ✅ Deploy = Start
- ✅ Community = Trust
- ✅ Docs = Operate

---

## Visual Comparison

### Current Homepage Flow
```
Hero
↓ (huge distance)
Problem
↓
Terminal Demo
↓
Product Preview (minimal)
↓
Target Audience (filtering)
↓
Failure Handling (interactive, heavy)
↓
Why DSO (comparison table, long)
↓
FAQ (6 questions)
↓
Installation
↓
Trust + CTA
↓ (~11,000px total)
```

### New Homepage Flow
```
Hero (value prop)
↓
Problem (context)
↓
Terminal Demo (proof)
↓
Product Preview (how it works)
↓
Why DSO Exists (positioning, brief)
↓
Trust (confidence)
↓
Deploy CTA
↓ (~3,800px total)
```

---

## Rollout Plan

### Day 1: Remove + Create
- Remove 4 components
- Create WhyDSOExists
- Build test

### Day 2: Enhance + Expand
- Enhance ProductPreview
- Expand TrustAndCTA
- Expand Product page
- Build test

### Day 3: Finalize + Verify
- Create FAQ guide
- Test all pages
- Verify responsive
- Final review

### Timeline: 3 days development

---

## Expected Results

### Before
- Homepage teaches everything
- Multiple pages duplicate content
- Users overwhelmed by information
- High bounce rate risk

### After
- Homepage creates curiosity
- Each page has clear purpose
- Users guided through journey
- Faster decision (Deploy or learn more)
- Professional, focused impression

