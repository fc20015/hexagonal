import { type PermissionRepository } from "../../../out/PermissionRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { PermissionNotFoundError } from "../../../../domain/errors.js";

export class FindPermissionByIdUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(permissionId: number): Promise<Permission | null> {
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission)
      throw new PermissionNotFoundError(
        `Permission with ID ${permissionId} not found`
      );
    return permission;
  }
}
