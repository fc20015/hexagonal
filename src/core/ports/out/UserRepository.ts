import { User } from "../../domain/User.js";
import { Permission } from "../../domain/Permission.js";
import type { Role } from "../../domain/Role.js";

export interface UserRepository {
  createUser(user: User): Promise<string>;
  getAllUsers(lazy?: boolean): Promise<User[]>;
  getUserBy(
    field: "id_user" | "username" | "email",
    value: string,
    lazy?: boolean
  ): Promise<User | null>;
  getUserProfile(id_user: string): Promise<User | null>;
  getUserRoles(id_user: string): Promise<Role[]>;
  getUserPermissions(id_user: string): Promise<Permission[]>;
  updateUser(user: User): Promise<void>;
  deleteUser(id_user: string): Promise<void>;
}
