import Link from "next/link";
import { signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type HeaderProps = {
  email: string;
  role: "user" | "admin";
};

export function Header({ email, role }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-logo">
          SCRUM RETRO
        </Link>
        <nav className="app-nav">
          <Link href="/">Dashboard</Link>
          <Link href="/retro/new">New Retro</Link>
          {role === "admin" && <Link href="/admin/users">Admin</Link>}
          <ThemeToggle />
          <span className="app-user">{email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="app-link-button">
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
