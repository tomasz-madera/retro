"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { themes, DEFAULT_THEME } from "./registry";
import type { ThemeId, ThemeModule } from "./types";

type ThemeContextValue = {
  themeId: ThemeId;
  theme: ThemeModule;
  setThemeId: (id: ThemeId) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: ThemeId;
};

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    setThemeId(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeId);
  }, [themeId]);

  const value = useMemo(
    () => ({
      themeId,
      theme: themes[themeId],
      setThemeId,
    }),
    [themeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
