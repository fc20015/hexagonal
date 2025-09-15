import { Role } from "../core/domain/Role.js";
import { User } from "../core/domain/User.js";
import type { PermissionRow, RoleRow, UserRow } from "../core/domain/types.js";
import { Permission } from "../core/domain/Permission.js";
import { UserEmail } from "../core/domain/UserEmail.js";

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
    user.id_user,
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

export function parseLazyParam(lazyParam: any): boolean {
  const isLazy =
    lazyParam === "true" || lazyParam === "1" || lazyParam === undefined;
  return isLazy;
}
