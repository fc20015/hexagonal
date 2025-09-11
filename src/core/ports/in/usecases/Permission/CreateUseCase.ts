import { PermissionAlreadyExistsError } from "../../../../domain/errors.js";
import { Permission } from "../../../../domain/Permission.js";
import { type PermissionRepository } from "../../../out/PermissionRepository.js";

export class CreatePermissionUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(name: string, description: string): Promise<number> {
    const permissionWithSameName = await this.permissionRepository.findByName(
      name
    );
    if (permissionWithSameName)
      throw new PermissionAlreadyExistsError(
        `Permission with name ${name} already exists`
      );
    const newPermission = new Permission(null, name, description);
    return await this.permissionRepository.create(newPermission);
  }
}
