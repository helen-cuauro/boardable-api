import { query } from "../db";

import * as db from "../db";
import { List } from "../models/list";

export async function createList(
  board_id: number,
  title: string,
  created_at: string
): Promise<List> {
  return (
    await query(
      "INSERT INTO lists (board_id, title, created_at) VALUES ($1, $2, $3)  RETURNING *",

      [board_id, title, created_at]
    )
  ).rows[0];
}

export async function getListsByBoardId(
  board_id: number,

): Promise<List[]> {
  try {
    let query = `
      SELECT *
      FROM lists
      WHERE board_id = $1;
    `;

    const queryParams = [board_id];
    const result = await db.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error; 
  }
}

export async function deleteList(list_id: number): Promise<void> {
    const query = "DELETE FROM lists WHERE list_id = $1";
    const queryParams = [list_id];
    await db.query(query, queryParams);
  }
  

export async function updateList(
    list_id: number,
    title: string
  ): Promise<List> {
    const query = "UPDATE lists SET title = $1 WHERE list_id = $2 RETURNING *";
    const queryParams = [title, list_id];
    const result = await db.query(query, queryParams);
    return result.rows[0]; 
  }
  