import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { Role } from "../../../../domain/Role.js";
import { RoleAlreadyExistsError } from "../../../../domain/errors.js";

interface PermissionDTO {
  id: number;
  name: string;
  description: string;
}

export class CreateUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(
    name: string,
    permissions: PermissionDTO[] | []
  ): Promise<number> {
    const roleExist = await this.roleRepository.findByName(name);
    if (roleExist)
      throw new RoleAlreadyExistsError(`Role with name ${name} already exists`);
    const domainPermissions: Permission[] = permissions.map(
      (p: PermissionDTO) => {
        return new Permission(p.id, p.name, p.description);
      }
    );

    const role = new Role(null, name, domainPermissions);
    return await this.roleRepository.create(role);
  }
}
