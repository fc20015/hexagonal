import { FindAllUseCase } from "../core/ports/in/usecases/Role/FindAllUseCase.js";
import { PostgresRoleRepository } from "../adapters/out/postgres/PostgresRoleRepository.js";
import { FindByIdUseCase } from "../core/ports/in/usecases/Role/FindByIdUseCase.js";
import { DeleteUseCase } from "../core/ports/in/usecases/Role/DeleteUseCase.js";
import { CreateUseCase } from "../core/ports/in/usecases/Role/CreateUseCase.js";
import { UpdateRoleUseCase } from "../core/ports/in/usecases/Role/UpdateRoleUseCase.js";

const roleRepository = new PostgresRoleRepository();

export const ServiceContainer = {
  roles: {
    findAll: new FindAllUseCase(roleRepository),
    findById: new FindByIdUseCase(roleRepository),
    delete: new DeleteUseCase(roleRepository),
    create: new CreateUseCase(roleRepository),
    update: new UpdateRoleUseCase(roleRepository),
  },
};
