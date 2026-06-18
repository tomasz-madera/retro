"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { retroUsers } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validators/auth";
import type { ActionResult } from "@/lib/types";

const BCRYPT_COST = 12;

export async function registerUser(
  formData: FormData,
): Promise<ActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const existing = await db
    .select({ id: retroUsers.id })
    .from(retroUsers)
    .where(eq(retroUsers.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_COST);

  await db.insert(retroUsers).values({
    email: parsed.data.email,
    passwordHash,
    role: "user",
  });

  return { success: true, data: { email: parsed.data.email } };
}
