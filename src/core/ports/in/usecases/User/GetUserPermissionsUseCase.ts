import type { UserRepository } from "../../../out/UserRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetUserPermissionsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id_user: string): Promise<Permission[]> {
    const userExist = await this.userRepository.getUserBy("id_user", id_user);
    if (!userExist)
      throw new UserNotFoundError(`User with ID ${id_user} not found.`);
    const userPermissions = await this.userRepository.getUserPermissions(
      id_user
    );
    return userPermissions;
  }
}
