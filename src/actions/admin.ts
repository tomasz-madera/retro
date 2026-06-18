"use server";

import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retroUsers } from "@/lib/db/schema";
import type { ActionResult } from "@/lib/types";

export async function getUsers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return [];
  }

  return db
    .select({
      id: retroUsers.id,
      email: retroUsers.email,
      role: retroUsers.role,
      createdAt: retroUsers.createdAt,
    })
    .from(retroUsers)
    .orderBy(asc(retroUsers.email))
    .limit(200);
}

export async function updateUserRole(
  userId: number,
  role: "user" | "admin",
): Promise<ActionResult<{ id: number }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Forbidden" };
  }

  if (Number(session.user.id) === userId) {
    return { success: false, error: "Cannot change your own role" };
  }

  const [user] = await db
    .select({ id: retroUsers.id })
    .from(retroUsers)
    .where(eq(retroUsers.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  await db.update(retroUsers).set({ role }).where(eq(retroUsers.id, userId));

  return { success: true, data: { id: userId } };
}
