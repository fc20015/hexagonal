import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";

export class FindByNameUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleName: string): Promise<Role | null> {
    return this.roleRepository.findByName(roleName);
  }
}
