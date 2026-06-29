# DSO Landing Page Redesign — Implementation Spec
**Date:** 2026-06-29  
**Status:** Approved by user

---

## Objective

Redesign the DSO landing page to achieve premium developer-infrastructure quality (inspired by DragonflyDB's polish), while keeping DSO's own brand identity. Result must feel like a flagship CNCF open-source project — not a DragonflyDB clone.

---

## Brand Tokens (Source of Truth)

| Token | Value |
|---|---|
| Background | `#05070A` |
| Surface | `#0B1118` |
| Primary accent | `#00E6C0` (teal) |
| Secondary accent | `#6D5DF6` (violet) |
| Text primary | `#F8FAFC` |
| Text muted | `#94A3B8` |
| Font sans | Plus Jakarta Sans |
| Font mono | JetBrains Mono |

---

## Codebase State (Pre-Redesign)

### Current page.tsx section order
1. Navbar
2. Hero (2-col, left text / right flow steps)
3. StatsStrip (4 metrics — we created this)
4. ProblemSection (timeline with red cards)
5. TerminalDemo (auto-playing CLI animation)
6. ProductPreview (CLI output + 2-feature grid)
7. WhyDSOExists (3-col philosophy cards)
8. BuiltForFailures (plain text)
9. InstallationSimple (4 deployment paths)
10. TrustAndCTA (trust signals + final CTA)
11. Footer

### Reusable (keep without major change)
- `Navbar.tsx` — keep structure, update color tokens
- `Footer.tsx` — keep structure, update color tokens
- `Button.tsx` — keep API, extend with `glow` variant
- `Typography.tsx` — update H1 scale (much larger)
- `ROUTES` / `links.ts` — unchanged

### Replaced / removed
- `Hero.tsx` → full rewrite (centered)
- `StatsStrip.tsx` → `MetricsStrip.tsx` (5 items, richer)
- `ProblemSection.tsx` → `WhySecretsFail.tsx` (upgrade visual)
- `TerminalDemo.tsx` → `CLIExperience.tsx` (richer terminal)
- `ProductPreview.tsx` → removed (content absorbed into CLIExperience)
- `WhyDSOExists.tsx` → removed (philosophy absorbed into KeyCapabilities)
- `BuiltForFailures.tsx` → removed (absorbed into SecurityGuarantees)
- `InstallationSimple.tsx` → removed (absorbed into FinalCTA)
- `TrustAndCTA.tsx` → `FinalCTA.tsx` (rewrite)

### New components
- `HowDSOWorks.tsx`
- `SecretLifecycle.tsx`
- `KeyCapabilities.tsx`
- `ProviderEcosystem.tsx`
- `SecurityGuarantees.tsx`
- `MetricsStrip.tsx`

---

## New Section Order

```
Navbar
Hero
MetricsStrip
WhySecretsFail
HowDSOWorks
SecretLifecycle
KeyCapabilities
ProviderEcosystem
CLIExperience
SecurityGuarantees
Community (inline in FinalCTA or separate)
FinalCTA
Footer
```

---

## Section Specs

### 1. Hero
- **Layout:** centered, full-width
- **Headline:** very large (text-6xl sm:text-7xl lg:text-8xl), bold, tight tracking, two lines max
  - Line 1: white
  - Line 2: teal with `text-shadow: 0 0 60px rgba(0,230,192,0.35)`
- **Subheading:** 20px, muted, max-width 600px, centered
- **CTAs:** "Get Started" (teal, glow shadow) + "Documentation" (outline)
- **Terminal:** animated CLI below CTAs showing `dso init` → `dso up` → `dso rotate` → `dso inspect` with typing effect
- **Background:** two large radial gradient orbs (teal top-center, violet bottom-right), subtle noise texture overlay
- **No border-b** — flows into MetricsStrip via gradient fade

### 2. MetricsStrip
- 5 items in a horizontal row with hairline dividers
- Items: Zero Downtime · Runtime Injection · 5+ Providers · Zero Disk Writes · Auto Rotation
- Alternating teal / white label colors
- Dark surface background, slight glass effect

### 3. WhySecretsFail
- Renamed from ProblemSection
- Keep timeline metaphor (T+0s, T+5m, T+7m, T+10m)
- Upgrade: larger time labels, more dramatic cards, red glow on hover
- Add a summary "result" block at the bottom with gradient border

### 4. HowDSOWorks (NEW)
- Centered headline + subhead
- Animated vertical flow diagram: Developer → Secret Provider → DSO Engine → Docker Compose → Running Containers
- Each node is a glassmorphism card
- Animated connecting lines (dashed, flowing dots) between nodes
- Framer Motion orchestrated entrance

### 5. SecretLifecycle (NEW)
- Centered headline
- 5-step horizontal timeline (desktop) / vertical (mobile):
  Create → Encrypt → Inject → Rotate → Destroy
- Each step has: icon, label, brief description
- Active step glows teal
- Auto-advances every 2s (loops)

### 6. KeyCapabilities (NEW)
- 6 feature cards in 2×3 grid (desktop), 1-col (mobile)
- Cards: Runtime Injection, Zero Persistence, Automatic Rotation, Provider Plugins, Docker Native, Audit Ready
- Each card: icon (teal), title, description, gradient border, hover lift + glow
- Glassmorphism card background

### 7. ProviderEcosystem (NEW — includes Huawei CSMS)
- Section headline: "Works with your secret provider"
- 5 premium cards:
  - HashiCorp Vault
  - AWS Secrets Manager
  - Azure Key Vault
  - **Huawei Cloud CSMS** ← new
  - Local Secrets
- Each card: provider name, short description, 2–3 capability badges (e.g. "Rotation", "Injection", "Audit")
- Hover: card lifts, border glows teal, badges highlight

### 8. CLIExperience
- Evolved from TerminalDemo
- Two-panel layout: left = description text, right = animated terminal
- Terminal shows 4 commands with typing animation:
  `$ docker dso init` → `$ docker dso up` → `$ docker dso rotate` → `$ docker dso inspect`
- Each command shows realistic output lines
- Blinking cursor between commands
- "Copy" button on install snippet

### 9. SecurityGuarantees (NEW)
- 5 large cards in a grid:
  - Secrets never stored permanently
  - Runtime-only injection
  - Automatic cleanup
  - Encrypted communication
  - Least privilege
- Cards: large icon, bold heading, description
- Background: subtle teal glow on each card hover
- Gradient border on cards

### 10. FinalCTA
- Community links row: GitHub, Docs, Discord, Releases, License
- Large centered headline: "Start rotating secrets in minutes."
- Subtext
- Large "Get Started" CTA (teal, large glow shadow)
- Secondary: "Read Documentation"
- Background: large teal radial glow creating a "stage" effect

---

## Design System Changes

### globals.css — update root tokens
```css
--background: #05070A;
--foreground: #F8FAFC;
--surface: #0B1118;
--surface2: #080D13;
--accent: #00E6C0;
--accent-secondary: #6D5DF6;
--muted: #94A3B8;
```

### Typography.tsx — upgrade H1
```
text-6xl sm:text-7xl lg:text-8xl  (up from 4xl/5xl/6xl)
tracking-tighter
```

### Button.tsx — add glow variant
Primary button gets `box-shadow: 0 0 40px rgba(0,230,192,0.3)` on hover.

---

## Background Treatment (Global)
- Fixed `background: #05070A` on `<body>`
- Large radial gradient orbs via `position: fixed, pointer-events: none, z-index: 0`:
  - Teal orb: top-center, 800px diameter, 6% opacity, blur 180px
  - Violet orb: bottom-right, 600px diameter, 5% opacity, blur 150px
- Subtle noise texture: SVG filter or CSS noise at 2% opacity
- Section borders replaced with gradient fades (`bg-gradient-to-b from-transparent via-border/20 to-transparent`)

---

## Animation Principles
- All `whileInView` with `once: true` — no repeat triggers
- Entrance: `opacity 0→1`, `y 24→0`, `duration 0.5`
- Stagger children: `delay: idx * 0.08`
- Hover micro: `scale 1.01`, `y -2`, `duration 0.15`
- Terminal: typewriter at 40ms/character
- Architecture flow: SVG path `strokeDashoffset` animation
- SecretLifecycle: auto-advance every 2000ms
- Respect `prefers-reduced-motion`: wrap all motion in `useReducedMotion()` check

---

## Huawei Cloud CSMS — Provider Card Data
```
Name: Huawei Cloud CSMS
Description: Cloud Secret Management Service — enterprise-grade secret storage on Huawei Cloud
Badges: Rotation, Injection, Audit
```
Also add to: `Hero.tsx` provider pills, `InstallationSimple` paths (→ `/deploy#huawei`).

---

## Files Changed

| File | Action |
|---|---|
| `src/app/globals.css` | Update design tokens |
| `src/components/ui/Typography.tsx` | Upgrade H1 scale |
| `src/components/ui/Button.tsx` | Add glow behavior |
| `src/app/page.tsx` | New section order |
| `src/components/sections/Hero.tsx` | Full rewrite |
| `src/components/sections/MetricsStrip.tsx` | New (replaces StatsStrip) |
| `src/components/sections/WhySecretsFail.tsx` | Rewrite ProblemSection |
| `src/components/sections/HowDSOWorks.tsx` | New |
| `src/components/sections/SecretLifecycle.tsx` | New |
| `src/components/sections/KeyCapabilities.tsx` | New |
| `src/components/sections/ProviderEcosystem.tsx` | New |
| `src/components/sections/CLIExperience.tsx` | Rewrite TerminalDemo |
| `src/components/sections/SecurityGuarantees.tsx` | New |
| `src/components/sections/FinalCTA.tsx` | Rewrite TrustAndCTA |
| `src/components/sections/StatsStrip.tsx` | Deleted |
| `src/components/sections/ProblemSection.tsx` | Deleted |
| `src/components/sections/TerminalDemo.tsx` | Deleted |
| `src/components/sections/ProductPreview.tsx` | Deleted |
| `src/components/sections/WhyDSOExists.tsx` | Deleted |
| `src/components/sections/BuiltForFailures.tsx` | Deleted |
| `src/components/sections/InstallationSimple.tsx` | Deleted |
| `src/components/sections/TrustAndCTA.tsx` | Deleted |

---

## Non-Goals
- Do not change Navbar structure
- Do not change Footer structure
- Do not modify any routing or SEO metadata
- Do not touch `/docs`, `/deploy`, `/architecture`, `/community` pages
- Do not add new npm dependencies (use existing: framer-motion, lucide-react)
