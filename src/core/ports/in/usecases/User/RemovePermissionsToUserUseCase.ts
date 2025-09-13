import { type UserRepository } from "../../../out/UserRepository.js";
import { type PermissionRow } from "../../../../domain/types.js";
import { Permission } from "../../../../domain/Permission.js";
import { UserNotFoundError } from "../../../../domain/errors.js";
import { mapToPermissionDomain } from "../../../../../shared/utils.js";

export class RemovePermissionsToUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string, permissions: PermissionRow[]): Promise<void> {
    const user = await this.userRepository.getUserById(id_user);

    if (!user) throw new UserNotFoundError(`User not found`);

    const formattedPermissions: Permission[] =
      mapToPermissionDomain(permissions);

    await this.userRepository.removePermissionsFromUser(
      id_user,
      formattedPermissions
    );
  }
}
