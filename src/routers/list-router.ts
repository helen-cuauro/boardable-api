import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { validationHandler } from "../middlewares/validation";
import { listSchema } from "../models/list";
import { createList, deleteList, getListsByBoardId, updateList } from "../services/list-services";

const listRouter = express.Router();

listRouter.post(
  "/boards/:board_id",
  authenticateHandler,
  validationHandler(listSchema),
  async (req, res, next) => {
    try {
      const { title } = req.body;
      const board_id = parseInt(req.params["board_id"], 10);

      if (board_id === undefined) {
        throw new Error("No se pudo obtener el ID del tablero");
      }

      const created_at = new Date().toISOString();
      const newList = await createList({ title, created_at }, board_id);
      const newData = {
        list_id: newList.list_id,
        title: newList.title,
        created_at: newList.created_at,
        board_id: board_id,
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

listRouter.get(
  "/boards/:board_id",
  authenticateHandler,
  async (req, res, next) => {
    const board_id = parseInt(req.params["board_id"], 10);
    if (board_id === undefined) {
      return res
        .status(401)
        .json({ ok: false, error: "Falta el ID del tablero" });
    }

    try {
      const lists = await getListsByBoardId(board_id);

      if (lists && lists.length > 0) {
        return res.json({ ok: true, data: lists });
      } else {
        return res.status(404).json({
          ok: false,
          error: "tablero no encontrado o no tiene listas",
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



listRouter.patch(
  "/lists/:list_id",
  authenticateHandler,
  async (req, res, next) => {
    try {
      const list_id = parseInt(req.params["list_id"], 10);
      const { title } = req.body;

      const updatedList = await updateList(list_id, title);

      res.status(200).json({
        ok: true,
        message: "Lista actualizada exitosamente",
        data: updatedList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint para eliminar una lista específica
listRouter.delete("/lists/:list_id", authenticateHandler, async (req, res) => {
  const list_id = parseInt(req.params["list_id"], 10);
  await deleteList(list_id);

  return res.json({ ok: true, message: "lista eliminada exitosamente" });
});

listRouter.get(
    "/boards/:board_id/lists",
    async (req, res, next) => {
      try {
        const board_id = parseInt(req.params["board_id"], 10);
        if (board_id === undefined) {
          return res
            .status(401)
            .json({ ok: false, error: "Falta el ID del tablero" });
        }
  
        const lists = await getListsByBoardId(board_id);
  
        if (lists && lists.length > 0) {
          return res.json({ ok: true, data: lists });
        } else {
          return res.status(404).json({
            ok: false,
            error: "Tablero no encontrado o no tiene listas",
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
  




export default listRouter;
