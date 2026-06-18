"use client";

import { useRouter } from "next/navigation";
import { closeBoard } from "@/actions/board";
import { ThemedButton } from "@/components/theme/ThemedButton";

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
    <ThemedButton variant="danger" onClick={handleClose}>
      Close Retro
    </ThemedButton>
  );
}
