import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { ApiResponse } from "../types";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const meta = {
    requestId: (req.headers["x-request-id"] as string) || "generated-id",
    timestamp: new Date().toISOString(),
  };

  if (err instanceof ZodError) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.errors,
      },
      meta,
    };
    return res.status(400).json(response);
  }

  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta,
    };
    return res.status(err.statusCode).json(response);
  }

  // Fallback for unhandled errors
  console.error("Unhandled Error:", err);
  const response: ApiResponse<null> = {
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
    meta,
  };
  return res.status(500).json(response);
};
