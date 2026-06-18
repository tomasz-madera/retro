"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBoard } from "@/actions/board";
import { ThemedButton } from "@/components/theme/ThemedButton";

const DEFAULT_COLUMNS = [
  { name: "What went well?" },
  { name: "What could be improved?" },
  { name: "Action items" },
];

export function NewRetroForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function addColumn() {
    if (columns.length >= 10) return;
    setColumns([...columns, { name: "" }]);
  }

  function removeColumn(index: number) {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== index));
  }

  function updateColumn(index: number, name: string) {
    setColumns(columns.map((col, i) => (i === index ? { name } : col)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set(
      "columns",
      JSON.stringify(columns.filter((c) => c.name.trim())),
    );

    const result = await createBoard(formData);

    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.push(`/retro/${result.data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: 600 }}>
      <div>
        <label htmlFor="title" className="app-label">
          Board Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="app-input"
          placeholder="Sprint 42 Retrospective"
        />
      </div>

      <div>
        <label className="app-label">Columns</label>
        <div className="column-builder">
          {columns.map((col, index) => (
            <div key={index} className="column-row">
              <input
                value={col.name}
                onChange={(e) => updateColumn(index, e.target.value)}
                required
                maxLength={100}
                className="app-input"
                placeholder={`Column ${index + 1}`}
              />
              <ThemedButton
                type="button"
                variant="danger"
                className="app-button-sm"
                onClick={() => removeColumn(index)}
                disabled={columns.length <= 1}
              >
                X
              </ThemedButton>
            </div>
          ))}
        </div>
        <ThemedButton
          type="button"
          variant="secondary"
          className="app-button-sm"
          onClick={addColumn}
          disabled={columns.length >= 10}
          style={{ marginTop: 8 }}
        >
          + Add Column
        </ThemedButton>
      </div>

      {error && <p className="app-error">{error}</p>}

      <div style={{ display: "flex", gap: 12 }}>
        <ThemedButton type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Board"}
        </ThemedButton>
        <Link href="/">
          <ThemedButton type="button" variant="secondary">
            Cancel
          </ThemedButton>
        </Link>
      </div>
    </form>
  );
}
