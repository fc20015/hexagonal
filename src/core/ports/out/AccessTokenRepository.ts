import type { TokenPayload } from "../../domain/types.js";

export interface AccessTokenRepository {
  sign(payload: object, options?: object): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
