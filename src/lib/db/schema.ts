import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

export const retroUsers = mysqlTable(
  "retro_users",
  {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("retro_users_email_idx").on(table.email)],
);

export const retroBoards = mysqlTable(
  "retro_boards",
  {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 200 }).notNull(),
    status: mysqlEnum("status", ["active", "closed"])
      .notNull()
      .default("active"),
    createdBy: int("created_by")
      .notNull()
      .references(() => retroUsers.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    closedAt: timestamp("closed_at"),
  },
  (table) => [
    index("retro_boards_status_idx").on(table.status),
    index("retro_boards_created_by_idx").on(table.createdBy),
  ],
);

export const retroColumns = mysqlTable(
  "retro_columns",
  {
    id: int("id").primaryKey().autoincrement(),
    boardId: int("board_id")
      .notNull()
      .references(() => retroBoards.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    position: int("position").notNull().default(0),
  },
  (table) => [
    index("retro_columns_board_id_idx").on(table.boardId),
    index("retro_columns_board_position_idx").on(table.boardId, table.position),
  ],
);

export const retroCards = mysqlTable(
  "retro_cards",
  {
    id: int("id").primaryKey().autoincrement(),
    columnId: int("column_id")
      .notNull()
      .references(() => retroColumns.id, { onDelete: "cascade" }),
    authorId: int("author_id")
      .notNull()
      .references(() => retroUsers.id),
    content: text("content").notNull(),
    position: int("position").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("retro_cards_column_id_idx").on(table.columnId),
    index("retro_cards_column_position_idx").on(
      table.columnId,
      table.position,
    ),
  ],
);

export type RetroUser = typeof retroUsers.$inferSelect;
export type RetroBoard = typeof retroBoards.$inferSelect;
export type RetroColumn = typeof retroColumns.$inferSelect;
export type RetroCard = typeof retroCards.$inferSelect;
