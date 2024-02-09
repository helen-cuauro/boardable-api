import { query } from "../db";
import { Board } from "../models/board";
import * as db from "../db";
import { sorting } from "./utils";

export async function createBoard(
  user_id: number,
  title: string,
  backgroundColor: string,
  created_at: string
): Promise<Board> {
  return (
    await query(
      "INSERT INTO boards (user_id, title, background_color, created_at) VALUES ($1, $2, $3, $4)  RETURNING *",

      [user_id, title, backgroundColor, created_at]
    )
  ).rows[0];
}

export async function getBoardsByUserId(
  user_id: number,
  sort?: string
): Promise<Board[]> {
  try {
    let query = `
      SELECT *
      FROM boards
      WHERE user_id = $1;
    `;
    query = sorting(query, sort);
    const queryParams = [user_id];
    const result = await db.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}

export async function deleteBoard(board_id: number): Promise<void> {
  const query = "DELETE FROM boards WHERE board_id = $1";
  const queryParams = [board_id];
  await db.query(query, queryParams);
}

export async function updateBoard(
  board_id: number,
  title: string
): Promise<Board> {
  let query = "UPDATE boards SET title = $1 WHERE board_id = $2 RETURNING *";
  const queryParams = [title, board_id];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}
