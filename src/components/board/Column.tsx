"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AddCardForm } from "./AddCardForm";
import { Card } from "./Card";

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
};

export function Column({ id, name, cards, disabled }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    disabled,
  });

  const cardIds = cards.map((c) => `card-${c.id}`);

  return (
    <div
      ref={setNodeRef}
      className={`retro-column ${isOver ? "retro-column-over" : ""}`}
    >
      <h3 className="retro-column-title">{name}</h3>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="retro-column-cards">
          {cards.map((card) => (
            <Card key={card.id} card={card} disabled={disabled} />
          ))}
        </div>
      </SortableContext>
      {!disabled && <AddCardForm columnId={id} />}
    </div>
  );
}
