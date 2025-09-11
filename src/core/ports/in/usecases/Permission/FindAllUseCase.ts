import { type PermissionRepository } from "../../../out/PermissionRepository.js";
import { Permission } from "../../../../domain/Permission.js";

export class FindAllPermissionsUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(): Promise<Permission[]> {
    return await this.permissionRepository.findAll();
  }
}
