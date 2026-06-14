# Landing Page Upgrade Roadmap

**Document Purpose**: Comprehensive upgrade strategy for aligning landing page with DSO CLI capabilities  
**Status**: PLANNING PHASE — No implementation yet  
**Target**: 99%+ content accuracy with premium UI/UX design  

---

## Overview

This roadmap spans **4 comprehensive phases** over 2-3 weeks:

| Phase | Title | Effort | Duration | Focus |
|-------|-------|--------|----------|-------|
| **1** | Content Corrections & Feature Parity | 2-3 days | M-T | Fix validation report findings |
| **2** | Architecture & Workflow Diagrams | 3-4 days | W-Th | Visual storytelling of internals |
| **3** | Premium UI/UX Redesign | 4-5 days | F-M | Design system refresh |
| **4** | Interactive Examples & Optimization | 3-4 days | T-W | Code examples + performance |

**Exit Criteria**: All changes verified against CLI source code; 99%+ accuracy; 9/10 design quality

---

## PHASE 1: Content Corrections & Feature Parity (2-3 Days)

### Objective
Fix validation report findings. Update landing page content to reflect all CLI capabilities.

### 1.1 Add Missing Providers

**Files to Update**:
- `src/components/sections/PathChooser.tsx`
- `src/components/sections/VerifiedCapabilities.tsx`
- `src/components/sections/Hero.tsx`

**Changes Required**:

#### Add Huawei Cloud Provider
```tsx
// PathChooser.tsx: Add card for Huawei
{
  provider: "huawei",
  name: "Huawei Cloud",
  description: "Huawei Cloud KMS with native auth",
  setupTime: "5 minutes",
  icon: CloudIcon, // or huawei-specific icon
  recommended: false,
  details: {
    auth: "Huawei Cloud credential chain",
    setup: "Auto-detect credentials from environment",
    docs: "/docs/providers/huawei"
  }
}

// VerifiedCapabilities.tsx: Update features list
{
  title: "Huawei Cloud KMS",
  description: "Native Huawei Cloud authentication. Enterprise-ready."
}
```

#### Update Provider Count Badge
```tsx
// Hero.tsx: Change from "4+" to "5+"
<Badge>5+ Providers</Badge>

// Or list explicitly:
<Badge>AWS • Azure • Vault • Huawei • Local</Badge>
```

**Verification**:
- [ ] Huawei provider docs reviewed (README.md examples/huawei-compose/)
- [ ] Icon selected and imported
- [ ] Setup time validated
- [ ] Link to provider docs verified

---

### 1.2 Document All Rotation Strategies

**Files to Update**:
- `src/components/sections/VerifiedCapabilities.tsx`
- `src/components/sections/DeploymentPaths.tsx`
- Create new: `src/components/sections/RotationStrategies.tsx`

**Changes Required**:

#### Create Rotation Strategies Comparison Table
```tsx
// New section in VerifiedCapabilities or standalone
const rotationStrategies = [
  {
    name: "Rolling (Zero-Downtime)",
    strategy: "rolling",
    description: "Blue-green container swap. Old → backup, new → active. No downtime.",
    bestFor: "Stateless services, APIs, databases",
    healthCheck: "Required (recommended)",
    duration: "~30 seconds",
    example: "MySQL, PostgreSQL, web services"
  },
  {
    name: "Restart",
    strategy: "restart",
    description: "Stop old container, start new with updated secrets. Brief downtime.",
    bestFor: "Services that tolerate restarts",
    healthCheck: "Optional",
    duration: "5-10 seconds",
    example: "Background workers, batch jobs"
  },
  {
    name: "Signal",
    strategy: "signal",
    description: "Send SIGHUP to running container. Container reloads config without restart.",
    bestFor: "Apps that reload on SIGHUP",
    healthCheck: "N/A",
    duration: "< 1 second",
    example: "Nginx, HAProxy, custom daemons"
  },
  {
    name: "Auto (Adaptive)",
    strategy: "auto",
    description: "DSO chooses best strategy based on container configuration.",
    bestFor: "Hands-off operation",
    healthCheck: "Auto-detected",
    duration: "Varies",
    example: "Development environments"
  },
  {
    name: "None (Manual)",
    strategy: "none",
    description: "Update secret cache only. No container action. For manual rotation.",
    bestFor: "Controlled manual workflows",
    healthCheck: "N/A",
    duration: "Instant",
    example: "Manual approval workflows"
  }
];
```

