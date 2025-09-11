import { type PermissionRepository } from "../../../out/PermissionRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { PermissionNotFoundError } from "../../../../domain/errors.js";

export class FindPermissionByNameUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(permissionName: string): Promise<Permission | null> {
    const permission = await this.permissionRepository.findByName(
      permissionName
    );
    if (!permission)
      throw new PermissionNotFoundError(
        `Permission with name ${permissionName} not found`
      );
    return permission;
  }
}
