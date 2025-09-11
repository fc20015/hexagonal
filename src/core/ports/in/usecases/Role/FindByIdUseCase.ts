import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";
import { RoleNotFoundError } from "../../../../domain/errors.js";

export class FindByIdUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleId: number): Promise<Role | null> {
    const role = this.roleRepository.findById(roleId);
    if (!role) throw new RoleNotFoundError(`Role with ID ${roleId} not found`);
    return role;
  }
}