#### Update VerifiedCapabilities.tsx
```tsx
// Replace single feature with comprehensive section
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {rotationStrategies.map(strategy => (
    <StrategyCard 
      key={strategy.strategy}
      strategy={strategy}
      recommended={strategy.strategy === "rolling"}
    />
  ))}
</div>
```

**Verification**:
- [ ] All 5 strategies documented in pkg/config/config.go verified
- [ ] README.md examples reviewed for each strategy
- [ ] Use case descriptions align with CLI documentation
- [ ] Timing estimates validated against actual behavior

---

### 1.3 Clarify Crash Recovery Terminology

**File to Update**:
- `src/components/sections/VerifiedCapabilities.tsx` (line 70)

**Change Required**:

```tsx
// FROM (current, vague):
{
  icon: <AlertCircle className="w-4 h-4" />,
  title: "Crash Recovery",
  description: "Agent restart from clean state. In-memory cache persists until container stops.",
},

// TO (accurate, clear):
{
  icon: <AlertCircle className="w-4 h-4" />,
  title: "Crash Recovery",
  description: "Agent tracks rotation checkpoints. On restart, DSO resumes incomplete rotations, preventing orphaned containers.",
},
```

**Detailed Explanation** (for FAQ or docs):
```
How Crash Recovery Works:

1. During Rotation:
   - DSO tracks every step (create, health check, swap, cleanup)
   - State persisted to disk
   - If crash occurs mid-rotation: checkpoint saved

2. On Agent Restart:
   - Loads checkpoint from disk
   - Evaluates state of last rotation
   - Options:
     a) If rotation was healthy: mark complete
     b) If rotation incomplete: resume from last safe step
     c) If rotation failed: execute rollback

3. Result:
   - No orphaned containers
   - No stale secrets
   - Consistent state guaranteed

This is NOT a "clean state" restart—it's intelligent recovery.
```

**Verification**:
- [ ] internal/agent/recovery.go reviewed
- [ ] internal/agent/state_tracker.go reviewed
- [ ] Checkpoint mechanism understood
- [ ] Language aligns with actual behavior

---

### 1.4 Add Secret Size Limitations

**Files to Update**:
- `src/components/sections/TrustAndCTA.tsx` or new Limitations section
- `src/app/faq/page.tsx`

**Changes Required**:

#### Add FAQ Entry
```tsx
{
  question: "What's the maximum size for a secret?",
  answer: "DSO enforces a 1MB maximum per secret. This covers virtually all real-world use cases. For larger credentials, split into multiple secrets or contact support.",
  category: "Limitations"
}
```

#### Add Limitations Section
```tsx
// New section or addition to existing
export const Limitations = () => (
  <section className="py-20">
    <h2>Practical Limits & Scope</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <Card title="Secret Size" value="1MB max">
        Individual secret payloads are limited to 1MB. Covers typical API keys, passwords, certificates.
      </Card>
      <Card title="Scale" value="100s of secrets">
        File-based locking scales to hundreds of secrets per agent. For thousands, recommend distributed agents.
      </Card>
      <Card title="Host Scope" value="Single Docker host">
        One DSO agent manages one Docker host. No multi-host coordination. For Kubernetes, use ExternalSecrets.
      </Card>
      <Card title="Dependencies" value="Linux + systemd">
        Agent mode requires systemd. Local mode works on macOS for development. Kubernetes not supported.
      </Card>
    </div>
  </section>
);
```

**Verification**:
- [ ] pkg/vault/vault.go checked for 1MB limit enforcement
- [ ] Limits documented in README.md verified
- [ ] Scale recommendations align with implementation

---

### 1.5 Revise "All Features Verified" Meta-Claim

**File to Update**:
- `src/components/sections/VerifiedCapabilities.tsx` (line 206-209)

**Change Required**:

```tsx
// FROM (current, inaccurate):
<div className="p-6 rounded-lg border border-accent/20 bg-accent/5">
  <p className="text-sm font-semibold text-foreground mb-1">No Marketing Claims</p>
  <p className="text-xs text-gray-400">
    Every feature listed above is verified in the DSO CLI source code. 
    No vaporware. No unimplemented features. Everything shown is 
    production-ready and tested.
  </p>
</div>

// TO (accurate and credible):
<div className="p-6 rounded-lg border border-accent/20 bg-accent/5">
  <p className="text-sm font-semibold text-foreground mb-1">No Marketing Claims</p>
  <p className="text-xs text-gray-400">
    Every feature shown here is production-ready and verified in the 
    DSO CLI source code. We document what's implemented, not what's 
    planned. For the complete feature list and all options, see the 
    <Link href="/docs/cli">CLI Documentation</Link>.
  </p>
</div>
```

