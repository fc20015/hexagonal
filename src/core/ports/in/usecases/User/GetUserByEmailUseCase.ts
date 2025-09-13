import { type UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { UserNotFoundError } from "../../../../domain/errors.js";
import { UserEmail } from "../../../../domain/UserEmail.js";

export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const userEmail = new UserEmail(email);
    const user = await this.userRepository.getUserByEmail(userEmail);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }
}
