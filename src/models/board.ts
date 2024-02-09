import { z } from "zod";

export const boardSchema = z.object({
  title: z.string().min(1, { message: "El título debe tener al menos 1 carácter" }),
  background_color: z.string(),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type BoardParams = z.infer<typeof boardSchema>;
export type Board = BoardParams & { board_id: number };
