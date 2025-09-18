import type { RefreshTokenRepository } from "../../../out/RefreshTokenRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import type { UserRepository } from "../../../out/UserRepository.js";
import type { AccessTokenRepository } from "../../../out/AccessTokenRepository.js";
import { AuthenticationError } from "../../../../domain/errors.js";
import type { BrowserInfo, TokensSession } from "../../../../domain/types.js";
import {
  flattenPermissions,
  generateAccessToken,
  generateRefreshToken,
  packRefreshToken,
} from "../../../../../shared/utils.js";
import { RefreshToken } from "../../../../domain/RefreshToken.js";

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly encryptionRepository: EncryptionRepository,
    private readonly userRepository: UserRepository,
    private readonly accessTokenRepository: AccessTokenRepository
  ) {}

  async execute(
    id: string,
    secret: string,
    browserInfo: BrowserInfo
  ): Promise<TokensSession> {
    const currentRefreshToken =
      await this.refreshTokenRepository.findRefreshTokenById(id);
    if (!currentRefreshToken)
      throw new AuthenticationError(`The session is not valid. Log in again`);

    const secretsMatch = await this.encryptionRepository.compare(
      secret,
      currentRefreshToken.secret_hash
    );

    if (!secretsMatch)
      throw new AuthenticationError(`The session is not valid. Log in again`);

    if (currentRefreshToken.revoked)
      throw new AuthenticationError(
        `Your session has expired or was closed. Log in again`
      );

    const userProfile = await this.userRepository.getUserProfile(
      currentRefreshToken.id_user
    );

    const uniquePermissionsSet = flattenPermissions(userProfile);

    await this.refreshTokenRepository.revokeToken(currentRefreshToken.id);

    const accessToken = await generateAccessToken(
      userProfile,
      uniquePermissionsSet,
      this.accessTokenRepository
    );
    const refreshToken = await generateRefreshToken(this.encryptionRepository);
    const packedRefreshToken = packRefreshToken(
      refreshToken.id,
      refreshToken.secret
    );

    await this.refreshTokenRepository.save(
      new RefreshToken(
        refreshToken.id,
        userProfile.id_user,
        refreshToken.secretHash,
        browserInfo.ip_address,
        browserInfo.user_agent
      )
    );

    return { access_token: accessToken, refresh_token: packedRefreshToken };
  }
}
