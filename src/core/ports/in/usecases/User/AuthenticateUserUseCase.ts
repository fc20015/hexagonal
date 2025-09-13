import { type UserRepository } from "../../../out/UserRepository.js";
import { type EncryptionRepository } from "../../../out/EncryptionRepository.js";
import { User } from "../../../../domain/User.js";
import {
  AuthenticationError,
  InactiveUserError,
  UserNotFoundError,
} from "../../../../domain/errors.js";
import { Role } from "../../../../domain/Role.js";
import { Permission } from "../../../../domain/Permission.js";

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private encryptionRepository: EncryptionRepository
  ) {}

  async execute(username: string, password: string): Promise<User> {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }

    if (!user.is_active)
      throw new InactiveUserError(
        `The account associated with this user is currently inactive. Please contact support or your administrator for assistance.`
      );

    const isPasswordValid = await this.encryptionRepository.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Fetch roles and permissions
    const userRoles: Role[] = await this.userRepository.getRolesByUserId(
      user.id_user
    );
    const userPermissions: Permission[] =
      await this.userRepository.getPermissionsByUserId(user.id_user);

    user.roles = userRoles;
    user.permissions = userPermissions;

    return user;
  }
}