**Verification**:
- [ ] Claim is now accurate
- [ ] Directs users to authoritative source
- [ ] Maintains credibility without overstatement

---

### 1.6 Verify Multi-Container Parallel Rotation

**Files to Review**:
- `internal/agent/multi_secret_updater.go`
- `internal/rotation/coordinator.go` (if exists)
- `internal/agent/trigger_engine.go`

**Task**:
Determine whether DSO actually supports:
- Parallel rotation of multiple containers simultaneously, OR
- Sequential rotation of containers per secret

**Action Based on Finding**:

If **Sequential Only**:
```tsx
// Update claim
{
  title: "Multi-Container Support",
  description: "Rotate multiple containers sequentially, maintaining consistency."
}
```

If **Parallel with Guarantees**:
```tsx
// Document the concurrency
{
  title: "Parallel Container Rotation",
  description: "Rotate multiple containers concurrently with atomic coordination."
}
// Add details about coordination mechanism
```

**Verification Checklist**:
- [ ] Code review of multi_secret_updater.go
- [ ] Test execution with multiple containers
- [ ] Verify no race conditions in parallel mode
- [ ] Document concurrency guarantees if applicable

---

### Phase 1 Completion Checklist

- [ ] Huawei provider added to all relevant sections
- [ ] Provider count badge updated to 5+
- [ ] All 5 rotation strategies documented
- [ ] Comparison table created
- [ ] Crash recovery language clarified
- [ ] Secret size limit added to FAQ
- [ ] Limitations section added
- [ ] "All features verified" claim revised
- [ ] Multi-container rotation verified and documented
- [ ] All changes verified against CLI source code
- [ ] No new markdown files created (keep existing structure)

---

## PHASE 2: Architecture & Workflow Diagrams (3-4 Days)

### Objective
Add technical diagrams and visual storytelling to help users understand internals without reading code.

### 2.1 Rotation Lifecycle Diagram

**Current State**: RotationLifecycle.tsx exists but may be incomplete

**Verification Needed**: Does it show all 6 steps?

```
1. Detect Secret Change
   ↓ (polling, ~30s)
2. Acquire Distributed Lock
   ↓ (prevents concurrent rotation)
3. Create New Container
   ↓ (with updated secrets)
4. Validate Health
   ↓ (health check passes)
5. Atomic Swap
   ↓ (old → backup, new → active)
6. Cleanup & Release Lock
   ↓ (old container stopped)
```

**Enhancements**:
- Add timeline showing duration at each step
- Show rollback path from any step back to previous state
- Add decision points (health check pass/fail)
- Animate flow with Framer Motion

---

### 2.2 Security Architecture Diagram

**Current State**: SecurityArchitecture.tsx exists

**Verification Needed**: Does it show complete data flow?

```
Secret Backend (AWS/Azure/Vault/Local)
    ↓ [Encrypted connection]
DSO Agent Process
    ├─ Provider Plugin (decrypt with AWS/Azure/Vault)
    ├─ Secret Cache (AES-256-GCM encrypted)
    └─ Injector
       ├─ TAR → tmpfs (atomic)
       ├─ Environment variable injection
       └─ File injection (invisible to docker inspect)
          ↓
Container Process
  - Reads from memory/tmpfs
  - No plaintext on disk
  - Automatic cleanup on stop
```

**Enhancements**:
- Show memory boundaries clearly
- Highlight encryption points
- Show cleanup on container stop
- Emphasize no plaintext traces

---

### 2.3 Provider Integration Architecture

**Create New Diagram**: Show how providers work with DSO

```
Plugin System:
┌─────────────────────────────────────┐
│ DSO Agent                           │
│  ├─ Provider Manager                │
│  │  ├─ dso-provider-aws (external) │
│  │  ├─ dso-provider-azure          │
│  │  ├─ dso-provider-vault          │
│  │  ├─ dso-provider-huawei         │
│  │  └─ file-provider (built-in)    │
│  │                                  │
│  └─ Polling/Webhook Trigger        │
└─────────────────────────────────────┘
      ↓
Cloud Provider Backend
```

