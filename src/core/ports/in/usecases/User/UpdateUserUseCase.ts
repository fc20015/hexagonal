import { mapToUserDomain } from "../../../../../shared/utils.js";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../../../../domain/errors.js";
import type { UserRow } from "../../../../domain/types.js";
import type { UserRepository } from "../../../out/UserRepository.js";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserRow): Promise<void> {
    const currentUser = await this.userRepository.getUserBy(
      "id_user",
      user.id,
      false
    );
    if (!currentUser)
      throw new UserNotFoundError(`User with ID ${user.id} not found.`);

    const updatedUser = mapToUserDomain(user);

    if (currentUser.username !== updatedUser.username) {
      const userWithSameUsernameExist = await this.userRepository.getUserBy(
        "username",
        updatedUser.username
      );
      if (userWithSameUsernameExist)
        throw new UserAlreadyExistsError(`Username is not available.`);
    }

    await this.userRepository.updateUser(currentUser, updatedUser);
  }
}
