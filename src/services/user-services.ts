import { ApiError } from "../middlewares/error";
import { User, UserParams } from "../models/user";
import * as userDB from "../data/user-data";
import bcrypt from "bcrypt";

export async function createUser(data: UserParams): Promise<User> {
  const { username, password, name, email, created_at } = data;
  const user = await userDB.getUserByUsername(username);

  if (user) {
    throw new ApiError("El username ya está registrado", 400);
  }

  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);
  const newUser = await userDB.createUser(
    username,
    hashedPassword,
    email || "",
    name || "",
    created_at.toString()
  );
  return newUser;
}

export async function validateCredentials(
  credentials: UserParams
): Promise<User> {
  const { username, password } = credentials;
  const user = await userDB.getUserByUsername(username);

  const isValid = await bcrypt.compare(password, user?.password || "");

  if (!user || !isValid) {
    throw new ApiError("Credenciales incorrectas", 400);
  }

  return user;
}

export async function updateUser(
  user_id: number,
  updates: Partial<User>
): Promise<User> {
  return await userDB.updateUser(user_id, updates);
}

export async function deleteUser(user_id: number): Promise<void> {
  return await userDB.deleteUser(user_id);
}

export async function getUserById(user_id: number): Promise<User | undefined> {
  return await userDB.getUserById(user_id);
}
