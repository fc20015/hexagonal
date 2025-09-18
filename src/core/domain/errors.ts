export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class RoleNotFoundError extends DomainError {}
export class RoleAlreadyExistsError extends DomainError {}
export class PermissionNotFoundError extends DomainError {}
export class PermissionAlreadyExistsError extends DomainError {}
export class InvalidEmailError extends DomainError {}
export class UserNotFoundError extends DomainError {}
export class UserAlreadyExistsError extends DomainError {}

export class AuthenticationError extends DomainError {}
export class AuthorizationError extends DomainError {}
export class InactiveUserError extends DomainError {}

export class JwtTokenError extends DomainError {}
