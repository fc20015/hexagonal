import { RoleNotFoundError } from "../../../../domain/errors.js";
import type { Role } from "../../../../domain/Role.js";
import { type RoleRepository } from "../../../out/RoleRepository.js";

export class FindByIdWithPermissionsUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleId: number): Promise<Role | null> {
    const role = await this.roleRepository.findByIdWithPermissions(roleId);
    if (!role) throw new RoleNotFoundError(`Role with ID ${roleId} not found`);
    return role;
  }
}
