import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Permission } from "../../../../domain/Permission.js";

export class GetPermissionsUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(roleId: number): Promise<Permission[]> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return this.roleRepository.getPermissions(roleId);
  }
}
