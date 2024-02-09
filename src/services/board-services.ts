import * as boardDB from "../data/board-data";
import { Board, BoardParams } from "../models/board";

export async function createBoard(
  data: BoardParams,
  user_id: number
): Promise<Board> {
  const { title, background_color, created_at } = data;

  const newBoard = await boardDB.createBoard(
    user_id,
    title,
    background_color,
    created_at.toString()
  );

  return newBoard;
}

export async function getBoardByUserId(
  user_id: number,
  sort?: string
): Promise<Board[]> {
  return await boardDB.getBoardsByUserId(user_id, sort);
}
