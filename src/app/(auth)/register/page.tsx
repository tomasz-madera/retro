"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { ThemedAuthPanel } from "@/components/theme/ThemedAuthPanel";
import { ThemedButton } from "@/components/theme/ThemedButton";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="auth-page">
      <ThemedAuthPanel title="REGISTER.SYS">
        <h1 className="auth-title">NEW USER</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="email" className="app-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="app-input"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="app-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="app-input"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="app-error">{error}</p>}
          <ThemedButton type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Register"}
          </ThemedButton>
          <p className="auth-link">
            Have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </ThemedAuthPanel>
    </div>
  );
}
