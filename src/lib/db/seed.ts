import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { retroUsers } from "./schema";

const BCRYPT_COST = 12;

export async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "tomasz.madera@wskz.pl";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD is required");
  }

  const existing = await db
    .select({ id: retroUsers.id })
    .from(retroUsers)
    .where(eq(retroUsers.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Admin user ${email} already exists, skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  await db.insert(retroUsers).values({
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`Admin user ${email} created.`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
