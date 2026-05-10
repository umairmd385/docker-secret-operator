/**
 * Brand Color System - Docker Secret Operator
 *
 * Consistent color palette for all brand applications.
 * Values derived from design system: primary blue, action red, neutral gray, success green.
 */

export const BRAND_COLORS = {
  // Primary: Trust, precision, Docker-native
  primary: {
    light: "#42A5F5",
    main: "#1976D2",
    dark: "#0D47A1",
    darker: "#0A3D91",
  },

  // Secondary: Action, injection, active operations
  secondary: {
    light: "#EF5350",
    main: "#F44336",
    dark: "#D32F2F",
  },

  // Neutral: Professional, background, structural
  neutral: {
    white: "#FFFFFF",
    light: "#F5F5F5",
    lighter: "#EEEEEE",
    pale: "#FAFAFA",
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray900: "#111827",
    black: "#000000",
  },

  // Success: Verification, positive operations
  success: {
    light: "#66BB6A",
    main: "#4CAF50",
    dark: "#388E3C",
  },

  // Warning: Caution, important notes
  warning: {
    light: "#FFB74D",
    main: "#FFA726",
    dark: "#F57C00",
  },

  // Error: Failures, critical issues
  error: {
    light: "#EF5350",
    main: "#F44336",
    dark: "#D32F2F",
  },

  // Semantic: Purpose-driven
  semantic: {
    verified: "#4CAF50",
    injected: "#F44336",
    rotating: "#FFA726",
    encrypted: "#1976D2",
  },
};

/**
 * Light Mode Theme
 */
export const LIGHT_THEME = {
  background: BRAND_COLORS.neutral.white,
  surface: BRAND_COLORS.neutral.light,
  surfaceAlt: BRAND_COLORS.neutral.lighter,
  foreground: BRAND_COLORS.neutral.gray900,
  foregroundAlt: BRAND_COLORS.neutral.gray700,
  border: BRAND_COLORS.neutral.gray200,
  borderAlt: BRAND_COLORS.neutral.gray300,
  text: {
    primary: BRAND_COLORS.neutral.gray900,
    secondary: BRAND_COLORS.neutral.gray600,
    tertiary: BRAND_COLORS.neutral.gray500,
    disabled: BRAND_COLORS.neutral.gray400,
  },
  accent: BRAND_COLORS.primary.main,
  accentHover: BRAND_COLORS.primary.dark,
  action: BRAND_COLORS.secondary.main,
  success: BRAND_COLORS.success.main,
  warning: BRAND_COLORS.warning.main,
  error: BRAND_COLORS.error.main,
};

/**
 * Dark Mode Theme
 */
export const DARK_THEME = {
  background: BRAND_COLORS.neutral.gray900,
  surface: BRAND_COLORS.neutral.gray800,
  surfaceAlt: BRAND_COLORS.neutral.gray700,
  foreground: BRAND_COLORS.neutral.white,
  foregroundAlt: BRAND_COLORS.neutral.gray100,
  border: BRAND_COLORS.neutral.gray700,
  borderAlt: BRAND_COLORS.neutral.gray600,
  text: {
    primary: BRAND_COLORS.neutral.white,
    secondary: BRAND_COLORS.neutral.gray300,
    tertiary: BRAND_COLORS.neutral.gray400,
    disabled: BRAND_COLORS.neutral.gray500,
  },
  accent: BRAND_COLORS.primary.light,
  accentHover: BRAND_COLORS.primary.main,
  action: BRAND_COLORS.secondary.light,
  success: BRAND_COLORS.success.light,
  warning: BRAND_COLORS.warning.light,
  error: BRAND_COLORS.error.light,
};

/**
 * Get theme based on mode
 */
export const getTheme = (isDark: boolean) => isDark ? DARK_THEME : LIGHT_THEME;

/**
 * Color utilities
 */
export const colorUtils = {
  // Convert RGB to Hex
  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  },

  // Convert Hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  },

  // Add opacity to hex color
  withOpacity: (hex: string, opacity: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },
};
