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
