import { describe, expect, it } from "vitest";
import { registerSchema, createBoardSchema } from "@/lib/validators/auth";

describe("registerSchema", () => {
  it("accepts valid email and password", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("createBoardSchema", () => {
  it("requires at least one column", () => {
    const result = createBoardSchema.safeParse({
      title: "Sprint Retro",
      columns: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid board with columns", () => {
    const result = createBoardSchema.safeParse({
      title: "Sprint Retro",
      columns: [{ name: "Went well" }, { name: "Improve" }],
    });
    expect(result.success).toBe(true);
  });
});
