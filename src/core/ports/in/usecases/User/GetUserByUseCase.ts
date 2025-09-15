import type { UserRepository } from "../../../out/UserRepository.js";
import { User } from "../../../../domain/User.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserByUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    field: "id_user" | "username" | "email",
    value: string,
    lazy?: boolean
  ): Promise<User> {
    const user = await this.userRepository.getUserBy(field, value, lazy);

    if (!user)
      throw new UserNotFoundError(`User with ${field} = ${value} not found`);

    return user;
  }
}
