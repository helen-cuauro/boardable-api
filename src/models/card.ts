import { z } from "zod";

export const cardSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título debe tener al menos 1 carácter" }),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type CardParams = z.infer<typeof cardSchema>;
export type Card = CardParams & { card_id: number };
