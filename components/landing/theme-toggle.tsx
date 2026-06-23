"use client";

import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, setIsDark, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-12 h-7 rounded-full bg-muted transition-all duration-500 flex items-center"
      aria-label="Toggle dark mode"
    >
      {/* Background */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        isDark ? "bg-muted/50" : "bg-muted/80"
      }`} />

      {/* Thumb */}
      <div
        className={`absolute w-6 h-6 rounded-full bg-foreground shadow-lg transition-all duration-500 flex items-center justify-center ${
          isDark ? "translate-x-6" : "translate-x-0.5"
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-background" />
        ) : (
          <Sun className="w-3 h-3 text-background" />
        )}
      </div>
    </button>
  );
}
