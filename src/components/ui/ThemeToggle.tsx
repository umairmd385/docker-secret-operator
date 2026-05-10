"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className={`${sizeClasses[size]} transition-transform`} />
      ) : (
        <Moon className={`${sizeClasses[size]} transition-transform`} />
      )}
    </button>
  );
}
