import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

function hasStatusCode(err: unknown): err is AppError {
  return typeof err === "object" && err !== null && "statusCode" in err;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("Erro capturado:", err);

  if (err instanceof Error) {
    const status =
      hasStatusCode(err) && typeof err.statusCode === "number"
        ? err.statusCode
        : 500;

    const message = err.message
      ? (req.t?.(err.message) ?? err.message)
      : (req.t?.("unexpected_error") ?? "Erro inesperado");

    return res.status(status).json({ error: message });
  }

  const fallbackMessage = req.t?.("unexpected_error") ?? "Erro desconhecido";
  return res.status(500).json({ error: fallbackMessage });
}
