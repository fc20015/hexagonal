import { type UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserByUsernameUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string): Promise<User | null> {
    const user = this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }
}
