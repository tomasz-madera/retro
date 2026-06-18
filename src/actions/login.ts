"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function loginUser(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      redirect("/login?error=invalid");
    }
    throw error;
  }
}
