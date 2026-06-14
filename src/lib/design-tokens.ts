/**
 * DSO Premium Design Tokens
 * Source of truth for design system values (reflected in globals.css)
 * Use these in component code when CSS variables aren't sufficient
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Backgrounds — White + Layered Slate
  bg: {
    primary: "#FFFFFF",    // Main background - clean white
    secondary: "#F8FAFC",  // Primary surface (slate-50)
    tertiary: "#F1F5F9",   // Secondary surface (slate-100)
    elevated: "#FFFFFF",   // Premium cards - white lift
    hover: "#F3F4F6",      // Hover states (slate-100)
  },

  // Text — Dark Slate Hierarchy
  text: {
    primary: "#0F172A",    // Primary text (slate-900)
    secondary: "#334155",  // Secondary text (slate-700)
    tertiary: "#64748B",   // Tertiary/muted (slate-600)
    disabled: "#94A3B8",   // Disabled state (slate-500)
  },

  // Accent — Emerald Authority (Trust + Security)
  accent: {
    DEFAULT: "#047857",       // Primary (emerald-700)
    light: "#10B981",         // Light (emerald-500)
    lighter: "#6EE7B7",       // Lighter (emerald-300)
    dark: "#065F46",          // Dark (emerald-800)
    dim: "rgba(4, 120, 87, 0.08)",      // 8% opacity
    dimMedium: "rgba(4, 120, 87, 0.12)", // 12% opacity
    dimStrong: "rgba(4, 120, 87, 0.2)", // 20% opacity - hover states
    // Backwards compat aliases
    cyan: "#047857",          // Emerald (new primary)
    emerald: "#047857",       // Emerald (trust)
  },

  // Accent Secondary — Indigo Intelligence (Premium Polish)
  indigo: {
    DEFAULT: "#4F46E5",       // Indigo-600
    light: "#6366F1",         // Indigo-500
    lighter: "#A5B4FC",       // Indigo-300
    dark: "#4338CA",          // Indigo-700
    dim: "rgba(79, 70, 229, 0.08)",
  },

  // Semantic — Status Colors
  success: "#059669",       // Emerald-600 (success)
  warning: "#D97706",       // Amber-600 (warnings)
  error: "#DC2626",         // Red-600 (errors)
  info: "#2563EB",          // Blue-600 (information)

  // Borders — Subtle Slate
  border: "#E2E8F0",        // Default (slate-200)
  borderLight: "#F1F5F9",   // Subtle (slate-100)
  borderAccent: "rgba(4, 120, 87, 0.2)",    // Emerald border
  borderAccentLight: "rgba(4, 120, 87, 0.1)", // Light emerald
  borderAccentMedium: "rgba(4, 120, 87, 0.3)", // Medium emerald
  borderIndigo: "rgba(79, 70, 229, 0.15)",  // Indigo border

  // Borders — Grouped API
  borders: {
    default: "#E2E8F0",    // Standard
    light: "#F1F5F9",      // Subtle
    accent: "rgba(4, 120, 87, 0.2)",      // Emerald
    accentLight: "rgba(4, 120, 87, 0.1)", // Light emerald
    accentMedium: "rgba(4, 120, 87, 0.3)", // Medium emerald
    indigo: "rgba(79, 70, 229, 0.15)",  // Indigo
  },
} as const;

// ============================================================================
// TYPOGRAPHY — Inter/Geist Professional
// ============================================================================

export const typography = {
  family: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },

  // Scale — clamp for fluid typography (responsive sizing)
  scales: {
    h1: "clamp(2.25rem, 1rem + 7vw, 4rem)",    // 36-64px
    h2: "clamp(1.875rem, 0.875rem + 4.5vw, 3rem)", // 30-48px
    h3: "clamp(1.5rem, 0.75rem + 3vw, 2.25rem)",  // 24-36px
    h4: "1.25rem",  // 20px
    h5: "1.125rem", // 18px
    h6: "1rem",     // 16px
    bodyLg: "1.125rem", // 18px
    body: "1rem",   // 16px
    bodySm: "0.875rem", // 14px
    bodyXs: "0.75rem",  // 12px
    code: "0.875rem",   // 14px
    label: "0.875rem",  // 14px
    caption: "0.75rem", // 12px
  },

  // Font weights (semantic names)
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights (improved for readability)
  lineHeights: {
    tight: 1.1,      // Headlines
    snug: 1.2,       // Subheadings
    normal: 1.3,     // Technical content
    relaxed: 1.5,    // Body text
    loose: 1.75,     // Prose/documentation
  },

  // Letter spacing
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.05em",
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // Base 4px unit scale
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem",   // 48px
  "4xl": "4rem",   // 64px
  "5xl": "6rem",   // 96px
  "6xl": "8rem",   // 128px

  // Section padding (responsive clamp)
  section: {
    compact: "clamp(3rem, 2rem + 5vw, 5rem)",      // 48-80px
    normal: "clamp(4rem, 2rem + 7vw, 8rem)",       // 64-128px
    spacious: "clamp(5rem, 2rem + 10vw, 10rem)",   // 80-160px
    // Backwards compat — Tailwind class aliases
    desktop: "py-32 lg:py-40",   // 128px / 160px
    tablet: "py-24",             // 96px
    mobile: "py-16",             // 64px
  },

  // Component padding
  component: {
    sm: "0.75rem",   // 12px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
  },

  // Container (backwards compat)
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
} as const;

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================

export const shadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
  sm: "0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)",
  md: "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.08)",
  lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.08)",
  xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
  "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
  glow: "0 0 20px rgba(4, 120, 87, 0.08)",
  glowStrong: "0 0 30px rgba(4, 120, 87, 0.12)",
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const radius = {
  none: "0",
  xs: "0.25rem",   // 4px
  sm: "0.375rem",  // 6px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// ============================================================================
// MOTION & ANIMATION
// ============================================================================

export const motion = {
  // Durations
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },

  // Easing functions
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
    outQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    outCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  },

  // Standard transitions (CSS)
  transition: {
    fast: "150ms ease-out",
    normal: "300ms ease-out",
    slow: "500ms ease-out",
  },

  // Framer Motion defaults
  framingDefaults: {
    duration: 0.3,
    ease: "easeInOut",
  },
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const components = {
  // Button
  button: {
    primary: {
      bg: colors.accent.DEFAULT,    // Emerald-700
      text: "#FFFFFF",               // White text on emerald
      hover: colors.accent.dark,     // Emerald-800
      active: colors.accent.dark,
      disabled: colors.text.disabled,
    },
    secondary: {
      bg: colors.bg.secondary,       // Slate-50
      border: colors.borderAccent,
      text: colors.text.primary,     // Dark slate
      hover: colors.accent.dim,
      active: colors.accent.dimMedium,
    },
    ghost: {
      bg: "transparent",
      text: colors.text.secondary,
      hover: colors.text.primary,
    },
  },

  // Card
  card: {
    bg: colors.bg.secondary,
    border: colors.border,
    borderHover: colors.borderAccent,
  },

  // Input
  input: {
    bg: colors.bg.tertiary,
    border: colors.border,
    borderFocus: colors.accent.DEFAULT,
    text: colors.text.primary,
    placeholder: colors.text.tertiary,
  },

  // Badge
  badge: {
    primary: {
      bg: colors.accent.dim,
      border: colors.borderAccent,
      text: colors.accent.light,
    },
    secondary: {
      bg: colors.bg.tertiary,
      border: colors.borderLight,
      text: colors.text.secondary,
    },
  },
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
