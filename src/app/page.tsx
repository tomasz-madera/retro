import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBoards } from "@/actions/board";
import { Header } from "@/components/layout/Header";
import { CRTScreen } from "@/components/retro/CRTScreen";
import { RetroButton } from "@/components/retro/RetroButton";

export default async function DashboardPage() {
  const session = await auth();
  const { active, closed } = await getBoards();

  return (
    <CRTScreen>
      <Header
        email={session!.user.email}
        role={session!.user.role}
      />
      <main className="retro-main">
        <div className="retro-board-header">
          <h1 className="retro-board-title">RETROSPECTIVES</h1>
          <Link href="/retro/new">
            <RetroButton>+ New Retro</RetroButton>
          </Link>
        </div>

        <section className="retro-section">
          <h2 className="retro-section-title">Active</h2>
          {active.length === 0 ? (
            <p className="retro-empty">No active retrospectives.</p>
          ) : (
            <div className="retro-board-list">
              {active.map((board) => (
                <Link
                  key={board.id}
                  href={`/retro/${board.id}`}
                  className="retro-board-item"
                >
                  <div>
                    <div className="retro-board-item-title">{board.title}</div>
                    <div className="retro-board-item-meta">
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

        <section className="retro-section">
          <h2 className="retro-section-title">History</h2>
          {closed.length === 0 ? (
            <p className="retro-empty">No closed retrospectives yet.</p>
          ) : (
            <div className="retro-board-list">
              {closed.map((board) => (
                <Link
                  key={board.id}
                  href={`/retro/${board.id}`}
                  className="retro-board-item"
                >
                  <div>
                    <div className="retro-board-item-title">{board.title}</div>
                    <div className="retro-board-item-meta">
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
    </CRTScreen>
  );
}
