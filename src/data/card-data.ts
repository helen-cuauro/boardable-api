import { query } from "../db";
import * as db from "../db";
import { Card } from "../models/card";

export async function createCard(
  list_id: number,
  title: string,
  created_at: string
): Promise<Card> {
  return (
    await query(
      "INSERT INTO cards (list_id, title, created_at) VALUES ($1, $2, $3)  RETURNING *",

      [list_id, title, created_at]
    )
  ).rows[0];
}

export async function getCardByListId(list_id: number): Promise<Card[]> {
  try {
    let query = `
      SELECT *
      FROM cards
      WHERE list_id = $1;
    `;

    const queryParams = [list_id];
    const result = await db.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}

export async function deleteCard(card_id: number): Promise<void> {
  const query = "DELETE FROM cards WHERE card_id = $1";
  const queryParams = [card_id];
  await db.query(query, queryParams);
}

export async function updateCard(
  card_id: number,
  title: string
): Promise<Card> {
  const query = "UPDATE cards SET title = $1 WHERE card_id = $2 RETURNING *";
  const queryParams = [title, card_id];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}
