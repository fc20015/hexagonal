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
    const domainPermissions: Permission[] = permissions.map(
      (p) => new Permission(p.id_permission, p.name, p.description)
    );
    const role = new Role(roleId, name, domainPermissions);
    await this.roleRepository.update(role);
  }
}
