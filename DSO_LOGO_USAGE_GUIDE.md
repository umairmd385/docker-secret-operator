# DSO Logo Usage Guide
## Brand Asset Library & Implementation Standards

**Version:** 2.0 (Refined)  
**Date:** May 10, 2026  
**Status:** Production Ready

---

## QUICK START

### Logo Files Provided

```
/public/logo/
├── dso-primary-logo-refined.svg      (Full lockup: symbol + text)
├── dso-icon-refined.svg              (Icon only: 1:1 square)
├── dso-favicon-refined.svg           (Favicon: ultra-simplified)
├── dso-navbar-refined.svg            (Navbar: horizontal compact)
├── dso-monochrome.svg                (B&W: print & accessibility)
├── dso-dark-mode.svg                 (Dark background optimized)
└── dso-light-mode.svg                (Light background optimized)
```

### Quick Selection

| Use Case | File | Dimensions | Best For |
|----------|------|------------|----------|
| **Hero Section** | dso-primary-logo-refined.svg | 280×120px or 400×150px | Landing page main visual |
| **Navbar/Header** | dso-navbar-refined.svg | 160×40px or responsive | Top navigation |
| **Footer** | dso-icon-refined.svg | 32-40px | Secondary placement |
| **GitHub README** | dso-primary-logo-refined.svg | 300px width | Project cover |
| **Favicon** | dso-favicon-refined.svg | 16/32/64/128px | Browser tab |
| **Social Media** | dso-icon-refined.svg | 256-512px | Profile picture, cover |
| **Dark Background** | dso-dark-mode.svg | Variable | Dark theme websites |
| **Print/B&W** | dso-monochrome.svg | Variable | Printed materials |
| **Blog/Content** | dso-icon-refined.svg | 48-64px | Article headers |

---

## DETAILED LOGO SPECIFICATIONS

### 1. PRIMARY LOGO (Full Lockup)

