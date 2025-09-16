import jwt from "jsonwebtoken";
import type { TokenRepository } from "../../../core/ports/out/TokenRepository.js";
import { SECRET_KEY } from "../../../config/env.js";

export class JwtTokenRepository implements TokenRepository {
  async sign(payload: object, options?: object): Promise<string> {
    if (!SECRET_KEY) throw new Error(`Cannot sign token`);

    return jwt.sign(payload, SECRET_KEY, options);
  }

  async verify(token: string): Promise<object | undefined> {
    try {
      if (!SECRET_KEY) throw new Error(`Cannot verify token`);

      const decoded = jwt.verify(token, SECRET_KEY);

      return typeof decoded === "string" ? undefined : decoded;
    } catch (err) {
      return undefined;
    }
  }
}
