import jwt, { type JwtPayload } from "jsonwebtoken";
import type { AccessTokenRepository } from "../../../core/ports/out/AccessTokenRepository.js";
import { JWT_SECRET } from "../../../config/env.js";
import type { TokenPayload } from "../../../core/domain/types.js";
import { JwtTokenError } from "../../../core/domain/errors.js";

export class JwtAccessTokenRepository implements AccessTokenRepository {
  async sign(payload: object, options?: object): Promise<string> {
    if (!JWT_SECRET) throw new JwtTokenError(`Cannot sign token`);

    return jwt.sign(payload, JWT_SECRET, options);
  }

  async verify(token: string): Promise<TokenPayload | undefined> {
    try {
      if (!JWT_SECRET) throw new JwtTokenError(`Cannot verify token`);

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      return typeof decoded === "string"
        ? undefined
        : {
            id: decoded.id as string,
            username: decoded.username as string,
            full_name: decoded.full_name as string,
            permissions: decoded.permissions as string[],
          };
    } catch (err) {
      return undefined;
    }
  }
}
