import type { UserRepository } from "../../../out/UserRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import type { AccessTokenRepository } from "../../../out/AccessTokenRepository.js";
import { AuthenticationError } from "../../../../domain/errors.js";
import type { RefreshTokenRepository } from "../../../out/RefreshTokenRepository.js";
import { MAX_NUM_ACTIVE_SESSIONS } from "../../../../../config/env.js";
import { RefreshToken } from "../../../../domain/RefreshToken.js";
import {
  flattenPermissions,
  generateAccessToken,
  generateRefreshToken,
  packRefreshToken,
} from "../../../../../shared/utils.js";
import type { BrowserInfo, TokensSession } from "../../../../domain/types.js";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionRepository: EncryptionRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(
    username: string,
    password: string,
    browserInfo: BrowserInfo
  ): Promise<TokensSession> {
    const user = await this.userRepository.getUserBy("username", username);
    if (!user)
      throw new AuthenticationError(`The username or password is incorrect.`);

    const passwordsMatch = await this.encryptionRepository.compare(
      password,
      user.password_hash
    );

    if (!passwordsMatch)
      throw new AuthenticationError(`The username or password is incorrect.`);

    if (!user.is_active)
      throw new AuthenticationError(
        `The account is inactive. Contact your administrator to reactivate it.`
      );

    const hasActiveSessions =
      await this.refreshTokenRepository.getCurrentTokens(user.id_user);

    if (hasActiveSessions.length >= MAX_NUM_ACTIVE_SESSIONS)
      throw new AuthenticationError(
        `You have reached the maximum number of active sessions allowed (3). Close an existing session before starting a new one`
      );

    const userProfile = await this.userRepository.getUserProfile(user.id_user);

    const uniquePermissionsSet = flattenPermissions(userProfile);

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
