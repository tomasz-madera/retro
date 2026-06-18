"use client";

import { useContext } from "react";
import { ThemeContext } from "./provider";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useThemeComponents() {
  return useTheme().theme.components;
}
