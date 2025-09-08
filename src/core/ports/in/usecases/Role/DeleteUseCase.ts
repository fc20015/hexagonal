import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";

export class DeleteUseCase {
  constructor(private readonly roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(roleId: number): Promise<void> {
    await this.roleRepository.delete(roleId);
  }
}
