import { type RoleRepository } from "../../../out/RoleRepository.js";

export class FindByNameUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(roleName: string) {
    return this.roleRepository.findByName(roleName);
  }
}
