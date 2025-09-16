import type { RefreshToken } from "../../domain/RefreshToken.js";

export interface RefreshTokenRepository {
  save(refresh_token: RefreshToken): Promise<string>;
  findRefreshTokenById(id: string): Promise<RefreshToken | null>;
  revokeToken(id: string): Promise<void>;
}
