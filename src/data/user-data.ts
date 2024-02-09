import { query } from "../db";
import { User, UserParams } from "../models/user";
import * as db from "../db";

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

export async function updateUser(
  user_id: number,
  updates: Partial<UserParams>
): Promise<User> {
  let query = "UPDATE users SET";
  const queryParams = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null)  {
      if (queryParams.length > 0) {
        query += ",";
      }
      queryParams.push(value);
      query += ` ${key} = $${queryParams.length}`;
    }
  });

  queryParams.push(user_id);
  query += ` WHERE user_id = $${queryParams.length} RETURNING *`;

  const result = await db.query(query, queryParams);
  return result.rows[0];
}
