import { z } from "zod";

export const listSchema = z.object({
  title: z.string().min(1, { message: "El título debe tener al menos 1 carácter" }),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type ListParams = z.infer<typeof listSchema>;
export type List = ListParams & { list_id: number };
