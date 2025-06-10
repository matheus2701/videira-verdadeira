
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "videira-theme", // Default storageKey used if not provided
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
          return storedTheme;
        }
      } catch (e) {
        // Ignore localStorage errors (e.g., in private browsing)
        console.error("Failed to read theme from localStorage", e);
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    // This initial state for resolvedTheme is a best-guess for SSR and initial client render.
    // It will be correctly set by the useEffect hook once the client mounts.
    if (defaultTheme === "dark") return "dark";
    return "light"; // Default to light if system or light, as system preference isn't known SSR.
  });

  useEffect(() => {
    // This effect runs on the client after mount.
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const applyTheme = (currentThemeSetting: Theme) => {
      let themeToApply: "light" | "dark";
      if (currentThemeSetting === "system") {
        themeToApply = mediaQuery.matches ? "dark" : "light";
      } else {
        themeToApply = currentThemeSetting;
      }

      root.classList.remove("light", "dark");
      root.classList.add(themeToApply);
      setResolvedTheme(themeToApply);

      try {
        localStorage.setItem(storageKey, currentThemeSetting);
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    };

    applyTheme(theme); // Apply initial theme

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") { // Only react to system changes if theme is "system"
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, storageKey]);


  const handleSetTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
  }), [theme, handleSetTheme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
