import { PostgresPermissionRepository } from "../adapters/out/postgres/PostgresPermissionRepository.js";
import { CreatePermissionUseCase } from "../core/ports/in/usecases/Permission/CreateUseCase.js";
import { FindAllPermissionsUseCase } from "../core/ports/in/usecases/Permission/FindAllUseCase.js";
import { FindPermissionByIdUseCase } from "../core/ports/in/usecases/Permission/FindByIdUseCase.js";
import { UpdatePermissionUseCase } from "../core/ports/in/usecases/Permission/UpdateUseCase.js";
import { DeletePermissionUseCase } from "../core/ports/in/usecases/Permission/DeleteUseCase.js";

import { PostgresRoleRepository } from "../adapters/out/postgres/PostgresRoleRepository.js";
import { FindAllUseCase } from "../core/ports/in/usecases/Role/FindAllUseCase.js";
import { FindByIdUseCase } from "../core/ports/in/usecases/Role/FindByIdUseCase.js";
import { DeleteUseCase } from "../core/ports/in/usecases/Role/DeleteUseCase.js";
import { CreateUseCase } from "../core/ports/in/usecases/Role/CreateUseCase.js";
import { UpdateRoleUseCase } from "../core/ports/in/usecases/Role/UpdateRoleUseCase.js";
import { GetPermissionsUseCase } from "../core/ports/in/usecases/Role/GetPermissionsUseCase.js";

import { PostgresUserRepository } from "../adapters/out/postgres/PostgresUserRepository.js";
import { BcryptEncryptionRepository } from "../adapters/out/bcrypt/BcryptEncryptionRepository.js";

import { CreateUserUseCase } from "../core/ports/in/usecases/User/CreateUserUseCase.js";
import { GetAllUsersUseCase } from "../core/ports/in/usecases/User/GetAllUsersUseCase.js";
import { GetUserByUseCase } from "../core/ports/in/usecases/User/GetUserByUseCase.js";
import { GetUserProfileUseCase } from "../core/ports/in/usecases/User/GetUserProfileUseCase.js";
import { GetUserPermissionsUseCase } from "../core/ports/in/usecases/User/GetUserPermissionsUseCase.js";
import { GetUserRolesUseCase } from "../core/ports/in/usecases/User/GetUserRolesUseCase.js";
import { UpdateUserUseCase } from "../core/ports/in/usecases/User/UpdateUserUseCase.js";
import { DeleteUserUseCase } from "../core/ports/in/usecases/User/DeleteUserUseCase.js";
import { JwtAccessTokenRepository } from "../adapters/out/jsonwebtoken/JwtAccessTokenRepository.js";
import { LoginUseCase } from "../core/ports/in/usecases/Auth/LoginUseCase.js";
import { PostgresRefreshTokenRepository } from "../adapters/out/postgres/PostgresRefreshTokenRepository.js";

const permissionRepository = new PostgresPermissionRepository();
const roleRepository = new PostgresRoleRepository();
const encryptionRepository = new BcryptEncryptionRepository();
const userRepository = new PostgresUserRepository();
const accessTokenRepository = new JwtAccessTokenRepository();
const refreshTokenRepository = new PostgresRefreshTokenRepository();

export const ServiceContainer = {
  roles: {
    findAll: new FindAllUseCase(roleRepository),
    findById: new FindByIdUseCase(roleRepository),
    delete: new DeleteUseCase(roleRepository),
    create: new CreateUseCase(roleRepository),
    update: new UpdateRoleUseCase(roleRepository),
    getPermissions: new GetPermissionsUseCase(roleRepository),
  },
  permissions: {
    findAll: new FindAllPermissionsUseCase(permissionRepository),
    findById: new FindPermissionByIdUseCase(permissionRepository),
    delete: new DeletePermissionUseCase(permissionRepository),
    create: new CreatePermissionUseCase(permissionRepository),
    update: new UpdatePermissionUseCase(permissionRepository),
  },
  users: {
    create: new CreateUserUseCase(userRepository, encryptionRepository),
    getAll: new GetAllUsersUseCase(userRepository),
    getBy: new GetUserByUseCase(userRepository),
    getProfile: new GetUserProfileUseCase(userRepository),
    getPermissions: new GetUserPermissionsUseCase(userRepository),
    getRoles: new GetUserRolesUseCase(userRepository),
    update: new UpdateUserUseCase(userRepository),
    delete: new DeleteUserUseCase(userRepository),
  },
  auth: {
    login: new LoginUseCase(
      userRepository,
      encryptionRepository,
      accessTokenRepository,
      refreshTokenRepository
    ),
  },
};
