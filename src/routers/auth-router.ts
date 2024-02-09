import express from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  updateUser,
  validateCredentials,
} from "../services/user-services";
import { userSchema } from "../models/user";
import { validationHandler } from "../middlewares/validation";
import { authenticateHandler } from "../middlewares/authenticate";

const authRouter = express.Router();

const jwtSecret = "ultra-secret";

authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      const payload = { user_id: newUser.user_id };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
      const newData = {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at,
      };

      res.status(201).json({
        ok: true,
        message: "usuario creado exitosamente",
        data: { ...newData, token },
      });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await validateCredentials(req.body);
    const payload = { user_id: user.user_id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "5m" });

    res.json({ ok: true, message: "Login exitoso", data: { token } });
  } catch (error) {
    next(error);
  }
});

authRouter.patch("/me", authenticateHandler, async (req, res, next) => {
  try {
    const user_id = Number(req.params["user_id"]);
    const { username, ...updates } = req.body;

    const updatedUser = await updateUser(user_id, updates);

    res.status(200).json({
      ok: true,
      message: "Usuario actualizado exitosamente",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
