import type { Permission } from "./Permission.js";
import type { Role } from "./Role.js";
import type { UserEmail } from "./UserEmail.js";

export class User {
  private _id_user: string;
  private _username: string;
  private _password_hash: string;
  private _email: UserEmail;
  private _full_name: string;
  private _is_active: boolean;
  private _created_at: Date;
  private _updated_at: Date;
  private _roles: Role[] = [];
  private _permissions: Permission[] = [];

  constructor(
    id_user: string,
    username: string,
    password_hash: string,
    email: UserEmail,
    full_name: string,
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    roles: Role[] = [],
    permissions: Permission[] = []
  ) {
    this._id_user = id_user;
    this._username = username;
    this._password_hash = password_hash;
    this._email = email;
    this._full_name = full_name;
    this._is_active = is_active;
    this._created_at = created_at;
    this._updated_at = updated_at;
    this._roles = roles;
    this._permissions = permissions;
  }

  get id_user(): string {
    return this._id_user;
  }

  get username(): string {
    return this._username;
  }

  get password_hash(): string {
    return this._password_hash;
  }

  get email(): string {
    return this._email.email;
  }

  get full_name(): string {
    return this._full_name;
  }

  get is_active(): boolean {
    return this._is_active;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  get roles(): Role[] {
    return this._roles;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  set roles(roles: Role[]) {
    this._roles = roles;
  }

  set permissions(permissions: Permission[]) {
    this._permissions = permissions;
  }

  addRole(role: Role): void {
    if (!this._roles.find((r) => r.id === role.id)) {
      this._roles.push(role);
    }
  }

  removeRole(role: Role): void {
    this._roles = this._roles.filter((r) => r.id !== role.id);
  }

  addPermission(permission: Permission): void {
    if (!this._permissions.find((p) => p.id === permission.id)) {
      this._permissions.push(permission);
    }
  }

  removePermission(permission: Permission): void {
    this._permissions = this._permissions.filter((p) => p.id !== permission.id);
  }

  toJSON() {
    return {
      id: this._id_user,
      username: this._username,
      email: this._email.email,
      password_hash: this._password_hash,
      full_name: this._full_name,
      is_active: this._is_active,
      created_at: this._created_at,
      updated_at: this._updated_at,
      roles: this._roles,
      permissions: this._permissions,
    };
  }
}
