import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./error";

// Extendemos el objeto Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user_id?: number;
      board_id?: number;
    }
  }
}

const jwtSecret = "ultra-secret";

export function authenticateHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError("No autorizado", 401));
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      user_id: number;
      board_id: number;
      iat: number;
      exp: number;
    };

    req.user_id = payload.user_id;
    req.board_id = payload.board_id;
    next();
  } catch (error) {
    return next(new ApiError("No autorizado", 401));
  }
}
