import * as cardDB from "../data/card-data";
import { Card, CardParams } from "../models/card";



export async function createCard(
  data: CardParams,
  list_id: number
): Promise<Card> {
  const { title, created_at } = data;

  const newCard = await cardDB.createCard(
    list_id,
    title,
    created_at.toString()
  );

  return newCard;
}

export async function getCardByListId(
  list_id: number,
): Promise<Card[]> {
  return await cardDB.getCardByListId(list_id);
}


export async function deleteCard(list_id: number): Promise<void> {
    return await cardDB.deleteCard(list_id);
  }

  export async function updateCard(
    card_id: number,
    title: string
  ): Promise<Card> {
    return await cardDB.updateCard(card_id, title);
  }