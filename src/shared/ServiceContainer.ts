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
import { FindByIdWithPermissionsUseCase } from "../core/ports/in/usecases/Role/FindByIdWithPermissionsUseCase.js";
import { FindAllWithPermissionsUseCase } from "../core/ports/in/usecases/Role/FindAllWithPermissionsUseCase.js";
import { GetPermissionsUseCase } from "../core/ports/in/usecases/Role/GetPermissionsUseCase.js";

import { PostgresUserRepository } from "../adapters/out/postgres/PostgresUserRepository.js";
import { BcryptEncryptionRepository } from "../adapters/out/bcrypt/BcryptEncryptionRepository.js";
import { AuthenticateUserUseCase } from "../core/ports/in/usecases/User/AuthenticateUserUseCase.js";
import { GetUserByIdUseCase } from "../core/ports/in/usecases/User/GetUserByIdUseCase.js";
import { GetUserByUsernameUseCase } from "../core/ports/in/usecases/User/GetUserByUsernameUseCase.js";
import { GetUserByEmailUseCase } from "../core/ports/in/usecases/User/GetUserByEmailUseCase.js";
import { GetRolesByUserIdUseCase } from "../core/ports/in/usecases/User/GetRolesByUserIdUseCase.js";
import { GetPermissionsByUserIdUseCase } from "../core/ports/in/usecases/User/GetPermissionsByUserIdUseCase.js";
import { AddRolesToUserUseCase } from "../core/ports/in/usecases/User/AddRolesToUserUseCase.js";
import { AddPermissionsToUserUseCase } from "../core/ports/in/usecases/User/AddPermissionsToUserUseCase.js";
import { RemoveRolesFromUserUseCase } from "../core/ports/in/usecases/User/RemoveRolesFromUserUseCase.js";
import { RemovePermissionsToUserUseCase } from "../core/ports/in/usecases/User/RemovePermissionsToUserUseCase.js";
import { UpdateUserUseCase } from "../core/ports/in/usecases/User/UpdateUserUseCase.js";
import { DeleteUserUseCase } from "../core/ports/in/usecases/User/DeleteUserUseCase.js";
import { CreateUserUseCase } from "../core/ports/in/usecases/User/CreateUserUseCase.js";

const permissionRepository = new PostgresPermissionRepository();
const roleRepository = new PostgresRoleRepository();
const encryptionRepository = new BcryptEncryptionRepository();
const userRepository = new PostgresUserRepository();

export const ServiceContainer = {
  roles: {
    findAll: new FindAllUseCase(roleRepository),
    findAllWithPermissions: new FindAllWithPermissionsUseCase(roleRepository),
    findById: new FindByIdUseCase(roleRepository),
    findByIdWithPermissions: new FindByIdWithPermissionsUseCase(roleRepository),
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
    login: new AuthenticateUserUseCase(userRepository, encryptionRepository),
    findById: new GetUserByIdUseCase(userRepository),
    findByUsername: new GetUserByUsernameUseCase(userRepository),
    findByEmail: new GetUserByEmailUseCase(userRepository),
    getRoles: new GetRolesByUserIdUseCase(userRepository),
    getPermissions: new GetPermissionsByUserIdUseCase(userRepository),
    addRoles: new AddRolesToUserUseCase(userRepository),
    addPermissions: new AddPermissionsToUserUseCase(userRepository),
    removeRoles: new RemoveRolesFromUserUseCase(userRepository),
    removePermissions: new RemovePermissionsToUserUseCase(userRepository),
    create: new CreateUserUseCase(userRepository, encryptionRepository),
    update: new UpdateUserUseCase(userRepository),
    delete: new DeleteUserUseCase(userRepository),
  },
};