**Highlights**:
- Plugin-based extensibility
- Each provider independent
- Built-in vs. external providers
- Authentication per provider

---

### 2.4 Crash Recovery Flow

**Create New Diagram**: Visual recovery process

```
Normal Operation:
DSO Agent → State Checkpoint → Container Running
                ↓
                [Rotation in progress]
                ↓
               CRASH!

Recovery:
Agent Restart
    ↓
Load State Checkpoint
    ↓
Evaluate Last Rotation
    ├─ Complete? → Mark done
    ├─ Incomplete? → Resume
    └─ Failed? → Rollback
    ↓
Verify Container State
    ↓
Resume Operations
```

---

### 2.5 TCP Proxy Port Binding

**Create New Diagram**: Show how DSO owns port bindings during rotation

```
Before Rotation:
Host Port 3306 ────→ Old Container (:3306)

During Rotation (health check):
Host Port 3306 ────→ DSO TCP Proxy ─┬─→ Old Container (active)
                                    └─→ New Container (health checking)

After Rotation:
Host Port 3306 ────→ New Container (:3306)

Result: No dropped connections, traffic seamlessly switched
```

---

### Phase 2 Completion Checklist

- [ ] Rotation lifecycle diagram complete and animated
- [ ] Security architecture updated
- [ ] Provider plugin architecture diagram created
- [ ] Crash recovery flow diagram created
- [ ] TCP proxy flow diagram created
- [ ] All diagrams use consistent styling
- [ ] Diagrams responsive on mobile
- [ ] SVG optimized for performance
- [ ] Accessibility (alt text, descriptions) added

---

## PHASE 3: Premium UI/UX Redesign (4-5 Days)

### Objective
Elevate visual design from functional to premium while maintaining technical clarity.

### 3.1 Design Direction Analysis

**Target Aesthetic** (matching Vercel, Linear, Supabase):
- High contrast dark theme (already implemented)
- Emerald accent color system (already implemented)
- Premium typography (Geist stack)
- Subtle micro-interactions
- Technical but approachable
- No fluff, pure information architecture

**Current State Assessment**:
- ✅ Color system in place
- ✅ Typography hierarchy established
- ✅ Dark theme implemented
- ⚠️ Motion may be excessive
- ⚠️ Some sections may lack hierarchy
- ⚠️ Component consistency needs review

### 3.2 Component System Audit

**Tasks**:

1. **Review Spacing Consistency**
   - Audit all sections for padding/margin rhythm
   - Ensure 4-8-12-16-24-32-48-64 scale usage
   - Fix any random spacing values

2. **Typography Hierarchy Check**
   - H1: Hero titles (48-64px)
   - H2: Section titles (32-40px)
   - H3: Subsection headers (24-28px)
   - Body: Descriptions (16px)
   - Small: Labels/captions (12-14px)
   - Verify consistency across components

3. **Icon System Alignment**
   - Audit all Lucide icons for size consistency
   - Check icon-to-text color relationships
   - Ensure icon weights match

4. **Card & Surface Design**
   - Review border colors (accent/20 consistency)
   - Check background opacity values
   - Verify shadow depth (if using)
   - Ensure hover states are designed

5. **Motion & Animation**
   - Audit all Framer Motion usage
   - Verify easing functions match design system
   - Check animation durations (150-300ms range)
   - Remove any excessive motion
   - Ensure reduced-motion preference respected

### 3.3 Section-by-Section Polish

**Hero Section**:
- [ ] Verify CTA button states (hover, active, focus)
- [ ] Check headline contrast
- [ ] Ensure background gradient doesn't overwhelm content
- [ ] Mobile: button accessibility

**Capabilities Section**:
- [ ] Card styling consistent
- [ ] Grid gaps aligned to rhythm
- [ ] Icon sizing and color verified
- [ ] Proof statement styling premium

**Rotation Lifecycle**:
- [ ] Timeline styling polished
- [ ] Step numbers/icons clear
- [ ] Arrow indicators visible
- [ ] Mobile: horizontal scroll vs. vertical stack

**Security Architecture**:
- [ ] Diagram legibility
- [ ] Color coding clear
- [ ] Labels readable
- [ ] Information hierarchy

