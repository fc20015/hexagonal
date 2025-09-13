import { type UserRepository } from "../../../out/UserRepository.js";
import { Permission } from "../../../../domain/Permission.js";
import { UserNotFoundError } from "../../../../domain/errors.js";

export class GetPermissionsByUserIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id_user: string): Promise<Permission[]> {
    const user = await this.userRepository.getUserById(id_user);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return this.userRepository.getPermissionsByUserId(id_user);
  }
}
