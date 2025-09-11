import type { Request, Response, NextFunction } from "express";

import { errorHttpMap } from "./errorMap.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err); //login
  if (err && typeof err === "object" && "constructor" in err) {
    const status = errorHttpMap.get((err as any).constructor);

    if (status) {
      return res.status(status).json({ message: (err as Error).message });
    }
  }

  // No mapped errors
  return res.status(500).json({ message: "Internal server error" });
}
