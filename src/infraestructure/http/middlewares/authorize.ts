import type { Request, Response, NextFunction } from "express";
import type { AccessTokenRepository } from "../../../core/ports/out/AccessTokenRepository.js";
import { JwtTokenError } from "../../../core/domain/errors.js";

export function authorize(
  requiredPermission: string,
  accessTokenRepository: AccessTokenRepository
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "The access token was not provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "The access token was not provided" });
      }

      const payload = await accessTokenRepository.verify(token);

      const hasOwnPermission = payload?.permissions.some((perm) =>
        perm.endsWith(".own")
      );

      if (hasOwnPermission && payload?.id === req.params.id) {
        next();
      }

      if (!payload?.permissions.includes(requiredPermission)) {
        return res
          .status(403)
          .json({ message: "You do not have sufficient permissions" });
      }

      next();
    } catch (err) {
      throw new JwtTokenError(`Invalid or expired token`);
    }
  };
}
