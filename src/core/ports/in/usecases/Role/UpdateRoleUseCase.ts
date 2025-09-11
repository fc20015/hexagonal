import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { Role } from "../../../../domain/Role.js";
import {
  RoleAlreadyExistsError,
  RoleNotFoundError,
} from "../../../../domain/errors.js";

interface PermissionDTO {
  id: number;
  name: string;
  description: string;
}

export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(
    roleId: number,
    name: string,
    permissions: PermissionDTO[] | []
  ): Promise<void> {
    const currentRoleById = await this.roleRepository.findById(roleId);
    if (!currentRoleById)
      throw new RoleNotFoundError(`Role with ID ${roleId} not found`);

    if (currentRoleById.name !== name) {
      // will need to update the role name. Verify that the role name does not exist
      const currentRoleByName = await this.roleRepository.findByName(name);
      if (currentRoleByName)
        throw new RoleAlreadyExistsError(
          `Role with name ${name} already exists`
        );
    }
    const domainPermissions: Permission[] = permissions.map(
      (p: PermissionDTO) => new Permission(p.id, p.name, p.description)
    );
    const updatedRole = new Role(roleId, name, domainPermissions);
    await this.roleRepository.update(updatedRole, currentRoleById);
  }
}