**Architecture Section**:
- [ ] All diagrams consistent style
- [ ] SVG rendering crisp
- [ ] Labels integrated not overlaid
- [ ] Mobile: diagrams responsive

**Comparison/Alternatives**:
- [ ] Table styling (if exists)
- [ ] Feature checkmarks styled
- [ ] Color coding consistent
- [ ] Mobile: horizontal scroll smooth

### 3.4 New Component Creation (if needed)

**RotationStrategyCard**:
```tsx
export function RotationStrategyCard({ 
  strategy: 'rolling' | 'restart' | 'signal' | 'auto' | 'none',
  name: string,
  description: string,
  bestFor: string,
  duration: string,
  highlighted?: boolean
}) {
  // Premium card with:
  // - Strategy badge
  // - Name + description
  // - Use case tags
  // - Duration indicator
  // - Hover highlight effect
}
```

**LimitationCard**:
```tsx
export function LimitationCard({
  title: string,
  value: string,
  description: string,
  workaround?: string
}) {
  // Card showing practical limits
  // - Large value display
  // - Clear description
  // - Workaround if applicable
}
```

**DiagramCaption**:
```tsx
export function DiagramCaption({
  children: ReactNode,
  steps?: Array<{step: number, description: string}>
}) {
  // Narrative text explaining diagram
  // - With optional step-by-step guide
  // - Readable callouts
}
```

### 3.5 Mobile Responsiveness

**Audit Needed**:
- [ ] All sections stack vertically on 320px
- [ ] No horizontal overflow
- [ ] Touch targets ≥ 44px
- [ ] Typography scales appropriately
- [ ] Diagrams readable (or horizontal-scrollable)
- [ ] Spacing maintains rhythm at all breakpoints

**Breakpoints to Test**:
- 320px (phone)
- 375px (standard phone)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)
- 1920px (ultrawide)

### 3.6 Accessibility Review

**Checklist**:
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] All interactive elements keyboard-navigable
- [ ] Focus indicators visible
- [ ] Images have alt text
- [ ] SVG diagrams have aria-labels
- [ ] Reduced motion respected (`prefers-reduced-motion`)
- [ ] Form labels associated with inputs
- [ ] Error messages clear and associated
- [ ] Skip navigation link present

### Phase 3 Completion Checklist

- [ ] Design audit completed
- [ ] Spacing consistency verified
- [ ] Typography hierarchy confirmed
- [ ] Motion audit completed (no excessive animations)
- [ ] All new components created
- [ ] Mobile responsiveness tested
- [ ] Accessibility audit passed
- [ ] Dark theme verified across all sections
- [ ] Component props documented
- [ ] No console errors or warnings

---

## PHASE 4: Interactive Examples & Performance (3-4 Days)

### Objective
Add interactive code examples and optimize for performance.

### 4.1 Interactive Code Examples

**Add Examples For**:

1. **Local Mode Setup** (copy-to-clipboard)
   ```bash
   docker dso setup --mode local
   docker dso init
   docker dso secret set myapp/db_password
   ```

2. **Production Agent Mode** (AWS example)
   ```bash
   docker dso setup --mode agent --provider aws
   sudo systemctl start dso-agent
   ```

3. **docker-compose.yaml Labels**
   ```yaml
   services:
     mysql:
       image: mysql:8
       labels:
         dso.reloader: "true"
         dso.secrets: "database_credentials"
         dso.update.strategy: "rolling"
   ```

4. **Secret Rotation Lifecycle** (YAML config)
   ```yaml
   secrets:
     - name: database_credentials
       provider: aws
       rotation:
         enabled: true
         strategy: rolling
       targets:
         containers:
           - mysql
   ```

**Implementation Pattern**:
- Copy button (Lucide Copy icon)
- Syntax highlighting
- Option to expand to full example
- Link to full documentation
- Mobile: swipe-able or horizontal scroll

### 4.2 Performance Optimization

**Audit & Optimize**:

1. **Image Optimization**
   - [ ] All images have explicit width/height
   - [ ] AVIF/WebP with JPG fallback
   - [ ] Lazy loading for below-fold
   - [ ] Preload hero image

2. **Code Splitting**
   - [ ] Interactive examples loaded on-demand
   - [ ] Diagrams lazy-loaded if heavy
   - [ ] Analytics/tracking async

