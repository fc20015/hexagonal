import { type UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { type UserRow } from "../../../../domain/types.js";
import {
  mapToRoleDomain,
  mapToPermissionDomain,
} from "../../../../../shared/utils.js";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../../../../domain/errors.js";
import { Role } from "../../../../domain/Role.js";
import { Permission } from "../../../../domain/Permission.js";
import { UserEmail } from "../../../../domain/UserEmail.js";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserRow): Promise<void> {
    const existingUserById = await this.userRepository.getUserById(
      user.id_user
    );
    if (!existingUserById) throw new UserNotFoundError(`User not found`);

    if (existingUserById.username !== user.username) {
      const existingUserByUsername =
        await this.userRepository.getUserByUsername(user.username);

      if (existingUserByUsername)
        throw new UserAlreadyExistsError(`Username is not available`);
    }

    const formattedRoles: Role[] = mapToRoleDomain(user.roles);
    const formattedPermissions: Permission[] = mapToPermissionDomain(
      user.permissions
    );

    const updatedUser = new User(
      user.id_user,
      user.username,
      user.password_hash,
      new UserEmail(user.email),
      user.full_name,
      user.is_active,
      user.created_at,
      user.updated_at,
      formattedRoles,
      formattedPermissions
    );

    await this.userRepository.updateUser(updatedUser);
  }
}
