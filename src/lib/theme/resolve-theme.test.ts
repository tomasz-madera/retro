import { describe, it, expect } from "vitest";
import { DEFAULT_THEME } from "./registry";
import { resolveTheme } from "./resolve-theme";

describe("resolveTheme", () => {
  it("returns default theme for invalid value", () => {
    expect(resolveTheme("invalid")).toBe(DEFAULT_THEME);
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveTheme(undefined)).toBe(DEFAULT_THEME);
  });

  it("returns valid theme ids", () => {
    expect(resolveTheme("crt")).toBe("crt");
    expect(resolveTheme("classic")).toBe("classic");
    expect(resolveTheme("pink")).toBe("pink");
  });
});
