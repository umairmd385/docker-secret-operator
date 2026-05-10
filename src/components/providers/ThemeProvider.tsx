"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeMode,
  shouldBeDarkMode,
  applyThemeVariables,
  watchSystemTheme,
  getStoredThemePreference,
  saveThemePreference,
} from "@/lib/theme/theme-provider";

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Get stored preference or default to system
    const stored = getStoredThemePreference() || "system";
    const dark = shouldBeDarkMode(stored);

    // Apply theme immediately
    setThemeState(stored);
    setIsDark(dark);
    applyThemeVariables(dark);
    setMounted(true);

    // Watch for system theme changes if set to system
    if (stored === "system") {
      return watchSystemTheme((systemDark) => {
        setIsDark(systemDark);
        applyThemeVariables(systemDark);
      });
    }
  }, []);

  // Watch system preference when theme is "system"
  useEffect(() => {
    if (theme !== "system" || !mounted) return;

    return watchSystemTheme((systemDark) => {
      setIsDark(systemDark);
      applyThemeVariables(systemDark);
    });
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);

    const dark = shouldBeDarkMode(newTheme);
    setIsDark(dark);
    applyThemeVariables(dark);
  };

  const toggleTheme = () => {
    const newTheme: ThemeMode = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    isDark,
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
