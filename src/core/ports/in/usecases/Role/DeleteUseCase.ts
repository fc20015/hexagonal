import { type RoleRepository } from "../../../out/RoleRepository.js";
import { RoleNotFoundError } from "../../../../domain/errors.js";

export class DeleteUseCase {
  constructor(private readonly roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(roleId: number): Promise<void> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new RoleNotFoundError(`Role with ID ${roleId} not found`);
    await this.roleRepository.delete(roleId);
  }
}
