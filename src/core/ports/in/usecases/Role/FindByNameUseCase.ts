import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";
import { RoleNotFoundError } from "../../../../domain/errors.js";

export class FindByNameUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleName: string): Promise<Role | null> {
    const role = this.roleRepository.findByName(roleName);
    if (!role)
      throw new RoleNotFoundError(`Role with name ${roleName} not found`);
    return role;
  }
}
