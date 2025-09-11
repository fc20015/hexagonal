import {
  PermissionAlreadyExistsError,
  PermissionNotFoundError,
} from "../../../../domain/errors.js";
import { type PermissionRepository } from "../../../out/PermissionRepository.js";
import { Permission } from "../../../../domain/Permission.js";

export class UpdatePermissionUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(id: number, name: string, description: string): Promise<void> {
    const currentPermission = await this.permissionRepository.findById(id);
    if (!currentPermission)
      throw new PermissionNotFoundError(`Permission with ID ${id} not found`);

    if (currentPermission.name !== name) {
      // will need update permission name. Verify that the permission name does not exists
      const permissionByName = await this.permissionRepository.findByName(name);
      if (permissionByName)
        throw new PermissionAlreadyExistsError(
          `Permission with name ${name} already exists`
        );
    }

    const updatedPermission = new Permission(id, name, description);
    await this.permissionRepository.update(updatedPermission);
  }
}
