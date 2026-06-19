"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDateTime } from "@/lib/format-date";
import { useThemeComponents } from "@/lib/theme/hooks";

type CardData = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: Date;
};

type KanbanCardProps = {
  card: CardData;
  disabled?: boolean;
};

export function KanbanCard({ card, disabled }: KanbanCardProps) {
  const { Card } = useThemeComponents();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `card-${card.id}`,
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      dragging={isDragging}
      {...attributes}
      {...listeners}
    >
      <p className="app-card-content">{card.content}</p>
      <div className="app-card-meta">
        <span>{card.authorEmail}</span>
        <span>{formatDateTime(card.createdAt)}</span>
      </div>
    </Card>
  );
}
