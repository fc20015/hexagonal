import { Role } from "../../domain/Role.js";
import { Permission } from "../../domain/Permission.js";

export interface RoleRepository {
  create(role: Role): Promise<number>;
  findById(roleId: number): Promise<Role | null>;
  findByIdWithPermissions(roleId: number): Promise<Role | null>;
  findByName(roleName: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findAllWithPermissions(): Promise<Role[]>;
  getPermissions(roleId: number): Promise<Permission[]>;
  update(updatedRole: Role, currentRole: Role): Promise<void>;
  delete(roleId: number): Promise<void>;
}
