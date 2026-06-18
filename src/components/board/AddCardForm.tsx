"use client";

import { useState } from "react";
import { addCard } from "@/actions/board";

type AddCardFormProps = {
  columnId: number;
  disabled?: boolean;
};

export function AddCardForm({ columnId, disabled }: AddCardFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || pending || disabled) return;

    setPending(true);
    setError("");

    const formData = new FormData();
    formData.set("columnId", String(columnId));
    formData.set("content", content.trim());

    const result = await addCard(formData);

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
        className="retro-input"
      />
      {error && <p className="retro-error">{error}</p>}
      <button
        type="submit"
        disabled={disabled || pending || !content.trim()}
        className="retro-btn retro-btn-secondary retro-btn-sm"
      >
        {pending ? "..." : "Add"}
      </button>
    </form>
  );
}
