import { crtTheme } from "@/themes/crt";
import { classicTheme } from "@/themes/classic";
import { pinkTheme } from "@/themes/pink";
import type { ThemeId, ThemeModule } from "./types";

export const DEFAULT_THEME: ThemeId = "classic";

export const THEME_IDS: ThemeId[] = ["classic", "crt", "pink"];

export const themes: Record<ThemeId, ThemeModule> = {
  crt: crtTheme,
  classic: classicTheme,
  pink: pinkTheme,
};

export const themeList = THEME_IDS.map((id) => ({
  id,
  label: themes[id].label,
}));
