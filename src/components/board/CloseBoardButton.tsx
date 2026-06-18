"use client";

import { useRouter } from "next/navigation";
import { closeBoard } from "@/actions/board";
import { RetroButton } from "@/components/retro/RetroButton";

type CloseBoardButtonProps = {
  boardId: number;
};

export function CloseBoardButton({ boardId }: CloseBoardButtonProps) {
  const router = useRouter();

  async function handleClose() {
    if (!confirm("Close this retrospective? It will move to history.")) {
      return;
    }

    const result = await closeBoard(boardId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <RetroButton variant="danger" onClick={handleClose}>
      Close Retro
    </RetroButton>
  );
}