3. **Bundle Size**
   - [ ] framer-motion usage audit
   - [ ] Remove unused lucide icons
   - [ ] Tree-shake unused utilities
   - [ ] Check gzipped bundle size

4. **Rendering**
   - [ ] Avoid layout shifts (CLS)
   - [ ] Preload critical fonts
   - [ ] No render-blocking resources
   - [ ] Streaming SSR optimized

**Targets**:
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- JS bundle < 150KB gzipped

### 4.3 Lighthouse Audit

**Run Locally**:
```bash
npm run build
npx lighthouse http://localhost:3000 --output-path ./lighthouse.html
```

**Pass Criteria**:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 95

### 4.4 Documentation Links

**Ensure All Docs Linked**:
- [ ] `/docs/getting-started` from CTA
- [ ] `/docs/cli` from feature lists
- [ ] `/docs/providers/aws` from provider cards
- [ ] `/docs/providers/azure` from provider cards
- [ ] `/docs/providers/vault` from provider cards
- [ ] `/docs/providers/huawei` from provider cards
- [ ] `/docs/configuration` from config examples
- [ ] All links tested and working

### 4.5 Metadata & SEO

**Verify**:
- [ ] Page title: "Docker Secret Operator | Zero-Downtime Secret Rotation"
- [ ] Meta description captures unique value
- [ ] Open Graph tags set (title, description, image)
- [ ] Twitter card tags set
- [ ] Structured data (JSON-LD) for Organization/SoftwareProduct
- [ ] Sitemap updated
- [ ] robots.txt correct

### Phase 4 Completion Checklist

- [ ] Interactive examples added
- [ ] Copy-to-clipboard working
- [ ] Syntax highlighting functional
- [ ] All documentation links tested
- [ ] Lighthouse audit ≥ 90 all categories
- [ ] Bundle size optimized
- [ ] Mobile performance verified (Lighthouse mobile ≥ 85)
- [ ] No console errors
- [ ] Metadata & SEO complete
- [ ] Open Graph & Twitter cards tested

---

## Quality Gates & Verification

### Pre-Launch Verification Checklist

#### Content Accuracy (MUST PASS)
- [ ] Huawei provider verified and documented
- [ ] All 5 rotation strategies documented
- [ ] Secret size limit (1MB) documented
- [ ] Crash recovery language accurate
- [ ] Multi-container capability verified
- [ ] TCP proxy behavior documented
- [ ] No "future features" mentioned
- [ ] All examples match current CLI version
- [ ] All links to docs verified

#### Design Quality (MUST PASS)
- [ ] 9/10 visual quality assessment
- [ ] Consistent spacing rhythm
- [ ] Typography hierarchy correct
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Mobile responsive (320-1920px)
- [ ] No excessive motion
- [ ] Color contrast verified
- [ ] Interactive elements accessible

#### Performance (MUST PASS)
- [ ] Lighthouse ≥ 90 (all categories)
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] JS bundle < 150KB gzipped
- [ ] No CWV violations
- [ ] Mobile Lighthouse ≥ 85

#### User Experience (SHOULD PASS)
- [ ] Clear value proposition in hero
- [ ] Easy navigation to features/docs
- [ ] CTAs visible and compelling
- [ ] Information architecture logical
- [ ] Diagrams help understanding
- [ ] Code examples copy-able
- [ ] No dead links
- [ ] Footer contact info accessible

---

## Implementation Notes

### Working Principles
1. **Never break existing functionality** — all changes are additive or clarifying
2. **Maintain CLAUDE.md standards** — no unnecessary files, minimal abstractions
3. **Verify against CLI** — every claim cross-checked against source code
4. **Iterative verification** — test after each phase, not just at end
5. **Preserve CNCF sandbox messaging** — don't overstate maturity

### Git Workflow
```bash
# Phase 1: Content fixes (1 PR)
git checkout -b phase-1-content-corrections
# ... make changes ...
git commit -m "feat: add missing providers, strategies, and clarify claims"
git push origin phase-1-content-corrections
# PR → Review → Merge

# Phase 2: Architecture diagrams (1 PR)
git checkout -b phase-2-architecture-diagrams
# ... add diagrams ...
git commit -m "feat: add rotation lifecycle and security architecture diagrams"
git push origin phase-2-architecture-diagrams
# PR → Review → Merge

# Phase 3: UI/UX redesign (1-2 PRs if large)
git checkout -b phase-3-premium-design
# ... design improvements ...
git commit -m "refactor: premium UI polish and accessibility improvements"
git push origin phase-3-premium-design
# PR → Review → Merge

# Phase 4: Performance & examples (1 PR)
git checkout -b phase-4-interactive-examples
# ... add examples, optimize ...
git commit -m "feat: interactive code examples and performance optimization"
git push origin phase-4-interactive-examples
# PR → Review → Merge
```

