import { PermissionNotFoundError } from "../../../../domain/errors.js";
import { type PermissionRepository } from "../../../out/PermissionRepository.js";

export class DeletePermissionUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(permissionId: number): Promise<void> {
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission)
      throw new PermissionNotFoundError(
        `Permission with ID ${permissionId} not found`
      );
    await this.permissionRepository.delete(permissionId);
  }
}
