import { User } from "../../domain/User.js";
import { UserEmail } from "../../domain/UserEmail.js";
import { Permission } from "../../domain/Permission.js";
import type { Role } from "../../domain/Role.js";

export interface UserRepository {
  createUser(user: User): Promise<string>;
  getUserById(id_user: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: UserEmail): Promise<User | null>;
  getPermissionsByUserId(id_user: string): Promise<Permission[]>;
  getRolesByUserId(id_user: string): Promise<Role[]>;
  addRolesToUser(id_user: string, roles: Role[]): Promise<void>;
  removeRolesFromUser(id_user: string, roles: Role[]): Promise<void>;
  addPermissionsToUser(
    id_user: string,
    permissions: Permission[]
  ): Promise<void>;
  removePermissionsFromUser(
    id_user: string,
    permissions: Permission[]
  ): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id_user: string): Promise<void>;
}
