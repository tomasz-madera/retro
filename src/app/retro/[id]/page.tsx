import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBoard } from "@/actions/board";
import { Header } from "@/components/layout/Header";
import { Board } from "@/components/board/Board";
import { CloseBoardButton } from "@/components/board/CloseBoardButton";
import { ThemedButton } from "@/components/theme/ThemedButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RetroBoardPage({ params }: PageProps) {
  const { id } = await params;
  const boardId = Number(id);

  if (Number.isNaN(boardId)) {
    notFound();
  }

  const session = await auth();
  const data = await getBoard(boardId);

  if (!data) {
    notFound();
  }

  const { board, columns, cards } = data;
  const isClosed = board.status === "closed";
  const canClose =
    !isClosed &&
    (session!.user.role === "admin" ||
      board.createdBy === Number(session!.user.id));

  return (
    <>
      <Header email={session!.user.email} role={session!.user.role} />
      <main className="app-main">
        <div className="app-board-header">
          <div>
            <h1 className="app-board-title">{board.title}</h1>
            <p className="app-board-item-meta">
              by {board.creatorEmail} &middot;{" "}
              <span
                className={`status-badge ${isClosed ? "status-closed" : "status-active"}`}
              >
                {board.status}
              </span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {canClose && <CloseBoardButton boardId={boardId} />}
            <Link href="/">
              <ThemedButton variant="secondary">Back</ThemedButton>
            </Link>
          </div>
        </div>

        <Board
          columns={columns}
          initialCards={cards}
          disabled={isClosed}
        />
      </main>
    </>
  );
}
