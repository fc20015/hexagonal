import { UserNotFoundError } from "../../../../domain/errors.js";
import { type UserRepository } from "../../../out/UserRepository.js";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string): Promise<void> {
    const user = await this.userRepository.getUserById(id_user);
    if (!user) throw new UserNotFoundError(`User not found`);

    await this.userRepository.deleteUser(id_user);
  }
}
