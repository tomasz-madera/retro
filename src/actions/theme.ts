"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { THEME_COOKIE } from "@/lib/theme/cookies";
import { resolveTheme } from "@/lib/theme/resolve-theme";
import type { ThemeId } from "@/lib/theme/types";

export async function setThemeAction(themeId: ThemeId) {
  const resolved = resolveTheme(themeId);
  const cookieStore = await cookies();

  cookieStore.set(THEME_COOKIE, resolved, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
