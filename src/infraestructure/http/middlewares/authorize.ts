import type { Request, Response, NextFunction } from "express";
import type { AccessTokenRepository } from "../../../core/ports/out/AccessTokenRepository.js";
import { JwtTokenError } from "../../../core/domain/errors.js";

export function authorize(
  requiredPermissions: string[],
  accessTokenRepository: AccessTokenRepository,
  userIdSources: ("params" | "body" | "query")[] = ["params"],
  keyValue: string = "id"
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

      const tokenPayload = await accessTokenRepository.verify(token);

      for (const perm of requiredPermissions) {
        if (tokenPayload.permissions.includes(perm)) {
          //validate scope of the permission
          if (!perm.endsWith(".all") && !perm.endsWith(".own")) return next();

          if (perm.endsWith(".all")) return next();

          if (perm.endsWith(".own")) {
            const targetId = userIdSources
              .map((src) => (req as any)[src][keyValue])
              .find((value) => value !== undefined);

            if (
              targetId &&
              (String(targetId) === String(tokenPayload.id) ||
                String(targetId) === String(tokenPayload.username) ||
                String(targetId) === String(tokenPayload.email))
            )
              return next();
          }
        }
      }

      return res
        .status(403)
        .json({ message: "You do not have sufficient permissions" });
    } catch (err) {
      throw new JwtTokenError(`Invalid or expired token`);
    }
  };
}
