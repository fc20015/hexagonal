import type { UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(lazy?: boolean): Promise<User[]> {
    return await this.userRepository.getAllUsers(lazy);
  }
}
