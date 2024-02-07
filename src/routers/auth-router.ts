import express from "express";
import jwt from "jsonwebtoken";
import { createUser } from "../services/user-services";
import { userSchema } from "../models/user";
import { validationHandler } from "../middlewares/validation";

const authRouter = express.Router();

const jwtSecret = "ultra-secret";

authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      const payload = { userId: newUser.user_id };
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

export default authRouter;
