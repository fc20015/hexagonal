import { type RoleRepository } from "../../../out/RoleRepository.js";
import { Role } from "../../../../domain/Role.js";
import { Permission } from "../../../../domain/Permission.js";

interface PermissionInput {
  id: number;
  name: string;
  description: string;
}

interface SaveRoleInput {
  id?: number;
  name: string;
  permissions?: PermissionInput[];
}

export class SaveUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: SaveRoleInput): Promise<void> {
    const { id = null, name, permissions = [] } = input;
    let domainPermissions: Permission[] = [];
    if (permissions.length > 0) {
      domainPermissions = permissions.map((p) => {
        return new Permission(p.id, p.name, p.description);
      });
    }

    const role = new Role(id, name, domainPermissions);
    console.log(role);
    await this.roleRepository.save(role);
  }
}
