import { type UserRepository } from "../../../out/UserRepository.js";
import { Role } from "../../../../domain/Role.js";
import { UserNotFoundError } from "../../../../domain/errors.js";
import { type RoleRow } from "../../../../domain/types.js";
import { mapToRoleDomain } from "../../../../../shared/utils.js";

export class AddRolesToUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id_user: string, roles: RoleRow[]): Promise<void> {
    const user = await this.userRepository.getUserById(id_user);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    const formattedRoles: Role[] = mapToRoleDomain(roles);

    await this.userRepository.addRolesToUser(id_user, formattedRoles);
  }
}
