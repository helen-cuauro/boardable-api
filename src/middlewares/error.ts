import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Extendemos la interfaz Error de Zod para que TypeScript reconozca nuestro error personalizado
declare module "zod" {
  interface ZodError {
    status?: number;
  }
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, any>;

  constructor(message: string, status: number, details?: Record<string, any>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export default function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log("Error handler!");

  if (error instanceof z.ZodError) {
    // Manejar errores de validación de Zod
    const validationErrors = error.errors.map((err) => ({
      message: err.message,
      path: err.path,
    }));
    res.status(400).json({
      ok: false,
      error: {
        message: "Error de validación",
        details: validationErrors,
      },
    });
  } else if (error instanceof ApiError) {
    // Manejar errores de la API personalizados
    res.status(error.status).json({
      ok: false,
      error: {
        message: error.message,
        details: error.details,
      },
    });
  } else {
    // Manejar otros errores
    console.error(error);
    res.status(500).json({
      ok: false,
      error: {
        message: "Error interno del servidor",
      },
    });
  }
}
