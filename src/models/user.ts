import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({
      required_error: "Username es requerido",
      invalid_type_error: "Username debe ser un string",
    })
    .min(3, { message: "El nombre de usuario debe tener al menos 3 carácter" }),
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }).optional(),
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 carácter" }).optional(),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { user_id: number };
