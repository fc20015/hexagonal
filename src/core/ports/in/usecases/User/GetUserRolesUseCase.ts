import type { UserRepository } from "../../../out/UserRepository.js";
import { Role } from "../../../../domain/Role.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserRolesUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string): Promise<Role[]> {
    const userExist = await this.userRepository.getUserBy("id", id_user);
    if (!userExist)
      throw new UserNotFoundError(`User with ID ${id_user} not found.`);

    const userRoles = await this.userRepository.getUserRoles(id_user);
    return userRoles;
  }
}
