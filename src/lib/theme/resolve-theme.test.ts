import { describe, it, expect } from "vitest";
import { resolveTheme } from "./resolve-theme";

describe("resolveTheme", () => {
  it("returns default theme for invalid value", () => {
    expect(resolveTheme("invalid")).toBe("crt");
    expect(resolveTheme(null)).toBe("crt");
    expect(resolveTheme(undefined)).toBe("crt");
  });

  it("returns valid theme ids", () => {
    expect(resolveTheme("crt")).toBe("crt");
    expect(resolveTheme("classic")).toBe("classic");
    expect(resolveTheme("pink")).toBe("pink");
  });
});
