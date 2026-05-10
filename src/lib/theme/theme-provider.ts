/**
 * Theme Provider & Dark Mode System
 */

import { LIGHT_THEME, DARK_THEME } from "@/lib/branding/colors";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  isDark: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * Get system preference for dark mode
 */
export function getSystemThemePreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Get stored theme preference from localStorage
 */
export function getStoredThemePreference(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("dso-theme");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return null;
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dso-theme", theme);
}

/**
 * Determine if dark mode should be active
 */
export function shouldBeDarkMode(theme: ThemeMode): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  // system
  return getSystemThemePreference();
}

/**
 * Get CSS variables for current theme
 */
export function getThemeCSSVariables(isDark: boolean): Record<string, string> {
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  return {
    "--bg-background": theme.background,
    "--bg-surface": theme.surface,
    "--bg-surface-alt": theme.surfaceAlt,
    "--text-foreground": theme.foreground,
    "--text-foreground-alt": theme.foregroundAlt,
    "--text-primary": theme.text.primary,
    "--text-secondary": theme.text.secondary,
    "--text-tertiary": theme.text.tertiary,
    "--text-disabled": theme.text.disabled,
    "--border": theme.border,
    "--border-alt": theme.borderAlt,
    "--color-accent": theme.accent,
    "--color-accent-hover": theme.accentHover,
    "--color-action": theme.action,
    "--color-success": theme.success,
    "--color-warning": theme.warning,
    "--color-error": theme.error,
  };
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeVariables(isDark: boolean): void {
  if (typeof document === "undefined") return;

  const variables = getThemeCSSVariables(isDark);
  const root = document.documentElement;

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Add/remove dark class for CSS selectors
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Watch for system theme changes
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener("change", handler);

  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): ThemeMode {
  const stored = getStoredThemePreference();
  const theme = stored || "system";

  const isDark = shouldBeDarkMode(theme);
  applyThemeVariables(isDark);

  return theme;
}
