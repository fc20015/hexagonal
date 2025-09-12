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

const permissionRepository = new PostgresPermissionRepository();
const roleRepository = new PostgresRoleRepository();

export const ServiceContainer = {
  roles: {
    findAll: new FindAllUseCase(roleRepository),
    findAllWithPermissions: new FindAllWithPermissionsUseCase(roleRepository),
    findById: new FindByIdUseCase(roleRepository),
    findByIdWithPermissions: new FindByIdWithPermissionsUseCase(roleRepository),
    delete: new DeleteUseCase(roleRepository),
    create: new CreateUseCase(roleRepository),
    update: new UpdateRoleUseCase(roleRepository),
  },
  permissions: {
    findAll: new FindAllPermissionsUseCase(permissionRepository),
    findById: new FindPermissionByIdUseCase(permissionRepository),
    delete: new DeletePermissionUseCase(permissionRepository),
    create: new CreatePermissionUseCase(permissionRepository),
    update: new UpdatePermissionUseCase(permissionRepository),
  },
};
