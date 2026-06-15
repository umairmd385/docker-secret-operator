/**
 * DSO Design System
 *
 * Inspired by Linear, Vercel, Supabase, Stripe
 * Focus: Consistency, clarity, and intentionality
 */

// Spacing scale (4px base)
export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "2.5rem",  // 40px
  "3xl": "3rem",    // 48px
  "4xl": "4rem",    // 64px
  "5xl": "6rem",    // 96px
} as const;

// Typography scale (Linear-inspired)
export const typography = {
  // Display - Hero sections
  "display-lg": {
    fontSize: "3.5rem",
    lineHeight: "1.1",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  "display-md": {
    fontSize: "3rem",
    lineHeight: "1.2",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  // Heading - Section titles
  "heading-lg": {
    fontSize: "2rem",
    lineHeight: "1.3",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  "heading-md": {
    fontSize: "1.5rem",
    lineHeight: "1.4",
    fontWeight: 700,
  },
  "heading-sm": {
    fontSize: "1.25rem",
    lineHeight: "1.4",
    fontWeight: 600,
  },

  // Body - Running text
  "body-lg": {
    fontSize: "1.125rem",
    lineHeight: "1.6",
    fontWeight: 400,
  },
  "body-md": {
    fontSize: "1rem",
    lineHeight: "1.6",
    fontWeight: 400,
  },
  "body-sm": {
    fontSize: "0.875rem",
    lineHeight: "1.5",
    fontWeight: 400,
  },

  // Caption - Labels, small text
  "caption": {
    fontSize: "0.75rem",
    lineHeight: "1.4",
    fontWeight: 500,
  },

  // Mono - Code, terminal output
  "mono": {
    fontSize: "0.875rem",
    lineHeight: "1.6",
    fontFamily: "var(--font-mono)",
  },
} as const;

// Component radius consistency
export const radius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

// Shadows (minimal, clean)
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
} as const;

// Colors
export const colors = {
  // Dark theme
  background: "#0d1117",
  surface: "#161b22",
  surface2: "#0a0d12",
  surfaceHover: "#1c2128",
  border: "rgba(255, 255, 255, 0.1)",
  borderSoft: "rgba(255, 255, 255, 0.05)",

  // Text
  foreground: "#e2e8f0",
  foregroundAlt: "#cbd5e1",
  textSecondary: "#94a3b8",
  textTertiary: "#64748b",

  // Accent
  accent: "#00e6c0",
  accentDim: "rgba(0, 230, 192, 0.1)",
  accentDark: "#00d4ae",

  // Semantic
  success: "#4caf50",
  warning: "#ffa726",
  error: "#ef5350",
  info: "#42a5f5",
} as const;

// Transition durations (minimal motion)
export const transitions = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// Container widths (consistent section widths)
export const containers = {
  sm: "32rem",      // 512px
  md: "42rem",      // 672px
  lg: "64rem",      // 1024px
  xl: "80rem",      // 1280px
  "2xl": "88rem",   // 1408px
} as const;

// Breakpoints (mobile-first)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
