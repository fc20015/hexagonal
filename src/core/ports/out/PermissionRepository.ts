import type { Permission } from "../../domain/Permission.js";

export interface PermissionRepository {
  findByName(permissionName: string): Promise<Permission | null>;
  findById(permissionId: number): Promise<Permission | null>;
}
