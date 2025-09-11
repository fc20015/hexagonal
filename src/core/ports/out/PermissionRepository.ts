import type { Permission } from "../../domain/Permission.js";

export interface PermissionRepository {
  create(permission: Permission): Promise<number>;
  findById(permissionId: number): Promise<Permission | null>;
  findByName(permissionName: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  update(updatedPermission: Permission): Promise<void>;
  delete(permissionId: number): Promise<void>;
}
