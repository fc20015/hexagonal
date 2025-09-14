import { Role } from "../../domain/Role.js";
import { Permission } from "../../domain/Permission.js";

export interface RoleRepository {
  create(role: Role): Promise<number>;
  findById(roleId: number, lazy?: boolean): Promise<Role | null>;
  findByName(roleName: string, lazy?: boolean): Promise<Role | null>;
  findAll(lazy?: boolean): Promise<Role[]>;
  getPermissions(roleId: number): Promise<Permission[]>;
  update(updatedRole: Role, currentRole: Role): Promise<void>;
  delete(roleId: number): Promise<void>;
}
