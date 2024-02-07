import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { user_id: number };