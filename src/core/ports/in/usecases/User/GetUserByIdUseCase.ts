import type { UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id_user: string): Promise<User | null> {
    const user = this.userRepository.getUserById(id_user);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }
}
