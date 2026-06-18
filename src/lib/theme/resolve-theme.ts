import type { ThemeId } from "./types";
import { THEME_IDS, DEFAULT_THEME } from "./registry";

export function resolveTheme(value: string | undefined | null): ThemeId {
  if (value && THEME_IDS.includes(value as ThemeId)) {
    return value as ThemeId;
  }

  return DEFAULT_THEME;
}
