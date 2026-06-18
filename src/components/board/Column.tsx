"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { ActionResult } from "@/lib/types";
import { AddCardForm } from "./AddCardForm";
import { KanbanCard } from "./KanbanCard";

type CardData = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: Date;
};

type ColumnProps = {
  id: number;
  name: string;
  cards: CardData[];
  disabled?: boolean;
  onAddCard: (
    columnId: number,
    content: string,
  ) => Promise<ActionResult<unknown>>;
};

export function Column({ id, name, cards, disabled, onAddCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    disabled,
  });

  const cardIds = cards.map((c) => `card-${c.id}`);

  return (
    <div
      ref={setNodeRef}
      className={`app-column ${isOver ? "app-column-over" : ""}`}
    >
      <h3 className="app-column-title">{name}</h3>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="app-column-cards">
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} disabled={disabled} />
          ))}
        </div>
      </SortableContext>
      {!disabled && <AddCardForm columnId={id} onAddCard={onAddCard} />}
    </div>
  );
}
