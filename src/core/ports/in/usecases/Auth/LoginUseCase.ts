import type { UserRepository } from "../../../out/UserRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import type { AccessTokenRepository } from "../../../out/AccessTokenRepository.js";
import { AuthenticationError } from "../../../../domain/errors.js";
import type { RefreshTokenRepository } from "../../../out/RefreshTokenRepository.js";
import type { UserRefreshToken } from "../../../../domain/types.js";
import {
  ACCESS_TOKEN_TTL,
  MAX_NUM_ACTIVE_SESSIONS,
} from "../../../../../config/env.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { RefreshToken } from "../../../../domain/RefreshToken.js";

async function generateRefreshToken(
  encryptionRepository: EncryptionRepository
): Promise<UserRefreshToken> {
  const id = uuidv4();
  const secret = crypto.randomBytes(32).toString("hex");
  const secretHash = await encryptionRepository.hash(secret);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); //30 days

  return {
    id,
    secret,
    secretHash,
    expiresAt,
  };
}

function packRefreshToken(id: string, secret: string): string {
  return `${id}.${secret}`;
}

interface BrowserInfo {
  ip_address: string;
  user_agent: string;
}

interface TokensSession {
  access_token: string;
  refresh_token: string;
}

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

    if (hasActiveSessions.length === MAX_NUM_ACTIVE_SESSIONS)
      throw new AuthenticationError(
        `You have reached the maximum number of active sessions allowed (3). Close an existing session before starting a new one`
      );

    const userProfile = await this.userRepository.getUserProfile(user.id_user);

    const allPermissions = [
      ...userProfile.roles.flatMap((role) => role.permissions),
      ...userProfile.permissions,
    ];

    const uniquePermissionsSet = new Set(allPermissions.map((p) => p.name));

    const payload = {
      id: userProfile.id_user,
      username: userProfile.username,
      full_name: userProfile.full_name,
      permissions: [...uniquePermissionsSet],
    };

    const options = {
      expiresIn: ACCESS_TOKEN_TTL,
      issuer: "hotfix-api",
      audience: "hotfix-api-frontend",
    };

    const accessToken = await this.accessTokenRepository.sign(payload, options);
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
