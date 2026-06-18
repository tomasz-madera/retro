"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/types";

type AddCardFormProps = {
  columnId: number;
  disabled?: boolean;
  onAddCard: (
    columnId: number,
    content: string,
  ) => Promise<ActionResult<unknown>>;
};

export function AddCardForm({ columnId, disabled, onAddCard }: AddCardFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || pending || disabled) return;

    setPending(true);
    setError("");

    const result = await onAddCard(columnId, content.trim());

    if (result.success) {
      setContent("");
    } else {
      setError(result.error);
    }

    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a card..."
        rows={2}
        disabled={disabled || pending}
        className="app-input"
      />
      {error && <p className="app-error">{error}</p>}
      <button
        type="submit"
        disabled={disabled || pending || !content.trim()}
        className="app-button app-button-secondary app-button-sm"
      >
        {pending ? "..." : "Add"}
      </button>
    </form>
  );
}
