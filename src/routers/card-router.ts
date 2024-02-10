import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { validationHandler } from "../middlewares/validation";
import { cardSchema } from "../models/card";
import {
  createCard,
  deleteCard,
  getCardByListId,
  updateCard,
} from "../services/card-services";

const cardRouter = express.Router();

cardRouter.post(
  "/lists/:list_id",
  authenticateHandler,
  validationHandler(cardSchema),
  async (req, res, next) => {
    try {
      const { title } = req.body;
      const list_id = parseInt(req.params["list_id"], 10);

      if (list_id === undefined) {
        throw new Error("No se pudo obtener el ID de la lista");
      }

      const created_at = new Date().toISOString();
      const newCard = await createCard({ title, created_at }, list_id);
      const newData = {
        card_id: newCard.card_id,
        title: newCard.title,
        created_at: newCard.created_at,
        list_id: list_id,
      };
      res.status(201).json({
        ok: true,
        message: "lista creada exitosamente",
        data: { ...newData },
      });
    } catch (error) {
      next(error);
    }
  }
);

cardRouter.get(
  "/lists/:list_id",
  authenticateHandler,
  async (req, res, next) => {
    const list_id = parseInt(req.params["list_id"], 10);
    if (list_id === undefined) {
      return res
        .status(401)
        .json({ ok: false, error: "Falta el ID de la lista" });
    }

    try {
      const cards = await getCardByListId(list_id);

      if (cards && cards.length > 0) {
        return res.json({ ok: true, data: cards });
      } else {
        return res.status(404).json({
          ok: false,
          error: "lista no encontrada o no tiene cartas",
        });
      }
    } catch (error) {
      next(error);
      return res
        .status(500)
        .json({ ok: false, error: "Internal server error" });
    }
  }
);

cardRouter.patch(
  "/cards/:card_id",
  authenticateHandler,
  async (req, res, next) => {
    try {
      const card_id = parseInt(req.params["card_id"], 10);
      const { title } = req.body;

      const updatedCard = await updateCard(card_id, title);

      res.status(200).json({
        ok: true,
        message: "carta actualizada exitosamente",
        data: updatedCard,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint para eliminar una lista específica
cardRouter.delete("/cards/:card_id", authenticateHandler, async (req, res) => {
  const card_id = parseInt(req.params["card_id"], 10);
  await deleteCard(card_id);

  return res.json({ ok: true, message: "lista eliminada exitosamente" });
});

cardRouter.get("/lists/:list_id/cards", async (req, res, next) => {
  try {
    const list_id = parseInt(req.params["list_id"], 10);
    if (list_id === undefined) {
      return res
        .status(401)
        .json({ ok: false, error: "Falta el ID de la lista" });
    }

    const cards = await getCardByListId(list_id);

    if (cards && cards.length > 0) {
      return res.json({ ok: true, data: cards });
    } else {
      return res.status(404).json({
        ok: false,
        error: "lista no encontrado o no tiene cartas",
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

export default cardRouter;
