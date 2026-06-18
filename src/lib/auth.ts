import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { retroUsers } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validators/auth";

declare module "next-auth" {
  interface User {
    role: "user" | "admin";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: "user" | "admin";
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const [user] = await db
          .select({
            id: retroUsers.id,
            email: retroUsers.email,
            passwordHash: retroUsers.passwordHash,
            role: retroUsers.role,
          })
          .from(retroUsers)
          .where(eq(retroUsers.email, parsed.data.email))
          .limit(1);

        if (!user) {
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
