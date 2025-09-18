import { Role } from "../core/domain/Role.js";
import { User } from "../core/domain/User.js";
import type {
  PermissionRow,
  RoleRow,
  UserRow,
  RefreshTokenRow,
  UserRefreshToken,
} from "../core/domain/types.js";
import { Permission } from "../core/domain/Permission.js";
import { UserEmail } from "../core/domain/UserEmail.js";
import { RefreshToken } from "../core/domain/RefreshToken.js";
import type { EncryptionRepository } from "../core/ports/out/EncryptionRepository.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { AuthenticationError } from "../core/domain/errors.js";
import type { AccessTokenRepository } from "../core/ports/out/AccessTokenRepository.js";
import { ACCESS_TOKEN_TTL } from "../config/env.js";

export function mapToRoleDomain(role: RoleRow): Role {
  return new Role(
    role.id,
    role.name,
    role.permissions?.map(
      (perm) => new Permission(perm.id, perm.name, perm.description)
    )
  );
}

export function mapToPermissionDomain(permission: PermissionRow): Permission {
  return new Permission(permission.id, permission.name, permission.description);
}

export function mapToUserDomain(user: UserRow): User {
  const roles = user.roles?.map((role) => mapToRoleDomain(role)) || [];
  const permissions =
    user.permissions?.map((perm) => mapToPermissionDomain(perm)) || [];
  return new User(
    user.id,
    user.username,
    user.password_hash,
    new UserEmail(user.email),
    user.full_name,
    user.is_active,
    user.created_at,
    user.updated_at,
    roles,
    permissions
  );
}

export function mapToRefreshTokenDomain(refreshToken: RefreshTokenRow) {
  return new RefreshToken(
    refreshToken.id,
    refreshToken.user,
    refreshToken.secret_hash,
    refreshToken.ip_address,
    refreshToken.user_agent,
    refreshToken.created_at,
    refreshToken.revoked,
    refreshToken.revoked_at
  );
}

export function parseLazyParam(lazyParam: any): boolean {
  const isLazy =
    lazyParam === "true" || lazyParam === "1" || lazyParam === undefined;
  return isLazy;
}

export async function generateRefreshToken(
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

export async function generateAccessToken(
  user: User,
  permissions: Set<string>,
  accessTokenRepository: AccessTokenRepository
): Promise<string> {
  const payload = {
    id: user.id_user,
    username: user.username,
    full_name: user.full_name,
    permissions: [...permissions],
  };

  const options = {
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: "hotfix-api",
    audience: "hotfix-api-frontend",
  };

  const accessToken = await accessTokenRepository.sign(payload, options);

  return accessToken;
}

export function packRefreshToken(id: string, secret: string): string {
  return `${id}.${secret}`;
}

export function unpackRefreshToken(token: string): {
  id: string;
  secret: string;
} {
  const [id, secret] = token.split(".");
  if (!id || !secret)
    throw new AuthenticationError(`Invalid refresh token format`);
  return { id, secret };
}

export function flattenPermissions(userProfile: User): Set<string> {
  const allPermissions = [
    ...userProfile.roles.flatMap((role) => role.permissions),
    ...userProfile.permissions,
  ];

  const uniquePermissionsSet = new Set(allPermissions.map((p) => p.name));
  return uniquePermissionsSet;
}
