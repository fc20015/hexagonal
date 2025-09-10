import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { Role } from "../../../../domain/Role.js";

interface PermissionDTO {
  id_permission: number;
  name: string;
  description: string;
}

export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(
    roleId: number,
    name: string,
    permissions: PermissionDTO[]
  ): Promise<void> {
    const currentRole = await this.roleRepository.findById(roleId);
    if (currentRole === null)
      throw new Error(`Role with ID ${roleId} not found`);
    if (currentRole.name !== name) {
      // will need to update the role name. Verify that the role name does not exist
      const currentRole = await this.roleRepository.findByName(name);
      if (currentRole) throw new Error(`There is already an ${name} role`);
    }
    const domainPermissions: Permission[] = permissions.map(
      (p) => new Permission(p.id_permission, p.name, p.description)
    );
    const updatedRole = new Role(roleId, name, domainPermissions);
    await this.roleRepository.update(updatedRole, currentRole);
  }
}
