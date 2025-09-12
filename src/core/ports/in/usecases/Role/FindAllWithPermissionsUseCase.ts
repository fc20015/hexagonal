import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";

export class FindAllWithPermissionsUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return await this.roleRepository.findAllWithPermissions();
  }
}
