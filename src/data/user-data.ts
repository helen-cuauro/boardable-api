import { query } from "../db";
import { User } from "../models/user";

export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  return (await query("SELECT * FROM users WHERE username = $1", [username]))
    .rows[0];
}

export async function createUser(
  username: string,
  password: string,
  email: string,
  name: string,
  created_at: string
): Promise<User> {
  return (
    await query(
      "INSERT INTO Users (username, password, email, name, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",

      [username, password, email, name, created_at]
    )
  ).rows[0];
}
