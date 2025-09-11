import {
  RoleNotFoundError,
  RoleAlreadyExistsError,
  DomainError,
  ValidationError,
} from "../../../core/domain/errors.js";

export const errorHttpMap = new Map<Function, number>([
  [RoleAlreadyExistsError, 409],
  [RoleNotFoundError, 404],
  [DomainError, 400],
  [ValidationError, 400],
]);
