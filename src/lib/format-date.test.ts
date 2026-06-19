import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "./format-date";

describe("formatDate", () => {
  it("formats with fixed locale and timezone", () => {
    expect(formatDate("2026-06-18T13:49:33.000Z")).toBe("18.06.2026");
  });
});

describe("formatDateTime", () => {
  it("formats with fixed locale and timezone", () => {
    expect(formatDateTime("2026-06-18T13:49:33.000Z")).toBe(
      "18.06.2026, 15:49:33",
    );
  });
});
