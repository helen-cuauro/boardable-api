import * as listDB from "../data/list-data";
import { List, ListParams } from "../models/list";


export async function createList(
  data: ListParams,
  board_id: number
): Promise<List> {
  const { title, created_at } = data;

  const newList = await listDB.createList(
    board_id,
    title,
    created_at.toString()
  );

  return newList;
}

export async function getListsByBoardId(
  board_id: number,
): Promise<List[]> {
  return await listDB.getListsByBoardId(board_id);
}


export async function deleteList(board_id: number): Promise<void> {
    return await listDB.deleteList(board_id);
  }

  export async function updateList(
    list_id: number,
    title: string
  ): Promise<List> {
    return await listDB.updateList(list_id, title);
  }