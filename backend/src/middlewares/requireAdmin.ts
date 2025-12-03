import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userType !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Apenas admin pode realizar esta ação." });
  }
  next();
}
