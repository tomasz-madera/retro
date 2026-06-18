"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { CRTScreen } from "@/components/retro/CRTScreen";
import { Terminal } from "@/components/retro/Terminal";
import { RetroButton } from "@/components/retro/RetroButton";

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
    <CRTScreen>
      <div className="auth-page">
        <Terminal title="REGISTER.SYS">
          <h1 className="auth-title">NEW USER</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label htmlFor="email" className="retro-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="retro-input"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="retro-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="retro-input"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="retro-error">{error}</p>}
            <RetroButton type="submit" disabled={pending} className="w-full">
              {pending ? "Creating..." : "Register"}
            </RetroButton>
            <p className="auth-link">
              Have an account? <Link href="/login">Login</Link>
            </p>
          </form>
        </Terminal>
      </div>
    </CRTScreen>
  );
}
