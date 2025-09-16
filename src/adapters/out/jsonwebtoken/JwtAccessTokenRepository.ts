import jwt from "jsonwebtoken";
import type { AccessTokenRepository } from "../../../core/ports/out/AccessTokenRepository.js";
import { JWT_SECRET } from "../../../config/env.js";

export class JwtAccessTokenRepository implements AccessTokenRepository {
  async sign(payload: object, options?: object): Promise<string> {
    if (!JWT_SECRET) throw new Error(`Cannot sign token`);

    return jwt.sign(payload, JWT_SECRET, options);
  }

  async verify(token: string): Promise<object | undefined> {
    try {
      if (!JWT_SECRET) throw new Error(`Cannot verify token`);

      const decoded = jwt.verify(token, JWT_SECRET);

      return typeof decoded === "string" ? undefined : decoded;
    } catch (err) {
      return undefined;
    }
  }
}
