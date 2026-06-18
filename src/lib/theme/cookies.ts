import { cookies } from "next/headers";
import { resolveTheme } from "./resolve-theme";
import type { ThemeId } from "./types";

export const THEME_COOKIE = "app-theme";

export async function getTheme(): Promise<ThemeId> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return resolveTheme(value);
}
