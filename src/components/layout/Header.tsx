import Link from "next/link";
import { signOut } from "@/lib/auth";

type HeaderProps = {
  email: string;
  role: "user" | "admin";
};

export function Header({ email, role }: HeaderProps) {
  return (
    <header className="retro-header">
      <div className="retro-header-inner">
        <Link href="/" className="retro-logo">
          SCRUM RETRO
        </Link>
        <nav className="retro-nav">
          <Link href="/">Dashboard</Link>
          <Link href="/retro/new">New Retro</Link>
          {role === "admin" && <Link href="/admin/users">Admin</Link>}
          <span className="retro-user">{email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="retro-link-btn">
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
