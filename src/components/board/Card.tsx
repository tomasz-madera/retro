"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CardData = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: Date;
};

type CardProps = {
  card: CardData;
  disabled?: boolean;
};

export function Card({ card, disabled }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `card-${card.id}`,
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="retro-card"
      {...attributes}
      {...listeners}
    >
      <p className="retro-card-content">{card.content}</p>
      <div className="retro-card-meta">
        <span>{card.authorEmail}</span>
        <span>{new Date(card.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
