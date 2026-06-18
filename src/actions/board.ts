"use server";

import { and, asc, desc, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  retroBoards,
  retroCards,
  retroColumns,
  retroUsers,
} from "@/lib/db/schema";
import type { ActionResult } from "@/lib/types";
import {
  addCardSchema,
  createBoardSchema,
  moveCardSchema,
} from "@/lib/validators/auth";

export async function createBoard(
  formData: FormData,
): Promise<ActionResult<{ id: number }>> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const columnsRaw = formData.get("columns");
  let columns: { name: string }[] = [];

  try {
    columns = JSON.parse(String(columnsRaw ?? "[]"));
  } catch {
    return { success: false, error: "Invalid columns data" };
  }

  const parsed = createBoardSchema.safeParse({
    title: formData.get("title"),
    columns,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const userId = Number(session.user.id);

  const [boardResult] = await db
    .insert(retroBoards)
    .values({
      title: parsed.data.title,
      createdBy: userId,
      status: "active",
    })
    .$returningId();

  const boardId = boardResult.id;

  await db.insert(retroColumns).values(
    parsed.data.columns.map((column, index) => ({
      boardId,
      name: column.name,
      position: index,
    })),
  );

  return { success: true, data: { id: boardId } };
}

export async function closeBoard(
  boardId: number,
): Promise<ActionResult<{ id: number }>> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const [board] = await db
    .select({
      id: retroBoards.id,
      createdBy: retroBoards.createdBy,
      status: retroBoards.status,
    })
    .from(retroBoards)
    .where(eq(retroBoards.id, boardId))
    .limit(1);

  if (!board) {
    return { success: false, error: "Board not found" };
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.role === "admin";

  if (!isAdmin && board.createdBy !== userId) {
    return { success: false, error: "Forbidden" };
  }

  if (board.status === "closed") {
    return { success: false, error: "Board already closed" };
  }

  await db
    .update(retroBoards)
    .set({ status: "closed", closedAt: new Date() })
    .where(eq(retroBoards.id, boardId));

  return { success: true, data: { id: boardId } };
}

export async function addCard(
  formData: FormData,
): Promise<
  ActionResult<{
    id: number;
    columnId: number;
    content: string;
    position: number;
    authorEmail: string;
    createdAt: string;
  }>
> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = addCardSchema.safeParse({
    columnId: formData.get("columnId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const [column] = await db
    .select({
      id: retroColumns.id,
      boardId: retroColumns.boardId,
    })
    .from(retroColumns)
    .where(eq(retroColumns.id, parsed.data.columnId))
    .limit(1);

  if (!column) {
    return { success: false, error: "Column not found" };
  }

  const [board] = await db
    .select({ status: retroBoards.status })
    .from(retroBoards)
    .where(eq(retroBoards.id, column.boardId))
    .limit(1);

  if (!board || board.status !== "active") {
    return { success: false, error: "Board is closed" };
  }

  const [maxPosition] = await db
    .select({
      max: sql<number>`COALESCE(MAX(${retroCards.position}), -1)`,
    })
    .from(retroCards)
    .where(eq(retroCards.columnId, parsed.data.columnId));

  const newPosition = (maxPosition?.max ?? -1) + 1;

  const [cardResult] = await db
    .insert(retroCards)
    .values({
      columnId: parsed.data.columnId,
      authorId: Number(session.user.id),
      content: parsed.data.content,
      position: newPosition,
    })
    .$returningId();

  return {
    success: true,
    data: {
      id: cardResult.id,
      columnId: parsed.data.columnId,
      content: parsed.data.content,
      position: newPosition,
      authorEmail: session.user.email,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function moveCard(
  input: {
    cardId: number;
    targetColumnId: number;
    newPosition: number;
  },
): Promise<ActionResult<{ id: number }>> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = moveCardSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { cardId, targetColumnId, newPosition } = parsed.data;

  const [card] = await db
    .select({
      id: retroCards.id,
      columnId: retroCards.columnId,
      position: retroCards.position,
    })
    .from(retroCards)
    .where(eq(retroCards.id, cardId))
    .limit(1);

  if (!card) {
    return { success: false, error: "Card not found" };
  }

  const [targetColumn] = await db
    .select({
      id: retroColumns.id,
      boardId: retroColumns.boardId,
    })
    .from(retroColumns)
    .where(eq(retroColumns.id, targetColumnId))
    .limit(1);

  if (!targetColumn) {
    return { success: false, error: "Target column not found" };
  }

  const [sourceColumn] = await db
    .select({ boardId: retroColumns.boardId })
    .from(retroColumns)
    .where(eq(retroColumns.id, card.columnId))
    .limit(1);

  if (!sourceColumn || sourceColumn.boardId !== targetColumn.boardId) {
    return { success: false, error: "Invalid column move" };
  }

  const [board] = await db
    .select({ status: retroBoards.status })
    .from(retroBoards)
    .where(eq(retroBoards.id, targetColumn.boardId))
    .limit(1);

  if (!board || board.status !== "active") {
    return { success: false, error: "Board is closed" };
  }

  if (card.columnId === targetColumnId) {
    if (newPosition === card.position) {
      return { success: true, data: { id: cardId } };
    }

    if (newPosition < card.position) {
      await db
        .update(retroCards)
        .set({ position: sql`${retroCards.position} + 1` })
        .where(
          and(
            eq(retroCards.columnId, targetColumnId),
            gte(retroCards.position, newPosition),
            lt(retroCards.position, card.position),
          ),
        );
    } else {
      await db
        .update(retroCards)
        .set({ position: sql`${retroCards.position} - 1` })
        .where(
          and(
            eq(retroCards.columnId, targetColumnId),
            gt(retroCards.position, card.position),
            lte(retroCards.position, newPosition),
          ),
        );
    }

    await db
      .update(retroCards)
      .set({ position: newPosition })
      .where(eq(retroCards.id, cardId));
  } else {
    await db
      .update(retroCards)
      .set({ position: sql`${retroCards.position} - 1` })
      .where(
        and(
          eq(retroCards.columnId, card.columnId),
          gt(retroCards.position, card.position),
        ),
      );

    await db
      .update(retroCards)
      .set({ position: sql`${retroCards.position} + 1` })
      .where(
        and(
          eq(retroCards.columnId, targetColumnId),
          gte(retroCards.position, newPosition),
        ),
      );

    await db
      .update(retroCards)
      .set({ columnId: targetColumnId, position: newPosition })
      .where(eq(retroCards.id, cardId));
  }

  return { success: true, data: { id: cardId } };
}

export async function getBoards() {
  const session = await auth();
  if (!session?.user) {
    return { active: [], closed: [] };
  }

  const boards = await db
    .select({
      id: retroBoards.id,
      title: retroBoards.title,
      status: retroBoards.status,
      createdAt: retroBoards.createdAt,
      closedAt: retroBoards.closedAt,
      creatorEmail: retroUsers.email,
    })
    .from(retroBoards)
    .innerJoin(retroUsers, eq(retroBoards.createdBy, retroUsers.id))
    .orderBy(desc(retroBoards.createdAt))
    .limit(100);

  return {
    active: boards.filter((b) => b.status === "active"),
    closed: boards.filter((b) => b.status === "closed"),
  };
}

export async function getBoard(boardId: number) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const [board] = await db
    .select({
      id: retroBoards.id,
      title: retroBoards.title,
      status: retroBoards.status,
      createdBy: retroBoards.createdBy,
      createdAt: retroBoards.createdAt,
      closedAt: retroBoards.closedAt,
      creatorEmail: retroUsers.email,
    })
    .from(retroBoards)
    .innerJoin(retroUsers, eq(retroBoards.createdBy, retroUsers.id))
    .where(eq(retroBoards.id, boardId))
    .limit(1);

  if (!board) {
    return null;
  }

  const columns = await db
    .select({
      id: retroColumns.id,
      name: retroColumns.name,
      position: retroColumns.position,
    })
    .from(retroColumns)
    .where(eq(retroColumns.boardId, boardId))
    .orderBy(asc(retroColumns.position));

  const cards = await db
    .select({
      id: retroCards.id,
      columnId: retroCards.columnId,
      content: retroCards.content,
      position: retroCards.position,
      createdAt: retroCards.createdAt,
      authorEmail: retroUsers.email,
      authorId: retroCards.authorId,
    })
    .from(retroCards)
    .innerJoin(retroUsers, eq(retroCards.authorId, retroUsers.id))
    .innerJoin(retroColumns, eq(retroCards.columnId, retroColumns.id))
    .where(eq(retroColumns.boardId, boardId))
    .orderBy(asc(retroCards.position));

  return { board, columns, cards };
}
