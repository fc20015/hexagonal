import { FindAllUseCase } from "../core/ports/in/usecases/Role/FindAllUseCase.js";
import { PostgresRoleRepository } from "../adapters/out/postgres/PostgresRoleRepository.js";
import { FindByIdUseCase } from "../core/ports/in/usecases/Role/FindByIdUseCase.js";
import { DeleteUseCase } from "../core/ports/in/usecases/Role/DeleteUseCase.js";
import { SaveUseCase } from "../core/ports/in/usecases/Role/SaveUseCase.js";

const roleRepository = new PostgresRoleRepository();

export const ServiceContainer = {
  roles: {
    findAll: new FindAllUseCase(roleRepository),
    findById: new FindByIdUseCase(roleRepository),
    delete: new DeleteUseCase(roleRepository),
    save: new SaveUseCase(roleRepository),
  },
};
