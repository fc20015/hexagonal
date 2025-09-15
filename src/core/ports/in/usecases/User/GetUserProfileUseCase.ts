import type { UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string): Promise<User> {
    const userProfile = await this.userRepository.getUserProfile(id_user);
    if (!userProfile)
      throw new UserNotFoundError(`User with ID ${id_user} not found.`);
    return userProfile;
  }
}
