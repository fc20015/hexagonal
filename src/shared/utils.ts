import { Role } from "../core/domain/Role.js";
import { User } from "../core/domain/User.js";
import type { PermissionRow, RoleRow, UserRow } from "../core/domain/types.js";
import { Permission } from "../core/domain/Permission.js";
import { UserEmail } from "../core/domain/UserEmail.js";

export function mapToRoleDomain(roles: RoleRow[]): Role[] {
  return roles.map((role) => {
    return new Role(
      role.id,
      role.name,
      role.permissions?.map(
        (perm) => new Permission(perm.id, perm.name, perm.description)
      )
    );
  });
}

export function mapToPermissionDomain(
  permissions: PermissionRow[]
): Permission[] {
  return permissions.map(
    (perm) => new Permission(perm.id, perm.name, perm.description)
  );
}

export function mapToUserDomain(user: UserRow): User {
  return new User(
    user.id_user,
    user.username,
    user.password_hash,
    new UserEmail(user.email),
    user.full_name,
    user.is_active,
    user.created_at,
    user.updated_at
  );
}
