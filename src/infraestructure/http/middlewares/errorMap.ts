import {
  RoleNotFoundError,
  RoleAlreadyExistsError,
  PermissionNotFoundError,
  PermissionAlreadyExistsError,
  DomainError,
  ValidationError,
  DatabaseError,
} from "../../../core/domain/errors.js";

export const errorHttpMap = new Map<Function, number>([
  [RoleAlreadyExistsError, 409],
  [RoleNotFoundError, 404],
  [PermissionNotFoundError, 404],
  [PermissionAlreadyExistsError, 409],
  [DomainError, 400],
  [ValidationError, 400],
  [DatabaseError, 500],
]);
