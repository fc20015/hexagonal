import { DatabaseError } from "../../../core/domain/errors.js";
import { RefreshToken } from "../../../core/domain/RefreshToken.js";
import type { RefreshTokenRepository } from "../../../core/ports/out/RefreshTokenRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";

export class PostgresRefreshTokenRepository implements RefreshTokenRepository {
  async save(refresh_token: RefreshToken): Promise<string> {
    const client = await getClient();

    try {
      const saveRefreshTokenQuery = `
            INSERT INTO refresh_tokens(
                id_refresh_token,
                id_user,
                secret_hash,
                ip_address,
                user_agent
            ) VALUES ($1, $2, $3, $4)
            RETURNING ip_refresh_token
        `;

      const resRefreshToken = await client.query(saveRefreshTokenQuery, [
        refresh_token.id,
        refresh_token.id_user,
        refresh_token.secret_hash,
        refresh_token.remote_address,
        refresh_token.user_agent,
      ]);

      return resRefreshToken.rows[0].id_refresh_token;
    } catch (err) {
      throw new DatabaseError(`Error saving refresh token: ${err}`);
    } finally {
      client.release();
    }
  }
  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    const client = await getClient();

    try {
      const findRefreshTokenByIdQuery = `
            SELECT
                id_refresh_token,
                id_user,
                secret_hash,
                ip_address,
                user_agent,
                revoked,
                revoked_at
            FROM refresh_tokens
            WHERE id_refresh_token = $1
        `;

      const resRefreshToken = await client.query(findRefreshTokenByIdQuery, [
        id,
      ]);

      if (resRefreshToken.rowCount === 0) return null;

      return new RefreshToken(
        resRefreshToken.rows[0].id_refresh_token,
        resRefreshToken.rows[0].id_user,
        resRefreshToken.rows[0].secret_hash,
        resRefreshToken.rows[0].ip_address,
        resRefreshToken.rows[0].user_agent,
        resRefreshToken.rows[0].revoked,
        resRefreshToken.rows[0].revoked_at
      );
    } catch (err) {
      throw new DatabaseError(`Error finding refresh token by id: ${err}`);
    } finally {
      client.release();
    }
  }
  async revokeToken(id: string): Promise<void> {
    const client = await getClient();

    try {
      const revokeTokenQuery = `
            UPDATE refresh_tokens
            SET
                revoked = TRUE,
                revoked_at = NOW()
            WHERE id_refresh_token = $1
        `;

      await client.query(revokeTokenQuery, [id]);
    } catch (err) {
      throw new DatabaseError(`Error revoking refresh token: ${err}`);
    } finally {
      client.release();
    }
  }
}
