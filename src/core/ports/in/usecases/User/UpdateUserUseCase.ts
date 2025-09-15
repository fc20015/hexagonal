import {
  mapToPermissionDomain,
  mapToRoleDomain,
} from "../../../../../shared/utils.js";
import { UserNotFoundError } from "../../../../domain/errors.js";
import type { RoleRow, UserRow } from "../../../../domain/types.js";
import type { UserRepository } from "../../../out/UserRepository.js";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserRow): Promise<void> {
    const userExist = await this.userRepository.getUserBy(
      "id_user",
      user.id_user,
      false
    );
    if (!userExist)
      throw new UserNotFoundError(`User with ID ${user.id_user} not found.`);
    const currentRoles = new Set(userExist.roles.map((r) => r.id));
    const updatedRoles = new Set(user.roles.map((ur) => ur.id));

    const currentPermissions = new Set(userExist.permissions.map((p) => p.id));
    const updatedPermissions = new Set(user.permissions.map((up) => up.id));

    const rolesToAdd = [...updatedRoles].filter((id) => !currentRoles.has(id));
    // const rolesToRemove = [...currentRoles].filter(id => !updatedRoles.has(id));

    const toAdd = new Set();
  }
}
