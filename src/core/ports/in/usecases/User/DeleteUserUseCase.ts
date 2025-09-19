import { UserNotFoundError } from "../../../../domain/errors.js";
import type { UserRepository } from "../../../out/UserRepository.js";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string): Promise<void> {
    const userExist = await this.userRepository.getUserBy("id", id_user);
    if (!userExist)
      throw new UserNotFoundError(`User with ID ${id_user} not found.`);

    await this.userRepository.deleteUser(id_user);
  }
}
