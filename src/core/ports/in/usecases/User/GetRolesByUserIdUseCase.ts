import { type UserRepository } from "../../../out/UserRepository.js";
import { Role } from "../../../../domain/Role.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetRolesByUserIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id_user: string): Promise<Role[]> {
    const user = await this.userRepository.getUserById(id_user);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }

    const roles = await this.userRepository.getRolesByUserId(id_user);
    return roles;
  }
}
