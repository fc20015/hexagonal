import type { RefreshTokenRepository } from "../../../out/RefreshTokenRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import { AuthenticationError } from "../../../../domain/errors.js";

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly encryptionRepository: EncryptionRepository
  ) {}

  async execute(id: string, secret: string): Promise<void> {
    const currentRefreshToken =
      await this.refreshTokenRepository.findRefreshTokenById(id);
    if (!currentRefreshToken) return;

    const secretsMatch = await this.encryptionRepository.compare(
      secret,
      currentRefreshToken.secret_hash
    );

    if (!secretsMatch)
      throw new AuthenticationError(
        `The session is invalid or has already been closed. Log in again.`
      );

    await this.refreshTokenRepository.revokeToken(currentRefreshToken.id);
  }
}
