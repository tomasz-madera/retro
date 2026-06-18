import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  columns: z
    .array(
      z.object({
        name: z.string().min(1, "Column name is required").max(100),
      }),
    )
    .min(1, "At least one column is required")
    .max(10, "Maximum 10 columns"),
});

export const addCardSchema = z.object({
  columnId: z.coerce.number().int().positive(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content is too long"),
});

export const moveCardSchema = z.object({
  cardId: z.coerce.number().int().positive(),
  targetColumnId: z.coerce.number().int().positive(),
  newPosition: z.coerce.number().int().min(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
