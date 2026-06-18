import Link from "next/link";
import { loginUser } from "@/actions/login";
import { CRTScreen } from "@/components/retro/CRTScreen";
import { Terminal } from "@/components/retro/Terminal";
import { RetroButton } from "@/components/retro/RetroButton";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <CRTScreen>
      <div className="auth-page">
        <Terminal title="LOGIN.SYS">
          <h1 className="auth-title">SCRUM RETRO</h1>
          <form action={loginUser} className="auth-form">
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
                className="retro-input"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="retro-error">Invalid email or password</p>
            )}
            <RetroButton type="submit" className="w-full">
              Login
            </RetroButton>
            <p className="auth-link">
              No account? <Link href="/register">Register</Link>
            </p>
          </form>
        </Terminal>
      </div>
    </CRTScreen>
  );
}
