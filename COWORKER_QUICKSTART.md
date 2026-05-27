# Quick Start for Coworker - Landing Page Fixes

## TL;DR - What Needs Fixing

### 🔴 CRITICAL (Do First)
1. **Remove Guarantee Duplication**
   - File: `src/components/sections/SecurityArchitecture.tsx`
   - Line: ~190-220 (entire "Operational Guarantees" section)
   - Action: DELETE the 4-item guarantees grid
   - Reason: RotationLifecycle already shows guarantees

2. **Fix Alignment Issues** 
   - Need specific feedback on which sections
   - Files to check: SecurityArchitecture, DeploymentPaths, GetStarted, TrustAndCTA
   - Use browser DevTools (F12) to inspect

### 🟡 HIGH (Do Second)
3. **Verify all content is accurate**
   - Cross-check claims against actual CLI implementation
   - Verify all 5 commands in DeploymentPaths work

### 🟢 LOW (Do Last)
4. **Mobile responsiveness**
5. **Animation polish**
6. **Nice-to-have features** (FAQ, use cases, etc.)

---

## File Map - Where Everything Is

```
src/app/page.tsx
├─ Main landing page (imports all sections)
├─ Removed: HowItWorks
├─ Removed: ProductionSafety
├─ Added: DeploymentPaths (Phase 3)
└─ Order: Hero → RotationLifecycle → SecurityArchitecture → SolutionVisual 
          → DeploymentPaths → Architecture → QuickStart → TrustAndCTA → Footer

src/components/sections/
├─ Hero.tsx (FIXED: link, providers)
├─ RotationLifecycle.tsx (NEW: 6 steps + guarantees)
├─ SecurityArchitecture.tsx (NEEDS: remove guarantees section)
├─ SolutionVisual.tsx (FIXED: added timeout explanation)
├─ DeploymentPaths.tsx (NEW: 5 deployment paths)
├─ Architecture.tsx (OK: no changes)
├─ GetStarted.tsx (FIXED: commands, anchor ID)
└─ TrustAndCTA.tsx (OK: no changes)
```

---

## Most Important Fixes

### Fix #1: Remove Duplicate Guarantees
**File**: `src/components/sections/SecurityArchitecture.tsx`

**What to do**:
```javascript
// DELETE THIS ENTIRE SECTION (around line 190-220):

const GuaranteeCardComponent = ({ ... }) => (...)

// And this section in return statement:
<motion.div>
  <h3>Operational Guarantees</h3>
  <div className="grid sm:grid-cols-2 gap-4">
    {guarantees.map(...)}
  </div>
</motion.div>
```

**Result**: SecurityArchitecture will show only:
1. Data Flow (5 steps)
2. Trust Boundaries (diagram)
3. Compliance Alignment (3 columns)

---

### Fix #2: Check Alignment Issues
**How to find misalignment**:
1. Open `localhost:3000` in browser
2. Open DevTools (F12)
3. Use "Inspect" tool to click on misaligned elements
4. Look for issues in:
   - `grid` classes (wrong columns?)
   - `gap-*` spacing (too big/small?)
   - `px-*`/`py-*` padding (uneven?)
   - Responsive breakpoints (`sm:`, `md:`, `lg:`)

**Sections to check**:
```
SecurityArchitecture:
├─ Data flow section (5 numbered items)
├─ Trust boundaries (3-column grid)
└─ Compliance alignment (3-column grid)

DeploymentPaths:
├─ Path selector (5 cards in grid)
└─ Step-by-step commands

GetStarted:
├─ 3 command boxes
└─ Status indicator

TrustAndCTA:
├─ 4 capability cards (2x2 grid)
└─ CTA buttons
```

---

## Build & Test

```bash
# After making changes:
npm run build

# Check for errors (should see "✓ Compiled successfully")

# Test locally:
# Already running on localhost:3000, just refresh browser
```

---

## What NOT to Do

❌ Don't create new components (reuse existing ones)
❌ Don't create .md documentation files (keep in this summary)
❌ Don't use worktrees (edit main repo directly)
❌ Don't invent product features (verify with CLI)
❌ Don't make up claims (everything must be verifiable)
❌ Don't redesign sections (just fix alignment)

---

## What TO Do

✅ Use exact file paths from "File Map" section
✅ Reference line numbers when possible
✅ Test build after EVERY change (`npm run build`)
✅ Cross-check claims against CLI implementation
✅ Use browser DevTools to verify layout
✅ Keep changes surgical (don't rewrite sections)
✅ Follow CLAUDE.md coding standards

---

## If You Get Stuck

1. **Build fails**: Check error message, fix TypeScript error
2. **Component not showing**: Check if it's imported in `page.tsx`
3. **Alignment wrong**: Use browser DevTools → Inspect Element
4. **Claim seems wrong**: Check `/docs/guide/` files for truth
5. **Don't know a Tailwind class**: Use `tailwindcss.com` docs

---

## Questions to Ask User

Before/while working:
1. Which sections have alignment issues? (Be specific: SecurityArchitecture? DeploymentPaths?)
2. Are there OTHER duplications besides guarantees?
3. Should we remove entire sections or just parts?
4. Are all commands in DeploymentPaths accurate?

---

## Estimated Work Time

- Remove guarantee section: **5 min**
- Fix alignment issues: **30-45 min** (depends on issues)
- Verify all content: **20-30 min**
- Mobile testing: **15-20 min**
- Total: **1-2 hours**

---

## Success Criteria

✅ Build passes without errors
✅ No duplicate sections
✅ All links work
✅ All claims verified
✅ Alignment correct on mobile/tablet/desktop
✅ All 3 QuickStart commands work
✅ All 5 DeploymentPaths commands accurate

---

**Good luck! Ask clarifying questions if needed.**