### Timeline Estimate

| Phase | Days | Timeline |
|-------|------|----------|
| Phase 1 | 2-3 | Mon-Tue |
| Phase 2 | 3-4 | Wed-Thu |
| Phase 3 | 4-5 | Fri-Mon |
| Phase 4 | 3-4 | Tue-Wed |
| Buffer & Fixes | 2-3 | Thu-Fri |
| **Total** | **14-19** | **2-3 weeks** |

### Resource Requirements

**Frontend Developer**: 1 full-time equivalent
- Implement all UI changes
- Verify against CLI
- Lighthouse/performance audit
- Accessibility testing

**Design Review**: 2-3 sessions
- End of Phase 1 (content review)
- End of Phase 3 (design review)
- Before launch (final verification)

**QA/Testing**: Throughout
- Verify content against CLI
- Test all interactive elements
- Mobile & accessibility testing
- Link verification

---

## Success Criteria

### Phase 1 Complete When:
✅ All validation report findings addressed  
✅ Content 99%+ accurate vs. CLI  
✅ No new claims introduced  
✅ All examples match current CLI version  

### Phase 2 Complete When:
✅ 5+ diagrams created  
✅ Diagrams responsive & accessible  
✅ SVG optimized  
✅ Captions explain each diagram  

### Phase 3 Complete When:
✅ Design audit passed  
✅ Spacing consistent (rhythm scale used)  
✅ Accessibility ≥ WCAG AA  
✅ Visual quality 9/10  
✅ No excessive motion  

### Phase 4 Complete When:
✅ Interactive examples functional  
✅ Lighthouse ≥ 90 all categories  
✅ All docs links verified  
✅ No console errors  

### Launch Ready When:
✅ All phases complete  
✅ Final design review passed  
✅ Content verified against CLI main branch  
✅ QA sign-off received  
✅ LANDING_PAGE_VALIDATION_REPORT findings resolved  

---

## Post-Launch Maintenance

### Monthly Audits
- [ ] Check CLI repo for new features
- [ ] Verify no new providers added to CLI
- [ ] Check for deprecations
- [ ] Update version numbers if changed
- [ ] Review user feedback

### Quarterly Reviews
- [ ] Lighthouse audit re-run
- [ ] Accessibility re-check
- [ ] Mobile responsiveness test
- [ ] Update examples if CLI changed
- [ ] Review competitor landing pages

### Update Process
- Always verify changes against CLI before deploying
- Update LANDING_PAGE_VALIDATION_REPORT.md with findings
- Create PR with changes
- Include CLI version checked in PR description
- Keep content synchronized with CLI releases

---

## Appendix: File Changes Summary

### New Files Created
- None required (reuse existing structure per CLAUDE.md)

### Files Modified

**Phase 1**:
- `src/components/sections/VerifiedCapabilities.tsx` (add Huawei, strategies, clarifications)
- `src/components/sections/PathChooser.tsx` (add Huawei card)
- `src/components/sections/Hero.tsx` (update provider count)
- `src/app/faq/page.tsx` (add secret size limit, crash recovery FAQ)

**Phase 2**:
- `src/components/sections/RotationLifecycle.tsx` (enhance diagram)
- `src/components/sections/SecurityArchitecture.tsx` (verify/enhance)
- `src/components/sections/Architecture.tsx` (verify consistency)

**Phase 3**:
- Various component files (spacing, typography, motion audits)

**Phase 4**:
- `src/components/sections/GetStarted.tsx` (add interactive examples)
- Various files (performance optimizations)

### No New Components Required
(Reuse existing component library per project standards)

---

## Conclusion

This roadmap transforms the landing page from **78% accurate → 99% accurate** while elevating design quality to **9/10**. The phased approach allows for verification at each step against the DSO CLI source code.

**Next Step**: Begin Phase 1 implementation. Verify each change against CLI before committing.

---

**Document Version**: 1.0  
**Last Updated**: June 14, 2026  
**Status**: Ready for Phase 1 Implementation
