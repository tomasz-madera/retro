import Link from "next/link";
import { loginUser } from "@/actions/login";
import { ThemedAuthPanel } from "@/components/theme/ThemedAuthPanel";
import { ThemedButton } from "@/components/theme/ThemedButton";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="auth-page">
      <ThemedAuthPanel title="LOGIN.SYS">
        <h1 className="auth-title">SCRUM RETRO</h1>
        <form action={loginUser} className="auth-form">
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
              className="app-input"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="app-error">Invalid email or password</p>
          )}
          <ThemedButton type="submit" className="w-full">
            Login
          </ThemedButton>
          <p className="auth-link">
            No account? <Link href="/register">Register</Link>
          </p>
        </form>
      </ThemedAuthPanel>
    </div>
  );
}
