import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBoards } from "@/actions/board";
import { Header } from "@/components/layout/Header";
import { ThemedButton } from "@/components/theme/ThemedButton";

export default async function DashboardPage() {
  const session = await auth();
  const { active, closed } = await getBoards();

  return (
    <>
      <Header
        email={session!.user.email}
        role={session!.user.role}
      />
      <main className="app-main">
        <div className="app-board-header">
          <h1 className="app-board-title">RETROSPECTIVES</h1>
          <Link href="/retro/new">
            <ThemedButton>+ New Retro</ThemedButton>
          </Link>
        </div>

        <section className="app-section">
          <h2 className="app-section-title">Active</h2>
          {active.length === 0 ? (
            <p className="app-empty">No active retrospectives.</p>
          ) : (
            <div className="app-board-list">
              {active.map((board) => (
                <Link
                  key={board.id}
                  href={`/retro/${board.id}`}
                  className="app-board-item"
                >
                  <div>
                    <div className="app-board-item-title">{board.title}</div>
                    <div className="app-board-item-meta">
                      by {board.creatorEmail} &middot;{" "}
                      {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="status-badge status-active">active</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="app-section">
          <h2 className="app-section-title">History</h2>
          {closed.length === 0 ? (
            <p className="app-empty">No closed retrospectives yet.</p>
          ) : (
            <div className="app-board-list">
              {closed.map((board) => (
                <Link
                  key={board.id}
                  href={`/retro/${board.id}`}
                  className="app-board-item"
                >
                  <div>
                    <div className="app-board-item-title">{board.title}</div>
                    <div className="app-board-item-meta">
                      by {board.creatorEmail} &middot; closed{" "}
                      {board.closedAt
                        ? new Date(board.closedAt).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                  <span className="status-badge status-closed">closed</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
