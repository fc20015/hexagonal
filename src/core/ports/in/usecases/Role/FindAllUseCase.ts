import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";

export class FindAllUseCase {
  constructor(private readonly roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }
}