**File:** `dso-primary-logo-refined.svg`  
**Aspect Ratio:** 2.33:1 (280×120px native)  
**Color Scheme:** Primary Blue (#1976D2)

**Use Cases:**
- Landing page hero section
- GitHub README cover
- Blog header images
- Social media cover photos
- Marketing materials
- Presentation title slides

**Sizing Guidelines:**
- **Minimum width:** 200px (maintains readability)
- **Recommended width:** 300-400px
- **Maximum width:** 1200px (OG cards)
- **Height:** Scales proportionally

**Spacing:**
- Clear space around logo: 20px minimum
- Distance from other elements: 30px minimum
- No elements should touch the logo frame

**Implementation:**
```html
<!-- Hero Section Example -->
<img 
  src="/logo/dso-primary-logo-refined.svg" 
  alt="Docker Secret Operator - Runtime Secret Injection" 
  width="400" 
  height="172"
  class="logo-hero"
/>

<!-- CSS -->
.logo-hero {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
```

---

### 2. ICON-ONLY LOGO

**File:** `dso-icon-refined.svg`  
**Aspect Ratio:** 1:1 (Square)  
**Color Scheme:** Primary Blue (#1976D2)

**Use Cases:**
- Profile pictures
- App icons
- Favicon alternative
- Avatar/user icon
- Small UI elements
- Social media profile picture

**Sizing Guidelines:**
- **16px:** Favicon alternative, small UI
- **32px:** Navigation icons, small contexts
- **48px:** Blog headers, article icons
- **64px:** Avatar, profile picture
- **128px:** App icon, large avatar
- **256px:** Social media profile
- **512px:** App store icon

**Implementation:**
```html
<!-- Profile Picture -->
<img 
  src="/logo/dso-icon-refined.svg" 
  alt="DSO" 
  width="128" 
  height="128"
  class="profile-avatar"
/>

<!-- Navbar Icon -->
<img 
  src="/logo/dso-icon-refined.svg" 
  alt="DSO Home" 
  width="32" 
  height="32"
  class="navbar-logo"
/>
```

---

### 3. FAVICON

**File:** `dso-favicon-refined.svg`  
**Viewbox:** 64×64px (internal coordinates)  
**Color Scheme:** Primary Blue (#1976D2)

**Use Cases:**
- Browser tab icons
- Bookmark icons
- Favicon for website
- App shortcuts
- Emoji/icon scale usage

**Sizing For Different Contexts:**
```
16×16px   → Browser tab (primary)
32×32px   → Bookmark, small icons
64×64px   → Standard web favicon
128×128px → Home screen icons
256×256px → Touch icons
```

**Implementation:**
```html
<!-- Favicon Head Tag -->
<link rel="icon" href="/logo/dso-favicon-refined.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico"> <!-- Fallback -->
<link rel="apple-touch-icon" href="/logo/dso-favicon-refined.svg">

<!-- Manifest File -->
{
  "icons": [
    {
      "src": "/logo/dso-favicon-refined.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

---

### 4. NAVBAR LOGO

**File:** `dso-navbar-refined.svg`  
**Aspect Ratio:** 4:1 (200×50px native)  
**Color Scheme:** Primary Blue (#1976D2)

**Use Cases:**
- Website header/navbar
- Horizontal navigation bars
- Compact brand placement
- Small header logos

**Sizing Guidelines:**
- **40px height:** Typical navbar height
- **160px width:** Corresponding width for 40px height
- **Scale proportionally:** Maintain 4:1 ratio

**Implementation:**
```html
<!-- Navbar Logo -->
<a href="/" class="navbar-brand">
  <img 
    src="/logo/dso-navbar-refined.svg" 
    alt="DSO" 
    height="40"
  />
</a>

<!-- CSS -->
.navbar-brand img {
  height: 40px;
  width: auto;
  display: block;
}

@media (max-width: 768px) {
  .navbar-brand img {
    height: 32px;
  }
}
```

---

### 5. MONOCHROME VERSION

**File:** `dso-monochrome.svg`  
**Aspect Ratio:** 2.33:1 (280×120px native)  
**Color Scheme:** Black (#000000) on transparent

**Use Cases:**
- Printed materials
- Black and white publications
- Accessibility (color-blind friendly)
- Fax/scanning documents
- B&W brochures
- Terminal/CLI applications
- Low-color environments

**Sizing:** Same as primary logo

**Implementation:**
```html
<!-- Print Media -->
<img 
  src="/logo/dso-monochrome.svg" 
  alt="Docker Secret Operator" 
  width="300"
  class="print-logo"
/>

<!-- CSS for Print -->
@media print {
  .logo-hero {
    content: url('/logo/dso-monochrome.svg');
  }
}
```

---

### 6. DARK MODE VERSION

**File:** `dso-dark-mode.svg`  
**Aspect Ratio:** 2.33:1 (280×120px native)  
**Color Scheme:** White (#FFFFFF) with light blue gradient

**Use Cases:**
- Dark theme websites
- Dark background contexts
- Night mode interfaces
- Dark documentation sites
- Dark landing pages

**Sizing:** Same as primary logo

**Implementation:**
```html
<!-- Dark Mode Support -->
<img 
  src="/logo/dso-primary-logo-refined.svg" 
  alt="DSO" 
  class="logo-dynamic"
  width="300"
/>

<!-- CSS -->
@media (prefers-color-scheme: dark) {
  .logo-dynamic {
    content: url('/logo/dso-dark-mode.svg');
  }
}

<!-- Or with picture element -->
<picture>
  <source 
    srcset="/logo/dso-dark-mode.svg" 
    media="(prefers-color-scheme: dark)"
  />
  <img 
    src="/logo/dso-primary-logo-refined.svg" 
    alt="DSO"
    width="300"
  />
</picture>
```

---

### 7. LIGHT MODE VERSION

**File:** `dso-light-mode.svg`  
**Aspect Ratio:** 2.33:1 (280×120px native)  
**Color Scheme:** Dark Blue (#1976D2) on transparent

**Use Cases:**
- Light background contexts
- Standard light mode
- White background websites
- Print materials
- Default/fallback usage

**Sizing:** Same as primary logo

**Implementation:**
```html
<img 
  src="/logo/dso-light-mode.svg" 
  alt="Docker Secret Operator" 
  width="300"
/>
```

---

## COLOR SPECIFICATIONS

### Primary Brand Color

**Name:** Deep Docker Blue  
**Hex:** `#1976D2`  
**RGB:** `25, 118, 210`  
**HSL:** `216, 84%, 46%`  
**WCAG Contrast on White:** 7.8:1 (AAA)

### Secondary/Accent Color

**Name:** Cyan/Teal (Optional)  
**Hex:** `#00BCD4`  
**RGB:** `0, 188, 212`  
**HSL:** `187, 100%, 42%`  
**Note:** Use sparingly, primarily for hover states

### Dark Mode Text

**Name:** White  
**Hex:** `#FFFFFF`  
**RGB:** `255, 255, 255`  
**Contrast on Dark Background:** 21:1 (AAA)

### Light Mode Text

**Name:** Dark Gray  
**Hex:** `#666666`  
**RGB:** `102, 102, 102`  
**Contrast on White:** 9.5:1 (AAA)

### Monochrome

**Name:** Black  
**Hex:** `#000000`  
**RGB:** `0, 0, 0`  
**Contrast on White:** 21:1 (AAA)

---

## TYPOGRAPHY PAIRING

### Primary Wordmark: "DSO"
- **Font:** Inter, Roboto, or system sans-serif
- **Size:** 28-32px
- **Weight:** 700 (Bold)
- **Letter-spacing:** -0.5px
- **Color:** #1976D2

### Subtitle: "DOCKER SECRET OPERATOR"
- **Font:** Inter, Roboto, or system sans-serif
- **Size:** 11-12px
- **Weight:** 500-600
- **Letter-spacing:** 0.8px
- **Color:** #666666 (light mode) / #B0BEC5 (dark mode)
- **All-caps:** Yes

---

## CLEAR SPACE & MARGINS

```
┌─────────────────────────────────────────┐
│  20px clear space on all sides          │
│                                         │
│    ┌──────────────────────────┐        │
│    │   DSO LOGO               │        │
│    │   Symbol + Text          │        │
│    │                          │        │
│    └──────────────────────────┘        │
│                                         │
│  20px clear space on all sides          │
└─────────────────────────────────────────┘
```

**Minimum clear space:** 20px (or 1/5 of logo width)

---

## WHAT NOT TO DO

❌ **DON'T:**
- Stretch or distort the logo
- Rotate the logo (except in special contexts)
- Add drop shadows or filters (use provided versions instead)
- Change the colors
- Combine the logo with other logos
- Place the logo on busy/conflicting backgrounds
- Use outdated logo versions
- Scale below 100px width (for primary logo)
- Place text inside the logo frame
- Use the logo with different fonts/text

✅ **DO:**
- Use the appropriate file for each context
- Maintain 2.33:1 aspect ratio (for full logo)
- Use adequate clear space
- Test at actual display sizes
- Use dark mode version on dark backgrounds
- Provide alt text for accessibility
- Use high-quality SVG format
- Keep the logo simple and uncluttered

---

## ACCESSIBILITY REQUIREMENTS

### Alt Text Examples

```html
<!-- Full Logo -->
<img alt="Docker Secret Operator - Runtime Secret Injection for Docker" src="...">

<!-- Icon -->
<img alt="DSO - Docker Secret Operator" src="...">

<!-- Favicon -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" aria-label="DSO">
```

### Color Contrast

- ✅ Primary on white: 7.8:1 (AAA)
- ✅ Dark mode white on black: 21:1 (AAA)
- ✅ Monochrome: 21:1 (AAA)

### Screen Reader Support

```html
<img 
  src="/logo/dso-icon-refined.svg" 
  alt="Docker Secret Operator logo"
  aria-label="Docker Secret Operator - Secret Injection for Docker"
/>
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Update `/public/logo/` with refined versions
- [ ] Update favicon in `docs/.vitepress/config.mts`
- [ ] Update favicon in `src/app/layout.tsx`
- [ ] Update hero section logo (dso-primary-logo-refined.svg)
- [ ] Update navbar logo (dso-navbar-refined.svg)
- [ ] Update footer logo (dso-icon-refined.svg)
- [ ] Test at all viewport sizes (mobile, tablet, desktop)
- [ ] Test in dark mode
- [ ] Test in light mode
- [ ] Verify contrast ratios (WCAG AA+)
- [ ] Test favicon at 16/32/64px
- [ ] Update GitHub README logo
- [ ] Update OpenGraph cards
- [ ] Test on actual devices/browsers
- [ ] Document in brand guidelines
- [ ] Announce to team/community

---

## VERSION CONTROL

### Current Version: 2.0 (Refined)

**Changes from 1.0:**
- Simplified visual complexity
- Strengthened central drop symbol
- Reduced color competing
- Improved silhouette for favicon
- Single downward flow (removed bi-directional arrows)
- Better typography balance
- Enhanced dark/light mode support
- Monochrome version added

**Date:** May 10, 2026  
**Status:** Production Ready  
**Approved:** Senior OSS Brand Designer

---

## SUPPORT & QUESTIONS

For logo usage questions:
1. Check this guide first
2. Review provided SVG files
3. Test in your specific context
4. Follow WCAG accessibility standards
5. Maintain brand consistency

---

**Last Updated:** May 10, 2026  
**Next Review:** Q4 2026
