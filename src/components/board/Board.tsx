"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { moveCard, addCard } from "@/actions/board";
import { Column } from "./Column";
import { KanbanCard } from "./KanbanCard";

type CardData = {
  id: number;
  columnId: number;
  content: string;
  authorEmail: string;
  createdAt: Date;
  position: number;
};

type ColumnData = {
  id: number;
  name: string;
  position: number;
};

type BoardProps = {
  columns: ColumnData[];
  initialCards: CardData[];
  disabled?: boolean;
};

function parseId(id: string): { type: "card" | "column"; id: number } {
  const [type, num] = id.split("-");
  return { type: type as "card" | "column", id: Number(num) };
}

export function Board({ columns, initialCards, disabled }: BoardProps) {
  const [cards, setCards] = useState(initialCards);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  function getCardsForColumn(columnId: number) {
    return cards
      .filter((c) => c.columnId === columnId)
      .sort((a, b) => a.position - b.position);
  }

  function handleDragStart(event: DragStartEvent) {
    const { type, id } = parseId(String(event.active.id));
    if (type === "card") {
      setActiveCardId(id);
    }
  }

  async function handleAddCard(columnId: number, content: string) {
    const formData = new FormData();
    formData.set("columnId", String(columnId));
    formData.set("content", content);

    const result = await addCard(formData);

    if (result.success) {
      setCards((current) => [
        ...current,
        {
          id: result.data.id,
          columnId: result.data.columnId,
          content: result.data.content,
          position: result.data.position,
          authorEmail: result.data.authorEmail,
          createdAt: new Date(result.data.createdAt),
        },
      ]);
    }

    return result;
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCardId(null);
    if (disabled) return;

    const { active, over } = event;
    if (!over) return;

    const activeParsed = parseId(String(active.id));
    if (activeParsed.type !== "card") return;

    const cardId = activeParsed.id;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    let targetColumnId = card.columnId;
    let newPosition = card.position;

    const overParsed = parseId(String(over.id));

    if (overParsed.type === "column") {
      targetColumnId = overParsed.id;
      const columnCards = getCardsForColumn(targetColumnId);
      newPosition = columnCards.length;
    } else if (overParsed.type === "card") {
      const overCard = cards.find((c) => c.id === overParsed.id);
      if (!overCard) return;
      targetColumnId = overCard.columnId;
      newPosition = overCard.position;
    }

    if (targetColumnId === card.columnId && newPosition === card.position) {
      return;
    }

    const prevCards = cards;

    setCards((current) => {
      const without = current.filter((c) => c.id !== cardId);
      const updated = without.map((c) => {
        if (c.columnId === card.columnId && c.position > card.position) {
          return { ...c, position: c.position - 1 };
        }
        if (c.columnId === targetColumnId && c.position >= newPosition) {
          return { ...c, position: c.position + 1 };
        }
        return c;
      });

      return [
        ...updated,
        { ...card, columnId: targetColumnId, position: newPosition },
      ].sort((a, b) => {
        if (a.columnId !== b.columnId) return a.columnId - b.columnId;
        return a.position - b.position;
      });
    });

    const result = await moveCard({ cardId, targetColumnId, newPosition });

    if (!result.success) {
      setCards(prevCards);
    }
  }

  const activeCard = activeCardId
    ? cards.find((c) => c.id === activeCardId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-board">
        {sortedColumns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            name={column.name}
            cards={getCardsForColumn(column.id)}
            disabled={disabled}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <KanbanCard card={activeCard} disabled />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
