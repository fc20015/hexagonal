import { Permission } from "../../domain/Permission.js";
import { Role } from "../../domain/Role.js";

export interface RoleRepository {
  findById(roleId: number): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  delete(roleId: number): Promise<void>;
  findByName(roleName: string): Promise<Role | null>;
  create(role: Role): Promise<number>;
  update(role: Role): Promise<void>;
}
