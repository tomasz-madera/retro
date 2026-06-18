"use client";

import { useRouter } from "next/navigation";
import { setThemeAction } from "@/actions/theme";
import { useTheme } from "@/lib/theme/hooks";
import { themeList } from "@/lib/theme/registry";
import type { ThemeId } from "@/lib/theme/types";

export function ThemeToggle() {
  const router = useRouter();
  const { themeId, setThemeId } = useTheme();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ThemeId;
    setThemeId(next);
    await setThemeAction(next);
    router.refresh();
  }

  return (
    <label className="theme-toggle">
      <span className="app-text-muted">Theme</span>
      <select
        className="theme-toggle-select"
        value={themeId}
        onChange={handleChange}
        aria-label="Select theme"
      >
        {themeList.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}
