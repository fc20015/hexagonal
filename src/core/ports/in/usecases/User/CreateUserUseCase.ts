import type { UserRepository } from "../../../out/UserRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import type { RoleRow, PermissionRow } from "../../../../domain/types.js";
import {
  mapToRoleDomain,
  mapToPermissionDomain,
} from "../../../../../shared/utils.js";
import { User } from "../../../../domain/User.js";
import { Role } from "../../../../domain/Role.js";
import { Permission } from "../../../../domain/Permission.js";
import { UserAlreadyExistsError } from "../../../../domain/errors.js";
import { UserEmail } from "../../../../domain/UserEmail.js";
import { v4 as uuidv4 } from "uuid";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionRepository: EncryptionRepository
  ) {}

  async execute(
    username: string,
    password: string,
    email: string,
    full_name: string,
    roles?: RoleRow[],
    permissions?: PermissionRow[]
  ): Promise<string> {
    const userExist = await this.userRepository.getUserBy("username", username);
    if (userExist)
      throw new UserAlreadyExistsError(`Username is not available`);

    const userRoles: Role[] = roles?.map((role) => mapToRoleDomain(role)) || [];
    const userPermissions: Permission[] =
      permissions?.map((perm) => mapToPermissionDomain(perm)) || [];

    const userId = uuidv4();
    const passwordHash = await this.encryptionRepository.hash(password);

    const newUser = new User(
      userId,
      username,
      passwordHash,
      new UserEmail(email),
      full_name,
      true,
      new Date(),
      new Date(),
      userRoles,
      userPermissions
    );

    await this.userRepository.createUser(newUser);

    return userId;
  }
}
