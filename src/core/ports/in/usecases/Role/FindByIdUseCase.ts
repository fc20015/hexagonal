import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";

export class FindByIdUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleId: number): Promise<Role | null> {
    return this.roleRepository.findById(roleId);
  }
}
