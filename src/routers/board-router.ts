import express from "express";
import { createBoard, getBoardByUserId } from "../services/board-services";
import { authenticateHandler } from "../middlewares/authenticate";
import { validationHandler } from "../middlewares/validation";
import { boardSchema } from "../models/board";

const boardRouter = express.Router();

boardRouter.post(
  "/boards",
  authenticateHandler,
  validationHandler(boardSchema),
  async (req, res, next) => {
    try {
      const { title, background_color } = req.body;
      const user_id = req.user_id;

      if (user_id === undefined) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      const created_at = new Date().toISOString();
      const newBoard = await createBoard(
        { title, background_color, created_at },
        user_id
      );
      const newData = {
        board_id: newBoard.board_id,
        title: newBoard.title,
        background_color: newBoard.background_color,
        created_at: newBoard.created_at,
        user_id: user_id,
      };
      res.status(201).json({
        ok: true,
        message: "tablero creado exitosamente",
        data: { ...newData },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta protegida que solo devuelve los tableros cuando el usuario está autenticado
boardRouter.get("/boards", authenticateHandler, async (req, res, next) => {
  const sort = req.query["sort"] as string | undefined;
  const user_id = req.user_id;
  if (user_id === undefined) {
    return res.status(401).json({ ok: false, error: "Falta el ID de usuario" });
  }

  try {
    const boards = await getBoardByUserId(user_id, sort);

    if (boards && boards.length > 0) {
      return res.json({ ok: true, data: boards });
    } else {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado o no tiene tableros",
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

export default boardRouter;
